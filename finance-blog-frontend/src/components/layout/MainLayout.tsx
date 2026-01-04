import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout = ({
  children,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      {showHeader && <Header />}
      
      <main className={styles.main}>{children}</main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;