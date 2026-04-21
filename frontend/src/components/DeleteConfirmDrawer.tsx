import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Button } from './ui/button';

interface DeleteConfirmDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isPending?: boolean;
  onConfirm: () => void;
  children?: React.ReactNode;
}

export default function DeleteConfirmDrawer({
  open,
  onOpenChange,
  title,
  description,
  isPending,
  onConfirm,
  children,
}: DeleteConfirmDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-4 space-y-4">
          <p className="text-sm text-muted-foreground">{description}</p>
          {children}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 bg-destructive text-white hover:bg-destructive/80"
              disabled={isPending}
              onClick={onConfirm}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
