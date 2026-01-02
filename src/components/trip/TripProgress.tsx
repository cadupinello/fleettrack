import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TripProgressProps {
  value: number;
  label?: string;
  className?: string;
}

export const TripProgress = ({ value, label, className }: TripProgressProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-primary flex items-center gap-2">
          {label || 'Progresso da Viagem'}
        </h3>
        <span className="font-mono font-bold text-lg tabular-nums animate-in fade-in transition-all">
          {Math.round(value)}%
        </span>
      </div>
      
      <div className="relative">
        <Progress 
          value={value} 
          className="h-3 bg-primary/20 transition-all duration-500 ease-in-out" 
        />
        {/* Subtle glow effect for progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary/20 blur-sm -z-10 transition-all duration-500" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
};
