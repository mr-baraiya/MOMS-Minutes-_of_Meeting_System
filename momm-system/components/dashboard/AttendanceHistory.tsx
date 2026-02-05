interface AttendanceRecord {
  id: number;
  meetingTitle: string;
  date: string;
  status: 'present' | 'absent' | 'pending';
  meetingType: string;
}

interface AttendanceHistoryProps {
  history: AttendanceRecord[];
}

export default function AttendanceHistory({ history }: AttendanceHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return '✅';
      case 'absent':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '•';
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No attendance history</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((record) => (
        <div
          key={record.id}
          className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{record.meetingTitle}</h4>
              <div className="mt-1 space-y-1 text-xs text-gray-600">
                <p>📅 {record.date}</p>
                <p>🏷️ {record.meetingType}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl mb-1">{getStatusIcon(record.status)}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}
              >
                {record.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
