import styles from './ErrorBoundary.module.css';

interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>⚠️</div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>
          We're sorry, but something unexpected happened. Please try again.
        </p>
        
        {error && (
          <details className={styles.details}>
            <summary className={styles.summary}>Error details</summary>
            <pre className={styles.errorText}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className={styles.actions}>
          <button onClick={resetError} className={styles.button}>
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className={styles.buttonSecondary}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;