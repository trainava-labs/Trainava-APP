import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

const GpuDeleteConfirmationDialog = ({ 
  isOpen, 
  onOpenChange, 
  gpu, 
  onConfirmDelete, 
  isProcessing 
}) => {
  if (!gpu) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500"/>Confirm Deletion
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Are you sure you want to delete "{gpu.name}"? This action cannot be undone. 
            If this GPU is part of an active rental or training job, deletion might fail or cause issues.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)} className="hover:bg-slate-700" disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirmDelete(gpu.id)} className="bg-red-600 hover:bg-red-700" disabled={isProcessing}>
            {isProcessing ? 'Deleting...' : 'Yes, Delete GPU'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GpuDeleteConfirmationDialog;