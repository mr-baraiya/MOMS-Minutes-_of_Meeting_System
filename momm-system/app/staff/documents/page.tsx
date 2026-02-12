"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, BookOpen, Download, Eye } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import DocumentCard from "@/components/documents/DocumentCard";
import PreviewDrawer from "@/components/documents/PreviewDrawer";
import DocumentFilters from "@/components/documents/DocumentFilters";
import { DocumentWithMeetingInfo } from "@/types/models";

interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
}

export default function StaffDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithMeetingInfo[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithMeetingInfo | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchDocuments();
    fetchMeetingsForFilters();
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

  const fetchMeetingsForFilters = async () => {
    try {
      // Get unique meetings from documents for filter dropdown
      const response = await fetch("/api/documents");
      if (response.ok) {
        const data = await response.json();
        const uniqueMeetings = Array.from(
          new Map(
            data.documents.map((doc: DocumentWithMeetingInfo) => [
              doc.meeting.id,
              {
                id: doc.meeting.id,
                meetingTitle: doc.meeting.meetingTitle,
                meetingDate: doc.meeting.meetingDate,
              },
            ])
          ).values()
        ) as Meeting[];
        setMeetings(uniqueMeetings);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  const handlePreview = (document: DocumentWithMeetingInfo) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDownloadAll = () => {
    documents.forEach((doc) => {
      const link = window.document.createElement("a");
      link.href = doc.filePath;
      link.download = doc.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    });
    toast.success(`Downloading ${documents.length} document(s)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <BookOpen className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meeting Documents</h1>
                <p className="text-gray-600 mt-1">
                  Minutes of meetings you attended
                </p>
              </div>
            </div>
            {documents.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadAll}
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Download className="w-5 h-5" />
                Download All
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Access Your Meeting Records</h3>
              <p className="text-blue-100 text-sm">
                View and download minutes from all meetings you've been part of. Stay informed and keep track of decisions and action items.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Available Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Meetings Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Read-Only Access</p>
                <p className="text-lg font-semibold text-gray-900">View & Download</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
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
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-16 border border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-sm p-16 border border-gray-200 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No documents available
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {Object.keys(filters).length > 0
                  ? "No documents match your search criteria. Try adjusting your filters."
                  : "You don't have access to any meeting documents yet. Documents will appear here once you're added to a meeting."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map((document, index) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onPreview={handlePreview}
                  showActions={true}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Help Section */}
        {!loading && documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Click on any document card to preview it. You can download documents for offline access.
                </p>
                <p className="text-xs text-gray-500">
                  💡 <strong>Tip:</strong> Use the search and filters to quickly find specific meeting documents.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Preview Drawer */}
      <PreviewDrawer
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        canDelete={false}
      />
    </div>
  );
}
