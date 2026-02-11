'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	type = 'danger',
}: ConfirmModalProps) {
	if (!isOpen) return null;

	const typeStyles = {
		danger: {
			icon: 'text-red-600',
			confirmButton: 'bg-red-600 hover:bg-red-700',
			iconBg: 'bg-red-100',
		},
		warning: {
			icon: 'text-yellow-600',
			confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
			iconBg: 'bg-yellow-100',
		},
		info: {
			icon: 'text-blue-600',
			confirmButton: 'bg-blue-600 hover:bg-blue-700',
			iconBg: 'bg-blue-100',
		},
	};

	const styles = typeStyles[type];

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 overflow-y-auto">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="fixed inset-0 bg-black bg-opacity-50"
				/>

				{/* Modal */}
				<div className="flex items-center justify-center min-h-screen p-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						onClick={(e) => e.stopPropagation()}
						className="relative bg-white rounded-xl shadow-2xl w-full max-w-md"
					>
						{/* Header */}
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-xl font-bold text-gray-900">{title}</h2>
							<button
								onClick={onClose}
								className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						{/* Content */}
						<div className="px-6 py-6">
							<div className="flex items-start gap-4">
								<div className={`p-3 rounded-full ${styles.iconBg}`}>
									<AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
								</div>
								<div className="flex-1">
									<p className="text-gray-700 leading-relaxed">{message}</p>
								</div>
							</div>
						</div>

						{/* Footer */}
						<div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-xl">
							<button
								onClick={onClose}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								{cancelText}
							</button>
							<button
								onClick={onConfirm}
								className={`px-4 py-2 text-white rounded-lg transition-colors ${styles.confirmButton}`}
							>
								{confirmText}
							</button>
						</div>
					</motion.div>
				</div>
			</div>
		</AnimatePresence>
	);
}