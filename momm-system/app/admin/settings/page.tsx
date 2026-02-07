'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AdminSettingsPage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['admin'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Administrator';
  const displayEmail = profile?.email || 'admin@example.com';
  const displayRole = profile?.role || 'admin';

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
        .admin-settings {
          font-family: 'Source Sans 3', sans-serif;
        }
        .admin-settings h1,
        .admin-settings h2,
        .admin-settings h3 {
          font-family: 'Cinzel', serif;
        }
        .settings-rise {
          animation: settingsRise 650ms ease forwards;
        }
        @keyframes settingsRise {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="admin-settings space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-8 text-white settings-rise">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200">Administration</p>
          <h1 className="text-3xl font-semibold">Settings Control Room</h1>
          <p className="text-amber-100/80 mt-2">Tune system behavior and account access for {displayName}.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-2">{displayRole}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{displayEmail}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Account Control</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Profile</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Update name, avatar, and department</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Access</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Manage user roles and permissions</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900">
              Open Account Settings
            </button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Security</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Two-Factor Authentication', value: 'Enabled' },
                { label: 'Session Timeout', value: '30 minutes' },
                { label: 'Audit Logs', value: 'Active' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-700">Edit</span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Update Security
            </button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">System Preferences</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Data Retention</p>
                <p className="mt-2 text-sm font-semibold text-amber-900">Keep archives for 3 years</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email Digest</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Weekly summary enabled</p>
              </div>
            </div>
            <button className="mt-6 w-full rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100">
              Review Preferences
            </button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
