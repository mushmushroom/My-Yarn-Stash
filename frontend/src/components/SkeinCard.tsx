import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { DeleteConfirmDrawer } from '@/components/DeleteConfirmDrawer';
import type { SkeinItem } from '@/lib/types';
import { SkeinForm } from './SkeinForm';

interface SkeinCardProps {
  skein: SkeinItem;
  usedWeight: number;
  removing: boolean;
  onRemove: () => void;
}

export function SkeinCard({ skein, usedWeight, removing, onRemove }: SkeinCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const remaining = skein.weight - usedWeight;

  return (
    <>
      <div className="flex items-center gap-7 p-2 rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2">
          <div
            className="size-6 rounded-full shrink-0 border border-border"
            style={{ backgroundColor: skein.color }}
          />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {usedWeight > 0 ? (
                <>
                  {remaining}g <span className="opacity-50">/ {skein.weight}g</span>
                </>
              ) : (
                <>{skein.weight}g</>
              )}{' '}
              · {skein.yardage}m/{skein.yardage_unit}
            </p>
            {skein.comment && (
              <p className="text-xs text-muted-foreground truncate max-w-32">{skein.comment}</p>
            )}
          </div>
        </div>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditing(true)}
            aria-label="Edit skein"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            disabled={removing}
            onClick={() => setIsConfirming(true)}
            aria-label="Delete skein"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <DeleteConfirmDrawer
        open={isConfirming}
        onOpenChange={setIsConfirming}
        title="Delete skein?"
        description={`This will permanently remove "${skein.name}" from your stash. This action cannot be undone.`}
        isPending={removing}
        onConfirm={() => { setIsConfirming(false); onRemove(); }}
      />

      <Drawer open={isEditing} onOpenChange={setIsEditing} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit skein</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-auto">
            <SkeinForm skein={skein} onClose={() => setIsEditing(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
