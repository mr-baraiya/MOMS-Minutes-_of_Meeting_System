'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { MeetingWithRelations } from '@/types/models';

interface NewMeetingModalProps {
	onClose: () => void;
	onSuccess: () => void;
	editMeeting?: MeetingWithRelations;
}

interface FormData {
	meetingTitle: string;
	description: string;
	meetingTypeId: string;
	meetingDate: string;
	meetingStartTime: string;
	meetingEndTime: string;
	venueId: string;
	meetingLink: string;
	organizerStaffId: string;
	selectedStaff: number[];
}

export default function NewMeetingModal({ onClose, onSuccess, editMeeting }: NewMeetingModalProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
	const [venues, setVenues] = useState<any[]>([]);
	const [staff, setStaff] = useState<any[]>([]);
	
	const [formData, setFormData] = useState<FormData>({
		meetingTitle: '',
		description: '',
		meetingTypeId: '',
		meetingDate: '',
		meetingStartTime: '',
		meetingEndTime: '',
		venueId: '',
		meetingLink: '',
		organizerStaffId: '',
		selectedStaff: [],
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		fetchDropdownData();
		
		// Pre-populate form if editing
		if (editMeeting) {
			const meetingDate = new Date(editMeeting.meetingDate);
			const startTime = new Date(editMeeting.meetingStartTime);
			const endTime = new Date(editMeeting.meetingEndTime);
			
			// Format time as HH:MM
			const formatTime = (date: Date) => {
				return date.toLocaleTimeString('en-GB', { 
					hour: '2-digit', 
					minute: '2-digit',
					hour12: false 
				});
			};
			
			setFormData({
				meetingTitle: editMeeting.meetingTitle,
				description: editMeeting.meetingDescription || '',
				meetingTypeId: editMeeting.meetingTypeId?.toString() || '',
				meetingDate: meetingDate.toISOString().split('T')[0],
				meetingStartTime: formatTime(startTime),
				meetingEndTime: formatTime(endTime),
				venueId: editMeeting.venueId?.toString() || '',
				meetingLink: editMeeting.meetingLink || '',
				organizerStaffId: editMeeting.organizerStaffId?.toString() || '',
				selectedStaff: editMeeting.meetingMembers?.map(m => m.staffId) || [],
			});
		}
	}, [editMeeting]);

	const fetchDropdownData = async () => {
		try {
			const [typesRes, venuesRes, staffRes] = await Promise.all([
				fetch('/api/meeting-types'),
				fetch('/api/venues'),
				fetch('/api/staff'),
			]);

			const types = await typesRes.json();
			const venues = await venuesRes.json();
			const staff = await staffRes.json();

			if (types.success) setMeetingTypes(types.data.data || types.data);
			if (venues.success) setVenues(venues.data.data || venues.data);
			if (staff.success) setStaff(staff.data.data || staff.data);
		} catch (error) {
			console.error('Failed to fetch dropdown data:', error);
		}
	};

	const validateStep = (step: number): boolean => {
		const newErrors: { [key: string]: string } = {};

		if (step === 1) {
			if (!formData.meetingTitle) newErrors.meetingTitle = 'Meeting title is required';
			if (!formData.meetingTypeId) newErrors.meetingTypeId = 'Meeting type is required';
			if (!formData.meetingDate) newErrors.meetingDate = 'Date is required';
			if (!formData.meetingStartTime) newErrors.meetingStartTime = 'Start time is required';
			if (!formData.meetingEndTime) newErrors.meetingEndTime = 'End time is required';
		}

		if (step === 2) {
			if (!formData.venueId) newErrors.venueId = 'Venue is required';
			if (!formData.organizerStaffId) newErrors.organizerStaffId = 'Organizer is required';
		}

		if (step === 3) {
			if (formData.selectedStaff.length === 0) newErrors.selectedStaff = 'Select at least one participant';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateStep(currentStep)) {
			setCurrentStep((prev) => Math.min(prev + 1, 4));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleSubmit = async () => {
		if (!validateStep(3)) return;

		setLoading(true);
		try {
			// Combine date and time to create proper DateTime objects
			const startDateTime = new Date(`${formData.meetingDate}T${formData.meetingStartTime}`);
			const endDateTime = new Date(`${formData.meetingDate}T${formData.meetingEndTime}`);

			const payload = {
				meetingTitle: formData.meetingTitle,
				meetingDescription: formData.description || undefined,
				meetingDate: formData.meetingDate,
				meetingStartTime: startDateTime.toISOString(),
				meetingEndTime: endDateTime.toISOString(),
				meetingTypeId: parseInt(formData.meetingTypeId),
				venueId: parseInt(formData.venueId),
				organizerStaffId: parseInt(formData.organizerStaffId),
				meetingLink: formData.meetingLink || undefined,
				memberIds: formData.selectedStaff,
			};

			const url = editMeeting ? `/api/meetings/${editMeeting.id}` : '/api/meetings';
			const method = editMeeting ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				onSuccess();
				onClose();
			} else {
				setErrors({ submit: result.error || `Failed to ${editMeeting ? 'update' : 'create'} meeting` });
			}
		} catch (error) {
			console.error(`Failed to ${editMeeting ? 'update' : 'create'} meeting:`, error);
			setErrors({ submit: `An error occurred while ${editMeeting ? 'updating' : 'creating'} the meeting` });
		} finally {
			setLoading(false);
		}
	};

	const steps = ['Basic Details', 'Location & Organizer', 'Participants', 'Confirmation'];

	const toggleStaff = (staffId: number) => {
		setFormData((prev) => ({
			...prev,
			selectedStaff: prev.selectedStaff.includes(staffId)
				? prev.selectedStaff.filter((id) => id !== staffId)
				: [...prev.selectedStaff, staffId],
		}));
	};

	const handleSelectAll = () => {
		if (formData.selectedStaff.length === staff.length) {
			// Deselect all
			setFormData((prev) => ({ ...prev, selectedStaff: [] }));
		} else {
			// Select all
			setFormData((prev) => ({ ...prev, selectedStaff: staff.map((s) => s.id) }));
		}
	};

	return (
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
					className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
				>
						{/* Header */}
						<div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
							<h2 className="text-2xl font-bold text-gray-900">
								{editMeeting ? 'Edit Meeting' : 'Create New Meeting'}
							</h2>
							<button
								onClick={onClose}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						{/* Stepper */}
						<div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
							<div className="flex items-center justify-between">
								{steps.map((step, index) => {
									const stepNumber = index + 1;
									const isActive = currentStep === stepNumber;
									const isCompleted = currentStep > stepNumber;

									return (
										<div key={step} className="flex items-center flex-1">
											<div className="flex items-center flex-1">
												<div
													className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
														isCompleted
															? 'bg-green-500 border-green-500 text-white'
															: isActive
															? 'bg-blue-600 border-blue-600 text-white'
															: 'bg-white border-gray-300 text-gray-500'
													}`}
												>
													{isCompleted ? <Check size={20} /> : stepNumber}
												</div>
												<div className="ml-3 flex-1">
													<p
														className={`text-sm font-medium ${
															isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
														}`}
													>
														{step}
													</p>
												</div>
											</div>
											{index < steps.length - 1 && (
												<div
													className={`h-0.5 w-full mx-4 ${
														isCompleted ? 'bg-green-500' : 'bg-gray-300'
													}`}
												/>
											)}
										</div>
									);
								})}
							</div>
						</div>

						{/* Content */}
						<div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
						{currentStep === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="space-y-4"
							>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Meeting Title *
											</label>
											<input
												type="text"
												value={formData.meetingTitle}
												onChange={(e) => setFormData({ ...formData, meetingTitle: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Enter meeting title"
											/>
											{errors.meetingTitle && <p className="text-red-600 text-sm mt-1">{errors.meetingTitle}</p>}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
											<textarea
												value={formData.description}
												onChange={(e) => setFormData({ ...formData, description: e.target.value })}
												rows={3}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="Enter meeting description (optional)"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Meeting Type *
											</label>
											<select
												value={formData.meetingTypeId}
												onChange={(e) => setFormData({ ...formData, meetingTypeId: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="">Select meeting type</option>
												{meetingTypes.map((type) => (
													<option key={type.id} value={type.id}>
														{type.meetingTypeName}
													</option>
												))}
											</select>
											{errors.meetingTypeId && <p className="text-red-600 text-sm mt-1">{errors.meetingTypeId}</p>}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
											<input
												type="date"
												value={formData.meetingDate}
												onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											{errors.meetingDate && <p className="text-red-600 text-sm mt-1">{errors.meetingDate}</p>}
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
												<input
													type="time"
													value={formData.meetingStartTime}
													onChange={(e) => setFormData({ ...formData, meetingStartTime: e.target.value })}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
												{errors.meetingStartTime && (
													<p className="text-red-600 text-sm mt-1">{errors.meetingStartTime}</p>
												)}
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
												<input
													type="time"
													value={formData.meetingEndTime}
													onChange={(e) => setFormData({ ...formData, meetingEndTime: e.target.value })}
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
												{errors.meetingEndTime && (
													<p className="text-red-600 text-sm mt-1">{errors.meetingEndTime}</p>
												)}
											</div>
										</div>
									</motion.div>
								)}

								{currentStep === 2 && (
									<motion.div
										key="step2"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										className="space-y-4"
									>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
											<select
												value={formData.venueId}
												onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="">Select venue</option>
												{venues.map((venue) => (
													<option key={venue.id} value={venue.id}>
														{venue.venueName}
													</option>
												))}
											</select>
											{errors.venueId && <p className="text-red-600 text-sm mt-1">{errors.venueId}</p>}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Meeting Link (Optional)
											</label>
											<input
												type="url"
												value={formData.meetingLink}
												onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												placeholder="https://meet.example.com/meeting-id"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Organizer *</label>
											<select
												value={formData.organizerStaffId}
												onChange={(e) => setFormData({ ...formData, organizerStaffId: e.target.value })}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="">Select organizer</option>
												{staff.map((s) => (
													<option key={s.id} value={s.id}>
														{s.staffName} - {s.emailAddress}
													</option>
												))}
											</select>
											{errors.organizerStaffId && (
												<p className="text-red-600 text-sm mt-1">{errors.organizerStaffId}</p>
											)}
										</div>
									</motion.div>
								)}

								{currentStep === 3 && (
									<motion.div
										key="step3"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										className="space-y-4"
									>
										<div>
											<div className="flex items-center justify-between mb-2">
												<label className="block text-sm font-medium text-gray-700">
													Select Participants * ({formData.selectedStaff.length} selected)
												</label>
												<button
													type="button"
													onClick={handleSelectAll}
													className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
												>
													{formData.selectedStaff.length === staff.length ? 'Deselect All' : 'Select All'}
												</button>
											</div>
											<div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2">
												{staff.map((s) => (
													<label
														key={s.id}
														className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
													>
														<input
															type="checkbox"
															checked={formData.selectedStaff.includes(s.id)}
															onChange={() => toggleStaff(s.id)}
															className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
														/>
														<div>
															<p className="font-medium text-gray-900">{s.staffName}</p>
															<p className="text-sm text-gray-600">{s.emailAddress}</p>
														</div>
													</label>
												))}
											</div>
											{errors.selectedStaff && <p className="text-red-600 text-sm mt-1">{errors.selectedStaff}</p>}
										</div>
									</motion.div>
								)}

								{currentStep === 4 && (
									<motion.div
										key="step4"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										className="space-y-4"
									>
										<div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
											<Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
											<h3 className="text-xl font-bold text-gray-900 mb-2">Review Meeting Details</h3>
											<p className="text-gray-600">Please review the information before creating the meeting</p>
										</div>

										<div className="bg-gray-50 rounded-lg p-6 space-y-4">
											<div>
												<p className="text-sm text-gray-600">Meeting Title</p>
												<p className="text-lg font-semibold text-gray-900">{formData.meetingTitle}</p>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div>
													<p className="text-sm text-gray-600">Date</p>
													<p className="font-medium text-gray-900">{formData.meetingDate}</p>
												</div>
												<div>
													<p className="text-sm text-gray-600">Time</p>
													<p className="font-medium text-gray-900">
														{formData.meetingStartTime} - {formData.meetingEndTime}
													</p>
												</div>
												<div>
													<p className="text-sm text-gray-600">Venue</p>
													<p className="font-medium text-gray-900">
														{venues.find((v) => v.id === parseInt(formData.venueId))?.venueName || 'N/A'}
													</p>
												</div>
												<div>
													<p className="text-sm text-gray-600">Participants</p>
													<p className="font-medium text-gray-900">{formData.selectedStaff.length} people</p>
												</div>
											</div>
										</div>

										{errors.submit && (
											<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
												{errors.submit}
											</div>
										)}
									</motion.div>
								)}
							</div>

							{/* Footer */}
						<div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
							<button
								onClick={handlePrevious}
								disabled={currentStep === 1}
								className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft size={20} />
								Previous
							</button>

							<div className="flex gap-3">
								<button
									onClick={onClose}
									className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								{currentStep < 4 ? (
									<button
										onClick={handleNext}
										className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										Next
										<ChevronRight size={20} />
									</button>
								) : (
									<button
										onClick={handleSubmit}
										disabled={loading}
										className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{loading ? 'Creating...' : 'Create Meeting'}
									</button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
	);
}
