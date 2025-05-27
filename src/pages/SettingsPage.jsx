import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Trash2, Loader2, Palette, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from '@/lib/supabaseClient';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast({ title: 'Theme Updated', description: `Switched to ${newTheme} theme.` });
  };

  const handleRequestAccountDeletion = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    toast({
      title: "Account Deletion Requested (Simulated)",
      description: "Your account deletion request has been received. You will be logged out.",
      variant: "destructive",
      duration: 5000,
    });
    
    try {
        await supabase.auth.signOut();
    } catch (error) {
        toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const settingsCategories = [
    {
      title: 'Appearance',
      description: 'Customize the look and feel of the Trainava dashboard.',
      icon: Palette,
      content: (
        <RadioGroup value={theme} onValueChange={handleThemeChange} className="space-y-2">
          <Label htmlFor="theme-dark" className="flex items-center justify-between p-3 rounded-md border border-slate-600 hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <div className="flex items-center">
              <Moon className="h-5 w-5 mr-3 text-slate-400" />
              <span>Dark Theme</span>
            </div>
            <RadioGroupItem value="dark" id="theme-dark" />
          </Label>
          <Label htmlFor="theme-light" className="flex items-center justify-between p-3 rounded-md border border-slate-600 hover:border-primary cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <div className="flex items-center">
              <Sun className="h-5 w-5 mr-3 text-slate-400" />
              <span>Light Theme</span>
            </div>
            <RadioGroupItem value="light" id="theme-light" />
          </Label>
        </RadioGroup>
      ),
    },
    {
      title: 'Security',
      description: 'Enhance your account security (UI Placeholder).',
      icon: ShieldCheck,
      content: (
         <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-md text-sm">
                <span className="text-slate-300">Two-Factor Authentication</span>
                <Button variant="outline" size="sm" disabled>Enable</Button>
            </div>
             <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-md text-sm">
                <span className="text-slate-300">Active Sessions</span>
                <Button variant="link" size="sm" className="text-primary p-0 h-auto" disabled>View</Button>
            </div>
         </div>
      ),
    },
    {
      title: 'Account Deletion',
      description: 'Permanently delete your Trainava account and all associated data.',
      icon: Trash2,
      content: (
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-full">
            Request Account Deletion
          </Button>
        </AlertDialogTrigger>
      ),
    },
  ];

  return (
    <>
    <motion.div 
      className="space-y-8 max-w-2xl mx-auto" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Settings</h1>
        <p className="text-slate-400">Configure your Trainava experience and manage account preferences.</p>
      </motion.div>

      <AlertDialog onOpenChange={setIsDeleteModalOpen} open={isDeleteModalOpen}>
        {settingsCategories.map((category, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <category.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl text-slate-100">{category.title}</CardTitle>
                </div>
                <CardDescription className="text-slate-400 pt-1">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.content}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                This action cannot be undone. This will permanently delete your account and remove your data from our servers (simulated).
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteModalOpen(false)} className="hover:bg-slate-700">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRequestAccountDeletion} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
    </>
  );
};

export default SettingsPage;