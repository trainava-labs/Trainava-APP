import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, CheckCircle, ShoppingCart } from 'lucide-react';
import GpuPackageCard from '@/components/buy_gpu/GpuPackageCard';
import OrderSummaryCard from '@/components/buy_gpu/OrderSummaryCard';
import PaymentModal from '@/components/buy_gpu/PaymentModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useBetaFeatureToast } from '@/lib/utils';

const GPU_PACKAGES = [
  { id: 'starter', name: 'Starter Node', price: 99, vCpu: 4, ram: '16GB', gpuModel: 'NVIDIA RTX A2000', storage: '250GB NVMe', credits: 1000, vram: '6GB GDDR6', powerScore: 8, earningPotential: '~ $50-150/month' },
  { id: 'pro', name: 'Pro Node', price: 249, vCpu: 8, ram: '32GB', gpuModel: 'NVIDIA RTX A4000', storage: '500GB NVMe', credits: 3000, vram: '16GB GDDR6', powerScore: 15, earningPotential: '~ $150-400/month' },
  { id: 'ultra', name: 'Ultra Node', price: 499, vCpu: 16, ram: '64GB', gpuModel: 'NVIDIA RTX A6000', storage: '1TB NVMe', credits: 7000, vram: '48GB GDDR6', powerScore: 38, earningPotential: '~ $400-1000+/month' },
];

const BuyGpuPowerPage = () => {
  const [selectedPackageId, setSelectedPackageId] = useState(GPU_PACKAGES[0].id);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { showBetaToast } = useBetaFeatureToast();

  const selectedPackage = GPU_PACKAGES.find(p => p.id === selectedPackageId);

  const handleProceedToPayment = () => {
    showBetaToast("Payment Process Notice");
    if (!selectedPackage) {
      toast({ title: "No Package Selected", description: "Please select a GPU package to proceed.", variant: "destructive" });
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    showBetaToast("Payment Success Notice");
    if (!user || !selectedPackage) return;

    try {
      const gpuData = {
        user_id: user.id,
        name: selectedPackage.name,
        model: selectedPackage.gpuModel,
        vram: selectedPackage.vram,
        power_score: selectedPackage.powerScore,
        status: 'idle', 
        purchase_date: new Date().toISOString(),
        rental_rate_hourly: null, 
      };

      const { data: newGpu, error: gpuError } = await supabase
        .from('user_gpus')
        .insert(gpuData)
        .select()
        .single();

      if (gpuError) throw gpuError;

      const { error: creditsError } = await supabase.rpc('increment_user_credits', {
        user_id_input: user.id,
        increment_amount: selectedPackage.credits
      });

      if (creditsError) throw creditsError;
      
      toast({
        title: "Purchase Successful!",
        description: `${selectedPackage.name} acquired and ${selectedPackage.credits} $TRVN credits added.`,
        action: <CheckCircle className="text-green-500" />,
      });
      setIsPaymentModalOpen(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };


  return (
    <>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Cpu className="mr-3 h-8 w-8 text-primary" /> Acquire GPU Power
          </h1>
          <p className="text-slate-400 mt-1">Choose a GPU node package to enhance your AI capabilities and earning potential.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-100">Select Your GPU Node Package</CardTitle>
              <CardDescription className="text-slate-400">Each package comes with $TRVN credits and powerful hardware.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPackageId} onValueChange={setSelectedPackageId} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GPU_PACKAGES.map((pkg) => (
                  <Label key={pkg.id} htmlFor={pkg.id} className="cursor-pointer">
                    <RadioGroupItem value={pkg.id} id={pkg.id} className="sr-only" />
                    <GpuPackageCard pkg={pkg} isSelected={selectedPackageId === pkg.id} />
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </motion.div>

        {selectedPackage && (
          <motion.div variants={itemVariants}>
            <OrderSummaryCard selectedPackage={selectedPackage} />
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handleProceedToPayment} 
            disabled={!selectedPackage}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-lg px-8 py-6"
          >
            <ShoppingCart className="mr-2 h-6 w-6" /> Proceed to Payment
          </Button>
        </motion.div>
      </motion.div>

      {selectedPackage && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          setIsOpen={setIsPaymentModalOpen}
          selectedPackage={selectedPackage}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default BuyGpuPowerPage;