import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const ActionButton = ({ to, icon, label, description }) => {
  const IconComponent = icon;
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={to}>
        <Card className="shadow-lg hover:shadow-primary/40 transition-all duration-300 bg-slate-800/70 hover:bg-slate-700/90 cursor-pointer h-full border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-8 w-8 text-primary" />
              <CardTitle className="text-xl text-slate-100">{label}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm">{description}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ActionButton;