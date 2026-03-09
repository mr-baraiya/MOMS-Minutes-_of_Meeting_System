import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <section className="pt-20 pb-16 px-4 bg-linear-to-br from-blue-700 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-white rounded-lg shadow-xl p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Minutes of Meeting
              <span className="block text-blue-700">Management System</span>
            </h1>
            <div className="border-t-2 border-blue-200 mt-6 pt-6">
              <h2 className="text-xl text-gray-600 mb-6">
                Academic Project - Information Technology Department
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
                A comprehensive digital solution for organizing, documenting, and managing 
                institutional meetings with automated attendance tracking and report generation capabilities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-semibold shadow-lg"
              >
                Access System
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 border-2 border-blue-700 text-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition-colors font-semibold"
              >
                Project Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* System Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              System Features & Capabilities
            </h2>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Core functionalities implemented in this management system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Meeting Scheduling
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Digital scheduling interface for planning meetings with venue management, 
                participant selection, and automated notifications.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 text-green-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Attendance Tracking
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time attendance management with present/absent status tracking 
                and automated record generation for reporting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Document Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Centralized repository for meeting agendas, minutes, and documentation 
                with secure access control and version management.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                User Role Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Hierarchical access control with Administrator, Convener, 
                and Staff roles with appropriate permission levels.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                5
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Reports & Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Automated generation of meeting summaries, attendance reports, 
                and statistical analysis for administration.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-lg mb-4 font-bold text-xl">
                6
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Multi-Department Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cross-departmental coordination with venue allocation 
                and resource management across organizational units.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-lg p-10 border-l-4 border-blue-700">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              System Access & Demonstration
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              This application demonstrates modern web development practices and database management concepts.
              Access the demo to explore the complete functionality.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors font-semibold shadow-lg"
              >
                Demo Access
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-blue-700 text-blue-700 rounded-md hover:bg-blue-700 hover:text-white transition-colors font-semibold"
              >
                Contact Information
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
