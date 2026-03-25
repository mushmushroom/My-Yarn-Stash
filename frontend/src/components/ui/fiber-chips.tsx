import { cn } from '@/lib/utils';

interface FiberChipsProps {
  fibers: string[];
  selected: string[];
  onToggle: (fiber: string) => void;
  isLoading?: boolean;
}

export function FiberChips({ fibers, selected, onToggle, isLoading }: FiberChipsProps) {
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {fibers.map((fiber) => (
        <button
          key={fiber}
          type="button"
          onClick={() => onToggle(fiber)}
          className={cn(
            'px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer',
            selected.includes(fiber)
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-input hover:bg-muted',
          )}
        >
          {fiber}
        </button>
      ))}
    </div>
  );
}
