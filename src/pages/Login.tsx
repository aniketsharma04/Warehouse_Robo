import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Bot, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'signup';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store login state in global state (not localStorage as per requirements)
    login(formData.email, formData.name || formData.email.split('@')[0]);

    toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully', {
      description: 'Redirecting to dashboard...',
    });

    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-background to-background p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/50 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RoboWarehouse</h1>
              <p className="text-sm text-muted-foreground">Control Center</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">
            Manage your warehouse
            <br />
            <span className="gradient-text">robots with ease</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            Real-time monitoring, task allocation, and analytics for your
            autonomous warehouse operations.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-sm text-muted-foreground">
          <div>
            <p className="text-3xl font-bold text-foreground">10+</p>
            <p>Active Bots</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">99.9%</p>
            <p>Uptime</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">24/7</p>
            <p>Monitoring</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">RoboWarehouse</h1>
              <p className="text-xs text-muted-foreground">Control Center</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'login'
                ? 'Enter your credentials to access the dashboard'
                : 'Fill in your details to get started'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                mode === 'login'
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={cn(
                "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
                mode === 'signup'
                  ? "bg-background shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={cn("pl-10", errors.name && "border-destructive")}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={cn("pl-10", errors.email && "border-destructive")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={cn("pl-10", errors.password && "border-destructive")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className={cn(
                      "pl-10",
                      errors.confirmPassword && "border-destructive"
                    )}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
