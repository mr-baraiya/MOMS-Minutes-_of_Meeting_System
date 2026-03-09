'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Layers } from 'lucide-react';

const mockData = [
  { name: 'Committee', value: 400 },
  { name: 'Project', value: 300 },
  { name: 'Departmental', value: 300 },
  { name: 'Ad-hoc', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const MeetingTypeDistribution = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <Layers className="mr-2 h-6 w-6 text-green-500" />
        Meeting Type Distribution
      </h2>
      <div style={{ width: '100%', height: 300 }}>
        {mounted ? <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer> : <div className="h-full w-full animate-pulse bg-gray-100 rounded-lg" />}
      </div>
    </motion.div>
  );
};

export default MeetingTypeDistribution;
