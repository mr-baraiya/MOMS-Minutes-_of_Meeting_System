"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader2, AlertCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import DocumentTable from "@/components/documents/DocumentTable";
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

interface Department {
  id: number;
  departmentName: string;
}

export default function AdminDocumentsPage() {
  const { user, loading: authLoading } = useAuthGuard({ allowedRoles: ['admin'] });
  const [documents, setDocuments] = useState<DocumentWithMeetingInfo[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
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
    fetchDepartments();
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
      if (filters.departmentId) queryParams.append("departmentId", filters.departmentId.toString());
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
      const response = await fetch("/api/meetings");
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings || []);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
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

  const handleBulkDelete = async (ids: number[]) => {
    setConfirmConfig({
      title: "Delete Multiple Documents",
      message: `Are you sure you want to delete ${ids.length} document(s)? This action cannot be undone.`,
      onConfirm: async () => {
        setIsConfirmOpen(false);
        await performBulkDelete(ids);
      },
    });
    setIsConfirmOpen(true);
  };

  const performBulkDelete = async (ids: number[]) => {
    try {
      const response = await fetch("/api/documents/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentIds: ids }),
      });

      if (response.ok) {
        toast.success("Documents deleted successfully");
        fetchDocuments();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete documents");
      }
    } catch (error) {
      console.error("Error bulk deleting documents:", error);
      toast.error("Failed to delete documents");
    }
  };

  if (authLoading || !user) {
    return (
      <DashboardLayout role="admin">
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
    <DashboardLayout role="admin">
      <Toaster position="top-right" />
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-600 mt-1">
                  All meeting documents across the system
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
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
            departments={departments}
            showDepartmentFilter={true}
            showDateFilter={true}
          />
        </motion.div>

        {/* Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 flex items-center justify-center">
              <div
                style={{ animation: 'spin 1s linear infinite' }}
                className="h-12 w-12 border-4 border-slate-200 border-t-blue-700"
              />
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-500 mb-4">
                {Object.keys(filters).length > 0
                  ? "No documents match your current filters."
                  : "Upload your first document to get started."}
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Document
              </motion.button>
            </div>
          ) : (
            <DocumentTable
              documents={documents}
              onPreview={handlePreview}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              showBulkActions={true}
            />
          )}
        </motion.div>

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
