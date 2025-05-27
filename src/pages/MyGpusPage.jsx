import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Cpu, PlusCircle, PackageSearch, RotateCcw } from 'lucide-react';
import GpuListItem from '@/components/my_gpus/GpuListItem';
import { useBetaFeatureToast } from '@/lib/utils';

const MyGpusPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();
  const [gpus, setGpus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGpus = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_gpus')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setGpus(data || []);
    } catch (error) {
      toast({ title: "Error fetching GPUs", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchGpus();
  }, [fetchGpus]);

  const handleUpdateGpuStatus = async (gpuId, newStatus) => {
    showBetaToast("GPU Status Update Notice");
    try {
      const { error } = await supabase
        .from('user_gpus')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', gpuId);
      if (error) throw error;
      toast({ title: "GPU Status Updated", description: `GPU status changed to ${newStatus.replace(/-/g, ' ')}.` });
      fetchGpus();
    } catch (error) {
      toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
    }
  };

  const handleSaveRentalSettings = async (gpuId, rentalRate) => {
     showBetaToast("Rental Settings Save Notice");
    try {
      const { error } = await supabase
        .from('user_gpus')
        .update({ rental_rate_hourly: rentalRate, status: 'available-for-rent', updated_at: new Date().toISOString() })
        .eq('id', gpuId);
      if (error) throw error;
      toast({ title: "Rental Settings Saved", description: `GPU rental rate set to $${rentalRate}/hr and status updated.` });
      fetchGpus();
    } catch (error) {
      toast({ title: "Failed to save settings", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteGpu = async (gpuId) => {
    showBetaToast("GPU Deletion Notice");
    try {
      const { error } = await supabase
        .from('user_gpus')
        .delete()
        .eq('id', gpuId);
      if (error) throw error;
      toast({ title: "GPU Deleted", description: "The GPU has been removed from your inventory." });
      fetchGpus();
    } catch (error) {
      toast({ title: "Failed to delete GPU", description: error.message, variant: "destructive" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Cpu className="mr-3 h-8 w-8 text-primary" /> My GPU Nodes
          </h1>
          <p className="text-slate-400 mt-1">Manage your purchased GPU computing resources.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { showBetaToast("Refresh GPUs Notice"); fetchGpus(); }} disabled={isLoading}>
            <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={() => { showBetaToast("Acquire GPU Notice"); navigate('/buy-gpu-power'); }} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-5 w-5" /> Acquire More Power
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
              <div className="h-10 bg-slate-700 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && gpus.length === 0 && (
        <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-dashed border-slate-700">
          <PackageSearch className="mx-auto h-16 w-16 text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-slate-200 mb-2">No GPU Nodes Found</h3>
          <p className="text-slate-400 mb-6">You haven't acquired any GPU power yet. Get started by purchasing a node.</p>
          <Button onClick={() => { showBetaToast("Acquire GPU Notice"); navigate('/buy-gpu-power'); }} size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
            <PlusCircle className="mr-2 h-5 w-5" /> Acquire GPU Power
          </Button>
        </div>
      )}

      {!isLoading && gpus.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {gpus.map(gpu => (
            <GpuListItem
              key={gpu.id}
              gpu={gpu}
              onUpdateStatus={handleUpdateGpuStatus}
              onSaveRentalSettings={handleSaveRentalSettings}
              onDeleteGpu={handleDeleteGpu}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyGpusPage;