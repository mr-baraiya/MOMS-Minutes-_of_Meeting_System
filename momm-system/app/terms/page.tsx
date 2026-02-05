import Link from 'next/link';
import { FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | MOMM System',
  description: 'Terms of Service for the Minutes of Meeting Management System',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: February 5, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          
          {/* Introduction */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-100">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Welcome to the Minutes of Meeting Management (MOMM) System. These Terms of Service (&quot;Terms&quot;) govern your access to and use of our platform. By accessing or using the MOMM System, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not use our services.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-100">2. Account Registration</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed text-lg">
              <p>When creating an account, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
              <p className="mt-3">
                You must be at least 18 years old to use the MOMM System. Accounts are for individual use and may not be shared with multiple users.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Acceptable Use Policy</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any unlawful purpose or in violation of any regulations</li>
                <li>Attempt to gain unauthorized access to any part of the system</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Upload or transmit viruses, malware, or other malicious code</li>
                <li>Collect or harvest personal information from other users</li>
                <li>Impersonate any person or entity or misrepresent your affiliation</li>
                <li>Use automated systems to access the service without permission</li>
                <li>Share or distribute content that is illegal, harmful, or offensive</li>
              </ul>
            </div>
          </section>

          {/* Data and Content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data and Content Ownership</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong>Your Content:</strong> You retain all rights to the meeting minutes, documents, and other content you create or upload to the MOMM System. By using our service, you grant us a limited license to store, process, and display your content solely for the purpose of providing the service.
              </p>
              <p>
                <strong>Our Platform:</strong> The MOMM System, including its design, features, and underlying technology, remains our exclusive property. You may not copy, modify, distribute, or reverse engineer any part of our platform.
              </p>
            </div>
          </section>

          {/* User Roles and Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Roles and Responsibilities</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Staff Members:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Can view assigned meetings and documents</li>
                  <li>Responsible for maintaining attendance records</li>
                  <li>Must maintain confidentiality of meeting information</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Conveners:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Can create and manage meetings</li>
                  <li>Responsible for accurate meeting documentation</li>
                  <li>Must ensure proper member notification</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Administrators:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Can manage all system users and settings</li>
                  <li>Responsible for system integrity and security</li>
                  <li>Must comply with data protection regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide continuous access to the MOMM System. However, we do not guarantee uninterrupted service and reserve the right to modify, suspend, or discontinue any part of the service with or without notice. We will not be liable for any service interruptions, including those caused by maintenance, updates, or technical issues.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your data. However, no system is completely secure, and we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your login credentials and for any activities under your account.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, MOMM System shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use or inability to use the service. Our total liability shall not exceed the amount paid by you, if any, for accessing the service in the past 12 months.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                We reserve the right to suspend or terminate your account at any time for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activities</li>
                <li>Extended period of account inactivity</li>
                <li>Request from law enforcement or government agencies</li>
              </ul>
              <p className="mt-3">
                You may terminate your account at any time by contacting our support team. Upon termination, your access to the service will be immediately revoked.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or system notification. Your continued use of the MOMM System after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our organization operates, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved through binding arbitration.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@momm-system.com</p>
              <p className="text-gray-700"><strong>Support:</strong> support@momm-system.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 (123) 456-7890</p>
            </div>
          </section>

          {/* Agreement */}
          <section className="border-t pt-6">
            <p className="text-gray-700 leading-relaxed">
              By creating an account or using the MOMM System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
          </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
