'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Tags, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MeetingType {
  id?: number;
  meetingTypeName: string;
  isActive: boolean;
  _count?: {
    meetings: number;
  };
}

interface MeetingTypeModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  meetingType: MeetingType | null;
  onClose: () => void;
  onSubmit: (data: Partial<MeetingType>) => Promise<void>;
}

export default function MeetingTypeModal({ isOpen, mode, meetingType, onClose, onSubmit }: MeetingTypeModalProps) {
  const [formData, setFormData] = useState<Partial<MeetingType>>({
    meetingTypeName: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meetingType && (mode === 'edit' || mode === 'view')) {
      setFormData({
        meetingTypeName: meetingType.meetingTypeName,
        isActive: meetingType.isActive,
      });
    } else {
      setFormData({
        meetingTypeName: '',
        isActive: true,
      });
    }
  }, [meetingType, mode, isOpen]);

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

  const title = mode === 'add' ? 'Add New Meeting Type' : mode === 'edit' ? 'Edit Meeting Type' : 'Meeting Type Details';
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
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <Tags className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isView && meetingType ? (
              <div className="space-y-6">
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 text-3xl font-bold mb-3 shadow-inner">
                    {meetingType.meetingTypeName.substring(0, 1).toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{meetingType.meetingTypeName}</h3>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meetingType.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {meetingType.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <p className="text-sm text-indigo-600 font-medium mb-1">Total Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{meetingType._count?.meetings || 0}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-600 font-medium mb-1">Status</p>
                    <p className="text-lg font-semibold text-gray-900">{meetingType.isActive ? 'Active' : 'Disabled'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form id="meeting-type-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Meeting Type Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Tags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      required
                      type="text"
                      autoFocus
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Board Meeting, Team Huddle"
                      value={formData.meetingTypeName}
                      onChange={(e) => setFormData({ ...formData, meetingTypeName: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Must be unique across the system.</p>
                </div>

                {mode === 'edit' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center gap-4 py-2 p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="status" 
                          checked={formData.isActive} 
                          onChange={() => setFormData({ ...formData, isActive: true })}
                          className="text-indigo-600 focus:ring-indigo-500"
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
                )}

                {mode === 'add' && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Meeting type will be created as active</p>
                      <p className="text-blue-700">You can change its status later from the list.</p>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          {!isView && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="meeting-type-form"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : mode === 'add' ? 'Create Meeting Type' : 'Save Changes'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
