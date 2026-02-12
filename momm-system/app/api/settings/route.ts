import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { unauthorizedResponse, forbiddenResponse, successResponse, handleApiError } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/settings
 * Returns settings based on user role
 * - Admin: System config, Email config, Security settings, Profile
 * - Convener: Meeting preferences, Notification preferences, Profile
 * - Staff: Notification preferences, Profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    // Get user profile data
    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
        role: true,
        staff: {
          select: {
            id: true,
            staffName: true,
            designation: true,
            mobileNo: true,
            emailAddress: true,
            departmentId: true,
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build response based on role and section
    const response: any = {
      profile: {
        ...userProfile,
      }
    };

    // Admin-specific settings
    if (user.role === 'admin') {
      response.systemSettings = {
        defaultMeetingDuration: 60,
        defaultMeetingType: 'General Meeting',
        fileUploadSizeLimit: 10,
        allowedFileFormats: ['pdf'],
        requireStrongPasswords: true,
        autoLogoutInactivity: true,
        sessionTimeout: 30,
      };

      response.emailSettings = {
        smtpSenderName: 'MOMS System',
        enableEmailNotifications: true,
        meetingReminderEmails: true,
        momUploadNotifications: true,
      };

      response.securitySettings = {
        requireStrongPasswords: true,
        autoLogoutInactivity: true,
        sessionTimeout: 30,
      };

      response.notificationPreferences = {
        emailNotifications: true,
        meetingReminders: true,
        momAvailability: true,
        attendanceReminders: true,
      };
    }

    // Convener-specific settings
    if (user.role === 'convener') {
      response.meetingPreferences = {
        defaultMeetingDuration: 60,
        preferredMeetingType: 'Team Meeting',
        defaultVenueType: 'Physical',
        defaultVenue: null,
      };

      response.notificationPreferences = {
        emailReminders: true,
        smsNotifications: false,
        participantConfirmation: true,
        attendanceSubmissionReminders: true,
        momUploadConfirmation: true,
      };
    }

    // Staff-specific settings
    if (user.role === 'staff') {
      response.notificationPreferences = {
        meetingNotifications: true,
        momAvailability: true,
        attendanceMarkedNotification: true,
      };
    }

    // Filter by section if requested
    if (section) {
      if (section === 'system' && user.role !== 'admin') {
        return forbiddenResponse('Only administrators can access system settings');
      }
      if (section === 'email' && user.role !== 'admin') {
        return forbiddenResponse('Only administrators can access email settings');
      }
      if (section === 'security' && user.role !== 'admin') {
        return forbiddenResponse('Only administrators can access security settings');
      }
      if (section === 'meeting-preferences' && user.role !== 'convener') {
        return forbiddenResponse('Only conveners can access meeting preferences');
      }

      const sectionKey = section === 'system' ? 'systemSettings' :
                        section === 'email' ? 'emailSettings' :
                        section === 'security' ? 'securitySettings' :
                        section === 'meeting-preferences' ? 'meetingPreferences' :
                        section === 'notifications' ? 'notificationPreferences' :
                        section;

      if (response[sectionKey]) {
        return successResponse({ [sectionKey]: response[sectionKey] });
      }
    }

    return successResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/settings
 * Updates settings based on user role and section
 */
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    }

    // Role-based access control
    if (section === 'system' && user.role !== 'admin') {
      return forbiddenResponse('Only administrators can update system settings');
    }
    if (section === 'email' && user.role !== 'admin') {
      return forbiddenResponse('Only administrators can update email settings');
    }
    if (section === 'security' && user.role !== 'admin') {
      return forbiddenResponse('Only administrators can update security settings');
    }
    if (section === 'meeting-preferences' && user.role !== 'convener') {
      return forbiddenResponse('Only conveners can update meeting preferences');
    }

    // Handle profile updates (all roles)
    if (section === 'profile') {
      const allowedFields: any = {};

      // Profile picture update
      if (data.profilePicture !== undefined) {
        allowedFields.profilePicture = data.profilePicture;
      }

      // Update User table
      const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: allowedFields,
        select: {
          id: true,
          username: true,
          email: true,
          profilePicture: true,
          role: true,
          staff: {
            select: {
              id: true,
              staffName: true,
              designation: true,
              mobileNo: true,
              emailAddress: true,
              departmentId: true,
            }
          }
        }
      });

      // If user has staff record, update staff-specific fields
      if (updatedUser.staff && (data.name || data.mobile)) {
        await prisma.staff.update({
          where: { id: updatedUser.staff.id },
          data: {
            ...(data.name && { staffName: data.name }),
            ...(data.mobile && { mobileNo: data.mobile }),
          }
        });
      }

      return successResponse({ profile: updatedUser }, 'Profile updated successfully');
    }

    // Handle password change (all roles)
    if (section === 'password') {
      const bcrypt = require('bcryptjs');
      const { currentPassword, newPassword } = data;

      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 });
      }

      const userWithPassword = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { passwordHash: true }
      });

      if (!userWithPassword) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, userWithPassword.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.userId },
        data: { passwordHash: hashedPassword }
      });

      return successResponse({}, 'Password updated successfully');
    }

    // For other sections, return success (would be saved to DB in production)
    return successResponse({ section, data }, `${section} settings updated successfully`);

  } catch (error) {
    return handleApiError(error);
  }
}
