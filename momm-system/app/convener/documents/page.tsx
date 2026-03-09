"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader2, AlertCircle, Folders } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import DocumentCard from "@/components/documents/DocumentCard";
import PreviewDrawer from "@/components/documents/PreviewDrawer";
import UploadModal from "@/components/documents/UploadModal";
import DocumentFilters from "@/components/documents/DocumentFilters";
import ConfirmModal from "@/components/common/ConfirmModal";
import { DocumentWithMeetingInfo } from "@/types/models";

interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
}

export default function ConvenerDocumentsPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['convener'] });
  const [documents, setDocuments] = useState<DocumentWithMeetingInfo[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithMeetingInfo | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  useEffect(() => {
    fetchDocuments();
    fetchMeetings();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.meetingId) queryParams.append("meetingId", filters.meetingId.toString());
      if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);

      const response = await fetch(`/api/documents?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      } else {
        toast.error("Failed to load documents");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await fetch("/api/documents/meetings");
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings || []);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handlePreview = (document: DocumentWithMeetingInfo) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDelete = async (document: DocumentWithMeetingInfo) => {
    setConfirmConfig({
      title: "Delete Document",
      message: `Are you sure you want to delete "${document.documentTitle}"? This action cannot be undone.`,
      onConfirm: async () => {
        setIsConfirmOpen(false);
        await performDelete(document);
      },
    });
    setIsConfirmOpen(true);
  };

  const performDelete = async (document: DocumentWithMeetingInfo) => {
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Document deleted successfully");
        fetchDocuments();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  if (authLoading || !user) {
    return (
      <DashboardLayout role="convener">
        <div className="flex items-center justify-center h-screen">
          <div
            style={{ animation: 'spin 1s linear infinite' }}
            className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="convener">
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 border-2 border-gray-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center border-2 border-blue-800">
                <Folders className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">My Documents</h1>
                <p className="text-gray-600 mt-1">
                  Documents from meetings you manage
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-3 bg-blue-700 text-white hover:bg-blue-800 transition-colors font-medium flex items-center justify-center gap-2 border-2 border-blue-800 uppercase tracking-wide"
            >
              <Upload className="w-5 h-5" />
              Upload MOM
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div className="bg-blue-50 border-2 border-blue-700 p-5 text-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide">Total Documents</p>
                <p className="text-3xl font-bold mt-2">{documents.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center border-2 border-blue-800">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-700 p-5 text-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide">My Meetings</p>
                <p className="text-3xl font-bold mt-2">{meetings.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center border-2 border-blue-800">
                <Folders className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-700 p-5 text-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide">This Month</p>
                <p className="text-3xl font-bold mt-2">
                  {documents.filter((doc) => {
                    const docDate = new Date(doc.uploadedAt);
                    const now = new Date();
                    return (
                      docDate.getMonth() === now.getMonth() &&
                      docDate.getFullYear() === now.getFullYear()
                    );
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-700 text-white flex items-center justify-center border-2 border-blue-800">
                <Upload className="w-6 h-6" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DocumentFilters
            onFilterChange={setFilters}
            meetings={meetings}
            showDepartmentFilter={false}
            showDateFilter={true}
          />
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="bg-white p-12 border-2 border-gray-300 flex items-center justify-center">
              <div
                style={{ animation: 'spin 1s linear infinite' }}
                className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
              />
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {Object.keys(filters).length > 0
                    ? "No documents match your current filters. Try adjusting your search."
                    : "Upload your first meeting document to get started. Keep track of all your meeting minutes in one place."}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUploadOpen(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Your First Document
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document, index) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onPreview={handlePreview}
                  onDelete={handleDelete}
                  showActions={true}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Upload Prompt */}
        {!loading && documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Need to upload more?</h3>
                  <p className="text-sm text-gray-600">
                    Keep your meeting records organized and accessible
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadOpen(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upload Document
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Preview Drawer */}
        <PreviewDrawer
          document={selectedDocument}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDelete={handleDelete}
          canDelete={true}
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={fetchDocuments}
        />

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmConfig?.onConfirm || (() => {})}
          title={confirmConfig?.title || ""}
          message={confirmConfig?.message || ""}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
}
