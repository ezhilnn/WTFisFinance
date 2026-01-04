import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { signUpRequest } from '../store/auth.slice';
import { getEmailError, getPasswordError } from '../../../utils/validators';
import { ROUTES } from '../../../config/constants';
import styles from './SignUpForm.module.css';

interface SignUpFormProps {
  onSuccess?: () => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);
    let confirmPasswordError: string | undefined;

    if (password !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }

    if (emailError || passwordError || confirmPasswordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Dispatch sign up action
    dispatch(
      signUpRequest({
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

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignUpForm;