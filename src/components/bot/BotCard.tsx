import { Bot, BotStatus } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { Battery, Zap, Clock, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface BotCardProps {
  bot: Bot;
}

const statusConfig: Record<BotStatus, { label: string; color: string; bgColor: string }> = {
  idle: {
    label: 'Idle',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  busy: {
    label: 'Busy',
    color: 'text-primary',
    bgColor: 'bg-primary/20',
  },
  charging: {
    label: 'Charging',
    color: 'text-warning',
    bgColor: 'bg-warning/20',
  },
  error: {
    label: 'Error',
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
  },
};

function getBatteryColor(battery: number): string {
  if (battery > 60) return 'bg-success';
  if (battery > 30) return 'bg-warning';
  return 'bg-destructive';
}

export function BotCard({ bot }: BotCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const status = statusConfig[bot.status];

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 500);
    return () => clearTimeout(timer);
  }, [bot.lastUpdated]);

  return (
    <div
      className={cn(
        "bot-card bg-card rounded-xl p-5 border border-border",
        "hover:border-primary/50 transition-all duration-300",
        isUpdating && "ring-2 ring-primary/30 animate-pulse"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="font-mono text-primary font-bold">
              {bot.name.split(' ')[1]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold">{bot.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{bot.id}</p>
          </div>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium", status.bgColor, status.color)}>
          {status.label}
        </div>
      </div>

      {/* Battery */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Battery className="w-4 h-4" />
            <span>Battery</span>
          </div>
          <span className="text-sm font-mono font-medium">{bot.battery}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", getBatteryColor(bot.battery))}
            style={{ width: `${bot.battery}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Zap className="w-3 h-3" />
            <span>Speed</span>
          </div>
          <p className="font-mono font-medium">{bot.speed.toFixed(1)} m/s</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Clock className="w-3 h-3" />
            <span>Updated</span>
          </div>
          <p className="text-sm font-medium truncate">
            {formatDistanceToNow(bot.lastUpdated, { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Current Task */}
      <div className="bg-secondary/30 rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Activity className="w-3 h-3" />
          <span>Current Task</span>
        </div>
        <p className={cn(
          "text-sm font-medium truncate",
          bot.currentTask ? "text-foreground" : "text-muted-foreground italic"
        )}>
          {bot.currentTask || 'No active task'}
        </p>
      </div>
    </div>
  );
}
