'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Briefcase, Building2, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Staff {
  id?: number;
  staffName: string;
  emailAddress: string;
  designation: string;
  mobileNo: string;
  departmentId: number | string;
  isActive: boolean;
  department?: {
      departmentName: string;
  };
  user?: {
      profilePicture?: string;
  }
}

interface StaffModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  staff: Staff | null;
  departments: { id: number; departmentName: string }[];
  onClose: () => void;
  onSubmit: (data: Partial<Staff>) => Promise<void>;
}

export default function StaffModal({ isOpen, mode, staff, departments, onClose, onSubmit }: StaffModalProps) {
  const [formData, setFormData] = useState<Partial<Staff>>({
    staffName: '',
    emailAddress: '',
    designation: '',
    mobileNo: '',
    departmentId: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff && (mode === 'edit' || mode === 'view')) {
      setFormData({
        staffName: staff.staffName,
        emailAddress: staff.emailAddress,
        designation: staff.designation || '',
        mobileNo: staff.mobileNo || '',
        departmentId: staff.departmentId || '',
        isActive: staff.isActive,
      });
    } else {
      setFormData({
        staffName: '',
        emailAddress: '',
        designation: '',
        mobileNo: '',
        departmentId: '',
        isActive: true,
      });
    }
  }, [staff, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isView = mode === 'view';
  const title = mode === 'add' ? 'Add New Staff' : mode === 'edit' ? 'Edit Staff Details' : 'Staff Profile';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
             {isView && staff ? (
                 <div className="space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white shadow-lg">
                            {staff.staffName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{staff.staffName}</h3>
                            <p className="text-gray-500">{staff.designation}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {staff.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {staff.department?.departmentName || 'No Department'}
                                </span>
                            </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Information</h4>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span>{staff.emailAddress}</span>
                            </div>
                             <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span>{staff.mobileNo || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">System Stats</h4>
                             <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span>Joined: {new Date().toLocaleDateString()}</span> {/* Mock date */}
                            </div>
                             <div className="flex items-center gap-3 text-gray-600">
                                <FileText className="w-5 h-5 text-gray-400" />
                                <span>Reports Generated: 12</span> {/* Mock data */}
                            </div>
                        </div>
                     </div>
                 </div>
             ) : (
                <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.staffName}
                                    onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    required
                                    type="email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formData.emailAddress}
                                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                />
                            </div>
                        </div>
                        {mode === 'add' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Username <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            required
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="johndoe"
                                            // @ts-ignore
                                            value={formData.username || ''}
                                            // @ts-ignore
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center font-mono">**</div>
                                        <input
                                            required
                                            type="password"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="••••••••"
                                            // @ts-ignore
                                            value={formData.password || ''}
                                            // @ts-ignore
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Designation</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Software Engineer"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                    value={formData.mobileNo}
                                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                                    value={formData.departmentId}
                                    onChange={(e) => setFormData({ ...formData, departmentId: parseInt(e.target.value) })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.departmentName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <div className="flex items-center gap-4 py-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        checked={formData.isActive} 
                                        onChange={() => setFormData({ ...formData, isActive: true })}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        checked={!formData.isActive} 
                                        onChange={() => setFormData({ ...formData, isActive: false })}
                                        className="text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-sm text-gray-700">Inactive</span>
                                </label>
                            </div>
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
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="staff-form"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Staff'
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
