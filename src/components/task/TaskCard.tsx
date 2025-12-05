import { Task, TaskPriority } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { MapPin, Target, Clock, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: {
    label: 'Low',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  medium: {
    label: 'Medium',
    color: 'text-primary',
    bgColor: 'bg-primary/20',
  },
  high: {
    label: 'High',
    color: 'text-warning',
    bgColor: 'bg-warning/20',
  },
  critical: {
    label: 'Critical',
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
  },
};

export function TaskCard({ task, index }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-5 border border-border animate-fade-in",
        "hover:border-primary/50 transition-all duration-300"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center font-mono text-sm font-bold">
            #{index + 1}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono">{task.id.slice(0, 12)}...</p>
          </div>
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1", priority.bgColor, priority.color)}>
          <Flag className="w-3 h-3" />
          {priority.label}
        </div>
      </div>

      {/* Locations */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded bg-success/20 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-3 h-3 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pickup</p>
            <p className="font-medium">{task.pickup}</p>
          </div>
        </div>
        
        <div className="ml-3 border-l-2 border-dashed border-border h-4" />
        
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Target className="w-3 h-3 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Drop</p>
            <p className="font-medium">{task.drop}</p>
          </div>
        </div>
      </div>

      {/* Comments */}
      {task.comments && (
        <div className="bg-secondary/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-muted-foreground">{task.comments}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}</span>
      </div>
    </div>
  );
}
