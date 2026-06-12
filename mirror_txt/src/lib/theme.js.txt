// Light/Dark theme persistence. The class is applied to <html> so all
// `dark:`-aware tokens and `.dark` overrides switch together.
const KEY = 'rally_theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(KEY) || 'light';
  } catch {
    return 'light';
  }
}

export function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* ignore */
  }
  applyTheme(theme);
}
