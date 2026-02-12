"use client";

import { motion } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: number;
  meetingTitle: string;
  meetingDate: Date;
}

interface Department {
  id: number;
  departmentName: string;
}

interface DocumentFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    meetingId?: number;
    departmentId?: number;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  meetings?: Meeting[];
  departments?: Department[];
  showDepartmentFilter?: boolean;
  showDateFilter?: boolean;
}

export default function DocumentFilters({
  onFilterChange,
  meetings = [],
  departments = [],
  showDepartmentFilter = false,
  showDateFilter = false,
}: DocumentFiltersProps) {
  const [search, setSearch] = useState("");
  const [meetingId, setMeetingId] = useState<number | undefined>();
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const handleMeetingChange = (value: string) => {
    const id = value ? Number(value) : undefined;
    setMeetingId(id);
    applyFilters({ meetingId: id });
  };

  const handleDepartmentChange = (value: string) => {
    const id = value ? Number(value) : undefined;
    setDepartmentId(id);
    applyFilters({ departmentId: id });
  };

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    applyFilters({ dateFrom: value });
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    applyFilters({ dateTo: value });
  };

  const applyFilters = (newFilter: any) => {
    onFilterChange({
      search,
      meetingId,
      departmentId,
      dateFrom,
      dateTo,
      ...newFilter,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setMeetingId(undefined);
    setDepartmentId(undefined);
    setDateFrom("");
    setDateTo("");
    onFilterChange({});
  };

  const hasActiveFilters = search || meetingId || departmentId || dateFrom || dateTo;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {(showDepartmentFilter || showDateFilter) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              showAdvanced
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </motion.button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {/* Meeting Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting
            </label>
            <select
              value={meetingId || ""}
              onChange={(e) => handleMeetingChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Meetings</option>
              {meetings.map((meeting) => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.meetingTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          {showDepartmentFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={departmentId || ""}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date From */}
          {showDateFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Date To */}
          {showDateFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearFilters}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && !showAdvanced && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {search && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Search: {search}
            </span>
          )}
          {meetingId && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Meeting Selected
            </span>
          )}
          {departmentId && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Department Selected
            </span>
          )}
          {(dateFrom || dateTo) && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Date Range
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </motion.button>
        </div>
      )}
    </div>
  );
}
