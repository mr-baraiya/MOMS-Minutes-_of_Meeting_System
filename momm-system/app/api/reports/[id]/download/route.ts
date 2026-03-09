import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserFromRequest(req);

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const reportId = parseInt(id);
    if (isNaN(reportId)) {
      return new NextResponse('Invalid report ID', { status: 400 });
    }

    // Fetch the report record
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        generator: {
          select: {
            username: true,
            staff: { select: { staffName: true, designation: true } },
          },
        },
        meeting: {
          include: {
            meetingType: true,
            venue: true,
            organizer: {
              include: {
                department: true,
              },
            },
            meetingMembers: {
              include: {
                staff: {
                  include: {
                    department: true,
                  },
                },
              },
              orderBy: { staff: { staffName: 'asc' } },
            },
          },
        },
      },
    });

    if (!report) {
      return new NextResponse('Report not found', { status: 404 });
    }

    // Role-based access: convener can only view their own meeting reports
    if (user.role === 'convener') {
      if (report.generatedBy !== user.userId) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    const searchParams = req.nextUrl.searchParams;
    const dateFrom = searchParams.get('from') || '';
    const dateTo = searchParams.get('to') || '';
    const reportTypeLabel = searchParams.get('typeLabel') || report.reportType;

    // Fetch ranged data for non-meeting-specific reports
    let meetingsInRange: Awaited<ReturnType<typeof prisma.meeting.findMany>> = [];
    if (!report.meeting && (dateFrom || dateTo)) {
      const where: Record<string, unknown> = {};
      if (dateFrom || dateTo) {
        where.meetingDate = {};
        if (dateFrom) (where.meetingDate as Record<string, Date>).gte = new Date(dateFrom);
        if (dateTo) (where.meetingDate as Record<string, Date>).lte = new Date(dateTo);
      }
      // Dept filter
      const deptId = searchParams.get('deptId');
      if (deptId) {
        where.organizer = { departmentId: parseInt(deptId) };
      }
      meetingsInRange = await prisma.meeting.findMany({
        where,
        include: {
          meetingType: true,
          venue: true,
          organizer: { include: { department: true } },
          meetingMembers: {
            include: { staff: { include: { department: true } } },
          },
        },
        orderBy: { meetingDate: 'asc' },
      });
    }

    const generatorName =
      report.generator.staff?.staffName || report.generator.username;
    const generatedAt = new Date(report.generatedAt).toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const html = generateReportHtml({
      report,
      generatorName,
      generatedAt,
      dateFrom,
      dateTo,
      reportTypeLabel,
      meetingsInRange,
    });

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating report download:', error);
    return new NextResponse('Failed to generate report', { status: 500 });
  }
}

// ─── HTML generation ──────────────────────────────────────────────────────────

