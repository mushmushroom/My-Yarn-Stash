import { useEditSkeinForm } from '@/hooks/useEditSkeinForm';
import { SkeinForm } from '@/components/SkeinForm';
import type { SkeinItem } from '@/lib/types';

interface EditSkeinFormProps {
  skein: SkeinItem;
  onClose: () => void;
}

export function EditSkeinForm({ skein, onClose }: EditSkeinFormProps) {
  const { handleSubmit, onSubmit, isPending, submitError, register, control, setValue, errors, isDirty } =
    useEditSkeinForm({ skein, onClose });

  return (
    <SkeinForm
      control={control}
      register={register}
      setValue={setValue}
      errors={errors}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      isPending={isPending}
      isDirty={isDirty}
      submitError={submitError}
      submitLabel="Save changes"
    />
  );
}
