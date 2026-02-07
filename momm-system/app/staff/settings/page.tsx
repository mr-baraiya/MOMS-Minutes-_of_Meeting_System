'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function StaffSettingsPage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['staff'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Staff Member';
  const displayRole = profile?.role || 'staff';
  const displayEmail = profile?.email || 'staff@example.com';

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
        .staff-settings {
          font-family: 'Mulish', sans-serif;
        }
        .staff-settings h1,
        .staff-settings h2,
        .staff-settings h3 {
          font-family: 'Montserrat', sans-serif;
        }
        .staff-bloom {
          animation: staffBloom 650ms ease forwards;
        }
        @keyframes staffBloom {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="staff-settings space-y-8">
        <header className="rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-100 via-rose-100 to-sky-100 p-8 text-slate-900 staff-bloom">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600">Staff Settings</p>
          <h1 className="text-3xl font-semibold">Personal Preferences</h1>
          <p className="text-slate-600 mt-2">Customize your workspace, {displayName}.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-2">{displayRole}</span>
            <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-2">{displayEmail}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Meeting Reminders', value: 'On' },
                { label: 'Attendance Alerts', value: 'On' },
                { label: 'Document Uploads', value: 'Off' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Toggle</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Update Notifications
            </button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Workspace</h2>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Calendar View</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Weekly agenda</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Download Folder</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Default documents folder</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900">
              Customize Workspace
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
