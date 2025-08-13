'use client';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
    }
  };

  const getChangeSymbol = () => {
    switch (changeType) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      case 'neutral': return '→';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-foreground/60 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`text-sm font-medium ${getChangeColor()}`}>
          {getChangeSymbol()} {change}
        </span>
        <span className="text-foreground/60 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
}

export default function MetricsOverview() {
  const metrics = [
    {
      title: 'Total Conversations',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: '💬'
    },
    {
      title: 'API Calls',
      value: '5,432',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: '🔗'
    },
    {
      title: 'Average Response Time',
      value: '0.95s',
      change: '-15.3%',
      changeType: 'positive' as const,
      icon: '⚡'
    },
    {
      title: 'Total Tokens Used',
      value: '2.1M',
      change: '+23.1%',
      changeType: 'neutral' as const,
      icon: '🎯'
    },
    {
      title: 'Monthly Cost',
      value: '$187.50',
      change: '+18.7%',
      changeType: 'negative' as const,
      icon: '💰'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+0.5%',
      changeType: 'positive' as const,
      icon: '✅'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Usage Metrics</h2>
        <p className="text-foreground/60 mt-1">Overview of your AI model usage and performance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', activity: 'GPT-4 API call completed', status: 'success' },
              { time: '5 minutes ago', activity: 'Gemini 1.5 Pro conversation started', status: 'success' },
              { time: '12 minutes ago', activity: 'Model comparison analysis completed', status: 'success' },
              { time: '1 hour ago', activity: 'API rate limit warning', status: 'warning' },
              { time: '3 hours ago', activity: 'Monthly usage report generated', status: 'info' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-green-500' :
                  item.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.activity}</p>
                  <p className="text-xs text-foreground/60">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}