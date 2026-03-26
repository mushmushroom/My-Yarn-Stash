import { Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useProjectForm } from '@/hooks/useProjectForm';
import type { ProjectItem } from '@/lib/types';

interface ProjectFormProps {
  onClose: () => void;
  project?: ProjectItem;
}

export function ProjectForm({ onClose, project }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    errors,
    isDirty,
    fields,
    append,
    remove,
    watchedSkeins,
    allSkeins,
    usedWeightPerSkein,
    getOptionsForRow,
    categories,
    isPending,
    isEditing,
    onSubmit,
  } = useProjectForm({ project, onClose });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="project-name">Name</FieldLabel>
            <Input id="project-name" placeholder="Nordic Sweater" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </Field>

          <Field>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel>Skeins</FieldLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ skein_id: 0, weight_required: 0 })}
              >
                <Plus className="size-3.5 mr-1" /> Add skein
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skeins added yet.</p>
            ) : (
              <div className="space-y-2">
                {fields.map((field, index) => {
                  const selectedSkein = allSkeins.find(
                    (s) => s.id === watchedSkeins?.[index]?.skein_id,
                  );
                  const remaining = selectedSkein
                    ? selectedSkein.weight - (usedWeightPerSkein[selectedSkein.id] ?? 0)
                    : null;
                  const options = getOptionsForRow(index);

                  return (
                    <div key={field.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <Controller
                            name={`skeins.${index}.skein_id`}
                            control={control}
                            render={({ field: f }) => (
                              <Select
                                value={f.value > 0 ? String(f.value) : ''}
                                onValueChange={(val) => f.onChange(Number(val))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select skein" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.map((skein) => (
                                    <SelectItem key={skein.id} value={String(skein.id)}>
                                      <div className="flex items-start gap-2">
                                        <span
                                          className="size-3 rounded-full border border-border inline-block shrink-0 mt-0.5"
                                          style={{ backgroundColor: skein.color }}
                                        />
                                        <span className="whitespace-normal break-words min-w-0">
                                          {skein.brand.name} — {skein.name}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <InputGroup className="w-28 shrink-0">
                          <InputGroupInput
                            placeholder="100"
                            {...register(`skeins.${index}.weight_required`, { valueAsNumber: true })}
                          />
                          <InputGroupAddon align="inline-end">g</InputGroupAddon>
                        </InputGroup>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      {remaining !== null && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Available: {remaining}g
                        </p>
                      )}
                      {(errors.skeins?.[index]?.skein_id ||
                        errors.skeins?.[index]?.weight_required) && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.skeins?.[index]?.skein_id?.message ??
                            errors.skeins?.[index]?.weight_required?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={isPending || !isDirty}>
          {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Save project'}
        </Button>
      </div>
    </form>
  );
}
