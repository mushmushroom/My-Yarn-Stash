import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/api/api';
import type { Brand, BrandFormData } from '@/lib/types';
import { brandSchema } from '@/schemas/brand.schema';

interface UseBrandFormProps {
  brand?: Brand;
  onClose: () => void;
}
export default function useBrandForm({ brand, onClose }: UseBrandFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name,
    },
  });

  const logoFile = useWatch({ control, name: 'logo' });

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!(logoFile instanceof File)) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const queryClient = useQueryClient();

  const onSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    onClose();
  };
  const onError = (error: Error) => toast.error(error.message);

  const createMutation = useMutation({
    mutationFn: api.createBrand,
    onSuccess: () => onSuccess('Brand created!'),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: (data: BrandFormData) => api.updateBrand(brand!.id, data),
    onSuccess: () => onSuccess('Brand updated!'),
    onError,
  });

  const mutation = brand ? updateMutation : createMutation;

  const onSubmit = (data: BrandFormData) => mutation.mutate(data);

  return { mutation, onSubmit, handleSubmit, logoPreviewUrl, errors, isDirty, control, register };
}
