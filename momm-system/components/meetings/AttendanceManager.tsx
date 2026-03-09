'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  CheckCircle,
  XCircle,
  Search,
  Users,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  UserCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AttendanceManagerProps {
  meetingId: number;
  role: 'admin' | 'convener';
  initialData?: any;
}

interface Member {
  id: number; // meeting_member_id
  staffId: number;
  staffName: string;
  departmentName: string;
  designation: string;
  isPresent: boolean;
  remarks: string | null;
  attendanceMarkedAt: string | null;
}

export default function AttendanceManager({ meetingId, role }: AttendanceManagerProps) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);

  const fetchMeetingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/meetings/${meetingId}`);
      const result = await response.json();

      if (result.success) {
        setMeeting(result.data);
        const mappedMembers = result.data.meetingMembers.map((mm: any) => ({
          id: mm.id,
          staffId: mm.staff.id,
          staffName: mm.staff.staffName,
          departmentName: mm.staff.department?.departmentName || 'N/A',
          designation: mm.staff.designation || 'N/A',
          isPresent: mm.isPresent,
          remarks: mm.remarks || '',
          attendanceMarkedAt: mm.attendanceMarkedAt,
        }));
        setMembers(mappedMembers);
      } else {
        toast.error('Failed to load meeting data');
      }
    } catch (error) {
      console.error('Error fetching meeting:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAttendance = (memberId: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, isPresent: !m.isPresent } : m
      )
    );
  };

  const handleRemarkChange = (memberId: number, remark: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, remarks: remark } : m))
    );
  };

  const handleMarkAll = (isPresent: boolean) => {
    setMembers((prev) => prev.map((m) => ({ ...m, isPresent })));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formattedAttendance = members.map((m) => ({
        memberId: m.id,
        isPresent: m.isPresent,
        remarks: m.remarks,
      }));

      const response = await fetch(`/api/meetings/${meetingId}/attendance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendance: formattedAttendance }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Attendance saved successfully');
        fetchMeetingData(); // Refresh to get updated timestamps
      } else {
        toast.error(result.error || 'Failed to save attendance');
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  // Determine if meeting is in the future (attendance locked)
  const isFutureMeeting = meeting
    ? (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mDate = new Date(meeting.meetingDate);
        mDate.setHours(0, 0, 0, 0);
        return mDate > today;
      })()
    : false;

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'present') return matchesSearch && m.isPresent;
    if (filter === 'absent') return matchesSearch && !m.isPresent;
    return matchesSearch;
  });

  const stats = {
    total: members.length,
    present: members.filter((m) => m.isPresent).length,
    absent: members.filter((m) => !m.isPresent).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-8 text-center text-slate-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p>Meeting not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Meetings
          </button>
          <h1 className="text-2xl font-bold text-slate-900">{meeting.meetingTitle}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-slate-400" />
              {new Date(meeting.meetingDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-slate-400" />
              {new Date(meeting.meetingStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-slate-400" />
              {stats.total} Participants
            </div>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex flex-col items-end gap-3">
          {isFutureMeeting && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Attendance can only be marked on or after the meeting date
            </div>
          )}
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-medium">
              Present: {stats.present}
            </div>
            <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-100 font-medium">
              Absent: {stats.absent}
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || isFutureMeeting}
            title={isFutureMeeting ? 'Cannot save attendance for a future meeting' : undefined}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Attendance
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none"
          >
            <option value="all">All Members</option>
            <option value="present">Present Only</option>
            <option value="absent">Absent Only</option>
          </select>

          <div className="h-9 w-px bg-slate-200 mx-2" />

          <button
            onClick={() => handleMarkAll(true)}
            disabled={isFutureMeeting}
            className="px-3 py-2 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => handleMarkAll(false)}
            disabled={isFutureMeeting}
            className="px-3 py-2 text-xs font-medium bg-rose-100 text-rose-800 rounded-lg hover:bg-rose-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">
                  Participant
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">
                  Remarks
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={member.isPresent ? 'bg-emerald-50/30' : 'bg-white'}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${member.isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{member.staffName}</p>
                          <p className="text-xs text-slate-500">{member.designation} • {member.departmentName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => !isFutureMeeting && handleToggleAttendance(member.id)}
                        disabled={isFutureMeeting}
                        title={isFutureMeeting ? 'Cannot mark attendance for future meetings' : undefined}
                        className={`
                          relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${isFutureMeeting ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                          ${member.isPresent ? 'bg-emerald-500 focus:ring-emerald-500' : 'bg-slate-200 focus:ring-slate-500'}
                        `}
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${member.isPresent ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                      </button>
                      <span className={`ml-3 text-sm font-medium ${member.isPresent ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {member.isPresent ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={member.remarks || ''}
                        onChange={(e) => handleRemarkChange(member.id, e.target.value)}
                        placeholder="Add remarks..."
                        disabled={isFutureMeeting}
                        className="w-full text-sm border-0 border-b border-transparent bg-transparent focus:border-slate-300 focus:ring-0 placeholder:text-slate-400 hover:border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      />
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {member.attendanceMarkedAt ? new Date(member.attendanceMarkedAt).toLocaleString() : 'Not marked'}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredMembers.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>No participants found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
