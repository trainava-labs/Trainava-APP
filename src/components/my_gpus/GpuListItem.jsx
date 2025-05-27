import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Settings, Trash2, Power, PowerOff, DollarSign, BarChart3 } from 'lucide-react';
import GpuRentalSettingsModal from '@/components/my_gpus/GpuRentalSettingsModal';
import GpuDeleteConfirmationDialog from '@/components/my_gpus/GpuDeleteConfirmationDialog';
import { useBetaFeatureToast } from '@/lib/utils';

const GpuListItem = ({ gpu, onUpdateStatus, onSaveRentalSettings, onDeleteGpu }) => {
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { showBetaToast } = useBetaFeatureToast();

  const handleToggleStatus = () => {
    showBetaToast("GPU Status Change Notice");
    const newStatus = gpu.status === 'idle' ? 'available-for-rent' : 'idle';
    onUpdateStatus(gpu.id, newStatus);
  };

  const handleOpenRentalModal = () => {
    showBetaToast("Rental Rate Setting Notice");
    setIsRentalModalOpen(true);
  };
  
  const handleOpenDeleteDialog = () => {
    showBetaToast("GPU Deletion Notice");
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'active-training': return 'default';
      case 'available-for-rent': return 'success';
      case 'rented-out': return 'warning';
      case 'idle': return 'secondary';
      default: return 'outline';
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <>
      <motion.div variants={itemVariants}>
        <Card className="bg-slate-800/60 border-slate-700 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col h-full">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-slate-100 flex items-center">
                  <Cpu className="mr-2 h-6 w-6 text-primary" /> {gpu.name}
                </CardTitle>
                <CardDescription className="text-slate-400">{gpu.model}</CardDescription>
              </div>
              <Badge variant={getStatusBadgeVariant(gpu.status)} className="capitalize text-xs">
                {gpu.status.replace(/-/g, ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm flex-grow">
            <div className="text-slate-400">VRAM: <span className="font-medium text-slate-200">{gpu.vram}</span></div>
            <div className="text-slate-400">Power Score: <span className="font-medium text-slate-200">{gpu.power_score} TFLOPS</span></div>
            <div className="text-slate-400">Purchased: <span className="font-medium text-slate-200">{new Date(gpu.purchase_date).toLocaleDateString()}</span></div>
            <div className="text-slate-400">Rate: <span className="font-medium text-slate-200">{gpu.rental_rate_hourly ? `$${parseFloat(gpu.rental_rate_hourly).toFixed(2)}/hr` : 'Not Set'}</span></div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700/50">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleStatus} 
              disabled={gpu.status === 'active-training' || gpu.status === 'rented-out'}
              className="text-xs border-slate-600 hover:bg-slate-700/80"
            >
              {gpu.status === 'idle' ? <Power className="mr-1 h-3 w-3 text-green-400" /> : <PowerOff className="mr-1 h-3 w-3 text-red-400" />}
              {gpu.status === 'idle' ? 'Make Rentable' : 'Set to Idle'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenRentalModal} className="text-xs border-slate-600 hover:bg-slate-700/80">
              <DollarSign className="mr-1 h-3 w-3" /> Rate
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { showBetaToast("GPU Analytics Notice"); alert("Analytics feature coming soon!"); }} className="text-xs text-slate-400 hover:text-primary hover:bg-primary/10 col-span-1">
              <BarChart3 className="mr-1 h-3 w-3" /> Analytics
            </Button>
            <Button variant="destructiveOutline" size="sm" onClick={handleOpenDeleteDialog} className="text-xs col-span-1">
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {isRentalModalOpen && (
        <GpuRentalSettingsModal
          isOpen={isRentalModalOpen}
          setIsOpen={setIsRentalModalOpen}
          gpu={gpu}
          onSave={onSaveRentalSettings}
        />
      )}
      {isDeleteDialogOpen && (
        <GpuDeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          gpuName={gpu.name}
          onConfirm={() => onDeleteGpu(gpu.id)}
        />
      )}
    </>
  );
};

export default GpuListItem;