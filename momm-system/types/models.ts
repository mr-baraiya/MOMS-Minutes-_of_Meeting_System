// Database model types (matching Prisma schema)
import { Role, VenueType, ReportType } from "@prisma/client";

// Re-export Prisma enums for convenience
export { Role, VenueType, ReportType };

// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  profilePicture?: string | null;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

export interface UserWithStaff extends User {
  staff?: Staff | null;
}

// Department types
export interface Department {
  id: number;
  departmentName: string;
  isActive: boolean;
  createdAt: Date;
}

// Staff types
export interface Staff {
  id: number;
  userId: number;
  staffName: string;
  designation?: string | null;
  mobileNo?: string | null;
  emailAddress: string;
  departmentId?: number | null;
  profilePicture?: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface StaffWithRelations extends Staff {
  user?: User;
  department?: Department | null;
}

// Meeting Type types
export interface MeetingType {
  id: number;
  meetingTypeName: string;
  isActive: boolean;
  createdAt: Date;
}

// Venue types
export interface Venue {
  id: number;
  venueName: string;
  venueType: VenueType;
  location?: string | null;
  isActive: boolean;
  createdAt: Date;
}

// Meeting types
export interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDescription?: string | null;
  meetingDate: Date;
  meetingStartTime: Date;
  meetingEndTime: Date;
  meetingTypeId?: number | null;
  organizerStaffId?: number | null;
  venueId?: number | null;
  meetingLink?: string | null;
  isCancelled: boolean;
  cancellationReason?: string | null;
  cancelledAt?: Date | null;
  createdAt: Date;
  modifiedAt: Date;
}

export interface MeetingWithRelations extends Meeting {
  meetingType?: MeetingType | null;
  organizer?: StaffWithRelations | null;
  venue?: Venue | null;
  meetingMembers?: MeetingMemberWithStaff[];
  documents?: Document[];
}

export interface MeetingWithCount extends MeetingWithRelations {
  _count: {
    meetingMembers: number;
    documents: number;
  };
}

// Meeting Member types
export interface MeetingMember {
  id: number;
  meetingId: number;
  staffId: number;
  isPresent: boolean;
  attendanceMarkedAt?: Date | null;
  remarks?: string | null;
  createdAt: Date;
}

export interface MeetingMemberWithStaff extends MeetingMember {
  staff?: StaffWithRelations;
}

// Document types
export interface Document {
  id: number;
  meetingId: number;
  documentTitle: string;
  fileName: string;
  filePath: string;
  uploadedBy: number;
  uploadedAt: Date;
}

export interface DocumentWithRelations extends Document {
  meeting?: MeetingWithRelations;
  uploader?: UserWithStaff;
}

export interface DocumentWithMeetingInfo extends Document {
  meeting: {
    id: number;
    meetingTitle: string;
    meetingDate: Date;
    organizer?: {
      staffName: string;
      department?: {
        departmentName: string;
      } | null;
    } | null;
  };
  uploader: {
    id: number;
    username: string;
    email: string;
    staff?: {
      staffName: string;
      department?: {
        departmentName: string;
      } | null;
    } | null;
  };
}

// Report types
export interface Report {
  id: number;
  reportName: string;
  reportType: ReportType;
  meetingId?: number | null;
  filePath: string;
  generatedBy: number;
  generatedAt: Date;
}

export interface ReportWithRelations extends Report {
  meeting?: Meeting | null;
  generator?: User;
}

// Notification types
export enum NotificationType {
  MEETING_CREATED = "MEETING_CREATED",
  MEETING_UPDATED = "MEETING_UPDATED",
  MEETING_CANCELLED = "MEETING_CANCELLED",
  ATTENDANCE_MARKED = "ATTENDANCE_MARKED",
  DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED",
  REPORT_GENERATED = "REPORT_GENERATED",
  SUPPORT_TICKET_UPDATED = "SUPPORT_TICKET_UPDATED",
  GENERAL = "GENERAL",
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number | null;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationWithUser extends Notification {
  user?: User;
}
