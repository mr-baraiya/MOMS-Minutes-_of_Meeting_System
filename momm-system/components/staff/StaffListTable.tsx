'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Eye, 
  CheckCircle, 
  XCircle,
  MoreHorizontal
} from 'lucide-react';


interface Staff {
  id: number;
  staffName: string;
  emailAddress: string;
  designation: string;
  mobileNo: string;
  isActive: boolean;
  department: {
    id: number;
    departmentName: string;
  };
  user?: {
      profilePicture?: string;
  }
}

interface StaffListTableProps {
  staffList: Staff[];
  departments: { id: number; departmentName: string }[];
  onSearch: (query: string) => void;
  onFilterRole: (role: string) => void;
  onFilterDept: (deptId: string) => void;
  onFilterStatus: (status: string) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export default function StaffListTable({ 
    staffList, 
    departments,
    onSearch,
    onFilterDept,
    onFilterStatus,
    onToggleStatus,
    onView,
    onEdit,
    onDelete
}: StaffListTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedDept(value);
        onFilterDept(value);
    };
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedStatus(value);
        onFilterStatus(value);
    };

    // Color generation for avatars
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getDepartmentColor = (deptName: string) => {
        const colors = [
            'bg-blue-100 text-blue-700',
            'bg-green-100 text-green-700',
            'bg-purple-100 text-purple-700',
            'bg-orange-100 text-orange-700',
            'bg-pink-100 text-pink-700',
            'bg-indigo-100 text-indigo-700'
        ];
        const hash = deptName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

  return (
    <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, email, or designation..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDept}
                    onChange={handleDeptChange}
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.departmentName}</option>
                    ))}
                </select>
                <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Contact Info</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Department</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Designation</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.length === 0 ? (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                              <User className="w-12 h-12 text-gray-300 mb-2" />
                              <p>No staff records found matching your criteria.</p>
                          </div>
                      </td>
                  </tr>
              ) : (
                  staffList.map((staff, index) => (
                    <motion.tr 
                        key={staff.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {staff.user?.profilePicture ? (
                              <img src={staff.user.profilePicture} alt={staff.staffName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {getInitials(staff.staffName)}
                              </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{staff.staffName}</p>
                            <p className="text-xs text-gray-400">ID: #{staff.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {staff.emailAddress}
                            </div>
                            {staff.mobileNo && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    {staff.mobileNo}
                                </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(staff.department?.departmentName || 'General')}`}>
                          {staff.department?.departmentName || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {staff.designation || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                            onClick={() => onToggleStatus(staff.id, staff.isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${staff.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${staff.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => onView(staff)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                                title="View Details"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => onEdit(staff)}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                                title="Edit Staff"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => onDelete(staff)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                    !staff.isActive 
                                        ? 'text-red-600 hover:bg-red-100 bg-red-50' 
                                        : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                                }`}
                                title={!staff.isActive ? "Delete Permanently" : "Deactivate Staff"}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Simplified UI) */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {staffList.length} results</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50" disabled>Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
