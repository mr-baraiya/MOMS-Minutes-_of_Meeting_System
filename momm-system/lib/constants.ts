/**
 * Application Constants
 * Centralized location for all application-wide constants
 */

// Application Info
export const APP_NAME = 'MOMM System';
export const APP_FULL_NAME = 'Minutes of Meeting Management System';
export const APP_DESCRIPTION = 'Streamline your meeting documentation and management';
export const APP_TAGLINE = 'Minutes of Meeting Management System - Streamline your meeting documentation and management';

// Contact Information
export const CONTACT_INFO = {
  email: {
    primary: 'vvbaraiya32@gmail.com',
    support: 'support@mommsystem.com',
  },
  phone: {
    display: '+91 (XXX) XXX-XXXX',
    hours: 'Mon-Fri 9:00 AM - 6:00 PM',
  },
  address: {
    city: 'Gujarat',
    country: 'India',
    full: 'Gujarat, India',
  },
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.9534693746665!2d72.82494507516492!3d21.19058098050632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f2c0000000d%3A0x5d9b5a5a5a5a5a5a!2sSurat%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sus!4v1706000000000!5m2!1sen!2sus',
};

// Social Media Links
export const SOCIAL_MEDIA = {
  facebook: '#',
  twitter: '#',
  linkedin: '#',
  instagram: '#',
};

// Navigation Links
export const NAV_LINKS = {
  features: '/#features',
  about: '/about',
  contact: '/contact',
  login: '/auth/login',
  register: '/auth/register',
  dashboard: '/dashboard',
};

// Footer Links
export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About', href: '/about' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

// JWT Configuration
export const JWT_CONFIG = {
  expiresIn: '7d',
  algorithm: 'HS256' as const,
};

// Bcrypt Configuration
export const BCRYPT_CONFIG = {
  saltRounds: 10,
};

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
};

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM DD, YYYY',
  displayWithTime: 'MMM DD, YYYY HH:mm',
  api: 'YYYY-MM-DD',
  apiWithTime: 'YYYY-MM-DDTHH:mm:ss',
};

// Role Definitions
export const ROLES = {
  ADMIN: 'ADMIN' as const,
  CONVENER: 'CONVENER' as const,
  STAFF: 'STAFF' as const,
};

// Status Definitions
export const STATUS = {
  ACTIVE: 'ACTIVE' as const,
  INACTIVE: 'INACTIVE' as const,
  PENDING: 'PENDING' as const,
  APPROVED: 'APPROVED' as const,
  REJECTED: 'REJECTED' as const,
};

// Meeting Status
export const MEETING_STATUS = {
  SCHEDULED: 'SCHEDULED' as const,
  ONGOING: 'ONGOING' as const,
  COMPLETED: 'COMPLETED' as const,
  CANCELLED: 'CANCELLED' as const,
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT' as const,
  ABSENT: 'ABSENT' as const,
  LATE: 'LATE' as const,
};

// File Upload Limits
export const FILE_UPLOAD = {
  maxSizeMB: 10,
  maxSizeBytes: 10 * 1024 * 1024,
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
};

// API Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  UPDATE_SUCCESS: 'Updated successfully',
  DELETE_SUCCESS: 'Deleted successfully',
  CREATE_SUCCESS: 'Created successfully',
  EMAIL_SENT: 'Email sent successfully',
};

// EmailJS Configuration Keys
export const EMAILJS_CONFIG = {
  serviceId: 'service_ij1kbxk',
  templateId: 'template_l75jhxh',
  publicKey: '2Tv2HvLNWCMxZGz9d',
};

// SweetAlert2 Default Configuration
export const SWAL_CONFIG = {
  confirmButtonColor: '#16a34a',
  cancelButtonColor: '#ef4444',
  iconColor: '#16a34a',
};

// Dashboard Role-Based Routing
export const DASHBOARD_ROUTES = {
  ADMIN: '/dashboard/admin',
  CONVENER: '/dashboard/convener',
  STAFF: '/dashboard/staff',
};

// Copyright
export const COPYRIGHT = {
  year: new Date().getFullYear(),
  holder: 'MOMM System',
  text: `© ${new Date().getFullYear()} MOMM System. All rights reserved.`,
};
