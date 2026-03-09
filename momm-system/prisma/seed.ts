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
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
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

  // Create Users and Staff - Demo Users Only
  const adminUser = await prisma.user.create({
    data: {
      username: "vvbaraiya32",
      email: "vvbaraiya32@gmail.com",
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Password: Nayan@1878
      role: Role.ADMIN,
      staff: {
        create: {
          staffName: "Vijaybhai Baraiya",
          designation: "System Administrator",
          mobileNo: "9876543210",
          emailAddress: "vvbaraiya32@gmail.com",
          departmentId: departments[0].id,
        },
      },
    },
    include: { staff: true },
  });

  const convenerUser = await prisma.user.create({
    data: {
      username: "baraiyanayanbhai32",
      email: "baraiyanayanbhai32@gmail.com",
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Password: Nayan@1878
      role: Role.CONVENER,
      staff: {
        create: {
          staffName: "Nayanbhai Baraiya",
          designation: "Meeting Convener",
          mobileNo: "9876543211",
          emailAddress: "baraiyanayanbhai32@gmail.com",
          departmentId: departments[0].id,
        },
      },
    },
    include: { staff: true },
  });

  const staffUser = await prisma.user.create({
    data: {
      username: "baraiyavishalbhai32",
      email: "baraiyavishalbhai32@gmail.com",
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Password: Nayan@1878
      role: Role.STAFF,
      staff: {
        create: {
          staffName: "Vishalbhai Baraiya",
          designation: "Staff Member",
          mobileNo: "9876543212",
          emailAddress: "baraiyavishalbhai32@gmail.com",
          departmentId: departments[0].id,
        },
      },
    },
    include: { staff: true },
  });

  console.log(`✅ Created 3 demo users with staff profiles`);

  // Create Sample Meetings
  const today = new Date();
  
  const meeting1 = await prisma.meeting.create({
    data: {
      meetingTitle: "Weekly IT Team Standup",
      meetingDescription: "Weekly sync-up meeting to discuss project progress, blockers, and upcoming tasks.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0),
      meetingTypeId: meetingTypes[0].id,
      organizerStaffId: convenerUser.staff!.id,
      venueId: venues[0].id,
    },
  });

  const meeting2 = await prisma.meeting.create({
    data: {
      meetingTitle: "Project Planning Session",
      meetingDescription: "Planning session for the new MOMM system features.",
      meetingDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3),
      meetingStartTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 0),
      meetingEndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 16, 0),
      meetingTypeId: meetingTypes[1].id,
      organizerStaffId: convenerUser.staff!.id,
      venueId: venues[3].id,
      meetingLink: "https://meet.google.com/abc-defg-hij",
    },
  });

  console.log(`✅ Created 2 sample meetings`);

  // Add Meeting Members
  // Meeting 1 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting1.id, staffId: convenerUser.staff!.id, isPresent: true, attendanceMarkedAt: new Date() },
      { meetingId: meeting1.id, staffId: staffUser.staff!.id, isPresent: true, attendanceMarkedAt: new Date() },
      { meetingId: meeting1.id, staffId: adminUser.staff!.id, isPresent: false },
    ],
  });

  // Meeting 2 members
  await prisma.meetingMember.createMany({
    data: [
      { meetingId: meeting2.id, staffId: convenerUser.staff!.id },
      { meetingId: meeting2.id, staffId: staffUser.staff!.id },
      { meetingId: meeting2.id, staffId: adminUser.staff!.id },
    ],
  });

  console.log(`✅ Created meeting members`);

  // Create Sample Documents
  await prisma.document.createMany({
    data: [
      {
        meetingId: meeting1.id,
        documentTitle: "Meeting Agenda - IT Standup",
        fileName: "agenda_it_standup.pdf",
        filePath: "/documents/meetings/1/agenda_it_standup.pdf",
        uploadedBy: convenerUser.id,
      },
    ],
  });

  console.log(`✅ Created documents`);

  // Create Sample Reports
  await prisma.report.createMany({
    data: [
      {
        reportName: "Weekly Meeting Summary - January 2025",
        reportType: ReportType.SUMMARY,
        filePath: "/reports/summary_jan_2025.pdf",
        generatedBy: adminUser.id,
      },
      {
        reportName: "IT Standup Report",
        reportType: ReportType.MEETING_WISE,
        meetingId: meeting1.id,
        filePath: "/reports/meeting_1_report.pdf",
        generatedBy: convenerUser.id,
      },
    ],
  });

  console.log(`✅ Created reports`);

  // Create Notifications
  const allUsers = [adminUser, convenerUser, staffUser];
  const notifications = [];
  
  for (const user of allUsers) {
    notifications.push(
      {
        userId: user.id,
        title: "Welcome to MOMS",
        message: `Welcome to the Minutes of Meeting System, ${user.username}! You can now manage your meetings efficiently.`,
        type: "GENERAL" as const,
      },
      {
        userId: user.id,
        title: "System Ready",
        message: "Your account is set up and ready to use. Explore the dashboard to get started.",
        type: "GENERAL" as const,
      }
    );
  }

  await prisma.notification.createMany({
    data: notifications,
  });
  
  console.log(`✅ Created ${notifications.length} notifications`);

  console.log("\n🎉 Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Meeting Types: ${meetingTypes.length}`);
  console.log(`   - Venues: ${venues.length}`);
  console.log(`   - Users: 3`);
  console.log(`   - Meetings: 2`);
  console.log("\n🔑 Demo Login Credentials (All passwords: Nayan@1878):");
  console.log("   Admin:    baraiyavijaybhai98@gmail.com");
  console.log("   Convener: nayanbaraiya004@gmail.com");
  console.log("   Staff:    baraiyavishalbhai32@gmail.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
