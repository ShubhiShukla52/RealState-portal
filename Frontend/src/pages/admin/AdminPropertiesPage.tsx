import React, { useState, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Eye,
  Edit,
  Trash2,
  Check,
  XCircle,
  PlusCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { initialAdminProperties } from '../../data/mockAdmin';
import { AdminPropertyItem } from '../../types/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import { AdminOutletContext } from '../../layouts/AdminLayout';

export const AdminPropertiesPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<AdminOutletContext>();
  const [properties, setProperties] = useState<AdminPropertyItem[]>(initialAdminProperties);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [listingTypeFilter, setListingTypeFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-asc' | 'price-desc'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Actions modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminPropertyItem | null>(null);
  const [rejectingTarget, setRejectingTarget] = useState<AdminPropertyItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Incomplete property information');
  const [rejectionNote, setRejectionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Available unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    initialAdminProperties.forEach((p) => {
      if (p.city) set.add(p.city);
    });
    return Array.from(set).sort();
  }, []);

  // Filter & Sort Logic
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.owner?.name && p.owner.name.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (p) => (p.status || 'Published').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Property Type
    if (typeFilter !== 'all') {
      result = result.filter(
        (p) => p.propertyType.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Listing Type
    if (listingTypeFilter !== 'all') {
      result = result.filter((p) => p.listingType === listingTypeFilter);
    }

    // City
    if (cityFilter !== 'all') {
      result = result.filter((p) => p.city.toLowerCase() === cityFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.submittedAt || b.createdAt || '').localeCompare(a.submittedAt || a.createdAt || '');
      }
      if (sortBy === 'oldest') {
        return (a.submittedAt || a.createdAt || '').localeCompare(b.submittedAt || b.createdAt || '');
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [properties, searchQuery, statusFilter, typeFilter, listingTypeFilter, cityFilter, sortBy]);

  // Reset to page 1 on filter changes
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setListingTypeFilter('all');
    setCityFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'all' ||
    typeFilter !== 'all' ||
    listingTypeFilter !== 'all' ||
    cityFilter !== 'all' ||
    sortBy !== 'newest';

  // Paginated subset
  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProperties.slice(startIndex, startIndex + pageSize);
  }, [filteredProperties, currentPage, pageSize]);

  // Actions
  const handleApprove = (id: string) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    showToast('Listing marked as Approved.');
  };

  const handleConfirmReject = () => {
    if (!rejectingTarget) return;
    const finalReason = rejectionNote.trim()
      ? `${rejectionReason}: ${rejectionNote.trim()}`
      : rejectionReason;

    setProperties((prev) =>
      prev.map((item) =>
        item.id === rejectingTarget.id
          ? { ...item, status: 'Rejected', rejectionReason: finalReason }
          : item
      )
    );
    setRejectingTarget(null);
    showToast('Listing rejected with feedback stored locally.');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setProperties((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast('Property listing permanently deleted from local registry.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Property Management"
        subtitle="Review, approve, modify, and monitor listings across all marketplace territories."
        onOpenMobileMenu={openMobileSidebar}
        actions={
          <Link to={ROUTES.SELL.ROOT}>
            <Button variant="primary" size="sm" icon={PlusCircle}>
              Add Property
            </Button>
          </Link>
        }
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E2DF] p-4 sm:p-5 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3A3A3]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
            placeholder="Search listings by title, locality, city, or owner..."
            className="w-full rounded-xl border border-[#A3A3A3] bg-white pl-10 pr-4 py-2.5 text-sm text-[#222222] placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#171717] focus:border-[#171717]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleFilterChange(setSearchQuery, '')}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#737373] hover:text-[#171717]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
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
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Published">Published</option>
              <option value="Rejected">Rejected</option>
              <option value="Sold">Sold</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Listing
            </label>
            <select
              value={listingTypeFilter}
              onChange={(e) => handleFilterChange(setListingTypeFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Listings</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              City
            </label>
            <select
              value={cityFilter}
              onChange={(e) => handleFilterChange(setCityFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
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
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E2DF] text-xs text-[#737373]">
            <span>Filtered results ({filteredProperties.length} found)</span>
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
      {filteredProperties.length === 0 ? (
        <AdminEmptyState
          title="No Properties Match Filters"
          description="Try broadening your search keywords or resetting active status/type filters."
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
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Listing</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2DF]">
                {paginatedProperties.map((p) => {
                  const isPending = p.status === 'Pending';

                  return (
                    <tr key={p.id} className="hover:bg-[#F5F5F2]/40 transition-colors">
                      {/* Property */}
                      <td className="py-3.5 px-4 font-semibold text-[#171717] max-w-xs">
                        <div className="truncate font-bold" title={p.title}>
                          {p.title}
                        </div>
                        <span className="text-[10px] text-[#A3A3A3] font-mono">
                          ID: {p.id}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {p.owner?.name || 'Verified Owner'}
                      </td>

                      {/* Property Type */}
                      <td className="py-3.5 px-4 text-xs text-[#222222] whitespace-nowrap">
                        {p.propertyType}
                      </td>

                      {/* Listing Type */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        <span className="font-semibold text-[#171717]">
                          {p.listingType === 'sale' ? 'Sale' : 'Rent'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-[#171717] whitespace-nowrap text-xs">
                        {formatPrice(p.price, p.listingType)}
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C66A4A]" />
                          {p.city}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AdminStatusBadge status={p.status || 'Published'} />
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {p.submittedAt || p.createdAt?.slice(0, 10) || 'Recently'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {isPending ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(p.id)}
                                title="Approve listing"
                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectingTarget(p)}
                                title="Reject listing"
                                className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-[#DC2626] hover:bg-red-100 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : null}

                          <Link
                            to={ROUTES.PROPERTY_DETAILS(p.id)}
                            title="View public details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            to={ROUTES.SELL.EDIT(p.id)}
                            title="Edit listing details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#C66A4A] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            title="Delete listing"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="lg:hidden divide-y divide-[#E2E2DF]">
            {paginatedProperties.map((p) => {
              const isPending = p.status === 'Pending';
              return (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <AdminStatusBadge status={p.status || 'Published'} />
                      <h4 className="text-sm font-bold text-[#171717] mt-1 line-clamp-1">
                        {p.title}
                      </h4>
                    </div>
                    <span className="text-sm font-extrabold text-[#171717] whitespace-nowrap">
                      {formatPrice(p.price, p.listingType)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#737373]">
                    <div>
                      <span className="text-[#A3A3A3]">Owner:</span> {p.owner?.name || 'Verified Owner'}
                    </div>
                    <div>
                      <span className="text-[#A3A3A3]">Location:</span> {p.city}
                    </div>
                    <div>
                      <span className="text-[#A3A3A3]">Category:</span> {p.propertyType} • {p.listingType === 'sale' ? 'Sale' : 'Rent'}
                    </div>
                    <div>
                      <span className="text-[#A3A3A3]">Date:</span> {p.submittedAt || p.createdAt?.slice(0, 10)}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E2DF]">
                    {isPending && (
                      <>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 px-2.5"
                          icon={Check}
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setRejectingTarget(p)}
                          className="text-[#DC2626] border-red-200 hover:bg-red-50 text-xs py-1 px-2.5"
                          icon={XCircle}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    <Link to={ROUTES.PROPERTY_DETAILS(p.id)}>
                      <Button variant="outline" size="sm" className="text-xs py-1 px-2.5 border-[#E2E2DF]">
                        View
                      </Button>
                    </Link>

                    <Link to={ROUTES.SELL.EDIT(p.id)}>
                      <Button variant="secondary" size="sm" className="text-xs py-1 px-2.5">
                        Edit
                      </Button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(p)}
                      aria-label="Delete listing"
                      className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredProperties.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Property Listing"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This is a local administrative operation and cannot be undone.`}
        confirmLabel="Confirm Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Rejection Modal Dialog */}
      {rejectingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setRejectingTarget(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Reject Listing: {rejectingTarget.title}
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                Select the rejection reason to record in the audit log.
              </p>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-[#222222] mb-1">
                  Rejection Reason
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
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
                  Specific Feedback Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Notes for seller explaining changes needed..."
                  className="w-full rounded-xl border border-[#A3A3A3] bg-white p-2.5 text-xs text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#171717] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectingTarget(null)}
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
