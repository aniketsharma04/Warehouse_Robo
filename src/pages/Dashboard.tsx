import { useStore } from '@/store/useStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Bot, Activity, Pause, AlertTriangle, ClipboardList, Battery, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { bots, tasks } = useStore();

  // Calculate stats
  const totalBots = bots.length;
  const activeTasks = bots.filter((bot) => bot.status === 'busy').length;
  const idleBots = bots.filter((bot) => bot.status === 'idle').length;
  const errorBots = bots.filter((bot) => bot.status === 'error').length;
  const pendingTasks = tasks.length;
  const chargingBots = bots.filter((bot) => bot.status === 'charging').length;

  // Calculate average battery
  const avgBattery = Math.round(
    bots.reduce((sum, bot) => sum + bot.battery, 0) / bots.length
  );

  // Get recent activity (bots with recent updates)
  const recentBots = [...bots]
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your warehouse operations
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/tasks/create">
              <Button>
                <ClipboardList className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            title="Total Bots"
            value={totalBots}
            icon={Bot}
            variant="primary"
          />
          <StatCard
            title="Active Tasks"
            value={activeTasks}
            icon={Activity}
            variant="success"
          />
          <StatCard
            title="Idle Bots"
            value={idleBots}
            icon={Pause}
            variant="default"
          />
          <StatCard
            title="Bots in Error"
            value={errorBots}
            icon={AlertTriangle}
            variant="error"
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks}
            icon={ClipboardList}
            variant="warning"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Fleet Status</h3>
              <Link to="/bots" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm">Busy</span>
                </div>
                <span className="font-mono font-medium">{activeTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm">Idle</span>
                </div>
                <span className="font-mono font-medium">{idleBots}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm">Charging</span>
                </div>
                <span className="font-mono font-medium">{chargingBots}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm">Error</span>
                </div>
                <span className="font-mono font-medium">{errorBots}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Fleet Health</h3>
              <Battery className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Average Battery</span>
                  <span className="font-mono font-medium">{avgBattery}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${avgBattery}%` }}
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Low battery (&lt;30%)</span>
                  <span className="font-mono font-medium text-warning">
                    {bots.filter((b) => b.battery < 30).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-3">
              <Link to="/tasks/create" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Create New Task
                </Button>
              </Link>
              <Link to="/bots" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="w-4 h-4 mr-2" />
                  View Bot Status
                </Button>
              </Link>
              <Link to="/tasks/queue" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-4 h-4 mr-2" />
                  View Task Queue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Bot Activity</h3>
            <span className="text-sm text-muted-foreground">Last updated bots</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Battery</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Current Task</th>
                </tr>
              </thead>
              <tbody>
                {recentBots.map((bot) => (
                  <tr key={bot.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <span className="font-mono text-xs text-primary font-bold">
                            {bot.name.split(' ')[1]}
                          </span>
                        </div>
                        <span className="font-medium">{bot.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bot.status === 'busy'
                            ? 'bg-success/20 text-success'
                            : bot.status === 'idle'
                            ? 'bg-muted text-muted-foreground'
                            : bot.status === 'charging'
                            ? 'bg-warning/20 text-warning'
                            : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {bot.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              bot.battery > 60
                                ? 'bg-success'
                                : bot.battery > 30
                                ? 'bg-warning'
                                : 'bg-destructive'
                            }`}
                            style={{ width: `${bot.battery}%` }}
                          />
                        </div>
                        <span className="font-mono text-sm">{bot.battery}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {bot.currentTask || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
