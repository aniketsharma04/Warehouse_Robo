import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BotStatus from "./pages/BotStatus";
import TaskAllocation from "./pages/TaskAllocation";
import TaskQueue from "./pages/TaskQueue";
import Analytics from "./pages/Analytics";
import WarehouseMap from "./pages/WarehouseMap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bots"
            element={
              <ProtectedRoute>
                <BotStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/create"
            element={
              <ProtectedRoute>
                <TaskAllocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/queue"
            element={
              <ProtectedRoute>
                <TaskQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <WarehouseMap />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
