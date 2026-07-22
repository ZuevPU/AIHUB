/**
 * Copies text to the system clipboard.
 * Uses Clipboard API first, then falls back to execCommand for iframe / restricted contexts.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard API is often blocked inside cross-origin iframes.
    }
  }

  return copyWithExecCommand(text);
}

function copyWithExecCommand(text: string): boolean {
  const activeElement = document.activeElement as HTMLElement | null;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    if (activeElement?.focus) {
      activeElement.focus();
    }

    return copied;
  } catch {
    return false;
  }
}

export function selectPromptText(element: HTMLElement | null): void {
  if (!element) return;

  element.focus();

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    element.select();
    element.setSelectionRange(0, element.value.length);
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}
