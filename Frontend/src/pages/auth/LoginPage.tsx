import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, LogIn, CheckCircle2, Info } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [demoSuccess, setDemoSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: async (values) => {
      const result = loginSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !fieldErrors[field]) {
          fieldErrors[field] = { type: issue.code, message: issue.message };
        }
      });
      return { values: {}, errors: fieldErrors };
    },
  });

  const onSubmit = (_data: LoginFormData) => {
    // Demonstration validation - do not call real backend or pretend authenticated
    setDemoSuccess(true);
  };

  const handleReset = () => {
    reset();
    setDemoSuccess(false);
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1.5 leading-relaxed">
          Sign in to your EstateX account.
        </p>
      </div>

      {/* Demo Success Message */}
      {demoSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in"
        >
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Demo login successful</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Form validation passed. Real authentication will be connected later.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-emerald-900 underline hover:no-underline pt-1"
          >
            Reset Form
          </button>
        </div>
      )}

      {/* Info Pill */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F5F5F2] border border-[#E2E2DF] text-xs text-[#737373]">
        <Info className="w-4 h-4 text-[#C66A4A] shrink-0 mt-0.5" />
        <span>
          UI Demo mode. Enter any valid email and an 8+ character password to test validation.
        </span>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <Input
          id="login-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <div>
          <PasswordInput
            id="login-password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Options: Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#A3A3A3] text-[#171717] focus:ring-[#171717] cursor-pointer"
              {...register('rememberMe')}
            />
            <span className="text-xs sm:text-sm text-[#222222]">Remember me</span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs sm:text-sm font-medium text-[#737373] hover:text-[#C66A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          icon={LogIn}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="text-center text-xs sm:text-sm text-[#737373] pt-2 border-t border-[#E2E2DF]">
        Don't have an account?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-bold text-[#171717] hover:text-[#C66A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
        >
          Create one
        </Link>
      </div>
    </div>
  );
};
