import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              About the Project
            </h1>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              The Minutes of Meeting Management System (MOMM) is a comprehensive web-based 
              application designed to digitize and streamline the meeting management process 
              for academic institutions and organizations.
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  This system addresses the inefficiencies of traditional paper-based meeting 
                  management by providing a centralized digital platform for scheduling meetings, 
                  tracking attendance, storing documents, and generating comprehensive reports.
                </p>
                <p>
                  The application implements modern web technologies to ensure scalability, 
                  security, and user-friendly interfaces while maintaining the formal structure 
                  required for organizational documentation.
                </p>
                <p>
                  Built with a multi-tier architecture, the system supports role-based access 
                  control, real-time updates, and automated notification systems to enhance 
                  communication and coordination among stakeholders.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Project Specifications</h3>
              <dl className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <dt className="font-semibold text-gray-900">Project Type:</dt>
                  <dd className="text-gray-700">Web-based Meeting Management System</dd>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <dt className="font-semibold text-gray-900">Frontend Framework:</dt>
                  <dd className="text-gray-700">Next.js 14 with TypeScript</dd>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <dt className="font-semibold text-gray-900">Backend Technology:</dt>
                  <dd className="text-gray-700">Next.js API Routes with Prisma ORM</dd>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <dt className="font-semibold text-gray-900">Database:</dt>
                  <dd className="text-gray-700">PostgreSQL (Hosted on Neon)</dd>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <dt className="font-semibold text-gray-900">Authentication:</dt>
                  <dd className="text-gray-700">JWT-based with Role Management</dd>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <dt className="font-semibold text-gray-900">Styling:</dt>
                  <dd className="text-gray-700">Tailwind CSS with Custom Components</dd>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <dt className="font-semibold text-gray-900">Deployment:</dt>
                  <dd className="text-gray-700">Vercel Platform</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">System Architecture</h2>
          <div className="w-24 h-1 bg-blue-700 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Frontend Layer */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Presentation Layer</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• React-based user interfaces</li>
                <li>• Responsive design implementation</li>
                <li>• Component-based architecture</li>
                <li>• TypeScript for type safety</li>
                <li>• Client-side form validation</li>
                <li>• Dynamic routing system</li>
              </ul>
            </div>

            {/* Business Logic */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Logic Layer</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• API route handlers</li>
                <li>• Authentication middleware</li>
                <li>• Role-based authorization</li>
                <li>• Data validation logic</li>
                <li>• Business rule enforcement</li>
                <li>• Error handling mechanisms</li>
              </ul>
            </div>

            {/* Data Layer */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Access Layer</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Prisma ORM integration</li>
                <li>• PostgreSQL database</li>
                <li>• Database schema management</li>
                <li>• Migration handling</li>
                <li>• Query optimization</li>
                <li>• Connection pooling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Details */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Implementation Details</h2>
          <div className="w-24 h-1 bg-blue-700 mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Development Methodology */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Development Approach</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Incremental Development:</strong> The system was built using an iterative 
                  approach, implementing core functionalities first and gradually adding advanced features.
                </p>
                <p>
                  <strong>Component-Driven Design:</strong> Utilized reusable React components to 
                  maintain consistency and reduce code duplication across the application.
                </p>
                <p>
                  <strong>API-First Approach:</strong> Designed RESTful APIs that can support future 
                  mobile applications and third-party integrations.
                </p>
                <p>
                  <strong>Security-First Implementation:</strong> Implemented comprehensive security 
                  measures including input validation, SQL injection prevention, and XSS protection.
                </p>
              </div>
            </div>

            {/* Technical Challenges */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Challenges Addressed</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Real-time Updates:</strong> Implemented efficient state management to 
                  ensure UI updates reflect database changes without full page refreshes.
                </p>
                <p>
                  <strong>Role-based Access:</strong> Designed a flexible permission system that 
                  can accommodate different organizational structures and hierarchies.
                </p>
                <p>
                  <strong>Document Management:</strong> Integrated secure file upload and storage 
                  capabilities with proper access controls and version management.
                </p>
                <p>
                  <strong>Performance Optimization:</strong> Implemented database query optimization 
                  and client-side caching to ensure fast response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Learning Outcomes */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Learning Outcomes</h2>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Skills and knowledge gained through this project</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Technical Skills */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Technical Skills Acquired</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Full-stack web development</li>
                <li>• Database design and management</li>
                <li>• API development and integration</li>
                <li>• Modern JavaScript frameworks</li>
                <li>• Version control with Git</li>
                <li>• Cloud deployment practices</li>
              </ul>
            </div>

            {/* Problem-Solving */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Problem-Solving Approach</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Requirements analysis and planning</li>
                <li>• System design and architecture</li>
                <li>• Testing and debugging strategies</li>
                <li>• Performance optimization techniques</li>
                <li>• User experience considerations</li>
                <li>• Security implementation practices</li>
              </ul>
            </div>

            {/* Project Management */}
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Management</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Timeline planning and execution</li>
                <li>• Feature prioritization</li>
                <li>• Documentation practices</li>
                <li>• Testing and quality assurance</li>
                <li>• Deployment and maintenance</li>
                <li>• Continuous improvement mindset</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}