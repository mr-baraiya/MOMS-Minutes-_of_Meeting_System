"use client";

import { DocumentWithMeetingInfo } from "@/types/models";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Trash2, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface DocumentCardProps {
  document: DocumentWithMeetingInfo;
  onPreview: (document: DocumentWithMeetingInfo) => void;
  onDelete?: (document: DocumentWithMeetingInfo) => void;
  showActions?: boolean;
  index?: number;
}

export default function DocumentCard({
  document,
  onPreview,
  onDelete,
  showActions = true,
  index = 0,
}: DocumentCardProps) {
  const handleDownload = () => {
    // For Vercel Blob URLs, open directly
    const link = window.document.createElement("a");
    link.href = document.filePath;
    link.download = document.fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-4"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {document.documentTitle}
          </h3>
          <p className="text-sm text-gray-600 truncate mb-2">
            {document.meeting.meetingTitle}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(document.meeting.meetingDate), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>
                {document.uploader.staff?.staffName || document.uploader.username}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPreview(document)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(document)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
