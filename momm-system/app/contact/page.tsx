import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { CONTACT_INFO, NAV_LINKS } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              Contact <span className="text-blue-700">Information</span>
            </h1>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get in touch with our team for questions, support, or project inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-blue-700 rounded-lg p-8 text-white shadow-md">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold mb-1">Email</h4>
                      <p className="text-blue-100">{CONTACT_INFO.email.primary}</p>
                      <p className="text-blue-100">{CONTACT_INFO.email.support}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold mb-1">Phone</h4>
                      <p className="text-blue-100">{CONTACT_INFO.phone.display}</p>
                      <p className="text-blue-100 text-sm">{CONTACT_INFO.phone.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold mb-1">Office</h4>
                      <p className="text-blue-100">{CONTACT_INFO.address.full}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link href={NAV_LINKS.login} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Login to Dashboard
                  </Link>
                  <Link href={NAV_LINKS.features} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    View Features
                  </Link>
                  <Link href={NAV_LINKS.about} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    About Us
                  </Link>
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-3">Ready to Try?</h3>
                <p className="text-green-100 mb-6">
                  Start managing your meetings more efficiently today with our demo account.
                </p>
                <Link
                  href={NAV_LINKS.dashboard}
                  className="inline-block px-6 py-3 bg-white text-blue-700 hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                >
                  Try Demo Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">We're always happy to meet in person</p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md border border-blue-200">
            <iframe
              src={CONTACT_INFO.mapEmbedUrl}
              width="100%"
              height="450"
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
