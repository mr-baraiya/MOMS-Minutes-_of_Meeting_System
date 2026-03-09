'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#8B5CF6'];

export default function DepartmentDistributionChart({ data }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Meetings by Department</h3>
      <div className="h-[300px] w-full">
        {mounted ? <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fontSize: 12, fill: '#4B5563' }}
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="value" name="Meetings" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer> : <div className="h-full w-full animate-pulse bg-gray-100 rounded-lg" />}
      </div>
    </motion.div>
  );
}
