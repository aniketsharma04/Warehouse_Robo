import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BotCard } from '@/components/bot/BotCard';
import { RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BotStatus as BotStatusType } from '@/store/useStore';

export default function BotStatus() {
  const { bots, updateAllBots } = useStore();
  const [filter, setFilter] = useState<BotStatusType | 'all'>('all');
  const [countdown, setCountdown] = useState(10);
  const [isUpdating, setIsUpdating] = useState(false);

  // Auto-update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsUpdating(true);
          updateAllBots();
          setTimeout(() => setIsUpdating(false), 500);
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [updateAllBots]);

  const handleManualRefresh = () => {
    setIsUpdating(true);
    updateAllBots();
    setCountdown(10);
    setTimeout(() => setIsUpdating(false), 500);
  };

  const filteredBots = filter === 'all' 
    ? bots 
    : bots.filter((bot) => bot.status === filter);

  const statusCounts = {
    all: bots.length,
    idle: bots.filter((b) => b.status === 'idle').length,
    busy: bots.filter((b) => b.status === 'busy').length,
    charging: bots.filter((b) => b.status === 'charging').length,
    error: bots.filter((b) => b.status === 'error').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bot Status</h1>
            <p className="text-muted-foreground">
              Real-time monitoring of all warehouse robots
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Auto-update indicator */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-primary animate-pulse' : 'bg-success'}`} />
              <span>Next update in {countdown}s</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleManualRefresh}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by status:</span>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as BotStatusType | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="idle">Idle ({statusCounts.idle})</SelectItem>
              <SelectItem value="busy">Busy ({statusCounts.busy})</SelectItem>
              <SelectItem value="charging">Charging ({statusCounts.charging})</SelectItem>
              <SelectItem value="error">Error ({statusCounts.error})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Busy</p>
            <p className="text-2xl font-bold text-success">{statusCounts.busy}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Idle</p>
            <p className="text-2xl font-bold text-muted-foreground">{statusCounts.idle}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Charging</p>
            <p className="text-2xl font-bold text-warning">{statusCounts.charging}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">Error</p>
            <p className="text-2xl font-bold text-destructive">{statusCounts.error}</p>
          </div>
        </div>

        {/* Bot grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredBots.map((bot, index) => (
            <div
              key={bot.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <BotCard bot={bot} />
            </div>
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No bots found with the selected filter</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
