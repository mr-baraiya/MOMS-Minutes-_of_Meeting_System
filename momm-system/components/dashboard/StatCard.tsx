interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  iconType?: 'unicode' | 'css';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink';
}

export default function StatCard({ title, value, icon, iconType = 'unicode', trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
  };

  const renderIcon = () => {
    if (iconType === 'css') {
      return (
        <div 
          className={`w-8 h-8 flex items-center justify-center text-xl font-bold`}
          style={{ fontFamily: 'serif' }}
        >
          {icon}
        </div>
      );
    }
    return <span className="text-2xl">{icon}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-transparent hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
              <span>{trend.value}%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} flex items-center justify-center min-w-[56px] min-h-[56px]`}>
          {renderIcon()}
        </div>
      </div>
    </div>
  );
}
