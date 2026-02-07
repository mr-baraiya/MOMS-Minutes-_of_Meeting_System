'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminProfilePage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['admin'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Administrator';
  const displayEmail = profile?.email || 'admin@example.com';
  const displayRole = profile?.role || 'admin';
  const department = profile?.staff?.department || 'Head Office';
  const avatar = profile?.profilePicture?.trim() || '';

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Source+Sans+3:wght@400;500;600&display=swap');
        .admin-profile {
          font-family: 'Source Sans 3', sans-serif;
        }
        .admin-profile h1,
        .admin-profile h2,
        .admin-profile h3 {
          font-family: 'Cinzel', serif;
        }
        .profile-fade {
          animation: profileFade 600ms ease forwards;
        }
        @keyframes profileFade {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-stagger > * {
          opacity: 0;
          animation: profileFade 600ms ease forwards;
        }
        .profile-stagger > *:nth-child(1) { animation-delay: 60ms; }
        .profile-stagger > *:nth-child(2) { animation-delay: 140ms; }
        .profile-stagger > *:nth-child(3) { animation-delay: 220ms; }
      `}</style>

      <div className="admin-profile space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-8 text-white profile-fade">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl"></div>
          <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-slate-500/30 blur-3xl"></div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-20 w-20 rounded-2xl border border-white/20 object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border border-white/30 bg-white/10 text-2xl font-semibold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">Administrator Profile</p>
                <h1 className="text-3xl font-semibold">{displayName}</h1>
                <p className="text-amber-100/80 mt-1">{displayEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {displayRole}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 profile-stagger">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Identity</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Username</span>
                <span className="text-slate-900 font-medium">{profile?.username || 'admin'}</span>
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
              Update Profile
            </button>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Access Summary</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-between">
                <span>System Control</span>
                <span className="text-amber-700 font-semibold">Full</span>
              </li>
              <li className="flex items-center justify-between">
                <span>User Management</span>
                <span className="text-emerald-700 font-semibold">Enabled</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Report Access</span>
                <span className="text-emerald-700 font-semibold">Enabled</span>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
              You have administrator privileges across all departments and meetings.
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Last Login</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Just now</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Security Level</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">High</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Change Password
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
