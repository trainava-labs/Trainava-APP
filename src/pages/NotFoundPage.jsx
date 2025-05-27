import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] text-center p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <AlertTriangle className="h-24 w-24 text-yellow-400 mb-8 animate-pulse" />
      <h1 className="text-6xl font-bold text-slate-100 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-slate-300 mb-6">Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        Let's get you back on track.
      </p>
      <Link to="/">
        <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-lg">
          <Home className="mr-2 h-5 w-5" />
          Go to Dashboard
        </Button>
      </Link>
      <div className="mt-16">
        <img  alt="Futuristic abstract background element" class="opacity-20 w-64 h-auto" src="https://images.unsplash.com/photo-1664329182755-872386320782" />
      </div>
    </motion.div>
  );
};

export default NotFoundPage;