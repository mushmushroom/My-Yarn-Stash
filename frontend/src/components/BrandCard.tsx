import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { Brand } from '@/lib/types';
import { BACKEND_URL } from '@/lib/constants';
import BrandForm from './BrandForm';

interface BrandCardProps {
  brand: Brand;
  removing: boolean;
  onRemove: () => void;
}

export default function BrandCard({ brand, removing, onRemove }: BrandCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="flex items-center gap-7 p-3 rounded-lg border border-border bg-card border-l-4 border-l-accent justify-between max-w-lg">
        <div className="flex flex-col gap-6">
          <p>{brand.name}</p>
          {brand.logo_filename && (
            <img
              className="w-24 h-auto max-h-10 object-contain"
              src={`${BACKEND_URL}/static/brand-logos/${brand.logo_filename}`}
              alt={brand.name}
            />
          )}
          {!brand.logo_filename && (
            <div className="w-24 h-10 rounded border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center text-xs text-primary/60">
              No logo
            </div>
          )}
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditing(true)}
            aria-label="Edit brand"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            disabled={removing}
            onClick={onRemove}
            aria-label="Delete brand"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <Drawer open={isEditing} onOpenChange={setIsEditing} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit brand</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-auto">
            <BrandForm brand={brand} onClose={() => setIsEditing(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
