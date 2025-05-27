import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, Zap, DollarSign, Users, CheckCircle, XCircle } from 'lucide-react';
import { useBetaFeatureToast } from '@/lib/utils';

const GpuCard = ({ gpu, onRent }) => {
  const { showBetaToast } = useBetaFeatureToast();

  const handleRentClick = () => {
    showBetaToast("GPU Rental Notice");
    onRent(gpu);
  };

  const isAvailable = gpu.status === 'available-for-rent' || gpu.status === 'idle' || !gpu.status; // Treat idle/undefined as available for Trainava curated
  const badgeText = isAvailable ? 'Available' : gpu.status === 'rented-out' ? 'Rented Out' : 'Unavailable';
  const badgeIcon = isAvailable ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />;
  const badgeColor = isAvailable ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30';

  return (
    <motion.div 
      className="h-full"
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(var(--color-primary-DEFAULT), 0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg flex flex-col h-full transition-all duration-300 hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl text-slate-100 flex items-center">
              <Cpu className="mr-2 h-6 w-6 text-primary" /> {gpu.name || gpu.model}
            </CardTitle>
            <Badge className={`text-xs px-2 py-1 ${badgeColor} flex items-center`}>
              {badgeIcon} {badgeText}
            </Badge>
          </div>
          {gpu.name && gpu.model !== gpu.name && <CardDescription className="text-slate-400">{gpu.model}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow space-y-2 text-sm">
          <div className="flex items-center text-slate-300">
            <Zap className="h-4 w-4 mr-2 text-yellow-400" /> Power Score: <span className="font-semibold text-slate-100 ml-1">{gpu.power_score} TFLOPS</span>
          </div>
          <div className="flex items-center text-slate-300">
            <DollarSign className="h-4 w-4 mr-2 text-green-400" /> Rate: <span className="font-semibold text-slate-100 ml-1">${parseFloat(gpu.rental_rate_hourly || gpu.price_per_hour || 0).toFixed(2)}/hr</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Cpu className="h-4 w-4 mr-2 text-blue-400" /> VRAM: <span className="font-semibold text-slate-100 ml-1">{gpu.vram}</span>
          </div>
          {gpu.rentals_count !== undefined && (
            <div className="flex items-center text-slate-400 text-xs">
              <Users className="h-3 w-3 mr-1.5 text-slate-500" /> {gpu.rentals_count} times rented
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t border-slate-700/50">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
            onClick={handleRentClick}
            disabled={!isAvailable}
          >
            Rent Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GpuCard;