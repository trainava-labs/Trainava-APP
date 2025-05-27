import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cpu, DollarSign, Zap, Bot, BrainCircuit, ShoppingCart, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient'; 
import StatCard from '@/components/dashboard/StatCard';
import ActionButton from '@/components/dashboard/ActionButton';
import { useAuth } from '@/contexts/AuthContext';

const DashboardOverviewPage = () => {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({
    gpusOwned: 0,
    totalTrvnBalance: 0,
    aiModelsCreated: 0,
    isLoading: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setDashboardStats(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      setDashboardStats(prev => ({ ...prev, isLoading: true }));
      
      try {
        const { count: gpusCount, error: gpuError } = await supabase
          .from('user_gpus')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (gpuError) throw gpuError;

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
        if (profileError && profileError.code !== 'PGRST116') throw profileError; //PGRST116 is fine if profile not created yet

        // For AI models, let's assume you have a table `user_ai_models`
        // const { count: modelsCount, error: modelError } = await supabase.from('ai_training_jobs').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
        // if (modelError) throw modelError;
        // For now, using placeholder
        const modelsCount = 0;


        setDashboardStats({
          gpusOwned: gpusCount || 0,
          totalTrvnBalance: profile?.credits || 0,
          aiModelsCreated: modelsCount || 0,
          isLoading: false,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardStats({
          gpusOwned: 0,
          totalTrvnBalance: 0,
          aiModelsCreated: 0,
          isLoading: false,
        });
      }
    };

    fetchDashboardData();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      },
    },
  };

  if (dashboardStats.isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Zap className="h-12 w-12 text-primary animate-pulse" />
        <p className="ml-4 text-xl text-slate-300">Loading Dashboard...</p>
      </div>
    );
  }

  const isNewUserExperience = dashboardStats.gpusOwned === 0 && dashboardStats.totalTrvnBalance === 0 && dashboardStats.aiModelsCreated === 0;

  return (
    <motion.div 
      className="space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="page-title gradient-text mb-1 sm:mb-2">Welcome to Trainava</h1>
        <p className="text-slate-400 text-md sm:text-lg">
          {isNewUserExperience ? "Your journey into GPU-powered AI & Web3 starts here." : "Your central hub for GPU power, AI model deployment, and $TRVN earnings."}
        </p>
      </motion.div>

      {isNewUserExperience ? (
        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card className="bg-slate-800/60 border-slate-700/80 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-100">Get Started with Trainava</CardTitle>
                <CardDescription className="text-slate-400">
                  Unlock the full potential of decentralized AI by taking your first steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <ActionButton 
                  to="/buy-gpu-power" 
                  icon={ShoppingCart} 
                  label="Acquire GPU Node" 
                  description="Purchase cloud GPU power to train models or earn $TRVN passively."
                />
                <ActionButton 
                  to="/ai-templates" 
                  icon={Bot} 
                  label="Explore AI Starter Pack"
                  description="Discover pre-built AI assistants ready for immediate use or customization."
                />
                <ActionButton 
                  to="/train-ai" 
                  icon={BrainCircuit} 
                  label="Train Your First Model"
                  description="Use our pipelines or your custom code to bring AI ideas to life on the decentralized cloud."
                />
                <ActionButton 
                  to="/deploy-telegram" 
                  icon={Zap} 
                  label="Deploy Your First AI Bot"
                  description="Launch your trained AI models as Telegram bots in minutes."
                />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <StatCard title="GPU Nodes Owned" value="0" icon={Cpu} description="No GPU nodes acquired yet." color="text-slate-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="$TRVN Balance" value="0.00" icon={TrendingUp} description="No $TRVN earned or purchased yet." color="text-slate-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="AI Models Created" value="0" icon={Bot} description="No AI models created yet." color="text-slate-500" />
            </motion.div>
          </motion.div>

        </motion.div>
      ) : (
        <>
          <motion.div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <StatCard title="Active GPU Nodes" value={dashboardStats.gpusOwned.toString()} icon={Cpu} description="Your operational compute power." color="text-green-400" ctaPath="/my-gpus" ctaLabel="Manage GPUs"/>
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="$TRVN Balance" value={`${parseFloat(dashboardStats.totalTrvnBalance).toFixed(2)}`} icon={TrendingUp} description="Your Trainava token holdings." color="text-blue-400" ctaPath="/profile" ctaLabel="View Profile" />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard title="Models Trained" value={dashboardStats.aiModelsCreated.toString()} icon={Zap} description="Across all your projects." color="text-yellow-400" ctaPath="/train-ai" ctaLabel="Train New Model"/>
            </motion.div>
          </motion.div>

          <motion.div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl hover:shadow-accent/40 transition-shadow duration-300 bg-slate-800/60 border-slate-700/80">
                <CardHeader>
                  <CardTitle className="text-slate-100">Quick Start: Rent GPU Power</CardTitle>
                  <CardDescription className="text-slate-400">Instantly access community-provided GPUs for your AI tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 text-sm sm:text-base">
                    Browse available GPUs, select the power you need, and start training your models in minutes.
                  </p>
                  <Button variant="secondary" className="w-full sm:w-auto bg-gradient-to-r from-secondary to-blue-500 hover:opacity-90 transition-opacity" onClick={() => navigate('/rent-gpu')}>
                    Find GPUs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl hover:shadow-primary/40 transition-shadow duration-300 bg-slate-800/60 border-slate-700/80">
                <CardHeader>
                  <CardTitle className="text-slate-100">Explore AI Starter Pack</CardTitle>
                  <CardDescription className="text-slate-400">Jumpstart your AI projects with pre-built models.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 text-sm sm:text-base">
                    Choose from various starter AI assistants or customize them to fit your unique needs.
                  </p>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity" onClick={() => navigate('/ai-templates')}>
                    Browse Starter Pack <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-6 md:mt-8">
            <Card className="shadow-lg bg-slate-800/60 border-slate-700/80">
              <CardHeader>
                <CardTitle className="text-slate-100">Platform Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-sm sm:text-base">Overview of your recent activities and network stats.</p>
                <div className="mt-4 h-40 bg-slate-800/70 rounded-lg flex items-center justify-center text-slate-500 border border-slate-700">
                  [Activity Chart / Network Stats Placeholder]
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardOverviewPage;