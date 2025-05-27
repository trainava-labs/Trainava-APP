import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, KeyRound, Loader2, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useBetaFeatureToast } from '@/lib/utils';

const DeployToTelegramPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { showBetaToast } = useBetaFeatureToast();

  const [botName, setBotName] = useState('');
  const [botType, setBotType] = useState(''); // This would be the base model/type
  const [telegramToken, setTelegramToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.assistantName) {
      setBotName(location.state.assistantName);
    }
    if (location.state?.assistantType) {
      setBotType(location.state.assistantType);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    showBetaToast("Telegram Bot Deployment Notice");
    if (!botName || !telegramToken) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide a Bot Name and your Telegram Bot API Token.",
        variant: "destructive",
      });
      return;
    }
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      const tokenHint = telegramToken.slice(0, 10) + '...' + telegramToken.slice(-4);
      const { data, error } = await supabase
        .from('user_deployed_bots')
        .insert({
          user_id: user.id,
          bot_name: botName,
          bot_type: botType || 'Custom Assistant',
          telegram_token_hint: tokenHint,
          status: 'Live', // Placeholder status
          underlying_ai_model: botType || 'Custom', // Placeholder
        })
        .select();

      if (error) throw error;

      setIsLoading(false);
      toast({
        title: "Deployment Initiated!",
        description: `Your bot "${botName}" is being deployed to Telegram. This may take a few moments.`,
      });
      navigate('/my-bots');

    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Deployment Failed",
        description: error.message || "An unexpected error occurred during deployment.",
        variant: "destructive",
      });
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="max-w-xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-100 flex items-center justify-center">
          <Send className="mr-3 h-10 w-10 text-primary" /> Deploy AI Bot to Telegram
        </h1>
        <p className="text-slate-400 mt-2">Connect your configured AI assistant to Telegram by providing its API token.</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} variants={itemVariants}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Telegram Deployment</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your bot's name and the API token obtained from Telegram's BotFather.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="botName" className="text-slate-300">Bot Name*</Label>
              <Input 
                id="botName" 
                value={botName} 
                onChange={(e) => setBotName(e.target.value)} 
                placeholder="Your AI Assistant's Name on Telegram" 
                required 
                className="bg-slate-700/50 border-slate-600 focus:border-primary" 
              />
            </div>

            {botType && (
                 <div className="space-y-2">
                    <Label htmlFor="botTypeDisplay" className="text-slate-300">Assistant Type / Base Model</Label>
                    <Input 
                        id="botTypeDisplay" 
                        value={botType} 
                        readOnly 
                        className="bg-slate-700/30 border-slate-600/50 text-slate-400 cursor-default" 
                    />
                </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="telegramToken" className="text-slate-300 flex items-center">
                <KeyRound className="mr-2 h-4 w-4" /> Telegram Bot API Token*
              </Label>
              <Input 
                id="telegramToken" 
                type="password" 
                value={telegramToken} 
                onChange={(e) => setTelegramToken(e.target.value)} 
                placeholder="Paste your token from BotFather here" 
                required 
                className="bg-slate-700/50 border-slate-600 focus:border-primary" 
              />
            </div>
            
            <div className="flex items-start p-3 bg-blue-900/20 border border-blue-700/50 rounded-md space-x-2">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-300">
                To get a Telegram Bot API Token, you need to create a new bot or manage an existing one using <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">BotFather</a> on Telegram.
              </p>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-lg py-3" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bot className="mr-2 h-5 w-5" />}
              {isLoading ? 'Deploying to Telegram...' : 'Deploy Bot'}
            </Button>
          </CardFooter>
        </Card>
      </motion.form>
    </motion.div>
  );
};

export default DeployToTelegramPage;