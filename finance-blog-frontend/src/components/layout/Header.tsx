import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { logoutRequest } from '../../features/auth/store/auth.slice';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ROUTES, APP_NAME } from '../../config/constants';
import Button from '../common/Button';
import styles from './Header.module.css';

const Header = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized } = useAuth();

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoText}>{APP_NAME}</span>
        </Link>

        <nav className={styles.nav}>
          <Link to={ROUTES.LEARN} className={styles.navLink}>
            Learn
          </Link>
          <Link to={ROUTES.BLOGS} className={styles.navLink}>
            Blogs
          </Link>

          {!isInitialized ? (
            // Loading auth state
            <div className={styles.authButtons}>
              <div style={{ width: '80px', height: '36px' }}></div>
            </div>
          ) : isAuthenticated ? (
            // Authenticated
            <>
              {user?.role === 'admin' && (
                <Link to={ROUTES.CREATE_BLOG} className={styles.navLink}>
                  Write Blog
                </Link>
              )}
              
              <div className={styles.userMenu}>
                <span className={styles.userEmail}>{user?.email}</span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            // Not authenticated
            <div className={styles.authButtons}>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="small">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.SIGNUP}>
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;