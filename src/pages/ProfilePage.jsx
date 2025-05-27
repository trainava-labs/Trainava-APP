import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Edit3, Shield, Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import EditProfileModal from '@/components/profile/EditProfileModal';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      let { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, avatar_url, credits')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { 
        throw error;
      }
      
      if (data) {
        setProfile(data);
      } else {
        const defaultFullName = user.email?.split('@')[0] || 'New User';
        const { data: newProfileData, error: newProfileError } = await supabase
          .from('user_profiles')
          .insert({ id: user.id, full_name: defaultFullName, avatar_url: null, credits: 100.00 })
          .select()
          .single();
        if (newProfileError) throw newProfileError;
        setProfile(newProfileData);
        toast({ title: 'Profile Created', description: 'We created a basic profile for you with 100.00 $TRVN.'});
      }
    } catch (error) {
      toast({ title: 'Error fetching profile', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const handleChangePassword = async () => {
    if (!user?.email) {
        toast({ title: "Error", description: "User email not found.", variant: "destructive" });
        return;
    }
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/auth?view=update_password`,
        });
        if (error) throw error;
        toast({
            title: "Password Reset Email Sent",
            description: "Check your email for a link to reset your password.",
        });
    } catch (error) {
        toast({
            title: "Error Sending Reset Email",
            description: error.message,
            variant: "destructive",
        });
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="ml-3 text-slate-400">Loading user profile...</p>
      </div>
    );
  }
  
  const displayAvatarUrl = profile?.avatar_url || `https://source.unsplash.com/random/200x200/?abstract-profile-${user?.id || 'default'}`;

  return (
    <>
    <motion.div 
      className="space-y-8 max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">User Profile</h1>
        <p className="text-slate-400">Manage your personal information and account details.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
          <CardHeader className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-primary/70">
              <AvatarImage src={displayAvatarUrl} alt="User Avatar" key={displayAvatarUrl} />
              <AvatarFallback className="text-4xl bg-slate-700 text-primary">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl sm:text-3xl text-slate-100">
                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
              </CardTitle>
              <CardDescription className="text-slate-400 flex items-center justify-center sm:justify-start mt-1">
                <Mail className="h-4 w-4 mr-2" /> {user?.email}
              </CardDescription>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 border-primary text-primary hover:bg-primary/10"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Account Details</CardTitle>
            <CardDescription className="text-slate-400">View and manage your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
              <span className="text-slate-300">User ID:</span>
              <span className="text-slate-400 text-sm truncate">{user?.id}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
              <span className="text-slate-300">Email Verified:</span>
              <span className={`font-semibold ${user?.email_confirmed_at ? 'text-green-400' : 'text-yellow-400'}`}>
                {user?.email_confirmed_at ? 'Yes' : 'No (Check Email)'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
              <span className="text-slate-300">Account Created:</span>
              <span className="text-slate-400 text-sm">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-md">
              <span className="text-slate-300 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" /> $TRVN Balance:
              </span>
              <span className="text-primary font-semibold">
                {profile?.credits !== undefined ? parseFloat(profile.credits).toFixed(2) : 'Loading...'} $TRVN
              </span>
            </div>
             <Button variant="secondary" className="w-full sm:w-auto" onClick={handleChangePassword}>
                <Shield className="h-4 w-4 mr-2" /> Change Password
              </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {user && profile && (
      <EditProfileModal
        user={user}
        currentProfile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    )}
    </>
  );
};

export default ProfilePage;