/**
 * Signup Page
 * User registration with Supabase
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { AuthShell } from './AuthShell';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError('The two passwords do not match. Retype the second one.');
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setLocalError('Password needs at least 6 characters.');
      return;
    }

    const { error } = await signUp(email, password, fullName);

    if (!error) {
      // Navigate directly to setup - no email confirmation needed
      navigate('/setup');
    }
  };

  const mismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <AuthShell
      eyebrow="New account"
      title="Set up an account"
      lede="One account holds every business you run. It takes about thirty seconds."
      footer={
        <p className="text-[13.5px] text-bone-dim">
          Already have one?{' '}
          <Link to="/login" className="link-underline text-bone">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Your name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Alex Mercer"
          autoComplete="name"
          required
        />

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
            placeholder="At least 6 characters"
            hint="At least 6 characters."
            autoComplete="new-password"
            className="pr-11"
            minLength={6}
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

        <Input
          label="Password again"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Type it once more"
          autoComplete="new-password"
          error={mismatch ? 'This does not match the password above.' : undefined}
          required
        />

        {(error || localError) && (
          <p
            role="alert"
            className="border border-clip-deep bg-clip/10 px-3.5 py-2.5 font-mono text-[12px] leading-snug text-clip"
          >
            {localError || error}
          </p>
        )}

        <Button type="submit" size="lg" isLoading={isLoading} className="w-full">
          {isLoading ? 'Creating account' : 'Create account'}
          {!isLoading && <ArrowRight size={14} />}
        </Button>
      </form>
    </AuthShell>
  );
};

export default SignupPage;
