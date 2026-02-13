'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import StaffStats from '@/components/staff/StaffStats';
import StaffListTable from '@/components/staff/StaffListTable';
import StaffModal from '@/components/staff/StaffModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast, Toaster } from 'react-hot-toast';

export default function StaffManagementPage() {
    const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
    const [loading, setLoading] = useState(true);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [authLoading]);

    const fetchData = async () => {
        try {
            const [staffRes, deptRes] = await Promise.all([
                fetch('/api/staff?limit=100&includeInactive=true'),
                fetch('/api/departments')
            ]);
            
            const staffData = await staffRes.json();
            const deptData = await deptRes.json();

            if (staffData.success) {
                setStaffList(staffData.data.data);
            }
            if (deptData.success) {
                setDepartments(deptData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load staff data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => setSearchQuery(query);
    const handleFilterDept = (deptId: string) => setDeptFilter(deptId);
    const handleFilterStatus = (status: string) => setStatusFilter(status);
    const handleFilterRole = (role: string) => console.log('Role filter not implemented on backend yet');

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        // Optimistic update
        const updatedList = staffList.map(s => 
            s.id === id ? { ...s, isActive: !currentStatus } : s
        );
        setStaffList(updatedList);
        
        try {
            // Update via API
            const res = await fetch(`/api/staff/${id}`, {
                method: 'PATCH', // Assumes PATCH for partial update
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (!res.ok) throw new Error('Failed to update');
            toast.success(`Staff member ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            // Revert on error
            setStaffList(staffList);
            toast.error('Failed to update status');
             fetchData();
        }
    };

    // Modal Handlers
    const openAddModal = () => {
        setModalMode('add');
        setSelectedStaff(null);
        setIsModalOpen(true);
    };

    const openEditModal = (staff: any) => {
        setModalMode('edit');
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const openViewModal = (staff: any) => {
        setModalMode('view');
        setSelectedStaff(staff);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (staff: any) => {
        setStaffToDelete(staff);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!staffToDelete) return;
        setDeleteLoading(true);

        const isPermanent = !staffToDelete.isActive;
        const url = isPermanent 
            ? `/api/staff/${staffToDelete.id}?permanent=true` 
            : `/api/staff/${staffToDelete.id}`;

        try {
            const res = await fetch(url, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                toast.success(isPermanent ? 'Staff permanently deleted' : 'Staff deactivated successfully');
                fetchData();
                setIsDeleteModalOpen(false);
            } else {
                const error = await res.json();
                toast.error(error.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setDeleteLoading(false);
            setStaffToDelete(null);
        }
    };

    const handleModalSubmit = async (data: any) => {
        try {
            let url = '/api/staff';
            let method = 'POST';

            if (modalMode === 'edit' && selectedStaff) {
                url = `/api/staff/${selectedStaff.id}`;
                method = 'PUT'; // Using PUT as per route.ts
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (json.success) {
                toast.success(modalMode === 'add' ? 'Staff added successfully' : 'Staff updated successfully');
                setIsModalOpen(false);
                fetchData();
            } else {
                toast.error(json.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    const handleExport = () => {
        // Simple CSV Export
        const headers = ['ID', 'Name', 'Email', 'Designation', 'Mobile', 'Department', 'Status'];
        const csvContent = [
            headers.join(','),
            ...staffList.map(item => [
                item.id,
                `"${item.staffName}"`,
                item.emailAddress,
                `"${item.designation || ''}"`,
                item.mobileNo || '',
                `"${item.department?.departmentName || ''}"`,
                item.isActive ? 'Active' : 'Inactive'
            ].join(','))
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'staff_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Client-side filtering
    const filteredStaff = staffList.filter(staff => {
        const matchesSearch = 
            staff.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (staff.designation || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDept = deptFilter ? staff.department?.id.toString() === deptFilter : true;
        
        const matchesStatus = statusFilter === 'all' 
            ? true 
            : statusFilter === 'active' 
                ? staff.isActive 
                : !staff.isActive;

        return matchesSearch && matchesDept && matchesStatus;
    });

    // Calculate stats
    const stats = {
        totalStaff: staffList.length,
        activeStaff: staffList.filter(s => s.isActive).length,
        departmentCount: departments.length,
        activeInMeetingsPercentage: 75, // Placeholder/Mock for now
    };

    if (authLoading || loading) {
        return (
            <DashboardLayout role="admin">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

  return (
    <DashboardLayout role="admin">
      <Toaster position="top-right" />
      <div className="space-y-8 pb-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
                <p className="text-gray-500 mt-1">Manage organizational staff records and permissions</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
                >
                    <Plus className="w-4 h-4" />
                    Add Staff
                </button>
            </div>
        </div>

        {/* Stats */}
        <StaffStats {...stats} />

        {/* List Table */}
        <StaffListTable 
            staffList={filteredStaff} 
            departments={departments}
            onSearch={handleSearch}
            onFilterRole={handleFilterRole}
            onFilterDept={handleFilterDept}
            onFilterStatus={handleFilterStatus}
            onToggleStatus={handleToggleStatus}
            onView={openViewModal}
            onEdit={openEditModal}
            onDelete={handleDeleteClick}
        />

        {/* Modal */}
        <StaffModal
            isOpen={isModalOpen}
            mode={modalMode}
            staff={selectedStaff}
            departments={departments}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            title={staffToDelete?.isActive ? "Deactivate Staff" : "Delete Staff Permanently"}
            message={staffToDelete?.isActive 
                ? `Are you sure you want to deactivate ${staffToDelete?.staffName}? This action will prevent them from logging in and accessing the system.` 
                : `Are you sure you want to permanently delete ${staffToDelete?.staffName}? This action CANNOT be undone and will remove all associated user data.`}
            confirmText={staffToDelete?.isActive ? "Yes, Deactivate" : "Yes, Delete Forever"}
            cancelText="Cancel"
            variant="danger"
            isLoading={deleteLoading}
            onConfirm={handleConfirmDelete}
            onCancel={() => setIsDeleteModalOpen(false)}
        />

      </div>
    </DashboardLayout>
  );
}
