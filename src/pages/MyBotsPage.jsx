import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bot, PlusCircle, Trash2, Edit3, ExternalLink, ListChecks, PackageSearch, RotateCcw } from 'lucide-react';
import { useBetaFeatureToast } from '@/lib/utils';

const MyBotsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);

  const fetchBots = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_deployed_bots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBots(data || []);
    } catch (error) {
      toast({ title: "Error fetching bots", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleDeleteBot = async () => {
    if (!botToDelete) return;
    showBetaToast("Bot Deletion Notice");
    try {
      const { error } = await supabase
        .from('user_deployed_bots')
        .delete()
        .eq('id', botToDelete.id);
      if (error) throw error;
      toast({ title: "Bot Deleted", description: `Bot "${botToDelete.bot_name}" has been removed from your list.` });
      setBotToDelete(null);
      fetchBots();
    } catch (error) {
      toast({ title: "Failed to delete bot", description: error.message, variant: "destructive" });
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <>
      <motion.div 
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center">
              <ListChecks className="mr-3 h-8 w-8 text-primary" /> My Deployed AI Bots
            </h1>
            <p className="text-slate-400 mt-1">Manage your AI assistants deployed on Telegram.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { showBetaToast("Refresh Bots Notice"); fetchBots(); }} disabled={isLoading}>
              <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button onClick={() => { showBetaToast("Deploy New Bot Notice"); navigate('/deploy-telegram'); }} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
              <PlusCircle className="mr-2 h-5 w-5" /> Deploy New Bot
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-10 bg-slate-700 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && bots.length === 0 && (
          <div className="text-center py-16 bg-slate-800/30 rounded-lg border border-dashed border-slate-700">
            <PackageSearch className="mx-auto h-16 w-16 text-slate-500 mb-4" />
            <h3 className="text-xl font-semibold text-slate-200 mb-2">No Bots Deployed Yet</h3>
            <p className="text-slate-400 mb-6">You haven't deployed any AI bots to Telegram. Create and deploy one to see it here.</p>
            <Button onClick={() => { showBetaToast("Deploy New Bot Notice"); navigate('/deploy-telegram'); }} size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
              <PlusCircle className="mr-2 h-5 w-5" /> Deploy Your First Bot
            </Button>
          </div>
        )}

        {!isLoading && bots.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {bots.map(bot => (
              <motion.div key={bot.id} variants={itemVariants}>
                <Card className="bg-slate-800/60 border-slate-700 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-slate-100 flex items-center">
                        <Bot className="mr-2 h-6 w-6 text-primary" /> {bot.bot_name}
                      </CardTitle>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${bot.status === 'Live' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {bot.status}
                      </span>
                    </div>
                    <CardDescription className="text-slate-400 text-sm">Type: {bot.bot_type || 'N/A'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-1 text-sm">
                    <p className="text-slate-400">Model: <span className="font-medium text-slate-200">{bot.underlying_ai_model || 'Custom'}</span></p>
                    <p className="text-slate-400">Token Hint: <span className="font-medium text-slate-200">{bot.telegram_token_hint}</span></p>
                    <p className="text-slate-400">Deployed: <span className="font-medium text-slate-200">{new Date(bot.created_at).toLocaleDateString()}</span></p>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700/50">
                    <Button variant="outline" size="sm" onClick={() => { showBetaToast("Bot Details Notice"); alert('Bot details view coming soon!'); }} className="text-xs border-slate-600 hover:bg-slate-700/80">
                      <ExternalLink className="mr-1 h-3 w-3" /> View on Telegram
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { showBetaToast("Edit Bot Notice"); alert('Bot editing feature coming soon!'); }} className="text-xs border-slate-600 hover:bg-slate-700/80">
                      <Edit3 className="mr-1 h-3 w-3" /> Edit
                    </Button>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructiveOutline" size="sm" onClick={() => setBotToDelete(bot)} className="text-xs col-span-2">
                        <Trash2 className="mr-1 h-3 w-3" /> Delete Bot
                      </Button>
                    </AlertDialogTrigger>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <AlertDialog open={!!botToDelete} onOpenChange={(open) => !open && setBotToDelete(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the bot "{botToDelete?.bot_name}"? This action will remove it from your Trainava list but will not stop the bot on Telegram if it's running.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBotToDelete(null)} className="hover:bg-slate-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBot} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyBotsPage;