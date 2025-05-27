import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ShieldCheck, Zap, BrainCircuit, Bot, TrendingUp } from 'lucide-react';

const OrderSummaryCard = ({ currentPackage, onBuyClick, isProcessing }) => {
  if (!currentPackage) return null;

  return (
    <Card className="shadow-xl sticky top-28 bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100 flex items-center"><DollarSign className="mr-2 h-5 w-5 text-green-400" /> Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-400">Selected Node:</p>
          <p className="text-lg font-semibold text-slate-100">{currentPackage.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">Price (USD Equivalent):</p>
          <p className="text-2xl font-bold text-primary">${currentPackage.priceUSD.toFixed(2)}</p>
        </div>
        <div className="pt-2">
          <h4 className="text-sm font-medium text-slate-300 mb-1">Includes:</h4>
          <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
            <li>{currentPackage.GPU_Model} GPU Access</li>
            <li>{currentPackage.vCPU} vCPUs, {currentPackage.RAM} RAM, {currentPackage.vram} VRAM</li>
            <li>{currentPackage.storage} Storage</li>
            <li>{currentPackage.powerScore} Power Score</li>
            <li>{currentPackage.credits.toLocaleString()} $TRVN Tokens</li>
          </ul>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <h4 className="text-sm font-medium text-slate-300 mb-1">Selected Node Estimations:</h4>
          <ul className="text-xs text-slate-400 space-y-0.5">
            <li className="flex items-center"><BrainCircuit className="h-3 w-3 mr-1.5 text-blue-400"/> {currentPackage.estimations.models}</li>
            <li className="flex items-center"><Bot className="h-3 w-3 mr-1.5 text-purple-400"/> {currentPackage.estimations.bots}</li>
            <li className="flex items-center"><TrendingUp className="h-3 w-3 mr-1.5 text-green-400"/> {currentPackage.estimations.income}</li>
          </ul>
        </div>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-lg py-6 mt-4"
          onClick={onBuyClick}
          disabled={isProcessing}
        >
          {isProcessing ? <Zap className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
          {isProcessing ? 'Processing...' : 'Proceed to Payment'}
        </Button>
        <p className="text-xs text-slate-500 text-center pt-2">
          You will be prompted with payment instructions.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryCard;