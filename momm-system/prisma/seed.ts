import { PrismaClient, Role, VenueType, ReportType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.report.deleteMany();
  await prisma.document.deleteMany();
  await prisma.meetingMember.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.meetingType.deleteMany();
  await prisma.department.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: { departmentName: "Information Technology" },
    }),
    prisma.department.create({
      data: { departmentName: "Human Resources" },
    }),
    prisma.department.create({
      data: { departmentName: "Finance" },
    }),
    prisma.department.create({
      data: { departmentName: "Marketing" },
    }),
    prisma.department.create({
      data: { departmentName: "Operations" },
    }),
  ]);
  console.log(`✅ Created ${departments.length} departments`);

  // Create Meeting Types
  const meetingTypes = await Promise.all([
    prisma.meetingType.create({
      data: { meetingTypeName: "Team Meeting" },
    }),
    prisma.meetingType.create({
      data: { meetingTypeName: "Client Meeting" },
    }),
    prisma.meetingType.create({
      data: { meetingTypeName: "Management Meeting" },
    }),
    prisma.meetingType.create({
      data: { meetingTypeName: "Project Review" },
    }),
    prisma.meetingType.create({
      data: { meetingTypeName: "Training Session" },
    }),
  ]);
  console.log(`✅ Created ${meetingTypes.length} meeting types`);

  // Create Venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        venueName: "Conference Room A",
        venueType: VenueType.PHYSICAL,
        location: "Building 1, Floor 2",
      },
    }),
    prisma.venue.create({
      data: {
        venueName: "Conference Room B",
        venueType: VenueType.PHYSICAL,
        location: "Building 1, Floor 3",
      },
    }),
    prisma.venue.create({
      data: {
        venueName: "Board Room",
        venueType: VenueType.PHYSICAL,
        location: "Building 1, Floor 5",
      },
    }),
    prisma.venue.create({
      data: {
        venueName: "Google Meet",
        venueType: VenueType.VIRTUAL,
        location: "https://meet.google.com",
      },
    }),
    prisma.venue.create({
      data: {
        venueName: "Microsoft Teams",
        venueType: VenueType.VIRTUAL,
        location: "https://teams.microsoft.com",
      },
    }),
    prisma.venue.create({
      data: {
        venueName: "Zoom",
        venueType: VenueType.VIRTUAL,
        location: "https://zoom.us",
      },
    }),
  ]);
  console.log(`✅ Created ${venues.length} venues`);

  // Create Users and Staff
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@momm.com",
      passwordHash: "$2b$10$dummyhashforadmin123456789012345678901234",
      role: Role.ADMIN,
      staff: {
        create: {
          staffName: "System Administrator",
          designation: "Administrator",
          mobileNo: "9876543210",
          emailAddress: "admin@momm.com",
          departmentId: departments[0].id,
        },
      },
    },
    include: { staff: true },
  });

  const convener1 = await prisma.user.create({
    data: {
      username: "rajesh.kumar",
      email: "rajesh.kumar@momm.com",
      passwordHash: "$2b$10$dummyhashforconvener12345678901234567890",
      role: Role.CONVENER,
      staff: {
        create: {
          staffName: "Rajesh Kumar",
          designation: "Senior Manager",
          mobileNo: "9876543211",
          emailAddress: "rajesh.kumar@momm.com",
          departmentId: departments[0].id,
        },
      },
    },
    include: { staff: true },
  });

  const convener2 = await prisma.user.create({
    data: {
      username: "priya.sharma",
      email: "priya.sharma@momm.com",
      passwordHash: "$2b$10$dummyhashforconvener22345678901234567890",
      role: Role.CONVENER,
      staff: {
        create: {
          staffName: "Priya Sharma",
          designation: "Project Lead",
          mobileNo: "9876543212",
          emailAddress: "priya.sharma@momm.com",
          departmentId: departments[1].id,
        },
      },
    },
    include: { staff: true },
  });

  const staffUsers = await Promise.all([
    prisma.user.create({
      data: {
        username: "amit.patel",
        email: "amit.patel@momm.com",
        passwordHash: "$2b$10$dummyhashforstaff1234567890123456789012",
        role: Role.STAFF,
        staff: {
          create: {
            staffName: "Amit Patel",
            designation: "Software Developer",
            mobileNo: "9876543213",
            emailAddress: "amit.patel@momm.com",
            departmentId: departments[0].id,
          },
        },
      },
      include: { staff: true },
    }),
    prisma.user.create({
      data: {
        username: "sneha.verma",
        email: "sneha.verma@momm.com",
        passwordHash: "$2b$10$dummyhashforstaff2234567890123456789012",
        role: Role.STAFF,
        staff: {
          create: {
            staffName: "Sneha Verma",
            designation: "HR Executive",
            mobileNo: "9876543214",
            emailAddress: "sneha.verma@momm.com",
            departmentId: departments[1].id,
          },
        },
      },
      include: { staff: true },
    }),
    prisma.user.create({
      data: {
        username: "vikram.singh",
        email: "vikram.singh@momm.com",
        passwordHash: "$2b$10$dummyhashforstaff3234567890123456789012",
        role: Role.STAFF,
        staff: {
          create: {
            staffName: "Vikram Singh",
            designation: "Financial Analyst",
            mobileNo: "9876543215",
            emailAddress: "vikram.singh@momm.com",
            departmentId: departments[2].id,
          },
        },
      },
      include: { staff: true },
    }),
    prisma.user.create({
      data: {
        username: "neha.gupta",
        email: "neha.gupta@momm.com",
        passwordHash: "$2b$10$dummyhashforstaff4234567890123456789012",
        role: Role.STAFF,
        staff: {
          create: {
            staffName: "Neha Gupta",
            designation: "Marketing Executive",
            mobileNo: "9876543216",
            emailAddress: "neha.gupta@momm.com",
            departmentId: departments[3].id,
          },
        },
      },
      include: { staff: true },
    }),
    prisma.user.create({
      data: {
        username: "rahul.joshi",
        email: "rahul.joshi@momm.com",
        passwordHash: "$2b$10$dummyhashforstaff5234567890123456789012",
        role: Role.STAFF,
        staff: {
          create: {
            staffName: "Rahul Joshi",
            designation: "Operations Manager",
            mobileNo: "9876543217",
            emailAddress: "rahul.joshi@momm.com",
            departmentId: departments[4].id,
          },
        },
      },
      include: { staff: true },
    }),
  ]);

  console.log(`✅ Created ${3 + staffUsers.length} users with staff profiles`);

  // Create Meetings
  const today = new Date();
  
  const meeting1 = await prisma.meeting.create({
    data: {
      meetingTitle: "Weekly IT Team Standup",
      meetingDescription: "Weekly sync-up meeting to discuss project progress, blockers, and upcoming tasks.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
      meetingTypeId: meetingTypes[0].id,
      organizerStaffId: convener1.staff!.id,
      venueId: venues[0].id,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      meetingTitle: "Client Requirements Discussion",
      meetingDescription: "Meeting with ABC Corp to discuss new project requirements and timeline.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
      meetingTypeId: meetingTypes[1].id,
      organizerStaffId: convener1.staff!.id,
      venueId: venues[3].id,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
  });

  const meeting3 = await prisma.meeting.create({
    data: {
      meetingTitle: "Q1 Budget Review",
      meetingDescription: "Quarterly budget review meeting with all department heads.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 11, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 0),
      meetingTypeId: meetingTypes[2].id,
      organizerStaffId: convener2.staff!.id,
      venueId: venues[2].id,
    },
  });

  const meeting4 = await prisma.meeting.create({
    data: {
      meetingTitle: "Project Alpha Sprint Review",
      meetingDescription: "Sprint review and retrospective for Project Alpha.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 15, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, 17, 0),
      meetingTypeId: meetingTypes[3].id,
      organizerStaffId: convener1.staff!.id,
      venueId: venues[4].id,
      meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
    },
  });

  const meeting5 = await prisma.meeting.create({
    data: {
      meetingTitle: "New Employee Onboarding",
      meetingDescription: "Training session for newly joined employees.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 9, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, 12, 0),
      meetingTypeId: meetingTypes[4].id,
      organizerStaffId: convener2.staff!.id,
      venueId: venues[1].id,
    },
  });

  // Cancelled Meeting
  const meeting6 = await prisma.meeting.create({
    data: {
      meetingTitle: "Marketing Strategy Discussion",
      meetingDescription: "Discussion on Q2 marketing strategy and campaigns.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 14, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5, 15, 30),
      meetingTypeId: meetingTypes[0].id,
      organizerStaffId: convener2.staff!.id,
      venueId: venues[0].id,
      isCancelled: true,
      cancellationReason: "Key stakeholders unavailable due to emergency",
      cancelledAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    },
  });

  console.log(`✅ Created 6 meetings`);

  // Add Meeting Members
  const allStaffIds = [
    adminUser.staff!.id,
    convener1.staff!.id,
    convener2.staff!.id,
    ...staffUsers.map((u) => u.staff!.id),
  ];

  // Meeting 1 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting1.id, staffId: convener1.staff!.id, isPresent: true, attendanceMarkedAt: new Date() },
      { meetingId: meeting1.id, staffId: staffUsers[0].staff!.id, isPresent: true, attendanceMarkedAt: new Date() },
      { meetingId: meeting1.id, staffId: staffUsers[2].staff!.id, isPresent: false },
    ],
  });

  // Meeting 2 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting2.id, staffId: convener1.staff!.id },
      { meetingId: meeting2.id, staffId: staffUsers[0].staff!.id },
      { meetingId: meeting2.id, staffId: staffUsers[3].staff!.id },
    ],
  });

  // Meeting 3 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting3.id, staffId: convener2.staff!.id },
      { meetingId: meeting3.id, staffId: staffUsers[1].staff!.id },
      { meetingId: meeting3.id, staffId: staffUsers[2].staff!.id },
      { meetingId: meeting3.id, staffId: staffUsers[4].staff!.id },
    ],
  });

  // Meeting 4 members (past meeting with attendance marked)
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting4.id, staffId: convener1.staff!.id, isPresent: true, attendanceMarkedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) },
      { meetingId: meeting4.id, staffId: staffUsers[0].staff!.id, isPresent: true, attendanceMarkedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) },
      { meetingId: meeting4.id, staffId: staffUsers[3].staff!.id, isPresent: true, attendanceMarkedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2) },
      { meetingId: meeting4.id, staffId: adminUser.staff!.id, isPresent: false, remarks: "On leave" },
    ],
  });

  // Meeting 5 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting5.id, staffId: convener2.staff!.id },
      { meetingId: meeting5.id, staffId: staffUsers[1].staff!.id },
    ],
  });

  console.log(`✅ Created meeting members`);

  // Create Documents for past meeting
  await prisma.document.createMany({
    data: [
      {
        meetingId: meeting4.id,
        documentTitle: "Sprint Review Presentation",
        fileName: "sprint_review_alpha.pdf",
        filePath: "/documents/meetings/4/sprint_review_alpha.pdf",
        uploadedBy: convener1.id,
      },
      {
        meetingId: meeting4.id,
        documentTitle: "Minutes of Meeting - Sprint Review",
        fileName: "mom_sprint_review.pdf",
        filePath: "/documents/meetings/4/mom_sprint_review.pdf",
        uploadedBy: convener1.id,
      },
    ],
  });

  console.log(`✅ Created documents`);

  // Create Reports
  await prisma.report.createMany({
    data: [
      {
        reportName: "Monthly Meeting Summary - December 2025",
        reportType: ReportType.SUMMARY,
        filePath: "/reports/summary_dec_2025.pdf",
        generatedBy: adminUser.id,
      },
      {
        reportName: "Project Alpha Sprint Review Report",
        reportType: ReportType.MEETING_WISE,
        meetingId: meeting4.id,
        filePath: "/reports/meeting_4_report.pdf",
        generatedBy: convener1.id,
      },
    ],
  });

  console.log(`✅ Created reports`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Meeting Types: ${meetingTypes.length}`);
  console.log(`   - Venues: ${venues.length}`);
  console.log(`   - Users: ${3 + staffUsers.length}`);
  console.log(`   - Meetings: 6 (1 cancelled)`);
  console.log("\n🔑 Demo Login Credentials:");
  console.log("   Admin:    admin / password123");
  console.log("   Convener: rajesh.kumar / password123");
  console.log("   Staff:    amit.patel / password123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
