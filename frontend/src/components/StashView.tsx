import { useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSkeinsStore } from '@/store/skeins.store';
import { brandLogos } from '@/lib/constants';
import { useFiltersStore } from '@/store/filters.store';
import { useRemoveSkein } from '@/hooks/useRemoveSkein';
import { SkeinCard } from '@/components/SkeinCard';
import { api } from '@/api/api';
import type { ProjectUsage } from '@/lib/types';

export function StashView() {
  const { grouped, isLoading, isError, fetch } = useSkeinsStore();
  const { filters } = useFiltersStore();
  const { removing, handleRemove } = useRemoveSkein();

  useEffect(() => { fetch(filters); }, [fetch, filters]);

  const { data: projects = [] } = useQuery<ProjectUsage[]>({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const usedWeightPerSkein = useMemo(() => {
    const map: Record<number, number> = {};
    for (const project of projects) {
      for (const s of project.skeins) {
        map[s.skein_id] = (map[s.skein_id] ?? 0) + s.weight_required;
      }
    }
    return map;
  }, [projects]);

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading stash...</p>;
  if (isError) return <p className="text-destructive text-sm">Failed to load stash.</p>;

  const entries = Object.entries(grouped);

  if (entries.length === 0) {
    return <p className="text-muted-foreground text-sm">No skeins added yet.</p>;
  }

  return (
    <div className="space-y-8">
      {entries.map(([brandName, skeins]) => (
        <div key={brandName}>
          <div className="flex items-center gap-3 mb-4">
            {brandLogos[brandName] ? (
              <img src={brandLogos[brandName]} alt={brandName} className="w-24 h-auto max-h-10 object-contain" />
            ) : (
              <span className="text-base font-semibold">{brandName}</span>
            )}
          </div>

          <div className="space-y-4">
            {Object.entries(skeins).map(([skeinName, variants]) => (
              <div key={skeinName}>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <p className="text-sm font-medium">{skeinName}</p>
                  {(() => {
                    const fibers = variants.flatMap((s) => s.fibers ?? []);
                    const unique = [...new Set(fibers)];
                    return unique.length > 0 ? (
                      <p className="text-xs text-muted-foreground">{unique.join(' · ')}</p>
                    ) : null;
                  })()}
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((skein) => (
                    <SkeinCard
                      key={skein.id}
                      skein={skein}
                      usedWeight={filters.skipReserved ? (usedWeightPerSkein[skein.id] ?? 0) : 0}
                      removing={removing === skein.id}
                      onRemove={() => handleRemove(skein.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
