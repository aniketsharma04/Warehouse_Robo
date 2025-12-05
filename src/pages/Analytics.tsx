import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore } from '@/store/useStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { useMemo } from 'react';

export default function Analytics() {
  const { bots, tasks } = useStore();

  // Bot status distribution
  const statusData = useMemo(() => {
    const counts = {
      idle: bots.filter((b) => b.status === 'idle').length,
      busy: bots.filter((b) => b.status === 'busy').length,
      charging: bots.filter((b) => b.status === 'charging').length,
      error: bots.filter((b) => b.status === 'error').length,
    };
    return [
      { name: 'Idle', value: counts.idle, color: 'hsl(215, 15%, 55%)' },
      { name: 'Busy', value: counts.busy, color: 'hsl(142, 76%, 46%)' },
      { name: 'Charging', value: counts.charging, color: 'hsl(38, 92%, 50%)' },
      { name: 'Error', value: counts.error, color: 'hsl(0, 72%, 51%)' },
    ];
  }, [bots]);

  // Battery distribution
  const batteryData = useMemo(() => {
    return bots.map((bot) => ({
      name: bot.name.split(' ')[1],
      battery: bot.battery,
      fill: bot.battery > 60 ? 'hsl(142, 76%, 46%)' : bot.battery > 30 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 72%, 51%)',
    }));
  }, [bots]);

  // Task priority distribution
  const taskPriorityData = useMemo(() => {
    const counts = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      critical: tasks.filter((t) => t.priority === 'critical').length,
    };
    return [
      { name: 'Low', value: counts.low, color: 'hsl(215, 15%, 55%)' },
      { name: 'Medium', value: counts.medium, color: 'hsl(185, 80%, 50%)' },
      { name: 'High', value: counts.high, color: 'hsl(38, 92%, 50%)' },
      { name: 'Critical', value: counts.critical, color: 'hsl(0, 72%, 51%)' },
    ];
  }, [tasks]);

  // Simulated hourly activity data
  const hourlyActivityData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}:00`,
      tasks: Math.floor(Math.random() * 20) + 5,
      efficiency: Math.floor(Math.random() * 30) + 70,
    }));
  }, []);

  // Speed distribution
  const speedData = useMemo(() => {
    return bots.map((bot) => ({
      name: bot.name.split(' ')[1],
      speed: bot.speed,
    }));
  }, [bots]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics and insights for your warehouse operations
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Avg Battery</p>
            <p className="text-2xl font-bold">
              {Math.round(bots.reduce((sum, b) => sum + b.battery, 0) / bots.length)}%
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Avg Speed</p>
            <p className="text-2xl font-bold">
              {(bots.reduce((sum, b) => sum + b.speed, 0) / bots.length).toFixed(1)} m/s
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Utilization</p>
            <p className="text-2xl font-bold">
              {Math.round((bots.filter((b) => b.status === 'busy').length / bots.length) * 100)}%
            </p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground">Error Rate</p>
            <p className="text-2xl font-bold text-destructive">
              {Math.round((bots.filter((b) => b.status === 'error').length / bots.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bot Status Distribution */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Bot Status Distribution</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Current operational status of all warehouse robots
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Battery Levels */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Battery Levels by Bot</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Current battery percentage for each robot
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batteryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="battery" radius={[4, 4, 0, 0]}>
                    {batteryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Activity */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Hourly Task Activity</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Number of tasks processed throughout the day
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(215, 15%, 55%)" 
                    fontSize={10}
                    interval={3}
                  />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tasks"
                    stroke="hsl(185, 80%, 50%)"
                    fill="hsl(185, 80%, 50%)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Efficiency Trend */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Efficiency Trend</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Warehouse operational efficiency percentage over time
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(215, 15%, 55%)" 
                    fontSize={10}
                    interval={3}
                  />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 12%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(142, 76%, 46%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Speed comparison */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Bot Speed Comparison</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Current movement speed of each robot in meters per second
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speedData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
                <XAxis type="number" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(215, 15%, 55%)" fontSize={12} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220, 18%, 12%)',
                    border: '1px solid hsl(220, 15%, 20%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="speed" fill="hsl(185, 80%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analytics explanation */}
        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
          <h3 className="font-semibold text-primary mb-3">Why These Metrics?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Bot Status Distribution</p>
              <p>Helps identify fleet utilization and potential bottlenecks</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Battery Levels</p>
              <p>Critical for scheduling charging and preventing downtime</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Hourly Activity</p>
              <p>Reveals peak operation times for resource optimization</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Speed Comparison</p>
              <p>Identifies slow bots that may need maintenance</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
