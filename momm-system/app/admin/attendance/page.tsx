'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Search,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  ArrowRight,
  Clock,
  UserCheck
} from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';

// Mock types/interface based on system
interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: string;
  meetingStartTime: string;
  venue?: { venueName: string };
  meetingType: { meetingTypeName: string };
  organizer: { staffName: string; department?: { departmentName: string } };
  _count: { meetingMembers: number };
  attendanceStatus?: 'completed' | 'pending' | 'partial';
  attendancePercentage?: number;
}

export default function ManageAttendancePage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Logic (Mocked integration for design first)
  useEffect(() => {
    if (!authLoading) {
      fetchMeetings();
    }
  }, [authLoading, filter]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
        // In a real scenario, we would pass filter parameters here
      const response = await fetch('/api/meetings?limit=20'); 
      const data = await response.json();
      
      if (data.success) {
        // Transform data to include attendance status (mock logic for demo)
        const transformedMeetings = data.data.data.map((m: any) => ({
            ...m,
            // Simulating attendance status based on date/random for visual design
            attendanceStatus: new Date(m.meetingDate) < new Date() ? (Math.random() > 0.5 ? 'completed' : 'pending') : 'upcoming',
            attendancePercentage: Math.floor(Math.random() * 100)
        }));
        setMeetings(transformedMeetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMeetings = meetings.filter(m => {
    if (filter === 'pending') return m.attendanceStatus === 'pending';
    if (filter === 'completed') return m.attendanceStatus === 'completed';
    return true;
  }).filter(m => 
    m.meetingTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.organizer?.staffName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Attendance</h1>
            <p className="text-gray-500 mt-1">Monitor and verify meeting attendance records</p>
          </div>
          <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
             <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                All Meetings
             </button>
             <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                Pending
             </button>
             <button 
                 onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                Completed
             </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search by meeting title or organizer..." 
                className="flex-1 border-none focus:ring-0 text-gray-900 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>

        {/* Content */}
        {loading ? (
             <div className="flex justify-center py-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
                />
            </div>
        ) : filteredMeetings.length === 0 ? (
             <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No meetings found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredMeetings.map((meeting, index) => (
                    <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            {/* Date & Info */}
                            <div className="flex items-start gap-4 flex-1 w-full lg:w-auto">
                                <div className="flex flex-col items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg min-w-[80px]">
                                    <span className="text-xs font-bold uppercase tracking-wide">{new Date(meeting.meetingDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold">{new Date(meeting.meetingDate).getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{meeting.meetingTitle}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {new Date(meeting.meetingStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                         <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            by {meeting.organizer?.staffName || 'Unknown'}
                                        </div>
                                         <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                            {meeting.meetingType.meetingTypeName}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                             <div className="flex items-center gap-8 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{meeting._count.meetingMembers}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Invited</div>
                                </div>
                                <div className="text-center">
                                     <div className={`text-2xl font-bold ${meeting.attendanceStatus === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                                        {meeting.attendanceStatus === 'completed' ? `${meeting.attendancePercentage}%` : '-'}
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium uppercase">Present</div>
                                </div>
                             </div>

                             {/* Action */}
                             <div className="w-full lg:w-auto flex flex-col items-end gap-2">
                                {meeting.attendanceStatus === 'pending' ? (
                                    <div className="flex items-center gap-2 mb-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold">
                                        <AlertCircle className="w-3 h-3" />
                                        Pending
                                    </div>
                                ) : meeting.attendanceStatus === 'completed' ? (
                                     <div className="flex items-center gap-2 mb-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                                        <CheckCircle className="w-3 h-3" />
                                        Marked
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold">
                                        Future
                                    </div>
                                )}
                                
                                <Link 
                                    href={`/admin/meetings/${meeting.id}/attendance`}
                                    className="flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm"
                                >
                                    <UserCheck className="w-4 h-4" />
                                    Manage Attendance
                                </Link>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
