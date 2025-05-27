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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useBetaFeatureToast } from '@/lib/utils';

const RentalConfirmationDialog = ({ isOpen, setIsOpen, gpu, onConfirmRental }) => {
  const [hours, setHours] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { showBetaToast } = useBetaFeatureToast();

  useEffect(() => {
    if (gpu) {
      const rate = parseFloat(gpu.rental_rate_hourly || gpu.price_per_hour || 0);
      setTotalCost(rate * hours);
    }
  }, [gpu, hours]);

  const handleConfirm = async () => {
    showBetaToast("Rental Confirmation Notice");
    setIsLoading(true);
    await onConfirmRental(gpu, hours);
    setIsLoading(false);
    setIsOpen(false);
  };

  if (!gpu) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-slate-800/90 backdrop-blur-md border-slate-700 text-slate-200 shadow-2xl rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-slate-100 flex items-center">
            <ShoppingCart className="mr-3 h-6 w-6 text-primary" /> Confirm GPU Rental
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            You are about to rent <span className="font-semibold text-primary">{gpu.name || gpu.model}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm text-slate-300">Model: <span className="font-medium text-slate-100">{gpu.model}</span></p>
            <p className="text-sm text-slate-300">Power: <span className="font-medium text-slate-100">{gpu.power_score} TFLOPS</span></p>
            <p className="text-sm text-slate-300">Rate: <span className="font-medium text-slate-100">${parseFloat(gpu.rental_rate_hourly || gpu.price_per_hour || 0).toFixed(2)}/hr</span></p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rental-hours" className="text-slate-300">Rental Duration (hours)</Label>
            <Input 
              id="rental-hours"
              type="number"
              min="1"
              max="24" 
              value={hours}
              onChange={(e) => setHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="bg-slate-700/50 border-slate-600 focus:border-primary text-slate-100"
            />
          </div>

          <div className="text-lg font-semibold text-slate-100">
            Total Estimated Cost: <span className="text-primary">${totalCost.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slate-500">Actual cost will be based on precise usage time, billed from your $TRVN credits.</p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)} className="hover:bg-slate-700">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? 'Processing...' : 'Confirm & Rent'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RentalConfirmationDialog;