import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../config/constants';
import LoginForm from '../components/LoginForm';
import GoogleSignIn from '../components/GoogleSignIn';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome to {APP_NAME}</h1>
            <p className={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          <div className={styles.content}>
            <LoginForm />

            <div className={styles.divider}>
              <span className={styles.dividerText}>OR</span>
            </div>

            <GoogleSignIn />

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Don't have an account?{' '}
                <Link to={ROUTES.SIGNUP} className={styles.link}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;