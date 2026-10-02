import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, Send, ArrowLeft, CheckCircle2, Info } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [demoSuccess, setDemoSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    resolver: async (values) => {
      const result = forgotPasswordSchema.safeParse(values);
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

  const onSubmit = (_data: ForgotPasswordFormData) => {
    // Demonstration validation - do not call real backend
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
          Forgot Your Password?
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1.5 leading-relaxed">
          Enter your email address and we'll help you reset your password.
        </p>
      </div>

      {/* Demo Success / Notice State */}
      {demoSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in"
        >
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Request Validated</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Password reset is not connected yet. Your request has been validated successfully.
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
          UI Demo mode. Test email validation to view the confirmation state.
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="forgot-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          icon={Send}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Validating...' : 'Send Reset Link'}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="text-center pt-2 border-t border-[#E2E2DF]">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#171717] hover:text-[#C66A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded px-1 py-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
};
