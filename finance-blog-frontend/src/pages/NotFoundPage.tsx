import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Page not found</p>
        <Link to={ROUTES.HOME} className={styles.link}>
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;