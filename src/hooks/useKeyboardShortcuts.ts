import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onCopy,
  onDelete,
  onSave,
}: ShortcutHandlers) {
  useHotkeys('mod+z', (e) => {
    e.preventDefault();
    onUndo?.();
  });

  useHotkeys('mod+shift+z', (e) => {
    e.preventDefault();
    onRedo?.();
  });

  useHotkeys('mod+c', (e) => {
    if (onCopy) {
      e.preventDefault();
      onCopy();
    }
  });

  useHotkeys('delete', (e) => {
    if (onDelete) {
      e.preventDefault();
      onDelete();
    }
  });

  useHotkeys('mod+s', (e) => {
    if (onSave) {
      e.preventDefault();
      onSave();
    }
  });
}