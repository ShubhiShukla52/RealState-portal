import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  Eye,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { initialAdminUsers } from '../../data/mockAdmin';
import { AdminUser, AdminUserRole } from '../../types/admin';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminStatusBadge } from '../../components/admin/AdminStatusBadge';
import { AdminConfirmModal } from '../../components/admin/AdminConfirmModal';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { AdminEmptyState } from '../../components/admin/AdminEmptyState';
import { Button } from '../../components/ui/Button';
import { AdminOutletContext } from '../../layouts/AdminLayout';

export const AdminUsersPage: React.FC = () => {
  const { openMobileSidebar } = useOutletContext<AdminOutletContext>();
  const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name-asc' | 'name-desc'>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>('User');
  const [statusToggleUser, setStatusToggleUser] = useState<AdminUser | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role.toLowerCase() === roleFilter.toLowerCase());
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.joinedAt.localeCompare(a.joinedAt);
      if (sortBy === 'oldest') return a.joinedAt.localeCompare(b.joinedAt);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [users, searchQuery, roleFilter, statusFilter, sortBy]);

  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' || roleFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest';

  // Paginated list
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Role edit action
  const handleOpenEditRole = (user: AdminUser) => {
    setEditingRoleUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = () => {
    if (!editingRoleUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editingRoleUser.id ? { ...u, role: selectedRole } : u))
    );
    setEditingRoleUser(null);
    showToast(`Role updated to ${selectedRole} for ${editingRoleUser.name}.`);
  };

  // Status toggle (Suspend / Activate)
  const handleConfirmStatusToggle = () => {
    if (!statusToggleUser) return;
    const newStatus = statusToggleUser.status === 'Active' ? 'Suspended' : 'Active';

    setUsers((prev) =>
      prev.map((u) => (u.id === statusToggleUser.id ? { ...u, status: newStatus } : u))
    );
    setStatusToggleUser(null);
    showToast(`Account status updated to ${newStatus} for ${statusToggleUser.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="User Accounts"
        subtitle="Manage registered buyers, certified agents, and administrator permissions."
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

      {/* Search and Filters Bar */}
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
            placeholder="Search users by name, email, or phone number..."
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Role Filter */}
          <div>
            <label className="block font-bold text-[#737373] uppercase tracking-wider mb-1">
              Account Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => handleFilterChange(setRoleFilter, e.target.value)}
              className="w-full rounded-lg border border-[#E2E2DF] bg-white p-2 text-xs text-[#222222] focus:outline-none focus:ring-1 focus:ring-[#171717]"
            >
              <option value="all">All Roles</option>
              <option value="User">User</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
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
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
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
              <option value="newest">Recently Joined</option>
              <option value="oldest">Earliest Joined</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Clear Filters indicator */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E2DF] text-xs text-[#737373]">
            <span>Filtered results ({filteredUsers.length} found)</span>
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
      {filteredUsers.length === 0 ? (
        <AdminEmptyState
          title="No Users Match Search"
          description="Try searching with different names or resetting role/status filters."
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
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Listings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2DF]">
                {paginatedUsers.map((u) => {
                  const isActive = u.status === 'Active';
                  const initials = u.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={u.id} className="hover:bg-[#F5F5F2]/40 transition-colors">
                      {/* User */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#171717]">{u.name}</p>
                            <p className="text-[10px] text-[#A3A3A3] font-mono">{u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {u.email}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {u.phone}
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AdminStatusBadge status={u.role} />
                      </td>

                      {/* Listings Count */}
                      <td className="py-3.5 px-4 text-xs font-semibold text-[#171717] whitespace-nowrap">
                        {u.listingsCount} {u.listingsCount === 1 ? 'Listing' : 'Listings'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AdminStatusBadge status={u.status} />
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-xs text-[#737373] whitespace-nowrap">
                        {u.joinedAt}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailUser(u)}
                            title="View user details"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#171717] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditRole(u)}
                            title="Edit role"
                            className="p-1.5 rounded-lg border border-[#E2E2DF] text-[#737373] hover:text-[#C66A4A] hover:bg-[#F5F5F2] transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatusToggleUser(u)}
                            title={isActive ? 'Suspend user account' : 'Reactivate user account'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isActive
                                ? 'border-[#E2E2DF] text-[#737373] hover:text-[#DC2626] hover:bg-red-50'
                                : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
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
            {paginatedUsers.map((u) => {
              const isActive = u.status === 'Active';
              const initials = u.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();

              return (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#171717]">{u.name}</h4>
                        <p className="text-xs text-[#737373]">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <AdminStatusBadge status={u.status} />
                      <AdminStatusBadge status={u.role} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#737373] pt-1">
                    <span>{u.phone}</span>
                    <span>{u.listingsCount} Listings</span>
                    <span>Joined {u.joinedAt}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E2DF]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDetailUser(u)}
                      className="text-xs py-1 px-2.5 border-[#E2E2DF]"
                    >
                      Details
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEditRole(u)}
                      className="text-xs py-1 px-2.5"
                    >
                      Role
                    </Button>

                    <Button
                      type="button"
                      variant={isActive ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => setStatusToggleUser(u)}
                      className={
                        isActive
                          ? 'text-[#DC2626] border-red-200 hover:bg-red-50 text-xs py-1 px-2.5'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-xs py-1 px-2.5'
                      }
                    >
                      {isActive ? 'Suspend' : 'Activate'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* User Details Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setDetailUser(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-lg w-full z-10 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2E2DF]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#171717] text-white flex items-center justify-center font-bold text-base">
                  {detailUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#171717]">{detailUser.name}</h3>
                  <p className="text-xs text-[#737373]">Account ID: {detailUser.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailUser(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-[#737373] hover:text-[#171717]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <p className="font-semibold text-[#171717] truncate">{detailUser.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                <p className="font-semibold text-[#171717] truncate">{detailUser.phone}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Role & Status
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <AdminStatusBadge status={detailUser.role} />
                  <AdminStatusBadge status={detailUser.status} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F5F5F2]/70 space-y-1">
                <span className="text-[#A3A3A3] flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Properties Listed
                </span>
                <p className="font-semibold text-[#171717]">{detailUser.listingsCount} Total</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E2E2DF] bg-white text-xs space-y-1.5">
              <span className="font-bold text-[#171717] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#C66A4A]" /> Account History
              </span>
              <p className="text-[#737373] leading-relaxed">
                Registered on {detailUser.joinedAt}. Identity verification completed via OTP. No fraud sanctions recorded.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDetailUser(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
            onClick={() => setEditingRoleUser(null)}
          />

          <div className="relative bg-white rounded-2xl border border-[#E2E2DF] shadow-2xl p-6 max-w-sm w-full z-10 space-y-4 animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-bold text-[#171717]">
                Change Role: {editingRoleUser.name}
              </h3>
              <p className="text-xs text-[#737373] mt-1">
                Update user permissions and portal operational access.
              </p>
            </div>

            <div className="space-y-2 text-left">
              {(['User', 'Agent', 'Admin'] as AdminUserRole[]).map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedRole === role
                      ? 'border-[#C66A4A] bg-[#F8EBE6] text-[#171717] font-semibold'
                      : 'border-[#E2E2DF] bg-white hover:bg-[#F5F5F2]'
                  }`}
                >
                  <span className="text-xs font-medium">{role}</span>
                  <input
                    type="radio"
                    name="admin-role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                    className="w-4 h-4 text-[#C66A4A] focus:ring-[#171717]"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2DF]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingRoleUser(null)}
              >
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleSaveRole}>
                Save Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend / Activate Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(statusToggleUser)}
        title={
          statusToggleUser?.status === 'Active'
            ? 'Suspend User Account'
            : 'Activate User Account'
        }
        message={
          statusToggleUser?.status === 'Active'
            ? `Are you sure you want to suspend access for "${statusToggleUser?.name}"? The user will be temporarily blocked from managing listings.`
            : `Reactivate marketplace access and listing privileges for "${statusToggleUser?.name}"?`
        }
        confirmLabel={statusToggleUser?.status === 'Active' ? 'Confirm Suspend' : 'Activate User'}
        variant={statusToggleUser?.status === 'Active' ? 'danger' : 'primary'}
        onConfirm={handleConfirmStatusToggle}
        onCancel={() => setStatusToggleUser(null)}
      />
    </div>
  );
};
