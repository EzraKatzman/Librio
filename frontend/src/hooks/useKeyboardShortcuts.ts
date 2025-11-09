import { useEffect } from "react";

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            shortcuts.forEach(shortcut => {
                const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
                const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

                if (ctrlMatch && shiftMatch && keyMatch) {
                    event.preventDefault();
                    shortcut.callback();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}
