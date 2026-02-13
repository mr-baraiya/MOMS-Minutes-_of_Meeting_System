'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const bgColors = {
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
  };

  const textColors = {
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
    warning: 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200',
    info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full flex-shrink-0 ${bgColors[variant]}`}>
                <AlertTriangle className={`w-6 h-6 ${textColors[variant]}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 ${buttonColors[variant]} disabled:opacity-50`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
