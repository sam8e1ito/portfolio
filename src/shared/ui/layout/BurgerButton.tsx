import styles from './layout.module.scss';

type Props = {
  isOpen: boolean;
  onClick: () => void;
};

export const BurgerButton = ({ isOpen, onClick }: Props) => {
  return (
    <button
      type="button"
      className={`${styles.burgerButton} ${isOpen ? styles.burgerButtonOpen : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isOpen}
      aria-controls="site-sidebar"
    >
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
      <span className={styles.burgerLine} />
    </button>
  );
};
