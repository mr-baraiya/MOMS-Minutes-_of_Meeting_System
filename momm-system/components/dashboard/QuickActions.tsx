'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Users, FileText, Settings } from 'lucide-react';

const actions = [
  {
    title: 'Schedule Meeting',
    icon: Calendar,
    href: '/admin/meetings',
    color: 'bg-blue-100 text-blue-600',
    hoverColor: 'hover:bg-blue-50',
  },
  {
    title: 'Manage Users',
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-100 text-purple-600',
    hoverColor: 'hover:bg-purple-50',
  },
  {
    title: 'View Reports',
    icon: FileText,
    href: '/admin/reports',
    color: 'bg-green-100 text-green-600',
    hoverColor: 'hover:bg-green-50',
  },
  {
    title: 'System Settings',
    icon: Settings,
    href: '/admin/settings',
    color: 'bg-orange-100 text-orange-600',
    hoverColor: 'hover:bg-orange-50',
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link href={action.href} key={action.title} className="block h-full">
            <div className={`h-full flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${action.hoverColor} group border border-transparent hover:border-gray-200 border-gray-50 bg-gray-50/50`}>
              <div className={`p-3 rounded-full mb-3 ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={24} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{action.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
