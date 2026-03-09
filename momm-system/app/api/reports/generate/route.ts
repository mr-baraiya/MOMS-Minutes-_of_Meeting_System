import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ReportType } from '@prisma/client';

/**
 * POST /api/reports/generate
 * Generate a new report
 */
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = user.role.toUpperCase();

    // Staff cannot generate reports
    if (role === 'STAFF') {
      return NextResponse.json(
        { error: 'Staff members cannot generate reports' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { reportType, meetingId, departmentId, dateFrom, dateTo, format } = body;

    // Validation
    if (!reportType || !dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'Report type and date range are required' },
        { status: 400 }
      );
    }

    // Convener restrictions
    if (role === 'CONVENER') {
      // Conveners can only generate meeting-wise or attendance reports
      if (!['meeting-wise', 'attendance-summary'].includes(reportType)) {
        return NextResponse.json(
          { error: 'Conveners can only generate meeting-wise and attendance reports' },
          { status: 403 }
        );
      }

      // If meeting is specified, verify ownership
      if (meetingId) {
        const meeting = await prisma.meeting.findFirst({
          where: {
            id: meetingId,
            organizerStaffId: user.staffId,
          },
        });

        if (!meeting) {
          return NextResponse.json(
            { error: 'You can only generate reports for meetings you organize' },
            { status: 403 }
          );
        }
      }
    }

    // Map frontend report type to database enum
    const reportTypeMap: Record<string, ReportType> = {
      'meeting-wise': 'MEETING_WISE',
      'attendance-summary': 'SUMMARY',
      'department-wise': 'SUMMARY', // Using SUMMARY for now
      'monthly-summary': 'SUMMARY',
    };

    const dbReportType = reportTypeMap[reportType] || 'SUMMARY';

    // Generate report name
    const reportName = generateReportName(reportType, meetingId, dateFrom, dateTo);

    // Create report record (filePath updated below once we have the ID)
    const report = await prisma.report.create({
      data: {
        reportName,
        reportType: dbReportType,
        meetingId: meetingId || null,
        filePath: 'pending',
        generatedBy: user.userId,
      },
      include: {
        generator: {
          select: {
            username: true,
            staff: {
              select: {
                staffName: true,
              },
            },
          },
        },
        meeting: {
          select: {
            meetingTitle: true,
            meetingDate: true,
          },
        },
      },
    });

    // Build the real on-demand download URL with filter params encoded
    const typeLabel = reportType
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const downloadParams = new URLSearchParams({
      from: dateFrom,
      to: dateTo,
      typeLabel,
      ...(departmentId ? { deptId: String(departmentId) } : {}),
    });
    const downloadUrl = `/api/reports/${report.id}/download?${downloadParams.toString()}`;

    // Update the stored filePath to the real download URL
    await prisma.report.update({
      where: { id: report.id },
      data: { filePath: downloadUrl },
    });

    return NextResponse.json({
      success: true,
      message: 'Report generated successfully',
      report: {
        id: report.id,
        reportName: report.reportName,
        reportType: reportType,
        fileUrl: downloadUrl,
        createdAt: report.generatedAt,
        meeting: report.meeting,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function generateReportName(
  reportType: string,
  meetingId: number | undefined,
  dateFrom: string,
  dateTo: string
): string {
  const timestamp = new Date().toISOString().split('T')[0];
  const typeLabel = reportType
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (meetingId) {
    return `${typeLabel}_Meeting${meetingId}_${timestamp}`;
  }

  return `${typeLabel}_${dateFrom}_to_${dateTo}_${timestamp}`;
}
