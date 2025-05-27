import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const GpuRentalSettingsModal = ({ 
  isOpen, 
  onOpenChange, 
  gpu, 
  onSaveSettings,
  isProcessing 
}) => {
  const [rentalRate, setRentalRate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (gpu) {
      setRentalRate(gpu.rental_rate_hourly ? gpu.rental_rate_hourly.toString() : '0.50');
    }
  }, [gpu]);

  const handleSave = () => {
    const rate = parseFloat(rentalRate);
    if (isNaN(rate) || rate <= 0) {
      toast({ title: "Invalid Rental Rate", description: "Please enter a valid positive number for the rental rate.", variant: "destructive" });
      return;
    }
    onSaveSettings(gpu, rate);
  };

  if (!gpu) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Rental Settings for {gpu.name}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Set the hourly rental rate for your GPU. Setting a rate will also make it available for rent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="modal-rental-rate" className="text-slate-300">Hourly Rental Rate ($TRVN or USD equivalent)</Label>
          <Input
            id="modal-rental-rate"
            type="number"
            value={rentalRate}
            onChange={(e) => setRentalRate(e.target.value)}
            placeholder="e.g., 0.75"
            min="0.01"
            step="0.01"
            className="bg-slate-700/50 border-slate-600 focus:border-primary"
            disabled={isProcessing}
          />
          <p className="text-xs text-slate-500">A competitive rate attracts more renters. Your GPU will be listed as 'available-for-rent'.</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)} className="hover:bg-slate-700" disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={isProcessing}>
            {isProcessing ? 'Saving...' : 'Save & List for Rent'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GpuRentalSettingsModal;