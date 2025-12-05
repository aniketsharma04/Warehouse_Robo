import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskCard } from '@/components/task/TaskCard';
import { Link } from 'react-router-dom';
import { Plus, Timer, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TaskQueue() {
  const { tasks, removeTask, getNextTask } = useStore();
  const [countdown, setCountdown] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-remove one task every 3 seconds
  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextTask = getNextTask();
          if (nextTask) {
            setIsProcessing(true);
            setTimeout(() => {
              removeTask(nextTask.id);
              toast.success('Task assigned to bot', {
                description: `Task ${nextTask.id.slice(0, 8)}... has been assigned`,
              });
              setIsProcessing(false);
            }, 300);
          }
          return 3;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks.length, getNextTask, removeTask]);

  // Reset countdown when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      setCountdown(3);
    }
  }, [tasks.length]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Task Queue</h1>
            <p className="text-muted-foreground">
              Pending tasks waiting to be assigned to bots
            </p>
          </div>
          <Link to="/tasks/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </Link>
        </div>

        {/* Queue status bar */}
        <div className="bg-card rounded-xl p-4 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              <span className="font-medium">{tasks.length} tasks in queue</span>
            </div>
          </div>
          {tasks.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Timer className={`w-4 h-4 ${isProcessing ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              <span className="text-muted-foreground">
                {isProcessing ? 'Assigning task...' : `Next assignment in ${countdown}s`}
              </span>
              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Task list */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No pending tasks</h3>
            <p className="text-muted-foreground mb-6">
              All tasks have been assigned to bots. Create a new task to get started.
            </p>
            <Link to="/tasks/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
            </Link>
          </div>
        )}

        {/* Info about auto-assignment */}
        {tasks.length > 0 && (
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary mb-1">Automatic Task Assignment</h4>
                <p className="text-sm text-muted-foreground">
                  Tasks are automatically assigned to available bots every 3 seconds. 
                  The first task in the queue (highest priority, oldest first) will be assigned next.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
