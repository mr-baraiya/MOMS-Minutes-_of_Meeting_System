import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_INFO, NAV_LINKS } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 bg-linear-to-r from-blue-700 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h1>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Have a question, need support, or want to learn more? Our team is ready to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Contact Form - takes 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-8">
              <ContactForm />
            </div>

            {/* Right sidebar - 2 cols */}
            <div className="lg:col-span-2 space-y-5">

              {/* Contact Info card */}
              <div className="bg-linear-to-r from-blue-700 to-blue-900 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-xl font-bold mb-5">Contact Information</h3>
                <div className="space-y-5">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">Email</p>
                      <p className="text-sm text-white/90">{CONTACT_INFO.email.primary}</p>
                      <p className="text-sm text-white/75">{CONTACT_INFO.email.support}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">Phone</p>
                      <p className="text-sm text-white/90">{CONTACT_INFO.phone.display}</p>
                      <p className="text-xs text-white/60">{CONTACT_INFO.phone.hours}</p>
                    </div>
                  </div>

                  {/* Office */}
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">Office</p>
                      <p className="text-sm text-white/90">{CONTACT_INFO.address.full}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Quick Links</h3>
                <div className="space-y-1">
                  {[
                    { href: NAV_LINKS.login, label: "Login to Dashboard" },
                    { href: NAV_LINKS.features, label: "View Features" },
                    { href: NAV_LINKS.about, label: "About Us" },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all text-sm font-medium"
                    >
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-linear-to-r from-blue-700 to-blue-900 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Ready to Try?</h3>
                <p className="text-sm text-blue-100 mb-5 leading-relaxed">
                  Start managing your meetings more efficiently with a demo account.
                </p>
                <Link
                  href={NAV_LINKS.dashboard}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 hover:bg-blue-50 transition-colors rounded-md text-sm font-semibold shadow"
                >
                  Try Demo Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Visit Us</h2>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">We are always happy to meet in person</p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
            <iframe
              src={CONTACT_INFO.mapEmbedUrl}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location Map"
              className="w-full"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
