import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  center?: boolean;
}

const Spinner = ({ size = 'medium', color = 'primary', center = false }: SpinnerProps) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[color],
    center ? styles.center : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses}>
      <div className={styles.circle}></div>
    </div>
  );
};

export default Spinner;