'use client';

import Link from 'next/link';
import { Clock, Headset, Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CONTACT_INFO } from '@/lib/constants';

export default function HelpPage() {
  const { user } = useAuth();
  const role = user?.role || 'staff';
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONTACT_INFO.address.full
  )}`;
  const phoneLink = CONTACT_INFO.phone.display.replace(/[^\d+]/g, '');

  return (
    <DashboardLayout role={role}>
      <div className="min-h-screen bg-[#f5f2ec] px-6 py-10">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap');
          .help-page {
            font-family: 'Manrope', sans-serif;
            color: #1b1f2a;
          }
          .help-page h1,
          .help-page h2 {
            font-family: 'Playfair Display', serif;
          }
        `}</style>

        <div className="help-page mx-auto w-full max-w-6xl">
          <header className="relative overflow-hidden rounded-[32px] border border-[#e8dfd0] bg-gradient-to-r from-[#fdfcf9] via-[#f8f3e8] to-[#f3e7d6] p-12 shadow-[0_28px_80px_rgba(20,25,34,0.14)]">
            <div className="pointer-events-none absolute right-10 top-6 h-28 w-28 rounded-full bg-[#d7b37a]/30 blur-3xl"></div>
            <div className="pointer-events-none absolute left-6 bottom-0 h-32 w-32 rounded-full bg-[#b7c7d1]/40 blur-3xl"></div>
            <Headset className="pointer-events-none absolute -left-4 top-6 h-24 w-24 text-[#d6c1a0] opacity-30" />
            <p className="text-xs uppercase tracking-[0.4em] text-[#8a6f3f]">Help & Support</p>
            <h1 className="mt-3 text-4xl font-semibold text-[#1b1f2a]">We are here to help</h1>
            <p className="mt-3 max-w-xl text-sm text-[#4b5563]">
              Reach our support desk for account, access, or meeting workflow questions. Send a
              message and our team will respond quickly.
            </p>
            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
              <Link
                href="/help/faqs"
                className="rounded-full border border-[#d4c7b1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2f3137] transition hover:border-[#a18b66]"
              >
                View FAQs
              </Link>
              <Link
                href="/help/tickets"
                className="rounded-full bg-[#1b1f2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-black"
              >
                My Support Tickets
              </Link>
            </div>
          </header>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-[28px] border border-[#e8dfd0] bg-white p-9 shadow-[0_18px_50px_rgba(20,25,34,0.08)]">
              <ContactForm />
            </section>

            <aside className="space-y-6">
              <div className="rounded-[24px] border border-[#e8dfd0] bg-white p-6 shadow-[0_16px_40px_rgba(20,25,34,0.08)]">
                <h2 className="text-xl font-medium text-[#1b1f2a]">Contact details</h2>
                <div className="mt-5 space-y-4 text-sm text-[#4b5563]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9aa0a6]">Support email</p>
                    <a
                      href={`mailto:${CONTACT_INFO.email.support}`}
                      className="mt-2 flex items-center gap-2 font-semibold text-[#1b1f2a] hover:text-[#8a6f3f]"
                    >
                      <Mail className="h-4 w-4" />
                      {CONTACT_INFO.email.support}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9aa0a6]">Primary email</p>
                    <a
                      href={`mailto:${CONTACT_INFO.email.primary}`}
                      className="mt-2 flex items-center gap-2 font-semibold text-[#1b1f2a] hover:text-[#8a6f3f]"
                    >
                      <Mail className="h-4 w-4" />
                      {CONTACT_INFO.email.primary}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9aa0a6]">Phone</p>
                    <a
                      href={`tel:${phoneLink}`}
                      className="mt-2 flex items-center gap-2 font-semibold text-[#1b1f2a] hover:text-[#8a6f3f]"
                    >
                      <Phone className="h-4 w-4" />
                      {CONTACT_INFO.phone.display}
                    </a>
                    <p className="text-xs text-[#6b7280]">{CONTACT_INFO.phone.hours}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#9aa0a6]">Location</p>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex items-center gap-2 font-semibold text-[#1b1f2a] hover:text-[#8a6f3f]"
                    >
                      <MapPin className="h-4 w-4" />
                      {CONTACT_INFO.address.full}
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e8dfd0] bg-[#111827] p-6 text-white shadow-[0_18px_50px_rgba(17,24,39,0.4)]">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-white/70" />
                  <h2 className="text-2xl font-semibold">Support hours</h2>
                </div>
                <p className="mt-3 max-w-xs text-sm text-white/80">
                  Monday to Friday, 9:00 AM - 6:00 PM IST. We also monitor critical
                  incidents outside business hours.
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  For urgent account access issues, mark your request as "High Priority" in the subject.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
