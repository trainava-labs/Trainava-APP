import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Cpu } from 'lucide-react';

const GpuSelectionForTraining = ({
  ownedGpus,
  selectedGpuId,
  setSelectedGpuId,
  gpuSelectionMode,
  setGpuSelectionMode,
  isGpuLoading,
  onNavigateToBuyGpu
}) => {
  return (
    <Card className="shadow-lg bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center">
          <Cpu className="mr-2 h-5 w-5 text-primary" /> Select GPU Resource for Training
        </CardTitle>
        <CardDescription className="text-slate-400">
          Choose an available owned GPU or opt to rent one from the marketplace for this training session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup 
          value={gpuSelectionMode || ''} 
          onValueChange={(value) => { 
            setGpuSelectionMode(value); 
            if (value === 'owned') {
              setSelectedGpuId(null); // Reset specific GPU ID when switching to 'owned' mode
            } else if (value === 'rent-later') {
              setSelectedGpuId('rent-later-placeholder'); // Use placeholder for UI logic
            }
          }}
        >
          <Label className="flex items-center space-x-2 p-3 rounded-md border border-slate-600 hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <RadioGroupItem value="owned" id="owned-gpu" />
            <span>Use My Owned GPUs</span>
          </Label>
          {gpuSelectionMode === 'owned' && (
            isGpuLoading ? <p className="text-slate-400 p-2">Loading your GPUs...</p> :
            ownedGpus.length > 0 ? (
              <div className="pl-8 space-y-2 py-2 max-h-32 overflow-y-auto">
                {ownedGpus.map(gpu => (
                  <Label 
                    key={gpu.id} 
                    className={`flex items-center space-x-2 p-2 rounded-md border hover:border-accent cursor-pointer text-sm
                                ${selectedGpuId === gpu.id ? 'border-accent bg-accent/10' : 'border-slate-700'}`}
                  >
                    <RadioGroupItem 
                        value={gpu.id} 
                        id={`gpu-${gpu.id}`} 
                        checked={selectedGpuId === gpu.id} 
                        onCheckedChange={() => setSelectedGpuId(gpu.id)}
                    />
                    <span>{gpu.name} ({gpu.model}) - Status: <span className="capitalize">{gpu.status.replace(/-/g, ' ')}</span></span>
                  </Label>
                ))}
              </div>
            ) : <p className="text-slate-400 p-2 pl-8">You have no available owned GPUs. <Button variant="link" onClick={onNavigateToBuyGpu} className="p-0 h-auto text-primary">Purchase one?</Button></p>
          )}

          <Label className="flex items-center space-x-2 p-3 rounded-md border border-slate-600 hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <RadioGroupItem value="rent-later" id="rent-gpu" />
            <span>Rent a GPU from Marketplace (Configure job first, then rent)</span>
          </Label>
        </RadioGroup>
        {selectedGpuId && gpuSelectionMode === 'owned' && ownedGpus.find(g => g.id === selectedGpuId) && 
            <p className="text-sm text-green-400 pt-2">Selected Owned GPU: {ownedGpus.find(g => g.id === selectedGpuId)?.name}</p>
        }
        {gpuSelectionMode === 'rent-later' && 
            <p className="text-sm text-blue-400 pt-2">You will be prompted to rent a GPU after configuring the job.</p>
        }
      </CardContent>
    </Card>
  );
};

export default GpuSelectionForTraining;