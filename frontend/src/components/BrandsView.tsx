import useFetchBrands from '@/hooks/useFetchBrands';
import { BrandCard } from './BrandCard';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import BrandForm from './BrandForm';
import { useState } from 'react';
import type { Brand } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/api/api';
import { DeleteConfirmDrawer } from './DeleteConfirmDrawer';

export default function BrandsView() {
  const { data: brands, isLoading, isError } = useFetchBrands();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [confirmingBrand, setConfirmingBrand] = useState<Brand | null>(null);
  const [removeSkeins, setRemoveSkeins] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: api.deleteBrand,
    onSuccess: () => {
      toast.success('Brand removed');
      setConfirmingBrand(null);
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['skeins'] });
    },
    onError: () => {
      toast.error('Failed to delete brand');
      setConfirmingBrand(null);
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading brands...</p>;
  if (isError) return <p className="text-destructive text-sm">Failed to load brands.</p>;

  if (brands?.length === 0) {
    return <p className="text-muted-foreground text-sm">No brands yet.</p>;
  }

  return (
    <>
      <div className="space-y-8">
        {brands?.map((brand) => (
          <BrandCard
            brand={brand}
            key={brand.id}
            removing={deleteMutation.isPending && confirmingBrand?.id === brand.id}
            onRemove={() => {
              setRemoveSkeins(false);
              setConfirmingBrand(brand);
            }}
          />
        ))}
      </div>

      <DeleteConfirmDrawer
        open={!!confirmingBrand}
        onOpenChange={(open) => { if (!open) setConfirmingBrand(null); }}
        title={`Delete "${confirmingBrand?.name}"?`}
        description="Choose what to do with the skeins linked to this brand:"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate({ id: confirmingBrand!.id, removeSkeins })}
      >
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              className="mt-0.5"
              checked={!removeSkeins}
              onChange={() => setRemoveSkeins(false)}
            />
            <div>
              <p className="text-sm font-medium">Keep skeins</p>
              <p className="text-xs text-muted-foreground">
                Skeins stay in your stash but will no longer be linked to a brand. They'll appear under "No brand".
              </p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              className="mt-0.5"
              checked={removeSkeins}
              onChange={() => setRemoveSkeins(true)}
            />
            <div>
              <p className="text-sm font-medium">Delete skeins too</p>
              <p className="text-xs text-muted-foreground">
                All skeins from this brand will be permanently deleted from your stash.
              </p>
            </div>
          </label>
        </div>
      </DeleteConfirmDrawer>

      {/* Edit brand */}
      <Drawer
        open={!!editingBrand}
        onOpenChange={(open) => { if (!open) setEditingBrand(null); }}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit brand</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {editingBrand && (
              <BrandForm brand={editingBrand} onClose={() => setEditingBrand(null)} />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
