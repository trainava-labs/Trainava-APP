import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Store, UserCircle, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GpuFilterControls from '@/components/rent_gpu/GpuFilterControls';
import GpuListRenderer from '@/components/rent_gpu/GpuListRenderer';
import RentalConfirmationDialog from '@/components/rent_gpu/RentalConfirmationDialog';
import useGpuDataFetching from '@/components/rent_gpu/hooks/useGpuDataFetching';
import useGpuFilters from '@/components/rent_gpu/hooks/useGpuFilters';
import { useBetaFeatureToast } from '@/lib/utils';

const TRAINAVA_CURATED_GPUS = [
  { id: 'tc_rtx3070', name: 'Trainava Cloud RTX 3070', model: 'NVIDIA GeForce RTX 3070', vram: '8GB GDDR6', power_score: 12, price_per_hour: 0.75, status: 'available', rentals_count: 112 },
  { id: 'tc_rtx4080', name: 'Trainava Cloud RTX 4080', model: 'NVIDIA GeForce RTX 4080', vram: '16GB GDDR6X', power_score: 25, price_per_hour: 1.50, status: 'available', rentals_count: 258 },
  { id: 'tc_a100', name: 'Trainava Cloud A100', model: 'NVIDIA A100', vram: '40GB HBM2', power_score: 80, price_per_hour: 3.00, status: 'available', rentals_count: 73 },
];

const RentGpuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();

  const { marketplaceGpus, userOwnedGpusForRent, isLoading, fetchAllGpus } = useGpuDataFetching(user?.id);
  const {
    searchTerm, setSearchTerm,
    priceRange, setPriceRange,
    powerScoreRange, setPowerScoreRange,
    filteredTrainavaGpus,
    filteredMarketplaceGpus,
    filteredUserOwnedGpus
  } = useGpuFilters(TRAINAVA_CURATED_GPUS, marketplaceGpus, userOwnedGpusForRent);

  const [selectedGpu, setSelectedGpu] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [pendingJobDetails, setPendingJobDetails] = useState(null);

  useEffect(() => {
    if (location.state?.fromTrainingPage && location.state?.jobDetails) {
      setPendingJobDetails(location.state.jobDetails);
      toast({
        title: "Rent GPU for Training Job",
        description: `Please select and rent a GPU to proceed with your training job: "${location.state.jobDetails.jobName}".`,
        variant: "info",
        duration: 8000,
      });
    }
  }, [location.state, toast]);


  const handleRentGpu = (gpu) => {
    showBetaToast("GPU Rental Process Notice");
    setSelectedGpu(gpu);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRental = async (gpuToRent, hours) => {
    showBetaToast("Rental Confirmation Notice");
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to rent a GPU.", variant: "destructive" });
      return;
    }

    try {
      const rentalData = {
        gpu_id: gpuToRent.id,
        renter_user_id: user.id,
        owner_user_id: gpuToRent.user_id || 'trainava_platform', // Placeholder for platform-owned
        start_time: new Date().toISOString(),
        // end_time_expected will be calculated based on hours, actual_end_time on termination
        total_cost: parseFloat(gpuToRent.rental_rate_hourly || gpuToRent.price_per_hour || 0) * hours,
        status: 'active',
      };

      const { data: newRental, error: rentalError } = await supabase
        .from('gpu_rentals')
        .insert(rentalData)
        .select()
        .single();

      if (rentalError) throw rentalError;

      if (gpuToRent.user_id && gpuToRent.user_id !== 'trainava_platform') { // Marketplace GPU
        await supabase
          .from('user_gpus')
          .update({ status: 'rented-out' })
          .eq('id', gpuToRent.id);
      }
      
      toast({ title: "GPU Rented Successfully!", description: `${gpuToRent.name || gpuToRent.model} rented for ${hours} hours.` });
      fetchAllGpus(); // Refresh GPU lists
      
      if (pendingJobDetails) {
        navigate('/train-ai', { 
            state: { 
                rentalDetails: { 
                    rentedGpuId: newRental.id, // Or gpuToRent.id if more appropriate
                    rentedGpuName: gpuToRent.name || gpuToRent.model,
                    rentalDuration: hours 
                } 
            } 
        });
        setPendingJobDetails(null); 
      }

    } catch (error) {
      toast({ title: "Rental Failed", description: error.message, variant: "destructive" });
    }
  };
  
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 }}};

  return (
    <>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
              <Store className="mr-3 h-8 w-8 text-primary" /> Rent GPU Power
            </h1>
            <p className="text-slate-400 mt-1">Access on-demand GPU resources from Trainava or the community marketplace.</p>
          </div>
           <Button variant="outline" onClick={() => { showBetaToast("GPU List Refresh Notice"); fetchAllGpus(); }} disabled={isLoading}>
            <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Lists
          </Button>
        </div>

        {pendingJobDetails && (
          <motion.div 
            className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg flex items-center gap-3"
            initial={{opacity:0, y: -20}} animate={{opacity:1, y:0}}
          >
            <AlertTriangle className="h-6 w-6 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-300">Action Required: Rent GPU for Training Job</h3>
              <p className="text-sm text-blue-400">
                You are renting a GPU for the training job: <span className="font-medium">"{pendingJobDetails.jobName}"</span> (Pipeline: {pendingJobDetails.pipelineName}). 
                Select a suitable GPU below to proceed.
              </p>
            </div>
          </motion.div>
        )}

        <GpuFilterControls
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          powerScoreRange={powerScoreRange}
          setPowerScoreRange={setPowerScoreRange}
        />

        <Tabs defaultValue="trainava-curated" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-800/50 p-1.5 rounded-lg">
            <TabsTrigger value="trainava-curated" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Cpu className="mr-2 h-5 w-5" /> Trainava Curated
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Store className="mr-2 h-5 w-5" /> Marketplace
            </TabsTrigger>
            <TabsTrigger value="my-gpus-for-rent" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCircle className="mr-2 h-5 w-5" /> My GPUs for Rent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trainava-curated" className="mt-6">
            <GpuListRenderer gpus={filteredTrainavaGpus} onRentGpu={handleRentGpu} isLoading={isLoading} listType="Trainava Curated" />
          </TabsContent>
          <TabsContent value="marketplace" className="mt-6">
            <GpuListRenderer gpus={filteredMarketplaceGpus} onRentGpu={handleRentGpu} isLoading={isLoading} listType="Marketplace" />
          </TabsContent>
          <TabsContent value="my-gpus-for-rent" className="mt-6">
            <GpuListRenderer gpus={filteredUserOwnedGpus} onRentGpu={handleRentGpu} isLoading={isLoading} listType="My GPUs for Rent" isOwnerView={true} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {selectedGpu && (
        <RentalConfirmationDialog
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
          gpu={selectedGpu}
          onConfirmRental={handleConfirmRental}
        />
      )}
    </>
  );
};

export default RentGpuPage;