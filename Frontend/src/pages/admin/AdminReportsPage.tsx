import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  X,
  Eye,
  Check,
  Building,
  User,
  AlertTriangle,
} from 'lucide-react';
import { initialAdminReports } from '../../data/mockAdmin';
import { AdminReport } from '../../types/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { Button } from '../../components/ui/Button';
import { FormError } from '../../components/forms/FormError';
import { AdminOutletContext } from '../../layouts/AdminLayout';

const resolveSchema = z.object({
  resolutionNote: z
    .string()
    .trim()
    .min(5, 'Resolution note must be at least 5 characters')
    .max(500, 'Note cannot exceed 500 characters'),
});

type ResolveFormData = z.infer<typeof resolveSchema>;

export const AdminReportsPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<AdminOutletContext>();
  const [reports, setReports] = useState<AdminReport[]>(initialAdminReports);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [detailReport, setDetailReport] = useState<AdminReport | null>(null);
  const [resolvingReport, setResolvingReport] = useState<AdminReport | null>(null);
  const [dismissingReport, setDismissingReport] = useState<AdminReport | null>(null);
  const [dismissalNote, setDismissalNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Form for Resolution Note
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResolveFormData>({
    defaultValues: {
      resolutionNote: '',
    },
    resolver: async (values) => {
      const result = resolveSchema.safeParse(values);
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

  // Summary Metrics Counts
  const counts = useMemo(() => {
    return {
      open: reports.filter((r) => r.status === 'Open').length,
      underReview: reports.filter((r) => r.status === 'Under Review').length,
      resolved: reports.filter((r) => r.status === 'Resolved').length,
      dismissed: reports.filter((r) => r.status === 'Dismissed').length,
    };
  }, [reports]);

  // Filter & Sort Logic
  const filteredReports = useMemo(() => {
    let result = [...reports];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.reportedBy.toLowerCase().includes(q) ||
          (r.propertyTitle && r.propertyTitle.toLowerCase().includes(q)) ||
          (r.userName && r.userName.toLowerCase().includes(q)) ||
          r.id.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Target Type filter
    if (targetTypeFilter !== 'all') {
      result = result.filter(
        (r) => r.targetType.toLowerCase() === targetTypeFilter.toLowerCase()
      );
    }

    // Reason filter
    if (reasonFilter !== 'all') {
      result = result.filter((r) => r.reason.toLowerCase() === reasonFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt);
      return 0;
    });

    return result;
  }, [reports, searchQuery, statusFilter, targetTypeFilter, reasonFilter, sortBy]);

  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTargetTypeFilter('all');
    setReasonFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    targetTypeFilter !== 'all' ||
    reasonFilter !== 'all' ||
    sortBy !== 'newest';

  // Paginated reports
  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredReports.slice(startIndex, startIndex + pageSize);
  }, [filteredReports, currentPage, pageSize]);

  // Actions
  const handleMarkUnderReview = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Under Review' } : r))
    );
    showToast('Report marked as Under Review.');
  };

  const handleOpenResolve = (rep: AdminReport) => {
    setResolvingReport(rep);
    reset({ resolutionNote: '' });
  };

  const handleConfirmResolve = (data: ResolveFormData) => {
    if (!resolvingReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === resolvingReport.id
          ? { ...r, status: 'Resolved', resolutionNote: data.resolutionNote }
          : r
      )
    );
    setResolvingReport(null);
    showToast(`Report ${resolvingReport.id} successfully resolved.`);
  };

  const handleConfirmDismiss = () => {
    if (!dismissingReport) return;
    const note = dismissalNote.trim() || 'Dismissed as non-actionable by administrator.';
    setReports((prev) =>
      prev.map((r) =>
        r.id === dismissingReport.id
          ? { ...r, status: 'Dismissed', resolutionNote: note }
          : r
      )
    );
    setDismissingReport(null);
    setDismissalNote('');
    showToast(`Report ${dismissingReport.id} dismissed.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Reports Management"
        subtitle="Investigate user fraud warnings, flag duplicate listings, and resolve marketplace disputes."
        onOpenMobileMenu={openMobileSidebar}
      />

      {/* Toast Notice */}
      {toastMessage && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <AdminStatCard
          title="Open Reports"
          value={counts.open}
          icon={AlertOctagon}
          variant="warning"
          badge="Needs Review"
        />
        <AdminStatCard
          title="Under Review"
          value={counts.underReview}
          icon={Clock}
        />
        <AdminStatCard
          title="Resolved"
          value={counts.resolved}
          icon={CheckCircle2}
        />
        <AdminStatCard
          title="Dismissed"
          value={counts.dismissed}
          icon={XCircle}
        />
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E2DF] p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
            placeholder="Search reports by description, reporter, property title, or ID..."
            className="w-full rounded-xl border border-[#A3A3A3] bg-white pl-10 pr-4 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleFilterChange(setSearchQuery, '')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#737373] hover:text-[#171717]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Status */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          {/* Target Type */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Target
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) => handleFilterChange(setTargetTypeFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Targets</option>
              <option value="Property">Property</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Reason
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => handleFilterChange(setReasonFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Reasons</option>
              <option value="Fraud">Fraud</option>
              <option value="Incorrect Information">Incorrect Information</option>
              <option value="Duplicate Listing">Duplicate Listing</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Spam">Spam</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value as any)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E2DF] text-xs text-[#737373]">
            <span>Filtered results ({filteredReports.length} found)</span>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 font-semibold text-[#C66A4A] hover:underline"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table / Mobile Cards */}
      {filteredReports.length === 0 ? (
        <AdminEmptyState
          title="No Reports Found"
          description="There are no reported violations matching your current filters."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E2DF] shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E2DF] bg-[#F5F5F2]/50 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                  <th className="py-3 px-4">Report</th>
                  <th className="py-3 px-4">Target</th>
                  <th className="py-3 px-4">Reported By</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2DF]">
                {paginatedReports.map((r) => {
                  const targetLabel =
                    r.targetType === 'Property'
                      ? r.propertyTitle || r.targetId
                      : r.userName || r.targetId;

                  return (
                    <tr key={r.id} className="hover:bg-[#F5F5F2]/40 transition-colors">
                      {/* Report ID & Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-mono text-xs font-bold text-[#171717]">
                          {r.id}
                        </span>
                        <p className="text-xs text-[#737373] truncate mt-0.5" title={r.description}>
                          {r.description}
                        </p>
                      </td>

                      {/* Target */}
                      <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-semibold text-[#171717]">
                          {r.targetType === 'Property' ? (
                            <Building className="w-3.5 h-3.5 text-[#C66A4A]" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-sky-600" />
                          )}
                          {r.targetType}
                        </span>
                        <p className="text-[11px] text-[#737373] truncate max-w-[160px]">
                          {targetLabel}
                        </p>
                      </td>

                      {/* Reported By */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {r.reportedBy}
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#171717] whitespace-nowrap">
                        {r.reason}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {r.createdAt}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AdminStatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailReport(r)}
                            title="View report details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {r.status === 'Open' && (
                            <button
                              type="button"
                              onClick={() => handleMarkUnderReview(r.id)}
                              title="Mark under investigation"
                              className="p-1.5 rounded-lg border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                            >
                              <Clock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {r.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => handleOpenResolve(r)}
                              title="Resolve report with resolution notes"
                              className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {r.status !== 'Dismissed' && (
                            <button
                              type="button"
                              onClick={() => setDismissingReport(r)}
                              title="Dismiss report"
                              className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="lg:hidden divide-y divide-[#E2E2DF]">
            {paginatedReports.map((r) => {
              const targetLabel =
                r.targetType === 'Property'
                  ? r.propertyTitle || r.targetId
                  : r.userName || r.targetId;

              return (
                <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#171717]">{r.id}</span>
                      <span className="text-xs text-[#737373]">• {r.reason}</span>
                    </div>
                    <AdminStatusBadge status={r.status} />
                  </div>

                  <p className="text-xs text-[#222222] font-medium leading-relaxed">
                    {r.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
                    <span>
                      Target: <strong className="text-[#171717]">{targetLabel}</strong>
                    </span>
                    <span>{r.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E2DF]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailReport(r)}
                      className="text-xs py-1 px-2.5 border-[#E2E2DF]"
                    >
                      Details
                    </Button>

                    {r.status === 'Open' && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleMarkUnderReview(r.id)}
                        className="text-xs py-1 px-2.5 text-amber-800"
                      >
                        Review
                      </Button>
                    )}

                    {r.status !== 'Resolved' && (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenResolve(r)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 px-2.5"
                      >
                        Resolve
                      </Button>
                    )}

                    {r.status !== 'Dismissed' && (
                      <button
                        type="button"
                        onClick={() => setDismissingReport(r)}
                        aria-label="Dismiss report"
                        className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReports.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Report Details Modal */}
      {detailReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setDetailReport(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-lg w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E2DF]">
              <div>
                <span className="font-mono text-xs font-bold text-[#A3A3A3]">
                  CASE REF: {detailReport.id}
                </span>
                <h3 className="text-lg font-bold text-[#171717] mt-0.5">
                  {detailReport.reason} Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailReport(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-[#737373] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3]">Target Entity</span>
                <p className="font-semibold text-[#171717]">
                  {detailReport.targetType}:{' '}
                  {detailReport.propertyTitle || detailReport.userName || detailReport.targetId}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3]">Status & Date</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <AdminStatusBadge status={detailReport.status} />
                  <span className="text-[#737373]">{detailReport.createdAt}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E2DF] bg-white text-xs space-y-1.5">
              <span className="font-bold text-[#171717] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C66A4A]" /> Report Description
              </span>
              <p className="text-[#222222] leading-relaxed">
                {detailReport.description}
              </p>
              <p className="text-[11px] text-[#737373] pt-1">
                Submitted by: <strong>{detailReport.reportedBy}</strong>
              </p>
            </div>

            {detailReport.resolutionNote && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolution Note
                </span>
                <p className="leading-relaxed">{detailReport.resolutionNote}</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDetailReport(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Report Modal */}
      {resolvingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setResolvingReport(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Resolve Report: {resolvingReport.id}
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                Enter an audit note explaining the corrective action taken before resolving.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleConfirmResolve)} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Resolution Note <span className="text-[#C66A4A]">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Verified ownership title; updated incorrect sq.ft specifications..."
                  className={`w-full rounded-xl border bg-white p-3 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] resize-none ${
                    errors.resolutionNote ? 'border-[#DC2626]' : 'border-[#A3A3A3]'
                  }`}
                  {...register('resolutionNote')}
                />
                {errors.resolutionNote?.message && (
                  <FormError message={errors.resolutionNote.message} />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setResolvingReport(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirm Resolution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dismiss Report Modal */}
      {dismissingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setDismissingReport(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-[#F5F5F2] text-[#737373] flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Dismiss Report: {dismissingReport.id}
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                Optionally provide a reason for dismissing this report without penalizing the target.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Dismissal Reason / Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={dismissalNote}
                  onChange={(e) => setDismissalNote(e.target.value)}
                  placeholder="e.g. Verified to be false positive or normal industry variance..."
                  className="w-full rounded-xl border border-[#A3A3A3] bg-white p-2.5 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDismissingReport(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleConfirmDismiss}
              >
                Confirm Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
