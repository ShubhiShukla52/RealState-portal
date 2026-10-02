import { Property } from './property';

export type AdminUserRole = 'User' | 'Agent' | 'Admin';
export type AdminUserStatus = 'Active' | 'Suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: string;
  listingsCount: number;
}

export type AdminReportTarget = 'Property' | 'User';
export type AdminReportReason =
  | 'Fraud'
  | 'Incorrect Information'
  | 'Duplicate Listing'
  | 'Inappropriate Content'
  | 'Spam'
  | 'Other';
export type AdminReportStatus = 'Open' | 'Under Review' | 'Resolved' | 'Dismissed';

export interface AdminReport {
  id: string;
  reportedBy: string;
  targetType: AdminReportTarget;
  targetId: string;
  propertyTitle?: string;
  userName?: string;
  reason: AdminReportReason;
  description: string;
  status: AdminReportStatus;
  createdAt: string;
  resolutionNote?: string;
}

export interface AdminActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'property_submitted' | 'property_approved' | 'user_registered' | 'property_reported' | 'property_sold' | 'profile_updated';
  status?: string;
}

export interface AdminPropertyItem extends Property {
  submittedAt?: string;
  rejectionReason?: string;
}
