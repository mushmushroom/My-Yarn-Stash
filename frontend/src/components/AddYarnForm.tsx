import useAddYarnForm from '@/hooks/useAddYarnForm';
import { SkeinForm } from '@/components/SkeinForm';

interface AddYarnFormProps {
  onClose?: () => void;
}

export function AddYarnForm({ onClose }: AddYarnFormProps) {
  const { handleSubmit, onSubmit, isPending, submitError, register, control, setValue, errors, isDirty } =
    useAddYarnForm({ onClose });

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
      submitLabel="Save skein"
    />
  );
}
