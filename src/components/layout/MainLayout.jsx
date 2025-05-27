import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

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

const MainLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/3daea674-347e-4582-8ebd-6ff780aaa4b4/3c042fdfee3f846dd125c33667764280.png";

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { 
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
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
        <AnimatedText text="Loading Your Workspace..." className="text-xl text-slate-300 font-semibold" />
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
  }
  
  if (!user) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-foreground overflow-hidden">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarExpanded ? "md:ml-64" : "ml-0 md:ml-[4.5rem]" 
        )}
      >
        <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 pt-24 md:pt-28 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-slate-800/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, type: 'spring', stiffness:100, damping:20 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;