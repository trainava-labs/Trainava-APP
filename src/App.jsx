import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { motion } from 'framer-motion';

const AuthPage = lazy(() => import('@/pages/AuthPage'));
const DashboardOverviewPage = lazy(() => import('@/pages/DashboardOverviewPage'));
const MyGpusPage = lazy(() => import('@/pages/MyGpusPage'));
const RentGpuPage = lazy(() => import('@/pages/RentGpuPage'));
const TrainAiPage = lazy(() => import('@/pages/TrainAiPage'));
const AiStarterPackPage = lazy(() => import('@/pages/AiStarterPackPage'));
const BuildAiAssistantPage = lazy(() => import('@/pages/BuildAiAssistantPage'));
const DeployToTelegramPage = lazy(() => import('@/pages/DeployToTelegramPage'));
const MyBotsPage = lazy(() => import('@/pages/MyBotsPage'));
const BuyGpuPowerPage = lazy(() => import('@/pages/BuyGpuPowerPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const DocumentationPage = lazy(() => import('@/pages/DocumentationPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AnimatedText = ({ text, className }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: i * 0.02 },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`flex overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const LoadingFallback = () => {
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/3daea674-347e-4582-8ebd-6ff780aaa4b4/3c042fdfee3f846dd125c33667764280.png";
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      <motion.img 
        src={logoUrl} 
        alt="Trainava Logo" 
        className="h-20 w-20 mb-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
      />
      <AnimatedText text="Loading Trainava..." className="text-2xl text-slate-300 font-semibold" />
      <motion.div 
        className="mt-3 h-1 w-32 bg-primary/30 rounded-full overflow-hidden"
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
        transition={{delay: 0.2}}
      >
        <motion.div 
          className="h-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "0%"}}
          transition={{ duration: 1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};


function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Router>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardOverviewPage />} />
                  <Route path="my-gpus" element={<MyGpusPage />} />
                  <Route path="rent-gpu" element={<RentGpuPage />} />
                  <Route path="buy-gpu-power" element={<BuyGpuPowerPage />} />
                  <Route path="train-ai" element={<TrainAiPage />} />
                  <Route path="ai-templates" element={<AiStarterPackPage />} />
                  <Route path="build-ai" element={<BuildAiAssistantPage />} />
                  <Route path="deploy-telegram" element={<DeployToTelegramPage />} />
                  <Route path="my-bots" element={<MyBotsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="documentation" element={<DocumentationPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;