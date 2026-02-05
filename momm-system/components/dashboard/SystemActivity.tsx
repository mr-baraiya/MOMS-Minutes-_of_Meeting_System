interface Activity {
  id: number;
  action: string;
  user: string;
  timestamp: string;
  type: 'meeting' | 'user' | 'document' | 'system';
}

interface SystemActivityProps {
  activities: Activity[];
}

export default function SystemActivity({ activities }: SystemActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return '📅';
      case 'user':
        return '👤';
      case 'document':
        return '📄';
      case 'system':
        return '⚙️';
      default:
        return '•';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="text-2xl">{getActivityIcon(activity.type)}</div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.action}</p>
            <p className="text-xs text-gray-500 mt-1">
              by {activity.user} • {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
