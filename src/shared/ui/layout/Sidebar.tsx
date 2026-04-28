import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/app/providers/useTheme';
import styles from './layout.module.scss';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <button
        type="button"
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />

      <aside
        id="site-sidebar"
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.sidebarHeader}>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.themePanel}>
          <p className={styles.sidebarEyebrow}>Theme</p>
          <div className={styles.themeSwitch}>
            <button
              type="button"
              className={`${styles.themeButton} ${theme === 'light' ? styles.themeButtonActive : ''}`}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={`${styles.themeButton} ${theme === 'dark' ? styles.themeButtonActive : ''}`}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
