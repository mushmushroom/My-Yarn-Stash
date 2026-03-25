import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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
import { useSkeinsStore } from '@/store/skeins.store';
import { api } from '@/api/api';
import type { ProjectItem } from '@/lib/types';

// Static schema for type derivation only
// TODO move to separate files
const projectSchemaBase = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  skeins: z.array(
    z.object({
      skein_id: z.number().positive('Please select a skein'),
      weight_required: z.number({ error: 'Required' }).positive('Must be positive'),
    })
  ),
});

export type ProjectFormData = z.infer<typeof projectSchemaBase>;

interface ProjectFormProps {
  onClose: () => void;
  project?: ProjectItem;
}

export function ProjectForm({ onClose, project }: ProjectFormProps) {
  const { grouped, fetch } = useSkeinsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  const { data: existingProjects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const allSkeins = useMemo(
    () =>
      Object.values(grouped).flatMap((brandSkeins) =>
        Object.values(brandSkeins).flatMap((variants) => variants),
      ),
    [grouped],
  );

  // Total weight committed to existing projects per skein
  const usedWeightPerSkein = useMemo(() => {
    const map: Record<number, number> = {};
    for (const p of existingProjects) {
      if (project && p.id === project.id) continue;
      for (const s of p.skeins) {
        map[s.skein_id] = (map[s.skein_id] ?? 0) + s.weight_required;
      }
    }
    return map;
  }, [existingProjects, project]);

  const resolver = useMemo(
    () =>
      zodResolver(
        projectSchemaBase.extend({
          skeins: z
            .array(
              z.object({
                skein_id: z.number().positive('Please select a skein'),
                weight_required: z.number({ error: 'Required' }).positive('Must be positive'),
              }),
            )
            .superRefine((skeins, ctx) => {
              skeins.forEach((item, index) => {
                const skein = allSkeins.find((s) => s.id === item.skein_id);
                if (skein && item.weight_required > 0) {
                  const remaining = skein.weight - (usedWeightPerSkein[skein.id] ?? 0);
                  if (item.weight_required > remaining) {
                    ctx.addIssue({
                      code: 'custom',
                      message: `Only ${remaining}g available`,
                      path: [index, 'weight_required'],
                    });
                  }
                }
              });
            }),
        }),
      ),
    [allSkeins, usedWeightPerSkein],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver,
    defaultValues: project
      ? { name: project.name, category: project.category, skeins: project.skeins.map((s) => ({ skein_id: s.skein_id, weight_required: s.weight_required })) }
      : { name: '', category: '', skeins: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'skeins' });

  const watchedSkeins = useWatch({ control, name: 'skeins' });

  const queryClient = useQueryClient();

  const onSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ['projects'] });
    onClose();
  };
  const onError = (error: Error) => toast.error(error.message);

  const createMutation = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => onSuccess('Project created!'),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectFormData) => api.updateProject(project!.id, data),
    onSuccess: () => onSuccess('Project updated!'),
    onError,
  });

  const mutation = project ? updateMutation : createMutation;

  // Per-row: exclude skeins already picked in other rows, and those fully used in other projects
  const getOptionsForRow = (index: number) => {
    const selectedElsewhere = new Set(
      watchedSkeins
        ?.filter((_, i) => i !== index)
        .map((s) => s.skein_id)
        .filter((id) => id > 0),
    );
    return allSkeins.filter((skein) => {
      if (selectedElsewhere.has(skein.id)) return false;
      const remaining = skein.weight - (usedWeightPerSkein[skein.id] ?? 0);
      return remaining > 0;
    });
  };

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
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

        <Button type="submit" className="w-full" disabled={mutation.isPending || !isDirty}>
          {mutation.isPending ? 'Saving...' : project ? 'Save changes' : 'Save project'}
        </Button>
      </div>
    </form>
  );
}
