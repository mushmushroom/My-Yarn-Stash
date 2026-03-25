import { useState } from 'react';
import { toast } from 'sonner';
import { useSkeinsStore } from '@/store/skeins.store';

export function useRemoveSkein() {
  const { remove } = useSkeinsStore();
  const [removing, setRemoving] = useState<number | null>(null);

  const handleRemove = async (id: number) => {
    setRemoving(id);
    try {
      await remove(id);
      toast.success('Skein removed');
    } catch {
      toast.error('Failed to delete skein');
    } finally {
      setRemoving(null);
    }
  };

  return { removing, handleRemove };
}
