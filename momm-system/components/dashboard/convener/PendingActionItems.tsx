'use client';

import { motion } from 'framer-motion';
import { ListTodo, User, Calendar } from 'lucide-react';

const mockActionItems = [
  { id: 1, task: 'Finalize Q1 budget report', meeting: 'Finance Committee', assignedTo: 'John Doe', dueDate: '3 days' },
  { id: 2, task: 'Prepare presentation for project kickoff', meeting: 'Project Alpha', assignedTo: 'You', dueDate: '5 days' },
  { id: 3, task: 'Review marketing campaign mockups', meeting: 'Marketing Sync', assignedTo: 'Jane Smith', dueDate: '1 week' },
  { id: 4, task: 'Draft new user onboarding documentation', meeting: 'Product Team', assignedTo: 'You', dueDate: '2 weeks' },
];

const PendingActionItems = () => {
  const userActionItems = mockActionItems.filter(item => item.assignedTo === 'You');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <ListTodo className="mr-2 h-6 w-6 text-blue-500" />
          My Pending Action Items
        </h2>
        <span className="text-sm font-medium text-blue-600 bg-blue-100 rounded-full px-3 py-1">
          {userActionItems.length} items
        </span>
      </div>
      <div className="space-y-4">
        {userActionItems.map((item, index) => (
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
        {userActionItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No pending action items. Great job!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PendingActionItems;
