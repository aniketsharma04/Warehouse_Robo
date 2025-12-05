import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'bg-secondary text-secondary-foreground',
    glow: '',
  },
  primary: {
    icon: 'bg-primary/20 text-primary',
    glow: 'shadow-[0_0_30px_-10px_hsl(var(--primary)/0.4)]',
  },
  success: {
    icon: 'bg-success/20 text-success',
    glow: 'shadow-[0_0_30px_-10px_hsl(var(--success)/0.4)]',
  },
  warning: {
    icon: 'bg-warning/20 text-warning',
    glow: 'shadow-[0_0_30px_-10px_hsl(var(--warning)/0.4)]',
  },
  error: {
    icon: 'bg-destructive/20 text-destructive',
    glow: 'shadow-[0_0_30px_-10px_hsl(var(--destructive)/0.4)]',
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "stat-card bg-card rounded-xl p-6 border border-border",
        styles.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm mt-2 flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last hour</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
