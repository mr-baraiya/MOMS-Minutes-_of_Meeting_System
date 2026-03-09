'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';

const mockData = [
  { name: 'Conf Room A', usage: 40 },
  { name: 'Conf Room B', usage: 30 },
  { name: 'Boardroom', usage: 20 },
  { name: 'Huddle Room', usage: 27 },
  { name: 'Conf Room C', usage: 18 },
];

const VenueUtilization = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
        <MapPin className="mr-2 h-6 w-6 text-purple-500" />
        Venue Utilization
      </h2>
      <div style={{ width: '100%', height: 300 }}>
        {mounted ? <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer> : <div className="h-full w-full animate-pulse bg-gray-100 rounded-lg" />}
      </div>
    </motion.div>
  );
};

export default VenueUtilization;
