import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MessageSquare,
  X,
  Building2,
  Filter,
} from 'lucide-react';
import { Container } from '../../components/ui/Container';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';
import { useInquiries } from '../../context/InquiryContext';
import { InquiryCard } from './components/InquiryCard';
import { filterInquiries, sortInquiries, getInquiryCounts } from '../../utils/inquiries';

const TABS = [
  { key: 'all', label: 'All Inquiries' },
  { key: 'pending', label: 'Pending' },
  { key: 'visit_requested', label: 'Visit Requests' },
  { key: 'visit_confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export const InquiriesPage: React.FC = () => {
  const { inquiries } = useInquiries();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const [activeTab, setActiveTab] = useState<string>(urlStatus);
  const [searchQuery, setSearchQuery] = useState<string>(urlSearch);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'date'>('newest');

  // Sync state with URL params
  useEffect(() => {
    if (urlStatus !== activeTab) {
      setActiveTab(urlStatus);
    }
  }, [urlStatus]);

  useEffect(() => {
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    const newParams = new URLSearchParams(searchParams);
    if (key === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Counts
  const counts = useMemo(() => getInquiryCounts(inquiries), [inquiries]);

  // Filtered & sorted results
  const filteredList = useMemo(() => {
    const filtered = filterInquiries(inquiries, {
      status: activeTab,
      search: searchQuery,
    });
    return sortInquiries(filtered, sortBy);
  }, [inquiries, activeTab, searchQuery, sortBy]);

  const getTabBadgeCount = (key: string) => {
    switch (key) {
      case 'all':
        return counts.total;
      case 'pending':
        return counts.pending;
      case 'visit_requested':
        return counts.visitRequests;
      case 'visit_confirmed':
        return counts.confirmedVisits;
      case 'completed':
        return counts.completed;
      case 'cancelled':
        return counts.cancelled;
      default:
        return 0;
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#F5F5F2] min-h-screen">
      <Container size="xl">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C66A4A] block mb-1">
              Communication & Visits
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#171717] tracking-tight">
              My Inquiries
            </h1>
            <p className="text-sm sm:text-base text-[#737373] mt-1">
              Track your property questions and visit requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard/inquiries">
              <Button variant="outline" size="sm">
                Dashboard Overview
              </Button>
            </Link>
            <Link to="/properties">
              <Button variant="primary" size="sm" icon={Building2}>
                Explore Properties
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Sorting Toolbar */}
        <div className="bg-white rounded-2xl border border-[#E2E2DF] p-4 sm:p-5 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by property title, location, or inquiry ID..."
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-[#E2E2DF] bg-[#F5F5F2]/50 focus:bg-white focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#171717]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#737373] font-medium whitespace-nowrap">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-[#E2E2DF] bg-white text-[#171717] font-medium focus:outline-none focus:border-[#171717]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="date">Visit Date</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-[#E2E2DF] pt-3">
            {TABS.map((tab) => {
              const count = getTabBadgeCount(tab.key);
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors inline-flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#171717] text-white shadow-xs'
                      : 'bg-[#F5F5F2] text-[#737373] hover:text-[#171717] hover:bg-[#E2E2DF]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E2E2DF] text-[#171717]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inquiry Cards List / Empty State */}
        {inquiries.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No inquiries yet"
            description="You haven't contacted any property owners or requested visits yet."
            actionLabel="Browse Properties"
            onAction={() => (window.location.href = '/properties')}
            className="bg-white rounded-2xl border border-[#E2E2DF] p-12 text-center"
          />
        ) : filteredList.length === 0 ? (
          <EmptyState
            icon={Filter}
            title="No inquiries match your filters"
            description="Try changing your search terms or selecting a different status filter tab."
            actionLabel="Reset Filters"
            onAction={() => {
              setActiveTab('all');
              setSearchQuery('');
              setSearchParams(new URLSearchParams());
            }}
            className="bg-white rounded-2xl border border-[#E2E2DF] p-12 text-center"
          />
        ) : (
          <div className="space-y-4">
            {filteredList.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};
