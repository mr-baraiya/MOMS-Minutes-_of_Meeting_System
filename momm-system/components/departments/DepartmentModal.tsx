'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Department {
  id?: number;
  departmentName: string;
  isActive: boolean;
  _count?: {
      staff: number;
  };
}

interface DepartmentModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  department: Department | null;
  onClose: () => void;
  onSubmit: (data: Partial<Department>) => Promise<void>;
}

export default function DepartmentModal({ isOpen, mode, department, onClose, onSubmit }: DepartmentModalProps) {
  const [formData, setFormData] = useState<Partial<Department>>({
    departmentName: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department && (mode === 'edit' || mode === 'view')) {
      setFormData({
        departmentName: department.departmentName,
        isActive: department.isActive,
      });
    } else {
      setFormData({
        departmentName: '',
        isActive: true,
      });
    }
  }, [department, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const title = mode === 'add' ? 'Add New Department' : mode === 'edit' ? 'Edit Department' : 'Department Details';
  const isView = mode === 'view';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
             <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
             </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isView && department ? (
                 <div className="space-y-6">
                     <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                         <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-600 text-3xl font-bold mb-3 shadow-inner">
                             {department.departmentName.substring(0, 1).toUpperCase()}
                         </div>
                         <h3 className="text-2xl font-bold text-gray-900">{department.departmentName}</h3>
                         <div className="mt-2 flex items-center justify-center gap-2">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${department.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                 {department.isActive ? 'Active' : 'Inactive'}
                             </span>
                         </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-blue-50 p-4 rounded-xl">
                             <p className="text-sm text-blue-600 font-medium mb-1">Total Staff</p>
                             <p className="text-2xl font-bold text-gray-900">{department._count?.staff || 0}</p>
                         </div>
                         <div className="bg-purple-50 p-4 rounded-xl">
                             <p className="text-sm text-purple-600 font-medium mb-1">Status</p>
                             <p className="text-lg font-semibold text-gray-900">{department.isActive ? 'Operational' : 'Disabled'}</p>
                         </div>
                     </div>
                 </div>
            ) : (
                <form id="dept-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Department Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                required
                                type="text"
                                autoFocus
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Human Resources"
                                value={formData.departmentName}
                                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                            />
                        </div>
                        <p className="text-xs text-gray-500">Must be unique across the organization.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Initial Status</label>
                        <div className="flex items-center gap-4 py-2 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={formData.isActive} 
                                    onChange={() => setFormData({ ...formData, isActive: true })}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-900 font-medium">Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="status" 
                                    checked={!formData.isActive} 
                                    onChange={() => setFormData({ ...formData, isActive: false })}
                                    className="text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-gray-900 font-medium">Inactive</span>
                            </label>
                        </div>
                    </div>
                </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
             {isView ? (
                 <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Close
                </button>
             ) : (
                <>
                    <button
                        onClick={onClose}
                        type="button"
                        disabled={loading}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        form="dept-form"
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Department'
                        )}
                    </button>
                </>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
