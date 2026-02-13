'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { MeetingType } from '@/types/models';
import MeetingTypeListTable from '@/components/meeting-types/MeetingTypeListTable';
import MeetingTypeModal from '@/components/meeting-types/MeetingTypeModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function MeetingTypesPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [meetingTypes, setMeetingTypes] = useState<(MeetingType & { _count?: { meetings: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage'>('name');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedType, setSelectedType] = useState<MeetingType | null>(null);
  
  // Confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MeetingType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch meeting types
  const fetchMeetingTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/meeting-types?includeInactive=true');
      const data = await response.json();
      
      if (data.success) {
        setMeetingTypes(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch meeting types');
      }
    } catch (error) {
      toast.error('An error occurred while fetching meeting types');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchMeetingTypes();
    }
  }, [authLoading]);

  // Filter and sort meeting types
  const filteredAndSortedTypes = meetingTypes
    .filter(type => {
      // Search filter
      const matchesSearch = type.meetingTypeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? type.isActive :
        !type.isActive;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.meetingTypeName.localeCompare(b.meetingTypeName);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'usage':
          return (b._count?.meetings || 0) - (a._count?.meetings || 0);
        default:
          return 0;
      }
    });

  // Handlers
  const handleAdd = () => {
    setModalMode('add');
    setSelectedType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type: MeetingType) => {
    setModalMode('edit');
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleView = (type: MeetingType) => {
    setModalMode('view');
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (type: MeetingType) => {
    setItemToDelete(type);
    setConfirmOpen(true);
  };

  const handleSubmit = async (formData: Partial<MeetingType>) => {
    try {
      let response;
      
      if (modalMode === 'add') {
        response = await fetch('/api/meeting-types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else if (modalMode === 'edit' && selectedType) {
        response = await fetch(`/api/meeting-types/${selectedType.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || (modalMode === 'add' ? 'Meeting type created' : 'Meeting type updated'));
        setIsModalOpen(false);
        fetchMeetingTypes();
      } else {
        toast.error(data.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setIsDeleting(true);
      
      const url = itemToDelete.isActive 
        ? `/api/meeting-types/${itemToDelete.id}`
        : `/api/meeting-types/${itemToDelete.id}?hardDelete=true`;

      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      const data = await response.json();

      if (data.success) {
        toast.success(itemToDelete.isActive ? 'Meeting type deactivated successfully' : 'Meeting type permanently deleted');
        setConfirmOpen(false);
        fetchMeetingTypes();
      } else {
        toast.error(data.message || 'Failed to delete meeting type');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Meeting Types</h1>
            <p className="text-sm text-gray-500 mt-1">Manage meeting categories used across the system.</p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200"
          >
            <Plus size={18} />
            Add Meeting Type
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by type name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'usage')}
            className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium flex items-center gap-2"
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created Date</option>
            <option value="usage">Sort by Usage Count</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Types</p>
            <p className="text-2xl font-bold text-gray-900">{meetingTypes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <p className="text-sm text-green-600 mb-1">Active Types</p>
            <p className="text-2xl font-bold text-green-700">{meetingTypes.filter(t => t.isActive).length}</p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <p className="text-sm text-indigo-600 mb-1">Total Usage</p>
            <p className="text-2xl font-bold text-indigo-700">
              {meetingTypes.reduce((sum, t) => sum + (t._count?.meetings || 0), 0)}
            </p>
          </div>
        </div>

        {/* Table */}
        <MeetingTypeListTable 
          meetingTypes={filteredAndSortedTypes}
          isLoading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* View/Edit/Add Modal */}
        <MeetingTypeModal 
          isOpen={isModalOpen}
          mode={modalMode}
          meetingType={selectedType}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={confirmOpen}
          title={itemToDelete?.isActive ? "Deactivate Meeting Type" : "Permanently Delete Meeting Type"}
          message={itemToDelete?.isActive 
            ? `Are you sure you want to deactivate "${itemToDelete?.meetingTypeName}"? It will no longer be available for new meetings.`
            : `Are you sure you want to permanently delete "${itemToDelete?.meetingTypeName}"? This action cannot be undone.`
          }
          confirmText={itemToDelete?.isActive ? "Deactivate" : "Delete Permanently"}
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
