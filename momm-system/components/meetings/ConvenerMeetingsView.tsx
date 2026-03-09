"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Clock, MapPin, Users, Eye, FileText, Edit, Video } from "lucide-react";
import { MeetingWithCount } from "@/types/models";
import MeetingDetailDrawer from "./MeetingDetailDrawer";
import MeetingsCardView from "./MeetingsCardView";
import NewMeetingModal from "./NewMeetingModal";

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
  const searchParams = useSearchParams();
  const [view, setView] = useState<"card" | "table">("card");
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showEditMeetingModal, setShowEditMeetingModal] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState<MeetingWithCount | null>(null);

  // Check if we should open the create modal from URL
  useEffect(() => {
    const create = searchParams.get('create');
    if (create === '1') {
      setShowNewMeetingModal(true);
    }
  }, [searchParams]);

  const handleEditMeeting = (meeting: MeetingWithCount) => {
    setMeetingToEdit(meeting);
    setShowEditMeetingModal(true);
  };

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
			  <a
			    href={`/convener/meetings/${meeting.id}/attendance`}
				className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
			  >
			    <Users className="w-4 h-4" /> Attendance
			  </a>
              <button
                onClick={() => onSelect(meeting)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Eye className="w-4 h-4" /> View
              </button>
              {!meeting.isCancelled && meeting.meetingLink && (
                <a
                  href={`/meeting/${meeting.id}/join`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Video className="w-4 h-4" /> Join
                </a>
              )}
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
            onClick={() => setShowNewMeetingModal(true)}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Meeting
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
          <p className="text-gray-600 mb-4">Create a meeting to get started.</p>
          <button
            onClick={() => setShowNewMeetingModal(true)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Meeting
          </button>
        </div>
      ) : view === "card" ? (
        renderCards()
      ) : (
        <MeetingsCardView
          meetings={meetings}
          loading={loading}
          onViewMeeting={onSelect}
          onEditMeeting={handleEditMeeting}
        />
      )}

      {selectedMeeting && (
        <MeetingDetailDrawer
          meeting={selectedMeeting}
          onClose={onCloseDetail}
          onRefresh={onRefresh}
          onEdit={handleEditMeeting}
        />
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <NewMeetingModal
          onClose={() => setShowNewMeetingModal(false)}
          onSuccess={() => {
            setShowNewMeetingModal(false);
            onRefresh();
          }}
        />
      )}

      {/* Edit Meeting Modal */}
      {showEditMeetingModal && meetingToEdit && (
        <NewMeetingModal
          onClose={() => {
            setShowEditMeetingModal(false);
            setMeetingToEdit(null);
          }}
          onSuccess={() => {
            setShowEditMeetingModal(false);
            setMeetingToEdit(null);
            onRefresh();
          }}
          editMeeting={meetingToEdit}
        />
      )}
    </div>
  );
}
