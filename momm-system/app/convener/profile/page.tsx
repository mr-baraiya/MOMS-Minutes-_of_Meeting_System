'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ConvenerProfilePage() {
  const { user: authUser } = useAuth();
  const { user, loading } = useAuthGuard({ allowedRoles: ['convener'] });

  const profile = authUser || user;
  const displayName = profile?.staff?.name || profile?.username || 'Convener';
  const displayEmail = profile?.email || 'convener@example.com';
  const displayRole = profile?.role || 'convener';
  const department = profile?.staff?.department || 'Operations';
  const avatar = profile?.profilePicture?.trim() || '';

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
        .convener-profile {
          font-family: 'DM Sans', sans-serif;
        }
        .convener-profile h1,
        .convener-profile h2,
        .convener-profile h3 {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.08em;
        }
        .convener-rise {
          animation: convenerRise 700ms ease forwards;
        }
        @keyframes convenerRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="convener-profile space-y-8">
        <div className="relative overflow-hidden rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-8 text-white convener-rise">
          <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-teal-400/30 blur-3xl"></div>
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl"></div>
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-20 w-20 rounded-3xl border border-white/30 object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-3xl border border-white/30 bg-white/10 text-3xl font-semibold flex items-center justify-center">
                  {displayName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-100">Meeting Convener</p>
                <h1 className="text-4xl">{displayName}</h1>
                <p className="text-emerald-100/80 mt-1">{displayEmail}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {displayRole}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {department}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="grid grid-cols-1 gap-6">
            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-emerald-900">Your Mission</h2>
              <p className="mt-3 text-sm text-slate-600">
                Lead meeting planning, document capture, and participant alignment with a focus on momentum.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Active Meetings', value: '0' },
                  { label: 'Pending Docs', value: '0' },
                  { label: 'Participants', value: '0' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl text-emerald-900">Convener Details</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Department</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-900">{department}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Role</p>
                  <p className="mt-2 text-lg font-semibold text-emerald-900">{displayRole}</p>
                </div>
              </div>
              <button className="mt-6 w-full rounded-full border border-emerald-900 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-900 hover:text-white">
                Edit Convener Profile
              </button>
            </section>
          </div>

          <aside className="rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50 via-white to-white p-6 shadow-sm">
            <h2 className="text-2xl text-emerald-900">Meeting Pulse</h2>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Next Agenda Review', value: 'Schedule a review' },
                { label: 'Document Uploads', value: 'Keep MOMs updated' },
                { label: 'Team Touchpoints', value: 'Reach out to participants' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-full bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              Start Planning
            </button>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
