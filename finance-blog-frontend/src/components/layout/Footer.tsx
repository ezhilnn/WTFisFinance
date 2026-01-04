import { Link } from 'react-router-dom';
import { ROUTES, APP_NAME, LEGAL_DISCLAIMER } from '../../config/constants';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{APP_NAME}</h3>
            <p className={styles.tagline}>
              Educational finance content without the jargon
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <nav className={styles.linkList}>
              <Link to={ROUTES.HOME} className={styles.link}>
                Home
              </Link>
              <Link to={ROUTES.BLOGS} className={styles.link}>
                All Blogs
              </Link>
              <Link to={ROUTES.LOGIN} className={styles.link}>
                Sign In
              </Link>
            </nav>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Legal</h4>
            <div className={styles.disclaimer}>
              <p>{LEGAL_DISCLAIMER}</p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;