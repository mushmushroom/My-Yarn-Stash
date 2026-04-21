import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import DeleteConfirmDrawer from '@/components/DeleteConfirmDrawer';
import type { SkeinItem } from '@/lib/types';
import SkeinForm from './SkeinForm';

interface SkeinCardProps {
  skein: SkeinItem;
  usedWeight: number;
  removing: boolean;
  onRemove: () => void;
}

export default function SkeinCard({ skein, usedWeight, removing, onRemove }: SkeinCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const remaining = skein.weight - usedWeight;

  return (
    <>
      <div
        className="group relative flex flex-col gap-2.5 rounded-[18px] border transition-all duration-[180ms] overflow-hidden"
        style={{
          padding: '14px 34px 12px',
          background: '#fffdf7',
          borderColor: 'color-mix(in oklab, var(--foreground) 8%, transparent)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 16px rgba(28,42,40,0.06)';
          (e.currentTarget as HTMLElement).style.borderColor =
            'color-mix(in oklab, var(--foreground) 15%, transparent)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
          (e.currentTarget as HTMLElement).style.borderColor =
            'color-mix(in oklab, var(--foreground) 8%, transparent)';
        }}
      >
        {/* Color swatch */}
        <div className="flex justify-center" style={{ padding: '8px 0 4px' }}>
          <div
            className="w-[72px] h-[72px] rounded-full"
            style={{
              background: skein.color,
              border: '1px solid light',
            }}
          />
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground tabular-nums leading-none">
              {remaining > 0 ? remaining: skein.weight}
            </span>
            <span className="text-xs text-muted-foreground font-normal">g</span>
          </div>
          <p
            className="text-[11px] text-muted-foreground/70 leading-snug"
            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}
          >
            {skein.yardage}m · {skein.weight}g
          </p>
        </div>

        {/* Dashed divider */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: '8px',
            borderTop: '1px dashed color-mix(in oklab, var(--foreground) 10%, transparent)',
          }}
        >
          <div className="flex justify-center gap-0.5 w-full ">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditing(true)}
              aria-label="Edit skein"
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={removing}
              onClick={() => setIsConfirming(true)}
              aria-label="Delete skein"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <DeleteConfirmDrawer
        open={isConfirming}
        onOpenChange={setIsConfirming}
        title="Delete skein?"
        description={`This will permanently remove "${skein.name}" from your stash. This action cannot be undone.`}
        isPending={removing}
        onConfirm={() => {
          setIsConfirming(false);
          onRemove();
        }}
      />

      <Drawer open={isEditing} onOpenChange={setIsEditing} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit skein</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-4 overflow-auto">
            <SkeinForm skein={skein} onClose={() => setIsEditing(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
