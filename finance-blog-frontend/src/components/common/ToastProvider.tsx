import type { ReactNode } from 'react';
import Toast from './Toast';
import { useToast } from '../../hooks/useToast';

interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
};

export default ToastProvider;