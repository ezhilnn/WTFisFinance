import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME } from '../../../config/constants';
import SignUpForm from '../components/SignUpForm';
import GoogleSignIn from '../components/GoogleSignIn';
import styles from './LoginPage.module.css'; // Reusing LoginPage styles

const SignUpPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>Join {APP_NAME}</h1>
            <p className={styles.subtitle}>Start learning finance without the jargon</p>
          </div>

          <div className={styles.content}>
            <SignUpForm />

            <div className={styles.divider}>
              <span className={styles.dividerText}>OR</span>
            </div>

            <GoogleSignIn />

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className={styles.link}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;