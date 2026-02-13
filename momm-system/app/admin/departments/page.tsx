'use client';

import { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DepartmentListTable from '@/components/departments/DepartmentListTable';
import DepartmentModal from '@/components/departments/DepartmentModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toast, Toaster } from 'react-hot-toast';

export default function DepartmentsPage() {
    const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
    const [loading, setLoading] = useState(true);
    const [departments, setDepartments] = useState<any[]>([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedDept, setSelectedDept] = useState<any | null>(null);

    // Delete Confirmation State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Filters state (Managed in parent or passed down, simple client side first)
    // Actually table handles search term state, but improved if lifted. Table is handling it via props callback
    const [filteredDepts, setFilteredDepts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [authLoading]);

    // Apply filters whenever deps change
    useEffect(() => {
        let result = [...departments];

        if (searchTerm) {
            result = result.filter(d => d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            result = result.filter(d => d.isActive === isActive);
        }

        setFilteredDepts(result);
    }, [departments, searchTerm, statusFilter]);


    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all including inactive to allow full management
            const res = await fetch('/api/departments?includeInactive=true');
            const json = await res.json();
             
           if (json.success) {
               setDepartments(json.data);
               setFilteredDepts(json.data); // Init
           } else {
               toast.error('Failed to load departments');
           }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => setSearchTerm(query);
    const handleFilterStatus = (status: string) => setStatusFilter(status);
    
    const handleSort = (key: string) => {
        const sorted = [...filteredDepts].sort((a, b) => {
            if (key === 'name') return a.departmentName.localeCompare(b.departmentName);
            if (key === 'staffCount') return (b._count?.staff || 0) - (a._count?.staff || 0);
            if (key === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return 0;
        });
        setFilteredDepts(sorted);
    };

    const handleToggleStatus = async (dept: any) => {
        // Optimistic
        const updated = departments.map(d => d.id === dept.id ? { ...d, isActive: !d.isActive } : d);
        setDepartments(updated);

        try {
            const res = await fetch(`/api/departments/${dept.id}`, {
                method: 'PUT', // or PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !dept.isActive })
            });
            
            if (!res.ok) throw new Error();
            toast.success(`Department ${!dept.isActive ? 'activated' : 'deactivated'}`);
        } catch (e) {
            toast.error('Update failed');
            fetchData(); // Revert
        }
    };

    // Modal Operations
    const handleAdd = () => {
        setModalMode('add');
        setSelectedDept(null);
        setIsModalOpen(true);
    }

    const handleEdit = (dept: any) => {
        setModalMode('edit');
        setSelectedDept(dept);
        setIsModalOpen(true);
    }

    const handleView = (dept: any) => {
        setModalMode('view');
        setSelectedDept(dept);
        setIsModalOpen(true);
    }

    const handleModalSubmit = async (data: any) => {
        try {
            let url = '/api/departments';
            let method = 'POST';

            if (modalMode === 'edit' && selectedDept) {
                url = `/api/departments/${selectedDept.id}`;
                method = 'PUT';
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const json = await res.json();

            if (json.success) {
                toast.success(modalMode === 'add' ? 'Department created' : 'Department updated');
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

    // Delete Operations
    const handleDeleteClick = (dept: any) => {
        if (dept._count?.staff > 0) {
            toast.error('Cannot remove department with active staff members');
            return;
        }
        setDeptToDelete(dept);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deptToDelete) return;
        setDeleteLoading(true);
        try {
           const res = await fetch(`/api/departments/${deptToDelete.id}`, {
               method: 'DELETE'
           });
           
           if (res.ok) {
               toast.success('Department removed successfully');
               setIsDeleteModalOpen(false);
               fetchData();
           } else {
               const err = await res.json();
               toast.error(err.error || 'Failed to delete');
           }
        } catch (error) {
             toast.error('An error occurred');
        } finally {
            setDeleteLoading(false);
            setDeptToDelete(null);
        }
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
                {/* Header */}
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
                        <p className="text-gray-500 mt-1">Manage organizational departments and structure</p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            onClick={() => {
                                // Simple CSV Export
                                const headers = ['ID', 'Name', 'Status', 'Staff Count', 'Created Date'];
                                const csvContent = [
                                    headers.join(','),
                                    ...filteredDepts.map(d => [d.id, `"${d.departmentName}"`, d.isActive ? 'Active' : 'Inactive', d._count?.staff || 0, new Date(d.createdAt).toLocaleDateString()].join(','))
                                ].join('\n');
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'departments.csv';
                                a.click();
                            }}
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button 
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Department
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <DepartmentListTable 
                    departments={filteredDepts}
                    onSearch={handleSearch}
                    onFilterStatus={handleFilterStatus}
                    onSort={handleSort}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onToggleStatus={handleToggleStatus}
                />

                {/* Modals */}
                <DepartmentModal 
                    isOpen={isModalOpen}
                    mode={modalMode}
                    department={selectedDept}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />

                <ConfirmationModal 
                     isOpen={isDeleteModalOpen}
                     title="Delete Department"
                     message={`Are you sure you want to delete ${deptToDelete?.departmentName}? This action cannot be undone.`}
                     confirmText="Yes, Delete"
                     variant="danger"
                     isLoading={deleteLoading}
                     onConfirm={handleConfirmDelete}
                     onCancel={() => setIsDeleteModalOpen(false)}
                />
            </div>
        </DashboardLayout>
    );
}
