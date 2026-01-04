import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { loginRequest } from '../store/auth.slice';
import { getEmailError, getPasswordError } from '../../../utils/validators';
import { ROUTES } from '../../../config/constants';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Dispatch login action
    dispatch(
      loginRequest({
        credentials: { email, password },
        onSuccess: () => {
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess();
          } else {
            navigate(ROUTES.HOME);
          }
        },
        onError: (error) => {
          setIsSubmitting(false);
          setErrors({ email: error });
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {errors.password && <span className={styles.error}>{errors.password}</span>}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;