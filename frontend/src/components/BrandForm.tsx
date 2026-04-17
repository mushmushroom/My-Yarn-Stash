import type { Brand } from '@/lib/types';
import { Field, FieldDescription, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { BACKEND_URL } from '@/lib/constants';

import { Button } from './ui/button';
import useBrandForm from '@/hooks/useBrandForm';
import { Controller } from 'react-hook-form';

interface BrandFormProps {
  brand?: Brand;
  onClose: () => void;
}
export default function BrandForm({ brand, onClose }: BrandFormProps) {
  const { mutation, handleSubmit, onSubmit, logoPreviewUrl, errors, isDirty, control, register } =
    useBrandForm({
      brand,
      onClose,
    });

  const logoSrc = logoPreviewUrl ?? (brand?.logo_filename ? `${BACKEND_URL}/static/brand-logos/${brand.logo_filename}` : null);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FieldGroup>
          {logoSrc && (
            <img
              className="w-24 h-auto max-h-10 object-contain"
              src={logoSrc}
              alt={logoPreviewUrl ? 'Logo preview' : brand?.name}
            />
          )}

          <Field>
            <FieldLabel htmlFor="brand-name">Name</FieldLabel>
            <Input id="brand-name" placeholder="Drops..." {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </Field>
          <Field>
            <FieldLabel htmlFor="logo">Logo</FieldLabel>
            <Controller
              control={control}
              name="logo"
              render={({ field: { onChange, ref } }) => (
                <Input
                  id="logo"
                  type="file"
                  ref={ref}
                  onChange={(e) => onChange(e.target.files?.[0])}
                />
              )}
            />
            <FieldDescription>Select a new logo.</FieldDescription>
            {errors.logo && <p className="text-sm text-destructive">{errors.logo.message}</p>}
          </Field>
        </FieldGroup>
        <Button type="submit" className="w-full" disabled={mutation.isPending || !isDirty}>
          {mutation.isPending ? 'Saving...' : brand ? 'Save changes' : 'Save brand'}
        </Button>
      </div>
    </form>
  );
}
