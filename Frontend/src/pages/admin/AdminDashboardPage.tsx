import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Building2,
  Clock,
  Users,
  AlertTriangle,
  BadgeCheck,
  Tag,
  CheckCircle2,
  Eye,
  XCircle,
  ArrowRight,
  ShieldAlert,
  Globe,
  MapPin,
  Check,
} from 'lucide-react';
import {
  mockAdminStats,
  mockAdminActivities,
  initialAdminProperties,
} from '../../data/mockAdmin';
import { AdminPropertyItem } from '../../types/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { AdminActivityList } from '../../components/admin/AdminActivityList';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import { AdminOutletContext } from '../../layouts/AdminLayout';

export const AdminDashboardPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<AdminOutletContext>();
  const [properties, setProperties] = useState<AdminPropertyItem[]>(initialAdminProperties);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rejection modal state
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Incomplete property information');
  const [customReasonNote, setCustomReasonNote] = useState('');

  const pendingListings = properties.filter((p) => p.status === 'Pending').slice(0, 5);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApprove = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    showToast('Property listing approved and published to marketplace.');
  };

  const handleOpenReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('Incomplete property information');
    setCustomReasonNote('');
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    const finalReason = customReasonNote.trim()
      ? `${rejectReason}: ${customReasonNote.trim()}`
      : rejectReason;

    setProperties((prev) =>
      prev.map((item) =>
        item.id === rejectingId
          ? { ...item, status: 'Rejected', rejectionReason: finalReason }
          : item
      )
    );
    setRejectingId(null);
    showToast('Listing marked as rejected. Seller notified with feedback.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminHeader
        title="Admin Console"
        subtitle="EstateX real-estate marketplace operations, approvals, and metrics overview."
        onOpenMobileMenu={openMobileSidebar}
      />

      {/* Floating feedback toast */}
      {toastMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section A: Overview Statistics (6 Metric Cards) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
          Platform Overview Metrics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          <AdminStatCard
            title="Total Properties"
            value={mockAdminStats.totalProperties}
            icon={Building2}
            subtext="All listings in system"
          />
          <AdminStatCard
            title="Pending Approval"
            value={mockAdminStats.pendingApproval}
            icon={Clock}
            variant="warning"
            badge="Needs Action"
            subtext="Awaiting review"
          />
          <AdminStatCard
            title="Total Users"
            value={mockAdminStats.totalUsers}
            icon={Users}
            subtext="Registered accounts"
          />
          <AdminStatCard
            title="Reported"
            value={mockAdminStats.reportedProperties}
            icon={AlertTriangle}
            variant="accent"
            badge="7 Open"
            subtext="Flagged items"
          />
          <AdminStatCard
            title="Active Listings"
            value={mockAdminStats.activeListings}
            icon={BadgeCheck}
            subtext="Live on marketplace"
          />
          <AdminStatCard
            title="Sold / Rented"
            value={mockAdminStats.soldOrRented}
            icon={Tag}
            subtext="Completed deals"
          />
        </div>
      </section>

      {/* Section D: Quick Actions */}
      <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-4">
          Administrative Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link to={ROUTES.ADMIN.PROPERTIES} className="w-full">
            <Button variant="primary" size="sm" icon={Building2} className="w-full justify-center text-xs py-2.5">
              Manage Properties
            </Button>
          </Link>
          <Link to={ROUTES.ADMIN.USERS} className="w-full">
            <Button variant="secondary" size="sm" icon={Users} className="w-full justify-center text-xs py-2.5">
              Manage Users
            </Button>
          </Link>
          <Link to={ROUTES.ADMIN.REPORTS} className="w-full">
            <Button variant="secondary" size="sm" icon={ShieldAlert} className="w-full justify-center text-xs py-2.5">
              Review Reports
            </Button>
          </Link>
          <Link to={ROUTES.HOME} className="w-full">
            <Button variant="outline" size="sm" icon={Globe} className="w-full justify-center text-xs py-2.5 border-[#E2E2DF]">
              View Website
            </Button>
          </Link>
        </div>
      </section>

      {/* Section C: Pending Property Approvals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171717]">
              Pending Property Approvals
            </h2>
            <p className="text-xs text-[#737373]">
              Submissions requiring verification before being indexed publicly.
            </p>
          </div>
          <Link
            to={ROUTES.ADMIN.PROPERTIES}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E2DF] shadow-sm overflow-hidden">
          {pendingListings.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#737373]">
              No pending listings currently awaiting review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#E2E2DF] bg-[#F5F5F2]/50 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Owner</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DF]">
                  {pendingListings.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#F5F5F2]/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#171717] max-w-xs truncate">
                        {prop.title}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {prop.owner?.name || 'Verified Owner'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#171717] whitespace-nowrap text-xs">
                        {formatPrice(prop.price, prop.listingType)}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C66A4A]" />
                          {prop.locality}, {prop.city}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {prop.submittedAt || prop.createdAt?.slice(0, 10) || 'Recently'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AdminStatusBadge status={prop.status || 'Pending'} />
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={ROUTES.PROPERTY_DETAILS(prop.id)}
                            title="View property details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleApprove(prop.id)}
                            title="Approve listing"
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenReject(prop.id)}
                            title="Reject listing"
                            className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#DC2626] hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Section B: Recent Activity */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#171717]">
            Recent System Activity
          </h2>
          <p className="text-xs text-[#737373]">
            Audit trail of platform approvals, new registrations, and status shifts.
          </p>
        </div>

        <AdminActivityList activities={mockAdminActivities} />
      </section>

      {/* Rejection Modal Dialog */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setRejectingId(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Reject Property Listing
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                Select the primary reason for rejecting this listing submission.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Reason for Rejection
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-xl border border-[#A3A3A3] bg-white px-3 py-2 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717]"
                >
                  <option value="Incomplete property information">Incomplete property information</option>
                  <option value="Invalid or unverifiable details">Invalid or unverifiable details</option>
                  <option value="Duplicate listing in registry">Duplicate listing in registry</option>
                  <option value="Incorrect or inflated pricing">Incorrect or inflated pricing</option>
                  <option value="Low-resolution or competitor watermarked images">Low-resolution or watermarked images</option>
                  <option value="Other non-compliance">Other non-compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Additional Feedback Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={customReasonNote}
                  onChange={(e) => setCustomReasonNote(e.target.value)}
                  placeholder="Provide specific notes so the seller can amend the listing..."
                  className="w-full rounded-xl border border-[#A3A3A3] bg-white p-2.5 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectingId(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleConfirmReject}
                className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
