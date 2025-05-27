import React, { useState, useCallback } from 'react';

export const useGpuFilters = (initialPriceRange = [0.1, 5.0]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRangeState] = useState(initialPriceRange);
  const [minPowerScore, setMinPowerScore] = useState(0);

  const applyFilters = useCallback((gpus) => {
    if (!gpus || gpus.length === 0) return [];
    return gpus.filter(gpu => {
      const nameMatch = gpu.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const modelMatch = gpu.model?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = searchTerm ? (nameMatch || modelMatch) : true;
      
      const matchesPrice = gpu.rental_rate_hourly >= priceRange[0] && gpu.rental_rate_hourly <= priceRange[1];
      const matchesPower = minPowerScore > 0 ? (gpu.power_score || 0) >= minPowerScore : true;
      return matchesSearch && matchesPrice && matchesPower;
    });
  }, [searchTerm, priceRange, minPowerScore]);

  return {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange: setPriceRangeState,
    minPowerScore,
    setMinPowerScore,
    applyFilters,
  };
};