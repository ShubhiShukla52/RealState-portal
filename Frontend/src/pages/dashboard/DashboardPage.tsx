import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Heart,
  Building2,
  MessageSquare,
  Bell,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Edit,
  Eye,
  Calendar,
  MapPin,
  Bookmark,
} from 'lucide-react';
import { mockUser, mockListings } from '../../data/mockDashboard';
import { ROUTES } from '../../constants/routes';
import { StatCard } from '../../components/dashboard/StatCard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { ListingStatusBadge } from '../../components/dashboard/ListingStatusBadge';
import { PropertyCard } from '../../components/property/PropertyCard';
import { UpcomingVisits } from '../../components/property/UpcomingVisits';
import { InquiryStatusBadge } from '../../components/common/InquiryStatusBadge';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../utils/formatters';
import { formatDate } from '../../utils/date';
import { DashboardOutletContext } from '../../layouts/DashboardLayout';
import { useMessaging } from '../../context/MessagingContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useRecentlyViewed } from '../../context/RecentlyViewedContext';
import { useInquiries } from '../../context/InquiryContext';
import { getRecommendedProperties } from '../../utils/recommendations';
import { getUpcomingVisits } from '../../utils/inquiries';

export const DashboardPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<DashboardOutletContext>();
  const { conversations, unreadMessagesCount, unreadNotificationsCount } = useMessaging();
  const { favoriteProperties, favoritesCount, favorites } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();
  const { inquiries, getPendingCount } = useInquiries();
  const pendingInquiriesCount = getPendingCount();
  const upcomingVisits = React.useMemo(() => getUpcomingVisits(inquiries).slice(0, 2), [inquiries]);
  const mostRecentInquiry = inquiries[0];

  // Filter 3 recent favorites & 3 recent listings
  const recentFavorites = favoriteProperties.slice(0, 3);
  const recentListings = mockListings.slice(0, 3);

  // Recommendations for user
  const recommendedProperties = React.useMemo(() => {
    return getRecommendedProperties({
      viewedIds: recentlyViewed.map((v) => v.propertyId),
      favoriteIds: favorites.map((f) => f.propertyId),
      limit: 3,
    });
  }, [recentlyViewed, favorites]);

  const hasActivity = recentlyViewed.length > 0 || favorites.length > 0;

  const stats = [
    {
      title: 'Saved Properties',
      value: favoritesCount,
      icon: Heart,
      description: 'Bookmarked for review',
    },
    {
      title: 'My Listings',
      value: 3,
      icon: Building2,
      description: 'Total properties submitted',
    },
    {
      title: 'Unread Messages',
      value: unreadMessagesCount,
      icon: MessageSquare,
      trend: `${conversations.length} total`,
      description: 'Active inquiries',
    },
    {
      title: 'Notifications',
      value: unreadNotificationsCount,
      icon: Bell,
      trend: unreadNotificationsCount > 0 ? 'Pending' : 'All clear',
      description: 'System & listing updates',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader
        title={`Welcome back, ${mockUser.fullName.split(' ')[0]}`}
        subtitle="Here's what's happening with your EstateX account."
        onOpenMobileMenu={openMobileSidebar}
        action={
          <Link to={ROUTES.SELL.ROOT}>
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
            >
              Add Property
            </Button>
          </Link>
        }
      />

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            description={stat.description}
          />
        ))}
      </div>

      {/* Quick Actions Bar */}
      <section className="bg-white rounded-2xl border border-[#E2E2DF] p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737373] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link to={ROUTES.SELL.ROOT} className="w-full">
            <Button
              variant="primary"
              size="sm"
              icon={PlusCircle}
              className="w-full justify-center text-xs sm:text-sm py-2.5"
            >
              Add Property
            </Button>
          </Link>

          <Link to={ROUTES.DASHBOARD.MESSAGES} className="w-full">
            <Button
              variant="secondary"
              size="sm"
              icon={MessageSquare}
              className="w-full justify-center text-xs sm:text-sm py-2.5"
            >
              Messages
            </Button>
          </Link>

          <Link to={ROUTES.DASHBOARD.NOTIFICATIONS} className="w-full">
            <Button
              variant="secondary"
              size="sm"
              icon={Bell}
              className="w-full justify-center text-xs sm:text-sm py-2.5"
            >
              Notifications
            </Button>
          </Link>

          <Link to={ROUTES.DASHBOARD.FAVORITES} className="w-full">
            <Button
              variant="outline"
              size="sm"
              icon={Heart}
              className="w-full justify-center text-xs sm:text-sm py-2.5 border-[#E2E2DF]"
            >
              Favorites
            </Button>
          </Link>

          <Link to={ROUTES.DASHBOARD.SAVED_SEARCHES} className="w-full">
            <Button
              variant="outline"
              size="sm"
              icon={Bookmark}
              className="w-full justify-center text-xs sm:text-sm py-2.5 border-[#E2E2DF]"
            >
              Saved Searches
            </Button>
          </Link>

          <Link to={ROUTES.DASHBOARD.PROFILE} className="w-full">
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              className="w-full justify-center text-xs sm:text-sm py-2.5 border-[#E2E2DF]"
            >
              Edit Profile
            </Button>
          </Link>
        </div>
      </section>

      {/* Recommended for You Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#C66A4A] mb-1">
              Curated Selection
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#171717]">
              Recommended for You
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              {hasActivity
                ? "Based on residences you've viewed and bookmarked."
                : 'Personalized suggestions appear as you discover homes.'}
            </p>
          </div>
          <Link
            to={ROUTES.PROPERTIES}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!hasActivity ? (
          <div className="bg-white rounded-2xl border border-[#E2E2DF] p-8 text-center space-y-3">
            <p className="text-sm text-[#737373]">
              Explore properties to get personalized recommendations tailored to your architectural and locality preferences.
            </p>
            <Link to={ROUTES.PROPERTIES}>
              <Button variant="primary" size="sm">
                Explore Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Recently Saved Favorites */}
      <section className="space-y-4 pt-4 border-t border-[#E2E2DF]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171717]">
              Recently Saved
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              Residences you've bookmarked recently.
            </p>
          </div>
          <Link
            to={ROUTES.DASHBOARD.FAVORITES}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors"
          >
            <span>View All Favorites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentFavorites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E2DF] p-8 text-center space-y-2">
            <Heart className="w-8 h-8 text-[#A3A3A3] mx-auto" />
            <p className="text-sm font-semibold text-[#171717]">No saved properties yet</p>
            <p className="text-xs text-[#737373]">Save properties you like and they'll appear here.</p>
            <Link to={ROUTES.PROPERTIES}>
              <Button variant="outline" size="sm" className="mt-2 border-[#E2E2DF]">
                Explore Properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFavorites.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* My Recent Listings Preview */}
      <section className="space-y-4 pt-4 border-t border-[#E2E2DF]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#171717]">
              My Recent Listings
            </h2>
            <p className="text-xs sm:text-sm text-[#737373]">
              Track view metrics, status approvals, and listing edits.
            </p>
          </div>
          <Link
            to={ROUTES.DASHBOARD.LISTINGS}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors"
          >
            <span>View All Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-[#E2E2DF] p-4 sm:p-5 shadow-sm hover:border-[#A3A3A3] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left thumbnail and info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#171717] shrink-0 border border-[#E2E2DF]">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <ListingStatusBadge status={listing.status} />
                    <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                      {listing.listingType === 'sale' ? 'For Sale' : 'For Rent'} • {listing.propertyType}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#171717] truncate">
                    {listing.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#737373] mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C66A4A]" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      {listing.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A3A3A3]" />
                      {listing.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right price & action buttons */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E2E2DF]">
                <div className="text-left sm:text-right">
                  <p className="text-base sm:text-lg font-extrabold text-[#171717]">
                    {formatPrice(listing.price, listing.listingType)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={ROUTES.PROPERTY_DETAILS(listing.id)}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ExternalLink}
                      className="px-2.5 sm:px-3 text-xs border-[#E2E2DF]"
                    >
                      View
                    </Button>
                  </Link>

                  <Link to={ROUTES.SELL.EDIT(listing.id)}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit}
                      className="px-2.5 sm:px-3 text-xs"
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Property Inquiries Section (Step 14) */}
      <section className="space-y-4 pt-4 border-t border-[#E2E2DF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-[#171717]">
              Property Inquiries
            </h2>
            {pendingInquiriesCount > 0 && (
              <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                {pendingInquiriesCount} pending
              </span>
            )}
          </div>
          <Link
            to={ROUTES.DASHBOARD.INQUIRIES}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C66A4A] hover:text-[#b05c3e] transition-colors"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upcoming visits (left 7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Upcoming Site Visits
            </h3>
            <UpcomingVisits visits={upcomingVisits} showExploreLink={false} />
          </div>

          {/* Most recent inquiry (right 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Latest Inquiry
            </h3>
            {mostRecentInquiry ? (
              <div className="bg-white rounded-2xl border border-[#E2E2DF] p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <InquiryStatusBadge status={mostRecentInquiry.status} size="sm" />
                  <span className="text-[11px] text-[#A3A3A3]">
                    {formatDate(mostRecentInquiry.createdAt)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#171717] line-clamp-1">
                  {mostRecentInquiry.propertyTitle}
                </h4>
                <p className="text-xs text-[#737373] line-clamp-2 italic">
                  "{mostRecentInquiry.message}"
                </p>
                <div className="pt-2 border-t border-[#E2E2DF] flex items-center justify-between">
                  <span className="text-xs text-[#737373]">
                    Owner: <strong>{mostRecentInquiry.ownerName || 'Verified Owner'}</strong>
                  </span>
                  <Link to={`/inquiries/${mostRecentInquiry.id}`}>
                    <Button variant="outline" size="sm" className="text-xs px-2.5 py-1">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E2E2DF] p-6 text-center text-xs text-[#737373]">
                No inquiries submitted yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
