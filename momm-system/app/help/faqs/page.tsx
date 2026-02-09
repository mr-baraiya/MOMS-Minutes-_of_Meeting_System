'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Headset, ChevronDown, HelpCircle } from 'lucide-react';
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
      <div className="min-h-screen bg-[#f5f2ec] px-6 py-10">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
          .faq-page {
            font-family: 'Manrope', sans-serif;
            color: #1b1f2a;
          }
          .faq-page h1,
          .faq-page h2 {
            font-family: 'Playfair Display', serif;
          }
        `}</style>

        <div className="faq-page mx-auto w-full max-w-5xl">
          <header className="relative overflow-hidden rounded-[32px] border border-[#e8dfd0] bg-gradient-to-r from-[#fdfcf9] via-[#f8f3e8] to-[#f3e7d6] p-12 shadow-[0_28px_80px_rgba(20,25,34,0.14)]">
            <div className="absolute right-8 top-6 h-28 w-28 rounded-full bg-[#d7b37a]/30 blur-3xl"></div>
            <div className="absolute left-6 bottom-0 h-32 w-32 rounded-full bg-[#b7c7d1]/40 blur-3xl"></div>
            <Headset className="absolute -left-4 top-6 h-24 w-24 text-[#d6c1a0] opacity-30" />
            <p className="text-xs uppercase tracking-[0.4em] text-[#8a6f3f]">Help</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#1b1f2a]">Frequently asked questions</h1>
            <p className="mt-3 max-w-xl text-sm text-[#4b5563]">
              Clear, concise answers to the most common questions across meetings, MOMs, and access.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/help"
                className="rounded-full border border-[#d4c7b1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f3137] transition hover:border-[#a18b66]"
              >
                Back to Help
              </Link>
              <Link
                href="/help/tickets"
                className="rounded-full bg-[#1b1f2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black"
              >
                My Support Tickets
              </Link>
            </div>
          </header>

          <section className="mt-10 space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full rounded-[22px] border border-[#e8dfd0] bg-white p-6 text-left shadow-[0_16px_40px_rgba(20,25,34,0.08)] transition hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9aa0a6]">
                        <HelpCircle className="h-4 w-4" />
                        FAQ
                      </p>
                      <h2 className="mt-3 text-xl font-semibold text-[#1b1f2a]">
                        {item.question}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-[#8a6f3f] transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {isOpen && (
                    <p className="mt-4 text-sm text-[#4b5563]">
                      {item.answer}
                    </p>
                  )}
                </button>
              );
            })}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
