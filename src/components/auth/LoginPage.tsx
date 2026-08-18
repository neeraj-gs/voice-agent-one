/**
 * Login Page
 * Email/password authentication with Supabase
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { AuthShell } from './AuthShell';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const { error } = await signIn(email, password);

    if (!error) {
      navigate('/businesses');
    }
  };

  return (
    <AuthShell
      eyebrow="Session"
      title="Sign in"
      lede="Pick up where you left off."
      footer={
        <p className="text-[13.5px] text-bone-dim">
          No account yet?{' '}
          <Link to="/signup" className="link-underline text-bone">
            Create one
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-[2.05rem] text-bone-faint transition-colors hover:text-amber"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="border border-clip-deep bg-clip/10 px-3.5 py-2.5 font-mono text-[12px] leading-snug text-clip"
          >
            {error}
          </p>
        )}

        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? 'Signing in' : 'Sign in'}
          {!isLoading && <ArrowRight size={14} />}
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
