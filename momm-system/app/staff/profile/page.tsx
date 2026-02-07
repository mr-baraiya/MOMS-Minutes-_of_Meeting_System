'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function StaffProfilePage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['staff'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Staff Member';
  const displayEmail = profile?.email || 'staff@example.com';
  const displayRole = profile?.role || 'staff';
  const department = profile?.staff?.department || 'General';
  const avatar = profile?.profilePicture?.trim() || '';

  if (loading) {
    return (
      <DashboardLayout role="staff">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="staff">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Mulish:wght@400;500;600&display=swap');
        .staff-profile {
          font-family: 'Mulish', sans-serif;
        }
        .staff-profile h1,
        .staff-profile h2,
        .staff-profile h3 {
          font-family: 'Montserrat', sans-serif;
        }
        .staff-pop {
          animation: staffPop 650ms ease forwards;
        }
        @keyframes staffPop {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="staff-profile space-y-8">
        <div className="relative overflow-hidden rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-100 via-rose-100 to-sky-100 p-8 text-slate-900 staff-pop">
          <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-rose-200/60 blur-2xl"></div>
          <div className="absolute right-4 -bottom-12 h-32 w-32 rounded-full bg-sky-200/60 blur-2xl"></div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-20 w-20 rounded-2xl border border-white object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white bg-white/70 text-2xl font-semibold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Staff Profile</p>
                <h1 className="text-3xl font-semibold">{displayName}</h1>
                <p className="text-slate-600 mt-1">{displayEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {displayRole}
              </span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">My Profile</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Username</span>
                <span className="text-slate-900 font-medium">{profile?.username || 'staff'}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="text-slate-900 font-medium">{displayEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Department</span>
                <span className="text-slate-900 font-medium">{department}</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900">
              Update Contact Info
            </button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Support & Tasks</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Upcoming Meetings</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">0 scheduled</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Attendance</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">All caught up</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Open Help Desk
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
