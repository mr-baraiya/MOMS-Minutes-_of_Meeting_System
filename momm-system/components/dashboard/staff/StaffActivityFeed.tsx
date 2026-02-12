'use client';

import { motion } from 'framer-motion';
import { Clock, FileText, User } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'document', text: 'New document "Onboarding Guide" shared with you', time: '3 hours ago', icon: FileText, iconColor: 'text-green-500' },
  { id: 2, type: 'meeting', text: 'You were added to "Q2 Planning Session"', time: '8 hours ago', icon: Clock, iconColor: 'text-blue-500' },
  { id: 3, type: 'profile', text: 'Your profile information was updated', time: '2 days ago', icon: User, iconColor: 'text-purple-500' },
];

const StaffActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4">My Recent Activity</h2>
      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start"
            >
              <div className={`p-2 bg-gray-100 rounded-full mr-4`}>
                <Icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div>
                <p className="text-gray-800">{activity.text}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StaffActivityFeed;
