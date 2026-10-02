import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { User, Mail, Phone, UserPlus, CheckCircle2, Info } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/forms/PasswordInput';
import { FormError } from '../../components/forms/FormError';
import { Button } from '../../components/ui/Button';
import { ROUTES } from '../../constants/routes';

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .min(1, 'Phone number is required')
      .regex(/^[0-9+\s-]{10,15}$/, 'Please enter a valid phone number (at least 10 digits)'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the Terms & Conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [demoSuccess, setDemoSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false as unknown as true,
    },
    resolver: async (values) => {
      const result = registerSchema.safeParse(values);
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

  const onSubmit = (_data: RegisterFormData) => {
    // Demonstration validation - do not call real backend or store credentials
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
          Create Your EstateX Account
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1.5 leading-relaxed">
          Join EstateX and start discovering properties you'll love.
        </p>
      </div>

      {/* Demo Success Banner */}
      {demoSuccess && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-in fade-in"
        >
          <div className="flex items-center gap-2 font-semibold text-sm text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Demo account created</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            All registration fields validated successfully. Real authentication will be connected later.
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
          UI Demo mode. Test registration validation with any valid credentials.
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Full Name */}
        <Input
          id="register-fullname"
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Rahul Sharma"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        {/* Email */}
        <Input
          id="register-email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Phone */}
        <Input
          id="register-phone"
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          placeholder="e.g. 9876543210"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* Password */}
        <PasswordInput
          id="register-password"
          label="Password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Confirm Password */}
        <PasswordInput
          id="register-confirm-password"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#A3A3A3] text-[#171717] focus:ring-[#171717] cursor-pointer mt-0.5"
              {...register('agreeTerms')}
            />
            <span className="text-xs text-[#737373] leading-snug">
              I agree to the{' '}
              <span className="text-[#171717] font-semibold underline underline-offset-2">
                Terms of Service
              </span>{' '}
              and{' '}
              <span className="text-[#171717] font-semibold underline underline-offset-2">
                Privacy Policy
              </span>
              .
            </span>
          </label>
          {errors.agreeTerms?.message && (
            <FormError message={errors.agreeTerms.message} />
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          icon={UserPlus}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="text-center text-xs sm:text-sm text-[#737373] pt-2 border-t border-[#E2E2DF]">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-bold text-[#171717] hover:text-[#C66A4A] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717] rounded"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};
