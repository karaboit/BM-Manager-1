import { toast } from "@/components/ui/use-toast";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super("Validation failed");
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    toast({
      variant: "destructive",
      title: `Error ${error.status}`,
      description: error.message,
    });
    return;
  }

  if (error instanceof ValidationError) {
    const messages = Object.entries(error.errors)
      .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
      .join("\n");

    toast({
      variant: "destructive",
      title: "Validation Error",
      description: messages,
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: error.message,
    });
    return;
  }

  // Fallback for unknown errors
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });
};
