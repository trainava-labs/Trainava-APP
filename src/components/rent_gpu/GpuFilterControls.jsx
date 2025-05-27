import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Filter, Search } from 'lucide-react';

const GpuFilterControls = ({ 
  searchTerm, 
  setSearchTerm, 
  priceRange, 
  setPriceRange, 
  minPowerScore, 
  setMinPowerScore 
}) => {
  return (
    <Card className="shadow-lg bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" /> Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="search-gpu" className="text-slate-300">Search Model/Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <Input 
              id="search-gpu" 
              placeholder="e.g., RTX 4090, MyFastGPU" 
              className="pl-10 bg-slate-700/50 border-slate-600 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price-range" className="text-slate-300">Price per Hour: ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}</Label>
          <Slider
            id="price-range"
            min={0.1} max={5.0} step={0.05}
            value={priceRange}
            onValueChange={setPriceRange}
            className="pt-2 [&>span>span]:bg-primary [&>span>span]:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="power-score" className="text-slate-300">Min Power Score: {minPowerScore}</Label>
          <Slider
            id="power-score"
            min={0} max={15000} step={500}
            value={[minPowerScore]}
            onValueChange={(value) => setMinPowerScore(value[0])}
            className="pt-2 [&>span>span]:bg-primary [&>span>span]:border-primary"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GpuFilterControls;