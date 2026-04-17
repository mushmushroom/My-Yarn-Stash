import type { SkeinFormData, SkeinItem } from '@/lib/types';
import { skeinSchema } from '@/schemas/skein.schema';
import { useSkeinsStore } from '@/store/skeins.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UseSkeinFormProps {
  skein?: SkeinItem;
  onClose: () => void;
}
export default function useSkeinForm({ skein, onClose }: UseSkeinFormProps) {
  const queryClient = useQueryClient();
  const { create, update } = useSkeinsStore();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SkeinFormData>({
    resolver: zodResolver(skeinSchema),
    defaultValues: {
      name: skein?.name ?? undefined,
      brand_id: skein?.brand_id ?? undefined,
      color: skein?.color ?? '#ffffff',
      weight: skein?.weight ?? 0,
      yardage: skein?.yardage ?? '',
      yardage_unit: skein?.yardage_unit ?? '',
      fibers: skein?.fibers ?? [],
      comment: skein?.comment ?? '',
    },
  });

  const onSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['skeins'] });
    onClose();
  };
  const onError = (error: Error) => toast.error(error.message);

  const createMutation = useMutation({
    mutationFn: create,
    onSuccess: () => onSuccess('Skein added!'),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: (data: SkeinFormData) => update(skein!.id, data),
    onSuccess: () => onSuccess('Skein updated!'),
    onError,
  });

  const mutation = skein ? updateMutation : createMutation;

  const onSubmit = (data: SkeinFormData) => mutation.mutate(data);

  return {
    isDirty,
    mutation,
    setValue,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  };
}
