'use client';

import Link from 'next/link';
import { Clock, Headset, Mail, MapPin, Phone, HelpCircle, MessageSquare } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Headset className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Help & Support</h1>
          </div>
          <p className="text-blue-100 mt-2">
            We are here to help you with any questions or issues. Reach out to our support team.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/help/faqs"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              View FAQs
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h2>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar - Takes 1 column */}
          <div className="space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Support Email</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email.support}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{CONTACT_INFO.email.support}</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Primary Email</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email.primary}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{CONTACT_INFO.email.primary}</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Phone</p>
                  <a
                    href={`tel:${phoneLink}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{CONTACT_INFO.phone.display}</span>
                  </a>
                  <p className="text-xs text-gray-600 mt-1">{CONTACT_INFO.phone.hours}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Location</p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{CONTACT_INFO.address.full}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Support Hours Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Support Hours</h2>
              </div>
              <p className="text-sm text-slate-200 mb-4">
                Monday to Friday, 9:00 AM - 6:00 PM IST. We also monitor critical
                incidents outside business hours.
              </p>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4">
                <p className="text-sm text-slate-100">
                  <strong>Urgent issue?</strong> Mark your request as "High Priority" in the subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