interface GenerateParams {
  report: Awaited<ReturnType<typeof prisma.report.findUnique>> & {
    meeting?: {
      meetingTitle: string;
      meetingDate: Date;
      meetingStartTime: Date;
      meetingEndTime: Date;
      meetingLink?: string | null;
      meetingType?: { meetingTypeName: string } | null;
      venue?: { venueName: string; location?: string | null } | null;
      organizer?: {
        staffName: string;
        designation?: string | null;
        department?: { departmentName: string } | null;
      } | null;
      meetingMembers: Array<{
        isPresent: boolean;
        remarks?: string | null;
        staff: {
          staffName: string;
          designation?: string | null;
          department?: { departmentName: string } | null;
        };
      }>;
    } | null;
  };
  generatorName: string;
  generatedAt: string;
  dateFrom: string;
  dateTo: string;
  reportTypeLabel: string;
  meetingsInRange: Awaited<ReturnType<typeof prisma.meeting.findMany>>;
}

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function fmtTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function generateReportHtml(params: GenerateParams): string {
  const { report, generatorName, generatedAt, dateFrom, dateTo, reportTypeLabel, meetingsInRange } =
    params;

  const meetingSection = report.meeting
    ? buildMeetingSection(report.meeting)
    : buildRangeSummarySection(meetingsInRange, dateFrom, dateTo);

  const dateRangeText =
    dateFrom && dateTo
      ? `${fmtDate(dateFrom)} – ${fmtDate(dateTo)}`
      : dateFrom
      ? `From ${fmtDate(dateFrom)}`
      : dateTo
      ? `To ${fmtDate(dateTo)}`
      : '—';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${report!.reportName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #f4f6fa; }
  .page { max-width: 860px; margin: 0 auto; background: #fff; padding: 40px 48px; }
  /* Header */
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; }
  .header-logo { display: flex; align-items: center; gap: 12px; }
  .logo-circle { width: 48px; height: 48px; background: #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 20px; }
  .system-name { font-size: 20px; font-weight: 800; color: #1e40af; }
  .system-sub { font-size: 11px; color: #6b7280; margin-top: 2px; }
  .header-right { text-align: right; font-size: 11px; color: #6b7280; }
  /* Report title block */
  .report-title-block { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: #fff; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; }
  .report-title-block h1 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .report-title-block p { font-size: 12px; opacity: .85; }
  /* Meta grid */
  .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .meta-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; }
  .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; margin-bottom: 4px; }
  .meta-value { font-size: 13px; font-weight: 600; color: #111827; }
  /* Section */
  .section { margin-bottom: 28px; }
  .section-title { font-size: 14px; font-weight: 700; color: #1e40af; border-left: 4px solid #2563eb; padding-left: 10px; margin-bottom: 12px; }
  /* Detail row */
  .detail-row { display: flex; gap: 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 8px; }
  .detail-label { background: #f9fafb; font-weight: 600; color: #374151; padding: 8px 14px; min-width: 160px; border-right: 1px solid #e5e7eb; font-size: 12px; }
  .detail-value { padding: 8px 14px; color: #111827; font-size: 12px; }
  /* Table */
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { background: #1e40af; color: #fff; padding: 9px 12px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
  td { padding: 8px 12px; border-bottom: 1px solid #f3f4f6; }
  tr:nth-child(even) td { background: #f9fafb; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 700; }
  .badge-present { background: #d1fae5; color: #065f46; }
  .badge-absent { background: #fee2e2; color: #991b1b; }
  .badge-cancelled { background: #fef3c7; color: #92400e; }
  .stats-row { display: flex; gap: 12px; margin-bottom: 16px; }
  .stat-box { flex: 1; border-radius: 8px; padding: 12px; text-align: center; }
  .stat-box.blue { background: #eff6ff; border: 1px solid #bfdbfe; }
  .stat-box.green { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .stat-box.red { background: #fef2f2; border: 1px solid #fecaca; }
  .stat-box.purple { background: #faf5ff; border: 1px solid #e9d5ff; }
  .stat-num { font-size: 24px; font-weight: 800; }
  .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; margin-top: 2px; }
  /* Footer */
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
  /* Print button (hidden when printing) */
  .print-bar { position: fixed; top: 0; left: 0; right: 0; background: #1e40af; color: #fff; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 999; }
  .print-btn { background: #fff; color: #1e40af; border: none; border-radius: 6px; padding: 6px 18px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 7px; }
  .print-btn:hover { background: #dbeafe; }
  .bar-title { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; }
  body { padding-top: 46px; }
  @media print {
    .print-bar { display: none !important; }
    body { background: #fff; padding-top: 0; }
    .page { max-width: 100%; padding: 20px 24px; box-shadow: none; }
  }
</style>
</head>
<body>
<div class="print-bar">
  <span class="bar-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    ${report!.reportName}
  </span>
  <button class="print-btn" onclick="window.print()">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    Print / Save as PDF
  </button>
</div>
<div class="page">
  <!-- Header -->
  <div class="header">
    <div class="header-logo">
      <div class="logo-circle">M</div>
      <div>
        <div class="system-name">MOMM System</div>
        <div class="system-sub">Minutes of Meeting Management</div>
      </div>
    </div>
    <div class="header-right">
      <div>Generated by: <strong>${generatorName}</strong></div>
      <div>${generatedAt}</div>
    </div>
  </div>

  <!-- Report Title -->
  <div class="report-title-block">
    <h1>${report!.reportName}</h1>
    <p>${reportTypeLabel}${dateRangeText !== '—' ? ` &nbsp;|&nbsp; ${dateRangeText}` : ''}</p>
  </div>

  ${meetingSection}

  <!-- Footer -->
  <div class="footer">
    <span>MOMM – Minutes of Meeting Management System</span>
    <span>Report ID: #${report!.id} &nbsp;|&nbsp; ${generatedAt}</span>
  </div>
</div>
</body>
</html>`;
}

// ─── Meeting-wise report section ─────────────────────────────────────────────
function buildMeetingSection(
  meeting: NonNullable<GenerateParams['report']>['meeting']
): string {
  if (!meeting) return '';

  const members = meeting.meetingMembers ?? [];
  const presentCount = members.filter((m) => m.isPresent).length;
  const absentCount = members.length - presentCount;
  const attendanceRate =
    members.length > 0 ? Math.round((presentCount / members.length) * 100) : 0;

  const memberRows = members
    .map(
      (m, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${m.staff.staffName}</td>
      <td>${m.staff.designation || '—'}</td>
      <td>${m.staff.department?.departmentName || '—'}</td>
      <td><span class="badge ${m.isPresent ? 'badge-present' : 'badge-absent'}">${m.isPresent ? '✓ Present' : '✗ Absent'}</span></td>
      <td>${m.remarks || '—'}</td>
    </tr>`
    )
    .join('');

  return `
  <!-- Meeting Details -->
  <div class="section">
    <div class="section-title">Meeting Details</div>
    <div class="detail-row"><div class="detail-label">Title</div><div class="detail-value">${meeting.meetingTitle}</div></div>
    <div class="detail-row"><div class="detail-label">Date</div><div class="detail-value">${fmtDate(meeting.meetingDate)}</div></div>
    <div class="detail-row"><div class="detail-label">Time</div><div class="detail-value">${fmtTime(meeting.meetingStartTime)} – ${fmtTime(meeting.meetingEndTime)}</div></div>
    <div class="detail-row"><div class="detail-label">Type</div><div class="detail-value">${meeting.meetingType?.meetingTypeName || '—'}</div></div>
    <div class="detail-row"><div class="detail-label">Venue</div><div class="detail-value">${meeting.venue ? `${meeting.venue.venueName}${meeting.venue.location ? ` (${meeting.venue.location})` : ''}` : '—'}</div></div>
    <div class="detail-row"><div class="detail-label">Organizer</div><div class="detail-value">${meeting.organizer ? `${meeting.organizer.staffName}${meeting.organizer.designation ? ` – ${meeting.organizer.designation}` : ''}` : '—'}</div></div>
    <div class="detail-row"><div class="detail-label">Department</div><div class="detail-value">${meeting.organizer?.department?.departmentName || '—'}</div></div>
    ${meeting.meetingLink ? `<div class="detail-row"><div class="detail-label">Meeting Link</div><div class="detail-value"><a href="${meeting.meetingLink}">${meeting.meetingLink}</a></div></div>` : ''}
  </div>

  <!-- Attendance Stats -->
  <div class="section">
    <div class="section-title">Attendance Summary</div>
    <div class="stats-row">
      <div class="stat-box blue"><div class="stat-num" style="color:#1d4ed8">${members.length}</div><div class="stat-label">Total Invited</div></div>
      <div class="stat-box green"><div class="stat-num" style="color:#065f46">${presentCount}</div><div class="stat-label">Present</div></div>
      <div class="stat-box red"><div class="stat-num" style="color:#991b1b">${absentCount}</div><div class="stat-label">Absent</div></div>
      <div class="stat-box purple"><div class="stat-num" style="color:#6d28d9">${attendanceRate}%</div><div class="stat-label">Attendance Rate</div></div>
    </div>
  </div>

  <!-- Member List -->
  <div class="section">
    <div class="section-title">Member Attendance</div>
    ${
      members.length > 0
        ? `<table>
      <thead><tr><th>#</th><th>Name</th><th>Designation</th><th>Department</th><th>Status</th><th>Remarks</th></tr></thead>
      <tbody>${memberRows}</tbody>
    </table>`
        : '<p style="color:#6b7280;font-size:12px">No members assigned to this meeting.</p>'
    }
  </div>`;
}

// ─── Range / Summary report section ──────────────────────────────────────────
function buildRangeSummarySection(
  meetings: Awaited<ReturnType<typeof prisma.meeting.findMany>>,
  dateFrom: string,
  dateTo: string
): string {
  const total = meetings.length;
  const cancelled = meetings.filter((m) => m.isCancelled).length;
  const active = total - cancelled;

  const totalInvited = meetings.reduce(
    (s, m) => s + ((m as any).meetingMembers?.length ?? 0),
    0
  );
  const totalPresent = meetings.reduce(
    (s, m) =>
      s + ((m as any).meetingMembers?.filter((mm: any) => mm.isPresent).length ?? 0),
    0
  );
  const overallRate =
    totalInvited > 0 ? Math.round((totalPresent / totalInvited) * 100) : 0;

  const rows = meetings
    .map((m: any, i) => {
      const invited = m.meetingMembers?.length ?? 0;
      const present = m.meetingMembers?.filter((mm: any) => mm.isPresent).length ?? 0;
      const rate = invited > 0 ? Math.round((present / invited) * 100) : 0;
      return `<tr>
      <td>${i + 1}</td>
      <td>${m.meetingTitle}</td>
      <td>${fmtDate(m.meetingDate)}</td>
      <td>${m.meetingType?.meetingTypeName || '—'}</td>
      <td>${m.organizer?.staffName || '—'}</td>
      <td>${invited}</td>
      <td>${present}</td>
      <td>${rate}%</td>
      <td>${m.isCancelled ? '<span class="badge badge-cancelled">Cancelled</span>' : '<span class="badge badge-present">Held</span>'}</td>
    </tr>`;
    })
    .join('');

  return `
  <!-- Summary Stats -->
  <div class="section">
    <div class="section-title">Overview</div>
    <div class="stats-row">
      <div class="stat-box blue"><div class="stat-num" style="color:#1d4ed8">${total}</div><div class="stat-label">Total Meetings</div></div>
      <div class="stat-box green"><div class="stat-num" style="color:#065f46">${active}</div><div class="stat-label">Held</div></div>
      <div class="stat-box red"><div class="stat-num" style="color:#991b1b">${cancelled}</div><div class="stat-label">Cancelled</div></div>
      <div class="stat-box purple"><div class="stat-num" style="color:#6d28d9">${overallRate}%</div><div class="stat-label">Avg Attendance</div></div>
    </div>
  </div>

  <!-- Meeting List -->
  <div class="section">
    <div class="section-title">Meetings Breakdown</div>
    ${
      meetings.length > 0
        ? `<table>
      <thead><tr><th>#</th><th>Title</th><th>Date</th><th>Type</th><th>Organizer</th><th>Invited</th><th>Present</th><th>Rate</th><th>Status</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`
        : `<p style="color:#6b7280;font-size:12px">No meetings found for the selected date range.</p>`
    }
  </div>`;
}
