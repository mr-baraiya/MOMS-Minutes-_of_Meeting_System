'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Clock, AlertCircle } from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'open' || normalized === 'pending') {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (normalized === 'resolved' || normalized === 'closed') {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    if (normalized === 'in_progress') {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8" />
            <h1 className="text-3xl font-bold">My Support Tickets</h1>
          </div>
          <p className="text-blue-100 mt-2">
            Track the status of your support requests and follow up when needed.
          </p>
          <div className="mt-6">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help
            </Link>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error loading tickets</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center p-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Submit a request from Help & Support to get started.
              </p>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {formatCategory(ticket.category)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {formatCategory(ticket.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.message}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Submitted on {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
