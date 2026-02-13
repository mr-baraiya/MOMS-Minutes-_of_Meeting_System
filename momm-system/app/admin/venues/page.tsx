'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Venue } from '@/types/models';
import VenueListTable from '@/components/venues/VenueListTable';
import VenueModal from '@/components/venues/VenueModal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function VenuesPage() {
  const [venues, setVenues] = useState<(Venue & { _count?: { meetings: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  // Confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Venue | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch venues
  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/venues?includeInactive=true');
      const data = await response.json();
      
      if (data.success) {
        setVenues(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch venues');
      }
    } catch (error) {
      toast.error('An error occurred while fetching venues');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // Filter venues
  const filteredVenues = venues.filter(venue => 
    venue.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAdd = () => {
    setModalMode('add');
    setSelectedVenue(null);
    setIsModalOpen(true);
  };

  const handleEdit = (venue: Venue) => {
    setModalMode('edit');
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleView = (venue: Venue) => {
    setModalMode('view');
    setSelectedVenue(venue);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (venue: Venue) => {
    setItemToDelete(venue);
    setConfirmOpen(true);
  };

  const handleSubmit = async (formData: Partial<Venue>) => {
    try {
      let response;
      
      if (modalMode === 'add') {
        response = await fetch('/api/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else if (modalMode === 'edit' && selectedVenue) {
        response = await fetch(`/api/venues/${selectedVenue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || (modalMode === 'add' ? 'Venue created' : 'Venue updated'));
        setIsModalOpen(false);
        fetchVenues();
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
        ? `/api/venues/${itemToDelete.id}`
        : `/api/venues/${itemToDelete.id}?hardDelete=true`;

      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      const data = await response.json();

      if (data.success) {
        toast.success(itemToDelete.isActive ? 'Venue deactivated successfully' : 'Venue permanently deleted');
        setConfirmOpen(false);
        fetchVenues();
      } else {
        toast.error(data.message || 'Failed to delete venue');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout role="admin">
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Venue Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical locations and virtual meeting platforms.</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Add New Venue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table */}
      <VenueListTable 
        venues={filteredVenues}
        isLoading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* View/Edit/Add Modal */}
      <VenueModal 
        isOpen={isModalOpen}
        mode={modalMode}
        venue={selectedVenue}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title={itemToDelete?.isActive ? "Deactivate Venue" : "Permanently Delete Venue"}
        message={itemToDelete?.isActive 
          ? `Are you sure you want to deactivate "${itemToDelete?.venueName}"? It will no longer be available for new meetings.`
          : `Are you sure you want to permanently delete "${itemToDelete?.venueName}"? This action cannot be undone.`
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
