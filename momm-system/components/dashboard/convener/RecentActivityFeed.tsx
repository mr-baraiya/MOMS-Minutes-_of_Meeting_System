'use client';

import { motion } from 'framer-motion';
import { Clock, FilePlus, UserPlus } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'document', text: 'Minutes for "Q1 Review" uploaded', time: '2 hours ago', icon: FilePlus, iconColor: 'text-green-500' },
  { id: 2, type: 'meeting', text: 'New meeting "Project Phoenix Kickoff" created', time: '5 hours ago', icon: Clock, iconColor: 'text-blue-500' },
  { id: 3, type: 'participant', text: 'John Doe added to "Project Phoenix Kickoff"', time: '5 hours ago', icon: UserPlus, iconColor: 'text-purple-500' },
  { id: 4, type: 'document', text: 'Agenda for "Weekly Sync" updated', time: '1 day ago', icon: FilePlus, iconColor: 'text-green-500' },
];

const RecentActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
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

export default RecentActivityFeed;
