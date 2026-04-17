import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useFiltersStore } from '@/store/filters.store';
import { useMemo } from 'react';
import { COLOR_MAP } from '@/lib/constants';
import useFetchBrands from '@/hooks/useFetchBrands';
import useFetchFibers from '@/hooks/useFetchFibers';
import  FiberChips  from '@/components/ui/fiber-chips';

export default function StashFilters() {
  const { filters, setFilters, clearFilters } = useFiltersStore();

  const { data: brands = [] } = useFetchBrands();
  const { data: fibers = [], isLoading: isFibersLoading } = useFetchFibers();

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.skipReserved) count += 1;
    if (filters.brand && filters.brand.length > 0) count += 1;
    if (filters.colors && filters.colors.length > 0) count += 1;
    if (filters.fibers && filters.fibers.length > 0) count += 1;
    return count;
  }, [filters]);

  return (
    <Drawer direction="right" >
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="size-4 mr-1" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 space-y-6">
          {/* Availability */}
          <div>
            <Button
              variant={filters.skipReserved ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters('skipReserved')}
            >
              Available only
            </Button>
          </div>

          {/* Brand */}
          {brands.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Brand</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <Button
                    key={brand.id}
                    variant={filters.brand?.includes(brand.name) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters('brand', brand.name)}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Fibers */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fiber</p>
            <FiberChips
              fibers={fibers}
              selected={filters.fibers ?? []}
              isLoading={isFibersLoading}
              onToggle={(fiber) => setFilters('fibers', fiber)}
            />
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Color</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(COLOR_MAP).map(([name, hex]) => {
                const active = filters.colors?.includes(name);
                return (
                  <button
                    aria-label={name}
                    key={name}
                    title={name}
                    onClick={() => setFilters('colors', name)}
                    className={`size-7 rounded-full border-2 transition-all ${
                      active ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <DrawerFooter>
          {activeCount > 0 && (
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </DrawerClose>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
