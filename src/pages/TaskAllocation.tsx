import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskForm } from '@/components/task/TaskForm';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskAllocation() {
  const { tasks } = useStore();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Task Allocation</h1>
            <p className="text-muted-foreground">
              Create and assign new tasks to warehouse robots
            </p>
          </div>
          <Link to="/tasks/queue">
            <Button variant="outline">
              <ClipboardList className="w-4 h-4 mr-2" />
              View Queue ({tasks.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold mb-6">Create New Task</h2>
              <TaskForm />
            </div>
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current queue status */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Queue Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pending Tasks</span>
                  <span className="text-2xl font-bold">{tasks.length}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(tasks.length * 10, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks are automatically assigned to available bots
                </p>
              </div>
            </div>

            {/* Priority guide */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Priority Guide</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Low</p>
                    <p className="text-xs text-muted-foreground">Standard delivery tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium text-sm">Medium</p>
                    <p className="text-xs text-muted-foreground">Regular priority orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div>
                    <p className="font-medium text-sm">High</p>
                    <p className="text-xs text-muted-foreground">Time-sensitive deliveries</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div>
                    <p className="font-medium text-sm">Critical</p>
                    <p className="text-xs text-muted-foreground">Urgent, immediate action</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-3 text-primary">Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use zone codes (e.g., A-12) for faster identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Add comments for special handling instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Critical tasks are processed first</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
