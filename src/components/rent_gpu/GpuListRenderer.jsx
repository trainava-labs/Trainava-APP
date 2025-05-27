import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap } from 'lucide-react';
import GpuCard from '@/components/rent_gpu/GpuCard';

const GpuListRenderer = ({ 
  gpus, 
  isLoading, 
  activeTab, 
  listType, 
  onRentNow, 
  isProcessingRental, 
  toast 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const currentListIsActiveTab = listType === activeTab;

  if (isLoading && currentListIsActiveTab) {
    return (
      <div className="flex items-center justify-center h-64">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-slate-300">Loading GPUs...</p>
      </div>
    );
  }

  if (gpus.length === 0 && currentListIsActiveTab) {
    return (
      <motion.div variants={itemVariants} className="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg mt-6">
        <Cpu className="mx-auto h-16 w-16 text-slate-500 mb-4" />
        <h2 className="text-xl font-semibold text-slate-300 mb-2">No GPUs Found</h2>
        <p className="text-slate-400">Try adjusting your filters or check back later for this category.</p>
      </motion.div>
    );
  }
  
  if (!currentListIsActiveTab && !isLoading && gpus.length === 0) return null;

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 pt-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {gpus.map((gpu) => (
        <GpuCard 
          key={gpu.id} 
          gpu={gpu} 
          onRentNow={() => {
            if (listType === "myGpus") {
              toast({title: "Cannot Rent Own GPU", description: "You cannot rent your own GPU from this interface.", variant: "default"});
            } else {
              onRentNow(gpu);
            }
          }}
          isLoading={isProcessingRental} 
        />
      ))}
    </motion.div>
  );
};

export default GpuListRenderer;