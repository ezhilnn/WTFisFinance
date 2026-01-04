import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME, APP_TAGLINE } from '../config/constants';
import { useAuth } from '../features/auth/hooks/useAuth';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { user, isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className={styles.page}>
        <Spinner size="large" center />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{APP_NAME}</h1>
          <p className={styles.subtitle}>{APP_TAGLINE}</p>
        </header>

        <div className={styles.content}>
          {isAuthenticated ? (
            <div className={styles.welcomeCard}>
              <h2>Welcome back!</h2>
              <p>Email: {user?.email}</p>
              <p>Role: {user?.role}</p>
              {user?.role === 'admin' && (
                <p className={styles.adminBadge}>✨ You are an admin</p>
              )}
              
              <div className={styles.actions}>
                <Link to={ROUTES.BLOGS}>
                  <Button variant="primary">Browse Blogs</Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link to={ROUTES.CREATE_BLOG}>
                    <Button variant="secondary">Write Blog</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.authPrompt}>
              <h2>Get Started</h2>
              <p>Sign in to access all features and start your finance learning journey</p>
              <div className={styles.authButtons}>
                <Link to={ROUTES.LOGIN}>
                  <Button variant="primary" size="large">
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.SIGNUP}>
                  <Button variant="secondary" size="large">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;