'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  completed: number;
  upcoming: number;
  cancelled: number;
}

const STATUS_COLORS = ['#10B981', '#3B82F6', '#EF4444'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">{payload[0].value} meetings</p>
      </div>
    );
  }
  return null;
};

export default function MeetingStatusChart({ completed, upcoming, cancelled }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = [
    { name: 'Completed', value: completed },
    { name: 'Upcoming', value: upcoming },
    { name: 'Cancelled', value: cancelled },
  ].filter((d) => d.value > 0);

  const total = completed + upcoming + cancelled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-1">Meeting Status</h3>
      <p className="text-sm text-gray-500 mb-4">{total} total meetings</p>

      <div className="h-55 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                animationBegin={300}
                animationDuration={1200}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={30}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse bg-gray-100 rounded-lg" />
        )}
      </div>

      {/* Legend badges */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-50 rounded-lg py-2">
          <p className="font-bold text-emerald-700 text-lg">{completed}</p>
          <p className="text-emerald-600">Completed</p>
        </div>
        <div className="bg-blue-50 rounded-lg py-2">
          <p className="font-bold text-blue-700 text-lg">{upcoming}</p>
          <p className="text-blue-600">Upcoming</p>
        </div>
        <div className="bg-red-50 rounded-lg py-2">
          <p className="font-bold text-red-700 text-lg">{cancelled}</p>
          <p className="text-red-600">Cancelled</p>
        </div>
      </div>
    </motion.div>
  );
}
