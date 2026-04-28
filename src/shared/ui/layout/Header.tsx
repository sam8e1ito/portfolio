import { Link } from 'react-router-dom';
import { BurgerButton } from './BurgerButton';
import styles from './layout.module.scss';

type Props = {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
};

export const Header = ({ isSidebarOpen, onMenuToggle }: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          <BurgerButton isOpen={isSidebarOpen} onClick={onMenuToggle} />
          <Link to="/" className={styles.brand}>
            Samvel Symonian
          </Link>
        </div>
        <nav className={styles.headerNav} aria-label="Quick links">
          <Link to="/projects" className={styles.headerLink}>
            Projects
          </Link>
          <Link to="/about" className={styles.headerLink}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};
