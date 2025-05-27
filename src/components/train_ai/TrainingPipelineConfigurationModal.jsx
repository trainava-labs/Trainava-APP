import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const TrainingPipelineConfigurationModal = ({
  isOpen,
  setIsOpen,
  pipeline,
  jobName,
  setJobName,
  jobConfig,
  setJobConfig,
  onLaunch,
  isLoading,
  gpuSelectionMode,
  selectedGpuId // This is the ID of the owned GPU or the rented GPU, or 'rent-later-placeholder'
}) => {
  if (!pipeline) return null;

  const handleJobConfigChange = (fieldName, value) => {
    setJobConfig(prev => ({ ...prev, [fieldName]: value }));
  };

  const getButtonText = () => {
    if (isLoading) return "Submitting...";
    if (gpuSelectionMode === 'rent-later' && selectedGpuId === 'rent-later-placeholder') {
      return "Proceed to Rent GPU";
    }
    return "Launch Training Job";
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200 max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Configure: {pipeline.name}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Set up the parameters for your "{jobName || pipeline.name}" training job.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-slate-700/50">
          <div className="space-y-1">
              <Label htmlFor="jobName" className="text-slate-300">Job Name</Label>
              <Input 
                  id="jobName" 
                  value={jobName} 
                  onChange={(e) => setJobName(e.target.value)} 
                  placeholder="Descriptive name for this job"
                  className="bg-slate-700/50 border-slate-600 focus:border-primary" 
              />
          </div>
          {pipeline.configFields.map(field => (
            <div key={field.name} className="space-y-1">
              <Label htmlFor={field.name} className="text-slate-300">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  value={jobConfig[field.name] || ''}
                  onChange={(e) => handleJobConfigChange(field.name, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className="bg-slate-700/50 border-slate-600 focus:border-primary min-h-[80px]"
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  value={jobConfig[field.name] || ''}
                  onChange={(e) => handleJobConfigChange(field.name, e.target.value)}
                  placeholder={field.placeholder || ''}
                  className="bg-slate-700/50 border-slate-600 focus:border-primary"
                />
              )}
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)} className="hover:bg-slate-700">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onLaunch} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {getButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TrainingPipelineConfigurationModal;