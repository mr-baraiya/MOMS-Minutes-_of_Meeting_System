'use client';

import { motion } from 'framer-motion';
import { ListTodo, Calendar } from 'lucide-react';

const mockActionItems = [
  { id: 1, task: 'Submit feedback for Q1 performance review', meeting: 'HR Sync', dueDate: '4 days' },
  { id: 2, task: 'Update project status for "Project Gamma"', meeting: 'Weekly Standup', dueDate: '6 days' },
];

const StaffActionItems = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <ListTodo className="mr-2 h-6 w-6 text-blue-500" />
          My Action Items
        </h2>
        <span className="text-sm font-medium text-blue-600 bg-blue-100 rounded-full px-3 py-1">
          {mockActionItems.length} items
        </span>
      </div>
      <div className="space-y-4">
        {mockActionItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-4 rounded-lg bg-gray-50 border border-gray-100"
          >
            <p className="font-semibold text-gray-800">{item.task}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-4 w-4" />
                <span>{item.meeting}</span>
              </div>
              <span className="font-medium text-red-500">Due in {item.dueDate}</span>
            </div>
          </motion.div>
        ))}
        {mockActionItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No pending action items. Well done!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StaffActionItems;
