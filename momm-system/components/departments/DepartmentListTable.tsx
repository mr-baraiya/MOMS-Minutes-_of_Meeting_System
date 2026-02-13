'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, SortAsc, SortDesc, Users, Calendar, Eye, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface Department {
  id: number;
  departmentName: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    staff: number;
  };
}

interface DepartmentListTableProps {
  departments: Department[];
  onSearch: (query: string) => void;
  onFilterStatus: (status: string) => void;
  onSort: (key: string) => void;
  onView: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  onToggleStatus: (dept: Department) => void;
}

export default function DepartmentListTable({
  departments,
  onSearch,
  onFilterStatus,
  onSort,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}: DepartmentListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    onFilterStatus(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort(key); // Parent component should implementation sorting logic
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full md:w-auto min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto items-center">
            <div className="flex items-center gap-2 text-sm text-gray-500 mr-2">
                <SortAsc className="w-4 h-4" />
                <span>Sort by:</span>
            </div>
            <select
                className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSort(e.target.value)}
            >
                <option value="name">Name</option>
                <option value="staffCount">Staff Count</option>
                <option value="date">Date Created</option>
            </select>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <select
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
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
                <th 
                    className="px-6 py-4 font-semibold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                >
                    Department Name
                </th>
                <th 
                    className="px-6 py-4 font-semibold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('staffCount')}
                >
                    Staff Count
                </th>
                <th 
                    className="px-6 py-4 font-semibold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('date')}
                >
                    Created Date
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-12 h-12 text-gray-300 mb-2" />
                      <p>No departments found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                departments.map((dept, index) => (
                  <motion.tr
                    key={dept.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {dept.departmentName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{dept.departmentName}</p>
                            <p className="text-xs text-gray-400">ID: #{dept.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-700">{dept._count.staff}</span>
                            <span className="text-xs text-gray-400">members</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(dept.createdAt).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => onToggleStatus(dept)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${dept.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${dept.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(dept)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(dept)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Department"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(dept)}
                          className={`p-1.5 rounded-lg transition-colors ${
                              dept._count.staff > 0 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                          disabled={dept._count.staff > 0}
                          title={dept._count.staff > 0 ? "Cannot delete (Has assigned staff)" : "Delete Department"}
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
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
            <p className="text-sm text-gray-500">{departments.length} departments found</p>
        </div>
      </div>
    </div>
  );
}
