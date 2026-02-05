interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  venue: string;
  participantsCount?: number;
}

interface UpcomingMeetingsProps {
  meetings: Meeting[];
}

export default function UpcomingMeetings({ meetings }: UpcomingMeetingsProps) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No upcoming meetings</p>
      </div>
    );
  }

  const getDaysUntil = (dateString: string) => {
    const meetingDate = new Date(dateString);
    const today = new Date();
    const diffTime = meetingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `in ${diffDays} days`;
  };

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><span className="inline-block w-4 text-center mr-2">▢</span>{meeting.date} • {meeting.time}</p>
                <p><span className="inline-block w-4 text-center mr-2">⌘</span>{meeting.venue || 'N/A'}</p>
                <p><span className="inline-block w-4 text-center mr-2">◦</span>{meeting.type}</p>
                {meeting.participantsCount && (
                  <p><span className="inline-block w-4 text-center mr-2">∘</span>{meeting.participantsCount} participants</p>
                )}
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold">
              {getDaysUntil(meeting.date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
