import { StateCreator, StoreMutatorIdentifier } from "zustand";

type Logger = <
  T extends unknown,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>;

const loggerImpl: Logger = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;
  const loggedSet: typeof set = (...a) => {
    console.log(`${name || ""} prev state:`, get());
    set(...a);
    console.log(`${name || ""} next state:`, get());
  };
  return f(loggedSet, get, store);
};

export const logger = loggerImpl;

export const persist =
  <T extends unknown>(config: {
    name: string;
    storage?: Storage;
    version?: number;
    whitelist?: string[];
  }) =>
  (f: StateCreator<T>): StateCreator<T> =>
  (set, get, store) => {
    const storage = config.storage || localStorage;
    const version = config.version || 1;

    const persistData = (state: T) => {
      try {
        const dataToStore = config.whitelist
          ? Object.fromEntries(
              Object.entries(state).filter(([key]) =>
                config.whitelist?.includes(key),
              ),
            )
          : state;

        storage.setItem(
          config.name,
          JSON.stringify({ version, state: dataToStore }),
        );
      } catch (e) {
        console.error("Error persisting state:", e);
      }
    };

    try {
      const stored = storage.getItem(config.name);
      if (stored) {
        const { version: storedVersion, state } = JSON.parse(stored);
        if (storedVersion === version) {
          set(state);
        } else {
          console.log("State version mismatch, using defaults");
          const newState = f(set, get, store);
          persistData(newState);
        }
      }
    } catch (e) {
      console.error("Error loading persisted state:", e);
    }

    store.subscribe(persistData);
    return f(set, get, store);
  };
