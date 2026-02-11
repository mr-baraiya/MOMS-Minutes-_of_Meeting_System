'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface FilterState {
	search: string;
	meetingTypeId: string;
	departmentId: string;
	status: string;
}

interface CalendarFiltersProps {
	filters: FilterState;
	onFilterChange: (filters: FilterState) => void;
	onReset: () => void;
}

export default function CalendarFilters({ filters, onFilterChange, onReset }: CalendarFiltersProps) {
	const [meetingTypes, setMeetingTypes] = useState<any[]>([]);
	const [departments, setDepartments] = useState<any[]>([]);

	useEffect(() => {
		fetchMeetingTypes();
		fetchDepartments();
	}, []);

	const fetchMeetingTypes = async () => {
		try {
			const response = await fetch('/api/meeting-types');
			const result = await response.json();
			if (result.success) {
				setMeetingTypes(result.data || []);
			}
		} catch (error) {
			console.error('Failed to fetch meeting types:', error);
		}
	};

	const fetchDepartments = async () => {
		try {
			const response = await fetch('/api/departments');
			const result = await response.json();
			if (result.success) {
				setDepartments(result.data || []);
			}
		} catch (error) {
			console.error('Failed to fetch departments:', error);
		}
	};

	const handleChange = (key: keyof FilterState, value: string) => {
		onFilterChange({ ...filters, [key]: value });
	};

	const hasActiveFilters = filters.search || filters.meetingTypeId || filters.departmentId || filters.status !== 'upcoming';

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
			<div className="flex items-center gap-3 flex-wrap">
				{/* Search */}
				<div className="relative flex-1 min-w-[200px]">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						type="text"
						placeholder="Search meetings..."
						value={filters.search}
						onChange={(e) => handleChange('search', e.target.value)}
						className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>

				{/* Meeting Type */}
				<select
					value={filters.meetingTypeId}
					onChange={(e) => handleChange('meetingTypeId', e.target.value)}
					className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
				>
					<option value="">All Meeting Types</option>
					{meetingTypes.map((type) => (
						<option key={type.id} value={type.id}>
							{type.meetingTypeName}
						</option>
					))}
				</select>

				{/* Department */}
				<select
					value={filters.departmentId}
					onChange={(e) => handleChange('departmentId', e.target.value)}
					className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
				>
					<option value="">All Departments</option>
					{departments.map((dept) => (
						<option key={dept.id} value={dept.id}>
							{dept.departmentName}
						</option>
					))}
				</select>

				{/* Status */}
				<select
					value={filters.status}
					onChange={(e) => handleChange('status', e.target.value)}
					className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
				>
					<option value="all">All Status</option>
					<option value="upcoming">Upcoming</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>

				{/* Reset Button */}
				{hasActiveFilters && (
					<button
						onClick={onReset}
						className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
					>
						<X className="w-4 h-4" />
						Reset
					</button>
				)}
			</div>
		</div>
	);
}
