/**
 * Reader background theme utilities
 */

export type ReaderTheme = 'warm' | 'cool';

/**
 * Set the reader background theme
 */
export function setReaderTheme(theme: ReaderTheme) {
  const readerRoot = document.querySelector('.reader-root') as HTMLElement;
  if (readerRoot) {
    readerRoot.style.setProperty('--reader-bg-theme', theme);
  }
}

/**
 * Get the current reader theme
 */
export function getReaderTheme(): ReaderTheme {
  const readerRoot = document.querySelector('.reader-root') as HTMLElement;
  if (readerRoot) {
    const theme = readerRoot.style.getPropertyValue('--reader-bg-theme').trim();
    return (theme === 'cool' ? 'cool' : 'warm') as ReaderTheme;
  }
  return 'warm';
}

/**
 * Toggle between warm and cool themes
 */
export function toggleReaderTheme(): ReaderTheme {
  const currentTheme = getReaderTheme();
  const newTheme: ReaderTheme = currentTheme === 'warm' ? 'cool' : 'warm';
  setReaderTheme(newTheme);
  return newTheme;
}


