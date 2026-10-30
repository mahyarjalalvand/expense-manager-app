import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
type Props = {
  open: boolean;
  isEditing: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function BudgetIncomeConfirmDialog({ open, isEditing, isPending, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Budget exceeds your income</AlertDialogTitle>

          <AlertDialogDescription>The budget amount is higher than your recorded income for this month. Do you want to continue anyway? </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isEditing ? "Update anyway" : "Create anyway"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BudgetIncomeConfirmDialog;
