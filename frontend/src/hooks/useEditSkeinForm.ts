import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { skeinSchema } from '@/schemas/skein.schema';
import { useSkeinsStore } from '@/store/skeins.store';
import type { SkeinFormData } from '@/lib/types';
import type { SkeinItem } from '@/lib/types';

interface UseEditSkeinFormProps {
  skein: SkeinItem;
  onClose: () => void;
}

export function useEditSkeinForm({ skein, onClose }: UseEditSkeinFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { update } = useSkeinsStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SkeinFormData>({
    resolver: zodResolver(skeinSchema),
    defaultValues: {
      name: skein.name,
      brand_id: skein.brand_id,
      color: skein.color,
      weight: skein.weight,
      yardage: skein.yardage,
      yardage_unit: skein.yardage_unit,
      fibers: skein.fibers ?? [],
      comment: skein.comment ?? '',
    },
  });

  const onSubmit = async (data: SkeinFormData) => {
    setIsPending(true);
    setSubmitError(null);
    try {
      await update(skein.id, data);
      toast.success('Skein updated!');
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update skein';
      toast.error(msg);
      setSubmitError(msg);
    } finally {
      setIsPending(false);
    }
  };

  return { handleSubmit, onSubmit, isPending, submitError, register, control, setValue, errors, isDirty };
}
