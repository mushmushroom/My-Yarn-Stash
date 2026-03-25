import { useState } from 'react';
import { AddYarnForm } from '@/components/AddYarnForm';
import { StashView } from '@/components/StashView';
import { StashFilters } from '@/components/StashFilters';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectsView } from '@/components/ProjectsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Plus } from 'lucide-react';

function App() {
  const [skeinDrawerOpen, setSkeinDrawerOpen] = useState(false);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="skeins" className="flex flex-col h-screen">
        <div className="border-b bg-card px-6 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-6 py-3">
              <span className="font-semibold text-base tracking-tight">🧶 Yarn Stash</span>
              <TabsList className="bg-transparent gap-1 p-0">
                <TabsTrigger
                  value="skeins"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                >
                  Skeins
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                >
                  Projects
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="skeins" className="flex-1 overflow-auto py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your stash</h2>
              <div className="flex items-center gap-2">
                <StashFilters />
                <Drawer direction="right" open={skeinDrawerOpen} onOpenChange={setSkeinDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button size="sm">
                      <Plus className="size-4 mr-1" />
                      Add skein
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Add new skein</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4 overflow-auto">
                      <AddYarnForm onClose={() => setSkeinDrawerOpen(false)} />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            <StashView />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="flex-1 overflow-auto py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Drawer direction="right" open={projectDrawerOpen} onOpenChange={setProjectDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button size="sm">
                    <Plus className="size-4 mr-1" />
                    Add project
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>New project</DrawerTitle>
                  </DrawerHeader>
                  <div className="px-4 pb-4 overflow-auto">
                    <ProjectForm onClose={() => setProjectDrawerOpen(false)} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>

            <ProjectsView />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
