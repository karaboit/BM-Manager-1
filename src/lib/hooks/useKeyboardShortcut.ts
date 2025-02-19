import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: KeyHandler;
}

export function useKeyboardShortcut(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        ["input", "textarea"].includes(
          (e.target as HTMLElement).tagName.toLowerCase(),
        )
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrlKey = e.ctrlKey || e.metaKey;

      // Create shortcut string (e.g., 'ctrl+k' or just 'k')
      const shortcut = ctrlKey ? `ctrl+${key}` : key;

      if (shortcuts[shortcut]) {
        e.preventDefault();
        shortcuts[shortcut](e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
