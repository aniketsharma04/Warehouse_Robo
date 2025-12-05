import { useState } from 'react';
import { useStore, TaskPriority } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { MapPin, Target, Flag, MessageSquare, Plus } from 'lucide-react';

interface FormData {
  pickup: string;
  drop: string;
  priority: TaskPriority;
  comments: string;
}

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-muted-foreground' },
  { value: 'medium', label: 'Medium', color: 'text-primary' },
  { value: 'high', label: 'High', color: 'text-warning' },
  { value: 'critical', label: 'Critical', color: 'text-destructive' },
];

export function TaskForm() {
  const { addTask } = useStore();
  const [formData, setFormData] = useState<FormData>({
    pickup: '',
    drop: '',
    priority: 'medium',
    comments: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.pickup.trim()) {
      newErrors.pickup = 'Pickup location is required';
    }
    if (!formData.drop.trim()) {
      newErrors.drop = 'Drop location is required';
    }
    if (formData.pickup.trim() === formData.drop.trim() && formData.pickup.trim()) {
      newErrors.drop = 'Drop location must be different from pickup';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }

    addTask({
      pickup: formData.pickup.trim(),
      drop: formData.drop.trim(),
      priority: formData.priority,
      comments: formData.comments.trim(),
    });

    toast.success('Task created successfully', {
      description: `Task from ${formData.pickup} to ${formData.drop} added to queue`,
    });

    // Reset form
    setFormData({
      pickup: '',
      drop: '',
      priority: 'medium',
      comments: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pickup Location */}
      <div className="space-y-2">
        <Label htmlFor="pickup" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-success" />
          Pickup Location
        </Label>
        <Input
          id="pickup"
          placeholder="e.g., Zone A - Shelf 12"
          value={formData.pickup}
          onChange={(e) => setFormData({ ...formData, pickup: e.target.value })}
          className={errors.pickup ? 'border-destructive' : ''}
        />
        {errors.pickup && (
          <p className="text-sm text-destructive">{errors.pickup}</p>
        )}
      </div>

      {/* Drop Location */}
      <div className="space-y-2">
        <Label htmlFor="drop" className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Drop Location
        </Label>
        <Input
          id="drop"
          placeholder="e.g., Packing Station B"
          value={formData.drop}
          onChange={(e) => setFormData({ ...formData, drop: e.target.value })}
          className={errors.drop ? 'border-destructive' : ''}
        />
        {errors.drop && (
          <p className="text-sm text-destructive">{errors.drop}</p>
        )}
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-warning" />
          Priority
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value: TaskPriority) =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        <Label htmlFor="comments" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          Comments (Optional)
        </Label>
        <Textarea
          id="comments"
          placeholder="Any additional notes or instructions..."
          value={formData.comments}
          onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Create Task
      </Button>
    </form>
  );
}
