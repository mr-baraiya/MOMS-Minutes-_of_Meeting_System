'use client';

import { motion } from 'framer-motion';
import { Users, UserCheck, Building2, Presentation } from 'lucide-react';

interface StaffStatsProps {
  totalStaff: number;
  activeStaff: number;
  departmentCount: number;
  activeInMeetingsPercentage: number;
}

export default function StaffStats({ 
    totalStaff, 
    activeStaff, 
    departmentCount, 
    activeInMeetingsPercentage 
}: StaffStatsProps) {
    
  const stats = [
    {
      title: 'Total Staff',
      value: totalStaff,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Active Staff',
      value: activeStaff,
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'Departments',
      value: departmentCount,
      icon: Building2,
      color: 'bg-purple-50 text-purple-600',
    },
     {
      title: 'In Meetings',
      value: `${activeInMeetingsPercentage}%`,
      icon: Presentation,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          </div>
          <div className={`p-4 rounded-xl ${stat.color}`}>
            <stat.icon size={24} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
