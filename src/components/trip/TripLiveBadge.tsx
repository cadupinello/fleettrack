import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface TripLiveBadgeProps {
  isLive: boolean;
  className?: string;
}

export const TripLiveBadge = ({ isLive, className }: TripLiveBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-0.5 font-semibold transition-all duration-300',
        isLive 
          ? 'border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
          : 'border-slate-500/50 bg-slate-50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          isLive ? "bg-emerald-500" : "bg-slate-400"
        )}></span>
      </span>
      {isLive ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>AO VIVO</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>OFFLINE</span>
        </>
      )}
    </Badge>
  );
};
