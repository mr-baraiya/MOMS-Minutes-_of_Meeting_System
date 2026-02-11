import Link from 'next/link';
import { Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | MOMM System',
  description: 'Privacy Policy for the Minutes of Meeting Management System',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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
              At MOMM System (Minutes of Meeting Management), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-green-100">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-2">
                  When you register for an account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Full name and username</li>
                  <li>Email address</li>
                  <li>Department and designation</li>
                  <li>Contact number (optional)</li>
                  <li>Profile picture (optional)</li>
                  <li>Password (encrypted and securely stored)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Meeting and Document Data</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  As you use the MOMM System, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>Meeting minutes and documentation</li>
                  <li>Attendance records</li>
                  <li>Document uploads and attachments</li>
                  <li>Meeting schedules and venue information</li>
                  <li>Comments and notes</li>
                  <li>Action items and assignments</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Usage Information</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  We automatically collect certain information about your device and usage:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Login times and access logs</li>
                  <li>Pages visited and features used</li>
                  <li>Error logs and diagnostic data</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Delivery:</strong> To provide and maintain the MOMM System functionality</li>
                <li><strong>Account Management:</strong> To create and manage your user account</li>
                <li><strong>Communication:</strong> To send notifications, updates, and meeting reminders</li>
                <li><strong>Security:</strong> To protect against unauthorized access and fraudulent activities</li>
                <li><strong>Analytics:</strong> To analyze usage patterns and improve our services</li>
                <li><strong>Compliance:</strong> To comply with legal obligations and regulatory requirements</li>
                <li><strong>Support:</strong> To respond to your inquiries and provide customer support</li>
                <li><strong>Features:</strong> To develop new features and enhance user experience</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.1 Within Your Organization</h3>
                <p>
                  Meeting-related information is shared with authorized users within your organization based on their role and permissions. Administrators and conveners may have access to broader data sets necessary for their responsibilities.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.2 Service Providers</h3>
                <p>
                  We may engage trusted third-party service providers to assist with hosting, data storage, email delivery, and analytics. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.3 Legal Requirements</h3>
                <p>
                  We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, prevent fraud, or ensure user safety.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.4 Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or asset sale, your information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We implement comprehensive security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Encryption:</strong> All data transmission uses SSL/TLS encryption</li>
                <li><strong>Password Protection:</strong> Passwords are hashed using industry-standard algorithms (bcrypt)</li>
                <li><strong>Access Controls:</strong> Role-based access restrictions limit data exposure</li>
                <li><strong>Secure Hosting:</strong> Data is stored on secure, monitored servers</li>
                <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
                <li><strong>Backup Systems:</strong> Regular data backups with encryption</li>
                <li><strong>Staff Training:</strong> Our team is trained on data protection best practices</li>
              </ul>
              <p className="mt-3">
                While we strive to protect your data, no method of transmission over the internet is 100% secure. You are responsible for maintaining the confidentiality of your login credentials.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. Meeting minutes and documents are retained according to your organization&apos;s data retention policies. When you close your account, we will delete or anonymize your personal information within 90 days, unless retention is required by law or for legitimate business purposes.
            </p>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data we hold</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
                <li><strong>Withdrawal:</strong> Withdraw consent for optional data collection</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at privacy@momm-system.com. We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>We use cookies and similar tracking technologies to enhance your experience:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for authentication and session management</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand usage patterns (can be disabled)</li>
              </ul>
              <p className="mt-3">
                You can control cookie preferences through your browser settings. Note that disabling cookies may affect certain features of the MOMM System.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              The MOMM System may contain links to external websites or services not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              The MOMM System is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we discover that a child has provided us with personal information, we will promptly delete such information from our systems.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside your country of residence. By using the MOMM System, you consent to the transfer of your information to facilities that may be subject to different data protection laws. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          {/* Updates to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Updates to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or system notification. The &quot;Last Updated&quot; date at the top of this policy indicates when it was last revised. Your continued use of the MOMM System after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700"><strong>Privacy Officer:</strong> privacy@momm-system.com</p>
              <p className="text-gray-700"><strong>Support Team:</strong> support@momm-system.com</p>
              <p className="text-gray-700"><strong>Phone:</strong> +91 (123) 456-7890</p>
              <p className="text-gray-700 mt-3">
                <strong>Mailing Address:</strong><br />
                MOMM System Privacy Department<br />
                Your Organization Address<br />
                City, State, ZIP Code
              </p>
            </div>
          </section>

          {/* Agreement */}
          <section className="border-t pt-6">
            <p className="text-gray-700 leading-relaxed">
              By using the MOMM System, you acknowledge that you have read and understood this Privacy Policy and agree to its terms regarding the collection, use, and disclosure of your information.
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
