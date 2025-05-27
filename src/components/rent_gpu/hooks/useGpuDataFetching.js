import React, { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const PREDEFINED_TRAINAVA_GPUS_TEMPLATE = [
  {
    id: 'trainava-gpu-rtx4090-01',
    name: 'Trainava Titan RTX 4090',
    model: 'NVIDIA GeForce RTX 4090',
    vram: '24GB GDDR6X',
    power_score: 14500,
    rental_rate_hourly: 1.50,
    is_curated: true,
    capacity: 10,
    owner_profile: { full_name: 'Trainava Platform' },
    rental_count: Math.floor(Math.random() * 5) + 1, // Simulated initial rental count
  },
  {
    id: 'trainava-gpu-a100-01',
    name: 'Trainava Pro A100',
    model: 'NVIDIA A100',
    vram: '80GB HBM2e',
    power_score: 13500,
    rental_rate_hourly: 2.00,
    is_curated: true,
    capacity: 5,
    owner_profile: { full_name: 'Trainava Platform' },
    rental_count: Math.floor(Math.random() * 3), // Simulated initial rental count
  },
  {
    id: 'trainava-gpu-rtx3070-01',
    name: 'Trainava Swift RTX 3070',
    model: 'NVIDIA GeForce RTX 3070',
    vram: '8GB GDDR6',
    power_score: 9500,
    rental_rate_hourly: 0.75,
    is_curated: true,
    capacity: 15,
    owner_profile: { full_name: 'Trainava Platform' },
    rental_count: Math.floor(Math.random() * 8) + 2, // Simulated initial rental count
  },
];


export const useGpuDataFetching = (applyFilters) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [marketplaceGpus, setMarketplaceGpus] = useState([]);
  const [myGpusForRent, setMyGpusForRent] = useState([]);
  const [trainavaGpus, setTrainavaGpus] = useState(PREDEFINED_TRAINAVA_GPUS_TEMPLATE.map(g => ({...g}))); // Initial state with simulated counts

  const [isLoading, setIsLoading] = useState({ marketplace: true, myGpus: true, trainava: false }); // trainava initially false as it's static

  const fetchRawGpus = useCallback(async (type) => {
    if (!user && type !== 'trainava') {
      setIsLoading(prev => ({ ...prev, [type]: false }));
      return;
    }
    setIsLoading(prev => ({ ...prev, [type]: true }));

    try {
      if (type === 'trainava') {
        // Static data, already initialized. We only apply filters.
        // No network call needed for fetching, rental counts are simulated
        setTrainavaGpus(applyFilters(PREDEFINED_TRAINAVA_GPUS_TEMPLATE.map(g => ({...g})))); // Re-apply filters to static data
        setIsLoading(prev => ({ ...prev, trainava: false }));
        return;
      }
      
      let query = supabase
        .from('user_gpus')
        .select('*, owner_profile:user_profiles(id, full_name)')
        .eq('status', 'available-for-rent');

      if (type === 'marketplace') {
        query = query.not('user_id', 'eq', user.id);
      } else { // myGpus
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('rental_rate_hourly', { ascending: true });
      if (error) throw error;

      const gpusData = data || [];
      if (type === 'marketplace') {
        setMarketplaceGpus(applyFilters(gpusData));
      } else {
        setMyGpusForRent(applyFilters(gpusData));
      }

    } catch (error) {
      toast({ title: `Error Fetching ${type} GPUs`, description: error.message, variant: "destructive" });
      if (type === 'marketplace') setMarketplaceGpus([]);
      if (type === 'myGpus') setMyGpusForRent([]);
    } finally {
      setIsLoading(prev => ({ ...prev, [type]: false }));
    }
  }, [user, toast, applyFilters]);
  
  const refreshFilteredData = useCallback(() => {
    setMarketplaceGpus(currentGpus => applyFilters(currentGpus.map(g => ({...g}))));
    setMyGpusForRent(currentGpus => applyFilters(currentGpus.map(g => ({...g}))));
    setTrainavaGpus(currentGpus => applyFilters(currentGpus.map(g => ({...g}))));
  }, [applyFilters]);


  const incrementTrainavaGpuRentalCount = (gpuId) => {
    setTrainavaGpus(prevGpus =>
      prevGpus.map(gpu =>
        gpu.id === gpuId && gpu.is_curated
          ? { ...gpu, rental_count: (gpu.rental_count || 0) + 1 }
          : gpu
      )
    );
  };


  return {
    marketplaceGpus,
    myGpusForRent,
    trainavaGpus,
    isLoading,
    fetchGpus: fetchRawGpus, // Renamed internal function to avoid conflict
    refreshFilteredData,
    incrementTrainavaGpuRentalCount,
    setMarketplaceGpus,
    setMyGpusForRent,
    setTrainavaGpus
  };
};