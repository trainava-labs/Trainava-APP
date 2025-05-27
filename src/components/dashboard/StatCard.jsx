import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon, description, color, ctaPath, ctaLabel }) => {
  const navigate = useNavigate();
  return (
    <Card className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 flex flex-col h-full bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {React.createElement(icon, { className: `h-5 w-5 ${color || 'text-primary'}` })}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-slate-100">{value}</div>
        {description && <p className="text-xs text-slate-400 pt-1">{description}</p>}
      </CardContent>
      {ctaPath && ctaLabel && (
        <div className="p-4 pt-0">
          <Button variant="outline" size="sm" className="w-full text-primary border-primary hover:bg-primary/10" onClick={() => navigate(ctaPath)}>
            {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default StatCard;