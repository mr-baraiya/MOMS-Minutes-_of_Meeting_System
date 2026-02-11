"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Eye, FileText } from "lucide-react";
import { MeetingWithCount } from "@/types/models";
import MeetingDetailDrawer from "./MeetingDetailDrawer";
import MeetingsCardView from "./MeetingsCardView";

interface ConvenerMeetingsViewProps {
  meetings: MeetingWithCount[];
  loading: boolean;
  onRefresh: () => void;
  onSelect: (meeting: MeetingWithCount) => void;
  selectedMeeting: MeetingWithCount | null;
  onCloseDetail: () => void;
}

export default function ConvenerMeetingsView({
  meetings,
  loading,
  onRefresh,
  onSelect,
  selectedMeeting,
  onCloseDetail,
}: ConvenerMeetingsViewProps) {
  const [view, setView] = useState<"card" | "table">("card");

  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500">{meeting.meetingType?.meetingTypeName || "Meeting"}</p>
              <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                {meeting.meetingTitle}
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                meeting.isCancelled
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {meeting.isCancelled ? "Cancelled" : "Scheduled"}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(meeting.meetingDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {new Date(meeting.meetingStartTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {" - "}
                {new Date(meeting.meetingEndTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{meeting.venue?.venueName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{meeting._count?.meetingMembers || 0} participants</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onSelect(meeting)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="w-4 h-4" /> View Details
            </button>
            <a
              href={`/api/meetings/${meeting.id}/documents`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4" /> Documents
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Meetings</h1>
          <p className="text-gray-600">Meetings you organize.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => setView(view === "card" ? "table" : "card")}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {view === "card" ? "Table View" : "Card View"}
          </button>
        </div>
      </div>

      {loading && meetings.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : meetings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-10 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No meetings found</h3>
          <p className="text-gray-600">Create a meeting to get started.</p>
        </div>
      ) : view === "card" ? (
        renderCards()
      ) : (
        <MeetingsCardView
          meetings={meetings}
          loading={loading}
          onViewMeeting={onSelect}
          onEditMeeting={onSelect}
        />
      )}

      {selectedMeeting && (
        <MeetingDetailDrawer
          meeting={selectedMeeting}
          onClose={onCloseDetail}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
}
