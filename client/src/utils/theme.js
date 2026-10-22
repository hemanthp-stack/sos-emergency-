// System-based Theme Manager (Supports System, Light, and Dark)

export function getInitialTheme() {
  const saved = localStorage.getItem('sentrix_theme') || localStorage.getItem('bsafe_theme');
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system';
}

export function applyTheme(theme) {
  localStorage.setItem('sentrix_theme', theme);
  const root = document.documentElement;

  let isDark = false;
  if (theme === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = theme === 'dark';
  }

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    document.body.style.backgroundColor = '#0B0F19';
    document.body.style.color = '#F8FAFC';
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    document.body.style.backgroundColor = '#FFFFFF';
    document.body.style.color = '#0F172A';
  }

  return isDark;
}
