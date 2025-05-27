import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Settings, User, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useTheme } from '@/contexts/ThemeContext';

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/': return 'Dashboard Overview';
    case '/my-gpus': return 'My GPUs';
    case '/buy-gpu-power': return 'Buy GPU Cloud Power';
    case '/rent-gpu': return 'Rent GPU';
    case '/train-ai': return 'Train AI Models';
    case '/ai-templates': return 'AI Starter Pack';
    case '/build-ai': return 'Build Your Own AI Assistant';
    case '/deploy-telegram': return 'Deploy AI Bot';
    case '/my-bots': return 'My Telegram Bots';
    case '/profile': return 'User Profile';
    case '/settings': return 'Settings';
    default: return 'Trainava';
  }
};

const Header = ({ isSidebarExpanded, setIsSidebarExpanded }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = React.useState(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid error if no row is found
        
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine here
          console.error("Error fetching profile for header:", error);
        }
        if (data) {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [user]);


  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      navigate('/auth');
    } catch (error) {
      toast({ title: 'Logout Failed', description: error.message, variant: 'destructive' });
    }
  };
  
  const avatarSrc = profile?.avatar_url || `https://source.unsplash.com/random/100x100/?abstract-profile-${user?.id || 'default'}`;
  const avatarFallbackText = profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U';


  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "fixed top-0 right-0 z-30 h-20 bg-card/70 backdrop-blur-lg border-b border-border/70 flex items-center justify-between px-4 sm:px-6 md:px-8 shadow-xl transition-all duration-300 ease-in-out",
        isSidebarExpanded ? "left-0 md:left-64" : "left-0 md:left-[4.5rem]",
        theme === 'light' ? 'bg-slate-50/70 border-slate-200/70' : 'bg-slate-900/70 border-slate-800/70'
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
          className="mr-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 md:hidden"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className={cn("page-title hidden sm:block", theme === 'light' ? 'text-slate-800' : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-pink-500')}>{pageTitle}</h2>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent/50 p-0">
                <Avatar className="h-9 w-9 border-2 border-primary/50">
                  <AvatarImage src={avatarSrc} alt="User Avatar" key={avatarSrc} />
                  <AvatarFallback className={cn("bg-muted text-primary", theme === 'light' ? 'bg-slate-300' : 'bg-slate-700')}>
                    {avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className={cn(
                "w-60 backdrop-blur-md border-border text-foreground shadow-2xl rounded-lg",
                theme === 'light' ? 'bg-white/90' : 'bg-slate-800/90'
              )} 
              align="end" 
              forceMount
            >
              <DropdownMenuLabel className="font-normal px-3 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">Welcome back,</p>
                  <p className="text-xs leading-none text-primary truncate">{profile?.full_name || user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem 
                className="hover:bg-accent/80 focus:bg-accent/80 cursor-pointer text-sm py-2 px-3 rounded-md"
                onClick={() => navigate('/profile')}
              >
                <User className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-accent/80 focus:bg-accent/80 cursor-pointer text-sm py-2 px-3 rounded-md"
                onClick={() => navigate('/settings')}
              >
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem 
                className="hover:bg-red-600/30 focus:bg-red-600/40 text-red-400 focus:text-red-300 cursor-pointer text-sm py-2 px-3 rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.header>
  );
};

export default Header;