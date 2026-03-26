import { useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useSkeinsStore } from '@/store/skeins.store';
import { api } from '@/api/api';
import { projectSchemaBase } from '@/schemas/project.schema';
import type { ProjectFormData, ProjectItem } from '@/lib/types';

interface UseProjectFormProps {
  project?: ProjectItem;
  onClose: () => void;
}

export function useProjectForm({ project, onClose }: UseProjectFormProps) {
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
      ? {
          name: project.name,
          category: project.category,
          skeins: project.skeins.map((s) => ({ skein_id: s.skein_id, weight_required: s.weight_required })),
        }
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

  return {
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
    isPending: mutation.isPending,
    isEditing: !!project,
    onSubmit: (data: ProjectFormData) => mutation.mutate(data),
  };
}
