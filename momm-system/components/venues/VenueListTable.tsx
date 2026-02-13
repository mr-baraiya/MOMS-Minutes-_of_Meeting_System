'use client';

import { Edit, Trash2, Eye, MapPin, Video, Building2 } from 'lucide-react';
import { Venue } from '@/types/models';

interface VenueListTableProps {
  venues: (Venue & { _count?: { meetings: number } })[];
  isLoading: boolean;
  onView: (venue: Venue) => void;
  onEdit: (venue: Venue) => void;
  onDelete: (venue: Venue) => void;
}

export default function VenueListTable({ venues, isLoading, onView, onEdit, onDelete }: VenueListTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No venues found</h3>
        <p className="text-gray-500 mt-1">Get started by creating a new venue.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Venue Info</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {venues.map((venue) => (
              <tr 
                key={venue.id} 
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${venue.venueType === 'PHYSICAL' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {venue.venueType === 'PHYSICAL' ? <Building2 size={20} /> : <Video size={20} />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{venue.venueName}</p>
                      <p className="text-xs text-gray-500">
                        {venue._count?.meetings || 0} meetings hosted
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    venue.venueType === 'PHYSICAL' 
                      ? 'bg-blue-50 text-blue-700 border-blue-100' 
                      : 'bg-purple-50 text-purple-700 border-purple-100'
                  }`}>
                    {venue.venueType === 'PHYSICAL' ? <MapPin size={12} /> : <Video size={12} />}
                    {venue.venueType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs truncate text-sm text-gray-600">
                    {venue.location || <span className="text-gray-400 italic">Not specified</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    venue.isActive 
                      ? 'bg-green-50 text-green-700 border border-green-100' 
                      : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {venue.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onView(venue)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => onEdit(venue)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Venue"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(venue)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        venue.isActive 
                          ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                          : 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700'
                      }`}
                      title={venue.isActive ? "Deactivate Venue" : "Permanently Delete"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
