import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './config/constants';
import ErrorBoundary from './components/errors/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import ToastProvider from './components/common/ToastProvider';

// Pages
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './features/auth/pages/LoginPage';
import SignUpPage from './features/auth/pages/SignUpPage';

// Blog Pages
import BlogListPage from './features/blogs/pages/BlogListPage';
import BlogDetailPage from './features/blogs/pages/BlogDetailPage';
import CreateBlogPage from './features/blogs/pages/CreateBlogPage';
import EditBlogPage from './features/blogs/pages/EditBlogPage';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          {/* Auth pages - no layout */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
          
          {/* Main pages - with layout */}
          <Route
            path={ROUTES.HOME}
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          
          {/* Blog routes */}
          <Route
            path={ROUTES.BLOGS}
            element={
              <MainLayout>
                <BlogListPage />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.BLOG_DETAIL}
            element={
              <MainLayout>
                <BlogDetailPage />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.CREATE_BLOG}
            element={
              <MainLayout>
                <CreateBlogPage />
              </MainLayout>
            }
          />
          <Route
            path={ROUTES.EDIT_BLOG}
            element={
              <MainLayout>
                <EditBlogPage />
              </MainLayout>
            }
          />
          
          <Route
            path={ROUTES.NOT_FOUND}
            element={
              <MainLayout showFooter={false}>
                <NotFoundPage />
              </MainLayout>
            }
          />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;