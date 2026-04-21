import { useState } from 'react';
import StashView from '@/components/StashView';
import StashFilters from '@/components/StashFilters';
import ProjectForm from '@/components/ProjectForm';
import ProjectsView from '@/components/ProjectsView';
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
import BrandsView from './components/BrandsView';
import BrandForm from './components/BrandForm';
import SkeinForm from './components/SkeinForm';

function App() {
  const [skeinDrawerOpen, setSkeinDrawerOpen] = useState(false);
  const [projectDrawerOpen, setProjectDrawerOpen] = useState(false);
  const [brandDrawerOpen, setBrandDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="skeins" className="flex flex-col h-screen">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-background border-b border-foreground/8">
          <div className="max-w-[1240px] mx-auto px-8 py-[18px] flex items-center gap-8">
            {/* Wordmark */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div
                className="w-7 h-7 rounded-full shrink-0"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #f4c07a, #b86a2e 55%, #8a4819)',
                  boxShadow:
                    'inset -2px -3px 6px rgba(0,0,0,0.25), inset 2px 2px 4px rgba(255,255,255,0.3)',
                }}
              />
              <span className="text-primary font-bold text-[18px] tracking-tight underline underline-offset-2 decoration-primary/40">
                Yarn Stash
              </span>
            </div>

            {/* Nav tabs in pill container */}
            <TabsList
              className="rounded-full p-1 gap-1 h-auto"
              style={{ background: 'color-mix(in oklab, var(--foreground) 5%, transparent)' }}
            >
              {['skeins', 'projects', 'brands'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="border-0 font-medium text-sm px-4 py-2 rounded-full capitalize transition-all text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1" />
          </div>
        </div>

        {/* Skeins */}
        <TabsContent value="skeins" className="flex-1 overflow-auto">
          <div className="max-w-[1240px] mx-auto px-8 pt-10 pb-20">
            <div className="flex items-end justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.025em] text-foreground leading-[1.05] m-0">
                  Your stash
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <StashFilters />
                <Drawer direction="right" open={skeinDrawerOpen} onOpenChange={setSkeinDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button className="rounded-full bg-primary text-white hover:bg-primary/90 gap-1.5 shadow-sm">
                      <Plus className="size-4" />
                      Add skein
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Add new skein</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-4 overflow-auto">
                      <SkeinForm onClose={() => setSkeinDrawerOpen(false)} />
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
            <StashView />
          </div>
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="flex-1 overflow-auto">
          <div className="max-w-[1240px] mx-auto px-8 pt-10 pb-20">
            <div className="flex items-end justify-between gap-6 mb-8">
              <h1 className="text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.025em] text-foreground leading-[1.05] m-0">
                Projects
              </h1>
              <Drawer
                direction="right"
                open={projectDrawerOpen}
                onOpenChange={setProjectDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <Button className="rounded-full bg-primary text-white hover:bg-primary/90 gap-1.5 shadow-sm">
                    <Plus className="size-4" />
                    Add project
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>New project</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pb-4 overflow-auto">
                    <ProjectForm onClose={() => setProjectDrawerOpen(false)} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            <ProjectsView />
          </div>
        </TabsContent>

        {/* Brands */}
        <TabsContent value="brands" className="flex-1 overflow-auto">
          <div className="max-w-[1240px] mx-auto px-8 pt-10 pb-20">
            <div className="flex items-end justify-between gap-6 mb-8">
              <h1 className="text-[clamp(32px,4vw,44px)] font-bold tracking-[-0.025em] text-foreground leading-[1.05] m-0">
                Brands
              </h1>
              <Drawer direction="right" open={brandDrawerOpen} onOpenChange={setBrandDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button className="rounded-full bg-primary text-white hover:bg-primary/90 gap-1.5 shadow-sm">
                    <Plus className="size-4" />
                    Add brand
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>New brand</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pb-4 overflow-auto">
                    <BrandForm onClose={() => setBrandDrawerOpen(false)} />
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            <BrandsView />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
