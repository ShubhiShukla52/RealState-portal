import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { mockListings, UserListing } from '../../data/mockDashboard';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { ListingStatusBadge } from '../../components/dashboard/ListingStatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatters';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';

export const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const [listings, setListings] = useState<UserListing[]>(mockListings);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (!deleteId) return;
    setListings((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    setActionNotice('Listing removed from your account.');
    setTimeout(() => setActionNotice(null), 3500);
  };

  const targetListing = listings.find((item) => item.id === deleteId);

  return (
    <div className="space-y-6">
      {/* Header with Add New Property CTA */}
      <DashboardHeader
        title="My Listings"
        subtitle="Manage and monitor status for all your listed properties."
        onOpenMobileMenu={openMobileSidebar}
        action={
          <Link to={ROUTES.SELL.ROOT}>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
            >
              Add New Property
            </Button>
          </Link>
        }
      />

      {/* Action confirmation notification */}
      {actionNotice && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Delete Confirmation Modal UI */}
      {deleteId && targetListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-md w-full z-10 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Delete Listing?
              </h3>
              <p className="text-xs sm:text-sm text-[#737373] mt-1 leading-relaxed">
                Are you sure you want to remove <span className="font-semibold text-[#171717]">"{targetListing.title}"</span>?
                This will unpublish the listing from the marketplace.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDeleteConfirm}
                className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626]"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {listings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Listings Found"
          description="You haven't created any property listings yet. Publish your first property now."
          actionLabel="Add New Property"
          onAction={() => navigate(ROUTES.SELL.ROOT)}
          className="py-16 bg-white"
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-[#E2E2DF] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E2DF] bg-[#F5F5F2]/50 text-[11px] font-bold uppercase tracking-wider text-[#737373]">
                    <th scope="col" className="py-3.5 px-5">Property</th>
                    <th scope="col" className="py-3.5 px-4">Price</th>
                    <th scope="col" className="py-3.5 px-4">Type</th>
                    <th scope="col" className="py-3.5 px-4">Status</th>
                    <th scope="col" className="py-3.5 px-4">Created</th>
                    <th scope="col" className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DF] text-sm">
                  {listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className="hover:bg-[#F5F5F2]/40 transition-colors group"
                    >
                      {/* Property Column */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-12 h-12 rounded-lg object-cover bg-[#F5F5F2] shrink-0 border border-[#E2E2DF]"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-[#171717] truncate group-hover:text-[#C66A4A] transition-colors">
                              {listing.title}
                            </p>
                            <p className="text-xs text-[#737373] truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#C66A4A]" />
                              {listing.location}
                            </p>
                            <div className="mt-1">
                              <Link
                                to={ROUTES.DASHBOARD.INQUIRIES}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-[#737373] hover:text-[#C66A4A] bg-[#F5F5F2] hover:bg-[#E2E2DF] px-2 py-0.5 rounded border border-[#E2E2DF] transition-colors"
                              >
                                <MessageSquare className="w-2.5 h-2.5 text-[#C66A4A]" />
                                <span>{listing.id === 'list-1' ? '3 inquiries' : listing.id === 'list-2' ? '1 visit request' : '2 inquiries'}</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-4 font-bold text-[#171717] whitespace-nowrap">
                        {formatPrice(listing.price, listing.listingType)}
                      </td>

                      {/* Type Column */}
                      <td className="py-4 px-4 text-xs text-[#737373] whitespace-nowrap">
                        <span className="font-semibold text-[#171717]">
                          {listing.listingType === 'sale' ? 'Sale' : 'Rent'}
                        </span>
                        <span className="text-[#A3A3A3]"> • {listing.propertyType}</span>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <ListingStatusBadge status={listing.status} />
                      </td>

                      {/* Created Column */}
                      <td className="py-4 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {listing.createdAt}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={ROUTES.PROPERTY_DETAILS(listing.id)}
                            title="View property details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={ROUTES.SELL.EDIT(listing.id)}
                            title="Edit listing"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#C66A4A] hover:bg-[#F5F5F2] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteId(listing.id)}
                            title="Delete listing"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DC2626]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Cards View */}
          <div className="md:hidden space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-[#E2E2DF] p-4 shadow-sm space-y-3"
              >
                <div className="flex gap-3">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-20 h-20 rounded-xl object-cover bg-[#F5F5F2] shrink-0 border border-[#E2E2DF]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <ListingStatusBadge status={listing.status} />
                      <span className="text-[11px] font-semibold text-[#737373] uppercase">
                        {listing.listingType === 'sale' ? 'Sale' : 'Rent'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#171717] truncate">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-[#737373] truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C66A4A] shrink-0" />
                      {listing.location}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <p className="text-sm font-extrabold text-[#171717]">
                        {formatPrice(listing.price, listing.listingType)}
                      </p>
                      <Link
                        to={ROUTES.DASHBOARD.INQUIRIES}
                        className="inline-flex items-center gap-1 text-[10px] font-medium text-[#737373] bg-[#F5F5F2] px-2 py-0.5 rounded border border-[#E2E2DF]"
                      >
                        <MessageSquare className="w-2.5 h-2.5 text-[#C66A4A]" />
                        <span>{listing.id === 'list-1' ? '3 inquiries' : listing.id === 'list-2' ? '1 visit request' : '2 inquiries'}</span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E2E2DF] text-xs text-[#737373]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    {listing.createdAt}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link to={ROUTES.PROPERTY_DETAILS(listing.id)}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        className="px-2.5 py-1 text-xs"
                      >
                        View
                      </Button>
                    </Link>
                    <Link to={ROUTES.SELL.EDIT(listing.id)}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Edit}
                        className="px-2.5 py-1 text-xs"
                      >
                        Edit
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(listing.id)}
                      aria-label={`Delete ${listing.title}`}
                      className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
