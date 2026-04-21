import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { api } from '@/api/api';
import  ProjectForm  from '@/components/ProjectForm';
import  DeleteConfirmDrawer  from '@/components/DeleteConfirmDrawer';
import type { ProjectItem } from '@/lib/types';

export default function ProjectsView() {
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [confirmingProject, setConfirmingProject] = useState<ProjectItem | null>(null);

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => {
      toast.success('Project removed');
      setConfirmingProject(null);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => {
      toast.error('Failed to delete project');
      setConfirmingProject(null);
    },
  });

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading projects...</p>;
  if (isError) return <p className="text-destructive text-sm">Failed to load projects.</p>;

  if (projects.length === 0) {
    return <p className="text-muted-foreground text-sm">No projects yet.</p>;
  }

  return (
    <>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-card rounded-xl border border-border border-l-4 border-l-primary shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-heading text-lg">{project.name}</h3>
                <p className="text-xs font-medium text-primary/70">{project.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {project.skeins.length} skein{project.skeins.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingProject(project)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  disabled={deleteMutation.isPending && confirmingProject?.id === project.id}
                  onClick={() => setConfirmingProject(project)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>

            {project.skeins.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.skeins.map((skein) => (
                  <div
                    key={skein.skein_id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/60 text-sm text-accent-foreground"
                  >
                    <span
                      className="size-3 rounded-full border border-border shrink-0 inline-block"
                      style={{ backgroundColor: skein.color }}
                    />
                    <span>{skein.brand?.name ?? 'No brand'} — {skein.name}</span>
                    <span className="text-muted-foreground">· {skein.weight_required}g</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <DeleteConfirmDrawer
        open={!!confirmingProject}
        onOpenChange={(open) => { if (!open) setConfirmingProject(null); }}
        title={`Delete "${confirmingProject?.name}"?`}
        description="This project will be permanently deleted. Your skeins will remain in your stash."
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(confirmingProject!.id)}
      />

      <Drawer open={!!editingProject} onOpenChange={(open) => { if (!open) setEditingProject(null); }} direction="right">
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit project</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            {editingProject && (
              <ProjectForm
                project={editingProject}
                onClose={() => setEditingProject(null)}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
