'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ConvenerSettingsPage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['convener'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Convener';
  const displayRole = profile?.role || 'convener';
  const displayEmail = profile?.email || 'convener@example.com';

  if (loading) {
    return (
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="convener">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
        .convener-settings {
          font-family: 'DM Sans', sans-serif;
        }
        .convener-settings h1,
        .convener-settings h2,
        .convener-settings h3 {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
        }
        .convener-wave {
          animation: convenerWave 700ms ease forwards;
        }
        @keyframes convenerWave {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="convener-settings space-y-8">
        <header className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-8 text-white convener-wave">
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">Convener Settings</p>
          <h1 className="text-4xl">Your Meeting Command Center</h1>
          <p className="text-emerald-100/80 mt-2">Keep workflows crisp for {displayName}.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em]">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{displayRole}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2">{displayEmail}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl text-emerald-900">Meeting Defaults</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: 'Default Duration', value: '60 minutes' },
                { label: 'Reminder Window', value: '24 hours before' },
                { label: 'Document Checklist', value: 'Agenda, MOM, Attachments' },
                { label: 'Participant Limit', value: '30 attendees' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-900">{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-900 hover:text-white">
              Edit Meeting Defaults
            </button>
          </section>

          <aside className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white p-6 shadow-sm">
            <h2 className="text-2xl text-emerald-900">Workflow</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Auto Assign Notes', value: 'On' },
                { label: 'MOM Approval', value: 'Required' },
                { label: 'Calendar Sync', value: 'Connected' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Update Workflow
            </button>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
