interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  venue: string;
  status: string;
  convener?: string;
}

interface RecentMeetingsProps {
  meetings: Meeting[];
  role: 'admin' | 'convener' | 'staff';
}

export default function RecentMeetings({ meetings, role }: RecentMeetingsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent meetings</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>📅 {meeting.date} • {meeting.time}</p>
                <p>📍 {typeof meeting.venue === 'string' ? meeting.venue : meeting.venue?.venueName || 'N/A'}</p>
                <p>🏷️ {meeting.type}</p>
                {role === 'admin' && meeting.convener && (
                  <p>👤 Convener: {meeting.convener}</p>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(meeting.status)}`}
            >
              {meeting.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
