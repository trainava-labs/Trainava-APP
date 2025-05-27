import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast'; // Import useToast

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize useToast

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (event === 'SIGNED_OUT') {
          navigate('/auth');
        } else if (event === 'SIGNED_IN' && window.location.pathname === '/auth') {
          navigate('/');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithWallet = async () => {
    // This is a placeholder. Real wallet integration is complex.
    // For now, it just shows a toast.
    toast({
      title: "Wallet Connect (Coming Soon)",
      description: "Connecting with a Web3 wallet is a feature we're actively developing. Stay tuned!",
      duration: 5000,
    });
    // In a real scenario, you'd initiate wallet connection here
    // e.g., using supabase.auth.signInWithOtp({ provider: 'wallet' }) or similar,
    // or a third-party library like Web3Modal.
    // For demonstration, we'll simulate a delay and do nothing.
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };


  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    signInWithWallet, // Add the new method
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};