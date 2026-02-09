'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

interface SupportTicket {
  id: number;
  category: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function SupportTicketsPage() {
  const { user, token } = useAuth();
  const role = user?.role || 'staff';
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/support-tickets', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load support tickets.');
        }

        setTickets(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const formatCategory = (value: string) =>
    value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <DashboardLayout role={role}>
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto w-full max-w-5xl">
          <header className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Support</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">My Support Tickets</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track the status of your support requests and follow up when needed.
            </p>
          </header>

          <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-gray-500">Loading tickets...</p>
            ) : error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-gray-500">No tickets yet. Submit a request from Help & Support.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-2xl border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          {formatCategory(ticket.category)}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      </div>
                      <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                        {formatCategory(ticket.status)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{ticket.message}</p>
                    <p className="mt-3 text-xs text-gray-400">
                      Submitted on {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
