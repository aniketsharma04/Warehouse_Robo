import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useStore, Bot } from '@/store/useStore';
import { Upload, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function WarehouseMap() {
  const { bots, updateAllBots } = useStore();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update bot positions every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateAllBots();
    }, 2000);
    return () => clearInterval(interval);
  }, [updateAllBots]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const clearSvg = () => {
    setSvgContent(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const statusColors: Record<string, string> = {
    idle: '#6b7280',
    busy: '#22c55e',
    charging: '#f59e0b',
    error: '#ef4444',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Warehouse Map</h1>
            <p className="text-muted-foreground">
              Visual representation of bot positions in the warehouse
            </p>
          </div>
          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload SVG Layout
            </Button>
            {svgContent && (
              <Button variant="ghost" onClick={clearSvg}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Bonus Feature</p>
            <p className="text-sm text-muted-foreground">
              Upload a warehouse layout SVG file to see bots positioned on your actual floor plan.
              Bots are shown as colored circles that move randomly to simulate movement.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm capitalize">{status}</span>
            </div>
          ))}
        </div>

        {/* Map container */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div
            className="relative w-full aspect-[16/9] bg-secondary/30"
            style={{ minHeight: '500px' }}
          >
            {/* SVG background */}
            {svgContent ? (
              <div
                className="absolute inset-0 p-4"
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">No warehouse layout uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    Upload an SVG file or view bots on the default grid below
                  </p>
                </div>
              </div>
            )}

            {/* Default grid when no SVG */}
            {!svgContent && (
              <div className="absolute inset-4">
                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}

            {/* Bot positions */}
            {bots.map((bot) => (
              <BotMarker key={bot.id} bot={bot} statusColors={statusColors} />
            ))}
          </div>
        </div>

        {/* Bot list */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Bot Positions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="bg-secondary/50 rounded-lg p-3 text-center"
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: statusColors[bot.status] }}
                >
                  {bot.name.split(' ')[1]}
                </div>
                <p className="text-sm font-medium">{bot.name}</p>
                <p className="text-xs text-muted-foreground">
                  ({Math.round(bot.position.x)}%, {Math.round(bot.position.y)}%)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface BotMarkerProps {
  bot: Bot;
  statusColors: Record<string, string>;
}

function BotMarker({ bot, statusColors }: BotMarkerProps) {
  return (
    <div
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out",
        "group cursor-pointer"
      )}
      style={{
        left: `${bot.position.x}%`,
        top: `${bot.position.y}%`,
      }}
    >
      {/* Bot circle */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
        style={{
          backgroundColor: statusColors[bot.status],
          boxShadow: `0 0 15px ${statusColors[bot.status]}80`,
        }}
      >
        {bot.name.split(' ')[1]}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-popover text-popover-foreground rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg border border-border">
          <p className="font-medium">{bot.name}</p>
          <p className="text-muted-foreground capitalize">{bot.status}</p>
          <p className="text-muted-foreground">Battery: {bot.battery}%</p>
        </div>
      </div>

      {/* Pulse animation for busy bots */}
      {bot.status === 'busy' && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: statusColors[bot.status] }}
        />
      )}
    </div>
  );
}
