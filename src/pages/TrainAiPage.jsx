import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cpu, Settings2, RotateCcw, PackageX, BrainCircuit } from 'lucide-react';
import TrainingPipelineConfigurationModal from '@/components/train_ai/TrainingPipelineConfigurationModal';
import TrainingJobListItem from '@/components/train_ai/TrainingJobListItem';
import GpuSelectionForTraining from '@/components/train_ai/GpuSelectionForTraining';
import { useBetaFeatureToast } from '@/lib/utils';

const PIPELINES = [
  { id: 'img-gen', name: 'Image Generation Pipeline', description: 'Train custom image models (e.g., Stable Diffusion variants).', icon: BrainCircuit, configFields: [{name: 'baseModel', label: 'Base Model Checkpoint', type: 'text', placeholder:'e.g., sd_v1-5_pruned.ckpt'}, {name: 'datasetUrl', label: 'Dataset URL (.zip images)', type: 'url'}, {name: 'epochs', label: 'Training Epochs', type: 'number', defaultValue: 100}] },
  { id: 'voice-clone', name: 'Voice Cloning Pipeline', description: 'Create realistic voice clones from audio samples.', icon: BrainCircuit, configFields: [{name: 'speakerName', label: 'Speaker Name', type: 'text'}, {name: 'audioSamplesUrl', label: 'Audio Samples URL (.zip wavs)', type: 'url'}, {name: 'targetText', label: 'Text for Cloned Voice to Speak', type: 'textarea'}] },
  { id: 'chatbot-tune', name: 'Chatbot Fine-Tuning', description: 'Fine-tune LLMs for specific chatbot tasks.', icon: BrainCircuit, configFields: [{name: 'baseLlm', label: 'Base LLM (e.g., Llama2-7B)', type: 'text'}, {name: 'instructionDatasetUrl', label: 'Instruction Dataset URL (.jsonl)', type: 'url'}, {name: 'outputModelName', label: 'Output Model Name', type: 'text'}] },
  { id: 'custom-model', name: 'Custom Model Training', description: 'Upload your own code and datasets for flexible training.', icon: BrainCircuit, configFields: [{name: 'gitRepoUrl', label: 'Git Repository URL (with Dockerfile)', type: 'url'}, {name: 'datasetPathInRepo', label: 'Dataset Path in Repo', type: 'text', placeholder:'e.g., /data'}, {name: 'entrypointCommand', label: 'Entrypoint Command', type: 'text', placeholder:'e.g., python train.py --epochs 50'}] },
];

const TrainAiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();
  
  const [ownedGpus, setOwnedGpus] = useState([]);
  const [selectedGpuId, setSelectedGpuId] = useState(null); // Can be actual GPU ID or 'rent-later-placeholder'
  const [gpuSelectionMode, setGpuSelectionMode] = useState(null); // 'owned' or 'rent-later' or 'rented'
  const [isGpuLoading, setIsGpuLoading] = useState(false);
  
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [jobConfig, setJobConfig] = useState({});
  const [jobName, setJobName] = useState('');

  const fetchOwnedGpus = useCallback(async () => {
    if (!user) return;
    setIsGpuLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_gpus')
        .select('id, name, model, status')
        .eq('user_id', user.id)
        .in('status', ['idle', 'available-for-rent']);
      if (error) throw error;
      setOwnedGpus(data || []);
    } catch (error) {
      toast({ title: "Error fetching owned GPUs", description: error.message, variant: "destructive" });
    } finally {
      setIsGpuLoading(false);
    }
  }, [user, toast]);

  const fetchTrainingJobs = useCallback(async () => {
    if (!user) return;
    setIsLoadingJobs(true);
    try {
      const { data, error } = await supabase
        .from('ai_training_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      setTrainingJobs(data || []);
    } catch (error) {
      toast({ title: "Error fetching training jobs", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingJobs(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchOwnedGpus();
    fetchTrainingJobs();
  }, [fetchOwnedGpus, fetchTrainingJobs]);

  const handleConfigurePipeline = (pipeline) => {
    showBetaToast("AI Training Configuration Notice");
    if (!gpuSelectionMode) {
      toast({ title: "Select GPU Resource", description: "Please select an owned GPU or choose to rent one before configuring.", variant: "warning" });
      return;
    }
    if (gpuSelectionMode === 'owned' && !selectedGpuId) {
        toast({ title: "Select Owned GPU", description: "Please select one of your available owned GPUs.", variant: "warning" });
        return;
    }

    setSelectedPipeline(pipeline);
    const initialConfig = {};
    pipeline.configFields.forEach(field => {
        initialConfig[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
    });
    setJobConfig(initialConfig);
    setJobName(`${pipeline.name} Job - ${new Date().toLocaleDateString()}`);
    setIsConfigModalOpen(true);
  };

  const launchTrainingJob = async () => {
    showBetaToast("AI Training Launch Notice");
    if (!selectedPipeline || !user || !jobName.trim()) {
      toast({ title: "Configuration Incomplete", description: "Pipeline or job name missing.", variant: "destructive" });
      return;
    }

    if (gpuSelectionMode === 'rent-later' && selectedGpuId === 'rent-later-placeholder') { 
        toast({ title: "GPU Required for Training", description: "Please rent a GPU to start this training job.", duration: 5000});
        localStorage.setItem('pendingTrainingJob', JSON.stringify({ pipeline: selectedPipeline, config: jobConfig, name: jobName }));
        navigate('/rent-gpu', { state: { fromTrainingPage: true, jobDetails: { pipelineName: selectedPipeline.name, jobName: jobName } } });
        setIsConfigModalOpen(false);
        return;
    }
    if (gpuSelectionMode === 'owned' && !ownedGpus.find(gpu => gpu.id === selectedGpuId)) {
        toast({ title: "No Owned GPU Selected", description: "Please select an available owned GPU.", variant: "destructive"});
        return;
    }

    setIsLoadingJobs(true);
    try {
      const jobData = {
        user_id: user.id,
        pipeline_name: selectedPipeline.name,
        job_config: { ...jobConfig, jobName },
        status: 'queued',
        progress: 0,
      };

      if (gpuSelectionMode === 'owned') {
        jobData.gpu_id_used = selectedGpuId;
      } else if (gpuSelectionMode === 'rented') {
        jobData.rented_gpu_id = selectedGpuId; // This ID is from gpu_rentals table
      }


      const { data, error } = await supabase
        .from('ai_training_jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      if (gpuSelectionMode === 'owned' && selectedGpuId) {
        await supabase
          .from('user_gpus')
          .update({ status: 'active-training' })
          .eq('id', selectedGpuId);
      }
      
      toast({ title: "Training Job Queued!", description: `Job "${jobName}" for ${selectedPipeline.name} has been successfully queued.` });
      setIsConfigModalOpen(false);
      setSelectedPipeline(null);
      setJobConfig({});
      setJobName('');
      fetchTrainingJobs();
      if (gpuSelectionMode === 'owned') fetchOwnedGpus(); // Refresh owned GPUs if one was used
      setGpuSelectionMode(null); // Reset selection mode
      setSelectedGpuId(null); // Reset selected GPU
    } catch (error) {
      toast({ title: "Failed to Launch Job", description: error.message, variant: "destructive" });
    } finally {
      setIsLoadingJobs(false);
    }
  };
  
  useEffect(() => {
    const pendingJobRaw = localStorage.getItem('pendingTrainingJob');
    const rentalDetails = location.state?.rentalDetails; 

    if (pendingJobRaw && rentalDetails?.rentedGpuId) {
        const pendingJob = JSON.parse(pendingJobRaw);
        setSelectedPipeline(PIPELINES.find(p => p.name === pendingJob.pipeline.name) || pendingJob.pipeline);
        setJobConfig(pendingJob.config);
        setJobName(pendingJob.name);
        
        setSelectedGpuId(rentalDetails.rentedGpuId); 
        setGpuSelectionMode('rented'); 

        toast({ title: "GPU Rented!", description: `GPU ${rentalDetails.rentedGpuName} ready for job: ${pendingJob.name}. Confirm launch.`, duration: 6000 });
        setIsConfigModalOpen(true); 
        localStorage.removeItem('pendingTrainingJob');
        navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, toast]);


  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 }}};
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 }}};

  return (
    <>
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-100">Train AI Models</h1>
        <p className="text-slate-400">Launch model training pipelines using your GPUs or rent from the marketplace.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <GpuSelectionForTraining
            ownedGpus={ownedGpus}
            selectedGpuId={selectedGpuId}
            setSelectedGpuId={setSelectedGpuId}
            gpuSelectionMode={gpuSelectionMode}
            setGpuSelectionMode={setGpuSelectionMode}
            isGpuLoading={isGpuLoading}
            onNavigateToBuyGpu={() => navigate('/buy-gpu-power')}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">Choose a Training Pipeline</h2>
      </motion.div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
      >
        {PIPELINES.map((pipeline) => (
          <motion.div key={pipeline.id} variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full flex flex-col bg-slate-800/70 border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <pipeline.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl text-slate-100">{pipeline.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-slate-400 mb-4">{pipeline.description}</p>
              </CardContent>
              <div className="p-4 border-t border-slate-700/50">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                  onClick={() => handleConfigurePipeline(pipeline)}
                  disabled={!gpuSelectionMode || (gpuSelectionMode === 'owned' && !selectedGpuId)}
                >
                  <Settings2 className="mr-2 h-5 w-5" /> Configure & Launch
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="shadow-lg bg-slate-800/70 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-xl text-slate-100">My Training Jobs</CardTitle>
                <CardDescription className="text-slate-400">Your active and recent training jobs.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => { showBetaToast("Refresh Training Jobs Notice"); fetchTrainingJobs(); }} disabled={isLoadingJobs}>
                <RotateCcw className={`mr-2 h-4 w-4 ${isLoadingJobs ? 'animate-spin': ''}`} /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingJobs && <p className="text-slate-400">Loading training jobs...</p>}
            {!isLoadingJobs && trainingJobs.length === 0 && (
              <div className="text-center py-8">
                <PackageX className="mx-auto h-12 w-12 text-slate-500 mb-3" />
                <p className="text-slate-400">No training jobs found. Launch one to see it here.</p>
              </div>
            )}
            {!isLoadingJobs && trainingJobs.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trainingJobs.map(job => (
                  <TrainingJobListItem key={job.id} job={job} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {isConfigModalOpen && selectedPipeline && (
      <TrainingPipelineConfigurationModal
        isOpen={isConfigModalOpen}
        setIsOpen={setIsConfigModalOpen}
        pipeline={selectedPipeline}
        jobName={jobName}
        setJobName={setJobName}
        jobConfig={jobConfig}
        setJobConfig={setJobConfig}
        onLaunch={launchTrainingJob}
        isLoading={isLoadingJobs}
        gpuSelectionMode={gpuSelectionMode}
        selectedGpuId={selectedGpuId}
      />
    )}
    </>
  );
};

export default TrainAiPage;