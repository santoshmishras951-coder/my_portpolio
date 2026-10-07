import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useToast } from '../../context/ToastContext.js';
import { Shield, Lock, User, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBackToPublic: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToPublic }) => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const [username, setUsername] = useState('santoshmishras951@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      error('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ username, password });
      success('Authenticated successfully. Welcome to the CMS Dashboard.');
    } catch (err: any) {
      error(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-950 text-neutral-100">
      <div className="max-w-md w-full border border-neutral-800 rounded-3xl p-8 bg-neutral-900/40 backdrop-blur-xl shadow-2xl space-y-6">
        
        {/* Top Back Nav */}
        <button
          onClick={onBackToPublic}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Portfolio</span>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-100">
            Admin CMS Authentication
          </h2>
          <p className="text-xs text-neutral-400">
            Enter administrative credentials to manage portfolio content, update projects, and review messages.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Username or Admin Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin or santoshmishras951@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 placeholder:text-neutral-600 focus:outline-hidden focus:border-neutral-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-neutral-950 bg-neutral-100 hover:bg-white rounded-xl transition-colors shadow-xs disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        {/* Initial Credentials Hint Card */}
        <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/70 text-xs text-neutral-400 space-y-1">
          <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
            <span>Development Admin Credentials:</span>
          </div>
          <div className="text-[11px] font-mono text-neutral-400 space-y-0.5">
            <div>Email: <span className="text-neutral-200">santoshmishras951@gmail.com</span></div>
            <div>Password: <span className="text-neutral-200">Santosh@2007</span></div>
          </div>
          <p className="text-[10px] text-neutral-500 pt-1">
            (You can change your password anytime inside the Admin Settings tab).
          </p>
        </div>

      </div>
    </div>
  );
};
