'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Video, MonitorPlay } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Venue, VenueType } from '@/types/models';

interface VenueModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  venue: Venue | null;
  onClose: () => void;
  onSubmit: (data: Partial<Venue>) => Promise<void>;
}

export default function VenueModal({ isOpen, mode, venue, onClose, onSubmit }: VenueModalProps) {
  const [formData, setFormData] = useState<Partial<Venue>>({
    venueName: '',
    venueType: 'PHYSICAL',
    location: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (venue && (mode === 'edit' || mode === 'view')) {
      setFormData({
        venueName: venue.venueName,
        venueType: venue.venueType,
        location: venue.location || '',
        isActive: venue.isActive,
      });
    } else {
      setFormData({
        venueName: '',
        venueType: 'PHYSICAL',
        location: '',
        isActive: true,
      });
    }
  }, [venue, mode, isOpen]);

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

  const title = mode === 'add' ? 'Add New Venue' : mode === 'edit' ? 'Edit Venue' : 'Venue Details';
  const isView = mode === 'view';
  const isPhysical = formData.venueType === 'PHYSICAL';

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
                <div className={`p-2 rounded-lg ${isPhysical ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {isPhysical ? <MapPin className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
             </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isView && venue ? (
                 <div className="space-y-6">
                     <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                         <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 shadow-inner ${venue.venueType === 'PHYSICAL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                             {venue.venueType === 'PHYSICAL' ? <Building2 size={32} /> : <MonitorPlay size={32} />}
                         </div>
                         <h3 className="text-2xl font-bold text-gray-900">{venue.venueName}</h3>
                         <p className="text-gray-500 text-sm mt-1">{venue.location || 'No location specified'}</p>
                         <div className="mt-3 flex items-center justify-center gap-2">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${venue.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                 {venue.isActive ? 'Active' : 'Inactive'}
                             </span>
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                 {venue.venueType}
                             </span>
                         </div>
                     </div>
                 </div>
            ) : (
                <form id="venue-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                             <label className="text-sm font-medium text-gray-700">Venue Type</label>
                             <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                                 <button
                                     type="button"
                                     onClick={() => setFormData({ ...formData, venueType: 'PHYSICAL' })}
                                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${isPhysical ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                                 >
                                     <MapPin className="w-4 h-4" /> Physical
                                 </button>
                                 <button
                                     type="button"
                                     onClick={() => setFormData({ ...formData, venueType: 'VIRTUAL' })}
                                     className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${!isPhysical ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
                                 >
                                     <Video className="w-4 h-4" /> Virtual
                                 </button>
                             </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-gray-700">Venue Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    required
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder={isPhysical ? "e.g. Conference Room A" : "e.g. Zoom Meeting Room 1"}
                                    value={formData.venueName}
                                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-gray-700">{isPhysical ? "Location / Address" : "Meeting Link / Platform Info"}</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder={isPhysical ? "e.g. Building 2, Floor 3" : "e.g. https://zoom.us/j/..."}
                                    value={formData.location || ''}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                                <span className="text-sm text-gray-700 font-medium">Active Venue</span>
                            </label>
                        </div>
                    </div>
                </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            {!isView && (
              <button
                form="venue-form"
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        Saving...
                    </>
                ) : (
                    <>Save Venue</>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
