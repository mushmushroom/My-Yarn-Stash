import type { SkeinFormData } from '@/lib/types';
import { skeinSchema } from '@/schemas/skein.schema';
import { useSkeinsStore } from '@/store/skeins.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface AddYarnFormProps {
  onClose?: () => void;
}

export default function useAddYarnForm({ onClose }: AddYarnFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { create } = useSkeinsStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SkeinFormData>({
    resolver: zodResolver(skeinSchema),
    defaultValues: { color: '#ffffff', weight: 0, yardage: '', yardage_unit: '' },
  });

  const onSubmit = async (data: SkeinFormData) => {
    setIsPending(true);
    setSubmitError(null);
    try {
      await create(data);
      toast.success('Skein added!');
      reset();
      onClose?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save skein';
      toast.error(msg);
      setSubmitError(msg);
    } finally {
      setIsPending(false);
    }
  };
  return { handleSubmit, onSubmit, isPending, submitError, register, control, setValue, errors, isDirty };
}
