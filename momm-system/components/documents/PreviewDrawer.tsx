"use client";

import { DocumentWithMeetingInfo } from "@/types/models";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Calendar, User, Building2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";

interface PreviewDrawerProps {
  document: DocumentWithMeetingInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (document: DocumentWithMeetingInfo) => void;
  canDelete?: boolean;
}

export default function PreviewDrawer({
  document,
  isOpen,
  onClose,
  onDelete,
  canDelete = false,
}: PreviewDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "unset";
    }
    return () => {
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDownload = () => {
    if (!document) return;
    
    // For Vercel Blob URLs, open directly or trigger download
    const link = window.document.createElement("a");
    link.href = document.filePath;
    link.download = document.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleDelete = () => {
    if (document && onDelete) {
      onDelete(document);
      onClose();
    }
  };

  if (!document) return null;

  const isPDF = document.fileName.toLowerCase().endsWith(".pdf");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Document Preview
                  </h2>
                  <p className="text-sm text-gray-500">
                    {document.fileName}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Document Info */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {document.documentTitle}
                </h3>

                <div className="grid gap-4">
                  {/* Meeting Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Meeting</p>
                      <p className="text-sm text-gray-900">
                        {document.meeting.meetingTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(document.meeting.meetingDate), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Uploaded By */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Uploaded By</p>
                      <p className="text-sm text-gray-900">
                        {document.uploader.staff?.staffName ||
                          document.uploader.username}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(document.uploadedAt), "MMMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                  </div>

                  {/* Department */}
                  {document.uploader.staff?.department && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Department</p>
                        <p className="text-sm text-gray-900">
                          {document.uploader.staff.department.departmentName}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PDF Preview */}
              {isPDF && (
                <div className="p-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <iframe
                      src={document.filePath}
                      className="w-full h-[600px]"
                      title="Document Preview"
                    />
                  </div>
                </div>
              )}

              {/* Non-PDF message */}
              {!isPDF && (
                <div className="p-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Preview not available
                    </p>
                    <p className="text-sm text-blue-700">
                      This file type cannot be previewed. Download to view.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
                {canDelete && onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
