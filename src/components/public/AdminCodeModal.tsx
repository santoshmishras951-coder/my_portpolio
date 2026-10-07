import React, { useState } from 'react';
import { X, Lock, KeyRound, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';

interface AdminCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'login' | 'exit';
}

export const AdminCodeModal: React.FC<AdminCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mode = 'login'
}) => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() !== '654321') {
      error('Invalid 6-digit code');
      return;
    }

    if (mode === 'login') {
      success('Access code verified. Please log in.');
      sessionStorage.setItem('admin_code_verified', 'true');
      setCode('');
      onSuccess();
    } else {
      success('Verified. Returning to website.');
      sessionStorage.removeItem('admin_code_verified');
      setCode('');
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {mode === 'login' ? 'Admin Access' : 'Switch to Website'}
              </h3>
              <p className="text-xs text-neutral-500">
                Enter 6-digit password
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Enter 6-Digit Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full pl-10 pr-4 py-3 text-center tracking-[0.5em] font-mono text-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:tracking-normal placeholder:text-sm placeholder:text-neutral-500 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 6}
            className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? 'Verifying...' : mode === 'login' ? 'Open Admin Panel' : 'Switch to Website'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
