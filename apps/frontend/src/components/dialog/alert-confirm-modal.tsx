import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useModal } from '@/hooks/use-modal-store';

export default function AlertConfirmModal() {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'alertConfirmation';
  const alertData = data?.alertConfirmation;
  const handleClose = () => {
    onClose({ isConfirm: true });
  };
  const handleConfirm = () => {
    onClose({ isConfirm: true, detail: alertData?.detail });
  };
  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertData?.title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {alertData?.description || 'This action cannot be undone. This will permanently delete your data.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
