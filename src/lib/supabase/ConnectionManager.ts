import { supabase } from "./client";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";
type ConnectionListener = (status: ConnectionStatus) => void;

export class ConnectionManager {
  private static instance: ConnectionManager;
  private status: ConnectionStatus = "disconnected";
  private retryAttempts = 0;
  private maxRetries = 5;
  private retryTimeout = 2000;
  private connectionQueue: Array<() => void> = [];
  private isConnecting = false;
  private listeners = new Set<ConnectionListener>();
  private connectionPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): ConnectionManager {
    if (!this.instance) {
      this.instance = new ConnectionManager();
    }
    return this.instance;
  }

  async connect(): Promise<boolean> {
    if (this.status === "connected") return true;
    if (this.isConnecting) {
      return new Promise((resolve) => {
        this.connectionQueue.push(() => resolve(this.status === "connected"));
      });
    }

    this.isConnecting = true;
    try {
      const result = await this.tryConnect();
      this.connectionQueue.forEach((cb) => cb());
      this.connectionQueue = [];
      return result;
    } finally {
      this.isConnecting = false;
    }
  }

  private async tryConnect(): Promise<boolean> {
    this.updateStatus("connecting");

    for (let i = 0; i <= this.maxRetries; i++) {
      try {
        // Try a simple query to verify connection
        const { data, error } = await supabase.from("houses").select("count");

        if (error) {
          console.error(`Connection attempt ${i + 1} failed:`, error);
          // Only throw if it's not a permissions error
          if (error.code !== "PGRST301") {
            throw error;
          }
        }

        // If we get here, either the query succeeded or it was just a permissions error
        this.updateStatus("connected");
        this.retryAttempts = 0;
        return true;
      } catch (err) {
        console.error(`Connection attempt ${i + 1} error:`, err);

        if (i === this.maxRetries) {
          this.updateStatus("error");
          return false;
        }

        // Exponential backoff with jitter
        const delay =
          this.retryTimeout * Math.pow(2, i) * (0.5 + Math.random() * 0.5);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    this.updateStatus("error");
    return false;
  }

  private updateStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.notifyListeners();
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  addListener(listener: ConnectionListener) {
    this.listeners.add(listener);
  }

  removeListener(listener: ConnectionListener) {
    this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.status));
  }

  async withConnection<T>(operation: () => Promise<T>): Promise<T> {
    if (!(await this.connect())) {
      throw new Error("Failed to establish database connection");
    }

    try {
      return await operation();
    } catch (error) {
      // If operation fails due to connection, try to reconnect once
      if (error instanceof Error && error.message.includes("connection")) {
        if (await this.connect()) {
          return await operation();
        }
      }
      throw error;
    }
  }
}
