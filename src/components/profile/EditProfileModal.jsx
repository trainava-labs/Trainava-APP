import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User as UserIcon, Image as ImageIcon, Save, Loader2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

const EditProfileModal = ({ user, currentProfile, isOpen, onClose, onProfileUpdated }) => {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.full_name || '');
      setAvatarUrl(currentProfile.avatar_url || '');
    }
  }, [currentProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(updates)
        .select()
        .single();
        
      if (error) throw error;

      toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
      if (onProfileUpdated) {
        onProfileUpdated(data); 
      }
      onClose();
    } catch (error) {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-slate-200">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            Update your full name and avatar URL.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="fullNameModal" className="text-slate-300 flex items-center mb-1">
              <UserIcon className="h-4 w-4 mr-2 text-primary" /> Full Name
            </Label>
            <Input
              id="fullNameModal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="bg-slate-700/50 border-slate-600 focus:border-primary"
            />
          </div>
          <div>
            <Label htmlFor="avatarUrlModal" className="text-slate-300 flex items-center mb-1">
              <ImageIcon className="h-4 w-4 mr-2 text-primary" /> Avatar URL
            </Label>
            <Input
              id="avatarUrlModal"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
              className="bg-slate-700/50 border-slate-600 focus:border-primary"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="hover:bg-slate-700">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateProfile} disabled={isSaving} className="bg-primary hover:bg-primary/90">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfileModal;