export default function ThemeToggle({ theme, toggle }) {
  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}