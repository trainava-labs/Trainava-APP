import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { BrainCircuit, Bot, TrendingUp } from 'lucide-react';

const GpuPackageCard = ({ pkg, selectedPackageId, onSelect }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={itemVariants}>
      <Label
        htmlFor={pkg.id}
        className={`flex flex-col p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-primary/80
          ${selectedPackageId === pkg.id ? "border-primary bg-primary/10 shadow-lg" : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"}`}
        onClick={() => onSelect(pkg.id)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start w-full">
          <div className="flex items-center space-x-3 mb-3 sm:mb-0">
            <RadioGroupItem value={pkg.id} id={pkg.id} checked={selectedPackageId === pkg.id} className="border-slate-500 data-[state=checked]:border-primary data-[state=checked]:text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{pkg.name}</h3>
              <p className="text-sm text-slate-400">{pkg.GPU_Model} • {pkg.vCPU} vCPU • {pkg.RAM} RAM • {pkg.storage} • {pkg.vram} VRAM</p>
              <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
            </div>
          </div>
          <div className="text-right sm:ml-4 mt-2 sm:mt-0">
            <p className="text-2xl font-bold text-primary">${pkg.priceUSD}</p>
            <p className="text-xs text-slate-500">+{pkg.credits.toLocaleString()} $TRVN</p>
            {pkg.popular && <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-yellow-400/20 text-yellow-300 rounded-full">Popular</span>}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700/50 w-full">
          <h4 className="text-sm font-medium text-slate-300 mb-1">Estimated Usage & Income:</h4>
          <ul className="text-xs text-slate-400 space-y-0.5">
            <li className="flex items-center"><BrainCircuit className="h-3 w-3 mr-1.5 text-blue-400"/> {pkg.estimations.models}</li>
            <li className="flex items-center"><Bot className="h-3 w-3 mr-1.5 text-purple-400"/> {pkg.estimations.bots}</li>
            <li className="flex items-center"><TrendingUp className="h-3 w-3 mr-1.5 text-green-400"/> {pkg.estimations.income}</li>
          </ul>
        </div>
      </Label>
    </motion.div>
  );
};

export default GpuPackageCard;