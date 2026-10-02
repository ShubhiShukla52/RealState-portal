import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  Save,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { mockUser, DashboardUser } from '../../data/mockDashboard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';

const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().trim().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  location: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const [profile, setProfile] = useState<DashboardUser>(mockUser);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);

  const initials = profile.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
    },
    resolver: async (values) => {
      const result = profileSchema.safeParse(values);
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

  const onSubmit = (data: ProfileFormData) => {
    // Update local React state (no backend API call)
    setProfile((prev) => ({
      ...prev,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      location: data.location || prev.location,
    }));
    setSuccessMessage('Profile updated successfully.');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handlePhotoClick = () => {
    setPhotoNotice('Photo upload will be enabled with cloud storage in a future phase.');
    setTimeout(() => setPhotoNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Profile"
        subtitle="Manage your personal details, verified credentials, and contact preferences."
        onOpenMobileMenu={openMobileSidebar}
      />

      {/* Success Notification */}
      {successMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Photo notice notification */}
      {photoNotice && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-[#F5F5F2] border border-[#E2E2DF] text-xs text-[#737373] animate-in fade-in"
        >
          {photoNotice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Avatar & Profile Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2E2DF] p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#171717] text-white flex items-center justify-center font-black text-2xl border-4 border-white shadow-md">
              {initials}
            </div>

            <button
              type="button"
              onClick={handlePhotoClick}
              aria-label="Change profile photo"
              title="Change profile photo"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#C66A4A] text-white flex items-center justify-center hover:bg-[#b05c3e] transition-colors shadow-sm ring-2 ring-white"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#171717]">
              {profile.fullName}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#737373] mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{profile.role}</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-[#E2E2DF] text-xs text-[#737373] space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#A3A3A3]">
                <Calendar className="w-3.5 h-3.5" />
                Member Since
              </span>
              <span className="font-semibold text-[#171717]">{profile.joinedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#A3A3A3]">Account Status</span>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Active & Verified
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePhotoClick}
            className="w-full text-xs border-[#E2E2DF]"
            icon={Camera}
          >
            Change Photo
          </Button>
        </div>

        {/* Right: Edit Profile Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2E2DF] p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#171717]">
              Edit Profile
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mt-0.5">
              Update your contact credentials displayed to potential buyers and sellers.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              id="profile-fullname"
              label="Full Name"
              placeholder="e.g. Rahul Sharma"
              icon={User}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              id="profile-email"
              type="email"
              label="Email Address"
              placeholder="e.g. rahul.sharma@example.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              id="profile-phone"
              type="tel"
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              icon={Phone}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              id="profile-location"
              type="text"
              label="Location"
              placeholder="e.g. Sector 62, Noida, UP"
              icon={MapPin}
              error={errors.location?.message}
              helperText="City or locality displayed on your owner profile"
              {...register('location')}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                icon={Save}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
