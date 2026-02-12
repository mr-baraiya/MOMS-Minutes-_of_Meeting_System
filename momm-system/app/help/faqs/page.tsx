'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Security or use the Forgot Password link on the login page.',
  },
  {
    question: 'Where can I find my meeting documents?',
    answer: 'Navigate to Documents in the sidebar to access MOM files and attachments.',
  },
  {
    question: 'Why is my attendance not marked?',
    answer: 'Attendance is marked by the organizer. If you see an issue, submit a support ticket.',
  },
  {
    question: 'How do I update my profile picture?',
    answer: 'Open your profile page and upload a new photo under Edit Profile.',
  },
];

export default function HelpFaqsPage() {
  const { user } = useAuth();
  const role = user?.role || 'staff';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-blue-100 mt-2">
            Find answers to common questions about meetings, MOMs, and account access.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help
            </Link>
            <Link
              href="/help/tickets"
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              My Support Tickets
            </Link>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-500 uppercase">Question</span>
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.question}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 mt-1 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Help Footer */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Can't find what you're looking for? Contact our support team.
          </p>
          <Link
            href="/help"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
