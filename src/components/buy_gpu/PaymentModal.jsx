import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBetaFeatureToast } from '@/lib/utils';

const PaymentModal = ({ isOpen, setIsOpen, selectedPackage, onPaymentSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();

  const handleConfirmPayment = async () => {
    showBetaToast("Payment Confirmation Notice");
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500)); 

    setIsLoading(false);
    onPaymentSuccess({ transactionId: `sim_${Date.now()}` });
  };

  if (!selectedPackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-800/90 backdrop-blur-md border-slate-700 text-slate-200 shadow-2xl rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-100 flex items-center">
            <CreditCard className="mr-3 h-6 w-6 text-primary" /> Confirm Your Purchase
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            You are about to acquire the <span className="font-semibold text-primary">{selectedPackage.name}</span> for <span className="font-semibold text-primary">${selectedPackage.price}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-300 mb-1">Package Details:</h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1 pl-2">
              <li>GPU Model: {selectedPackage.gpuModel} ({selectedPackage.vram})</li>
              <li>vCPUs: {selectedPackage.vCpu}, RAM: {selectedPackage.ram}</li>
              <li>Storage: {selectedPackage.storage}</li>
              <li>$TRVN Credits: {selectedPackage.credits.toLocaleString()}</li>
            </ul>
          </div>
          <div className="flex items-center p-3 bg-green-600/10 border border-green-500/30 rounded-md">
            <ShieldCheck className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-xs text-green-300">This is a simulated secure payment process for beta testing.</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-600 hover:bg-slate-700">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Processing Payment...' : `Confirm & Pay $${selectedPackage.price}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;