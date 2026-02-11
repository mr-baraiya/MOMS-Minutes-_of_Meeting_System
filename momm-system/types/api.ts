// API Request and Response types

import { Role, VenueType, ReportType } from "./models";

// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
    staffId?: number;
    staffName?: string;
  };
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  staffName: string;
  designation?: string;
  mobileNo?: string;
  departmentId?: number;
}

// ============================================
// User Types
// ============================================

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: Role;
  profilePicture?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  profilePicture?: string;
  isActive?: boolean;
}

// ============================================
// Department Types
// ============================================

export interface CreateDepartmentRequest {
  departmentName: string;
}

export interface UpdateDepartmentRequest {
  departmentName?: string;
  isActive?: boolean;
}

// ============================================
// Staff Types
// ============================================

export interface CreateStaffRequest {
  userId: number;
  staffName: string;
  designation?: string;
  mobileNo?: string;
  emailAddress: string;
  departmentId?: number;
  profilePicture?: string;
}

export interface UpdateStaffRequest {
  staffName?: string;
  designation?: string;
  mobileNo?: string;
  emailAddress?: string;
  departmentId?: number;
  profilePicture?: string;
  isActive?: boolean;
}

// ============================================
// Meeting Type Types
// ============================================

export interface CreateMeetingTypeRequest {
  meetingTypeName: string;
}

export interface UpdateMeetingTypeRequest {
  meetingTypeName?: string;
  isActive?: boolean;
}

// ============================================
// Venue Types
// ============================================

export interface CreateVenueRequest {
  venueName: string;
  venueType?: VenueType;
  location?: string;
}

export interface UpdateVenueRequest {
  venueName?: string;
  venueType?: VenueType;
  location?: string;
  isActive?: boolean;
}

// ============================================
// Meeting Types
// ============================================

export interface CreateMeetingRequest {
  meetingTitle: string;
  meetingDescription?: string;
  meetingDate: string; // ISO date string
  meetingStartTime: string; // ISO datetime string
  meetingEndTime: string; // ISO datetime string
  meetingTypeId?: number;
  organizerStaffId: number;
  venueId?: number;
  meetingLink?: string;
  memberIds?: number[]; // Staff IDs to add as members
}

export interface UpdateMeetingRequest {
  meetingTitle?: string;
  meetingDescription?: string;
  meetingDate?: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
  meetingTypeId?: number;
  organizerStaffId?: number;
  venueId?: number;
  meetingLink?: string;
}

export interface CancelMeetingRequest {
  cancellationReason: string;
}

export interface MeetingFilters extends PaginationParams {
  startDate?: string;
  endDate?: string;
  meetingTypeId?: number;
  organizerStaffId?: number;
  memberStaffId?: number;
  venueId?: number;
  isCancelled?: boolean;
  search?: string;
}

// ============================================
// Meeting Member Types
// ============================================

export interface AddMeetingMemberRequest {
  staffId: number;
  remarks?: string;
}

export interface AddMeetingMembersRequest {
  staffIds: number[];
}

export interface MarkAttendanceRequest {
  memberId: number;
  isPresent: boolean;
  remarks?: string;
}

export interface BulkMarkAttendanceRequest {
  attendance: {
    memberId: number;
    isPresent: boolean;
    remarks?: string;
  }[];
}

// ============================================
// Document Types
// ============================================

export interface UploadDocumentRequest {
  meetingId: number;
  documentTitle: string;
  fileName: string;
  filePath: string;
  uploadedBy: number;
}

// ============================================
// Report Types
// ============================================

export interface GenerateReportRequest {
  reportName: string;
  reportType: ReportType;
  meetingId?: number;
  startDate?: string;
  endDate?: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  totalMeetings: number;
  upcomingMeetings: number;
  completedMeetings: number;
  cancelledMeetings: number;
  totalStaff: number;
  totalDocuments: number;
}

export interface RecentMeeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
  meetingType?: string;
  venue?: string;
  organizer?: string;
  status: "upcoming" | "completed" | "cancelled";
}
