"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MeetingWithCount } from "@/types/models";
import StaffMeetingsView from "./StaffMeetingsView";
import ConvenerMeetingsView from "./ConvenerMeetingsView";

interface MeetingsContainerProps {
  role: "admin" | "convener" | "staff";
}

export default function MeetingsContainer({ role }: MeetingsContainerProps) {
  const { token, user, loading: authLoading } = useAuth();
  const [meetings, setMeetings] = useState<MeetingWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingWithCount | null>(null);

  useEffect(() => {
    if (authLoading) return;
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Staff and convener only see current month's meetings
      if (role === "staff" || role === "convener") {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        params.set("startDate", startOfMonth.toISOString().split("T")[0]);
        params.set("endDate", endOfMonth.toISOString().split("T")[0]);
        params.set("limit", "100"); // fetch all this month's meetings at once
      }

      const url = `/api/meetings${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const result = await response.json();

      if (result.success) {
        const list = result.data?.data || result.data || [];
        setMeetings(list);
      } else {
        setError(result.error || "Failed to load meetings");
      }
    } catch (err) {
      console.error("Failed to load meetings", err);
      setError("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && meetings.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
        {error}
      </div>
    );
  }

  if (role === "staff") {
    return (
      <StaffMeetingsView
        meetings={meetings}
        loading={loading}
        onRefresh={fetchMeetings}
        onSelect={(meeting: MeetingWithCount) => setSelectedMeeting(meeting)}
        selectedMeeting={selectedMeeting}
        onCloseDetail={() => setSelectedMeeting(null)}
        userName={user?.staff?.name || user?.username || ""}
      />
    );
  }

  if (role === "convener") {
    return (
      <ConvenerMeetingsView
        meetings={meetings}
        loading={loading}
        onRefresh={fetchMeetings}
        onSelect={(meeting: MeetingWithCount) => setSelectedMeeting(meeting)}
        selectedMeeting={selectedMeeting}
        onCloseDetail={() => setSelectedMeeting(null)}
      />
    );
  }

  // Fallback for admin (not wired to existing admin page yet)
  return (
    <ConvenerMeetingsView
      meetings={meetings}
      loading={loading}
      onRefresh={fetchMeetings}
      onSelect={(meeting: MeetingWithCount) => setSelectedMeeting(meeting)}
      selectedMeeting={selectedMeeting}
      onCloseDetail={() => setSelectedMeeting(null)}
    />
  );
}
