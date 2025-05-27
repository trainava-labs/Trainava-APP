import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithWallet } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/3daea674-347e-4582-8ebd-6ff780aaa4b4/3c042fdfee3f846dd125c33667764280.png";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      toast({ title: 'Login Successful', description: 'Welcome back to Trainava!' });
      navigate('/');
    } catch (error) {
      toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      toast({ title: 'Signup Successful', description: 'Please check your email to confirm your account.' });
    } catch (error) {
      toast({ title: 'Signup Failed', description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleWalletConnect = async () => {
    setWalletLoading(true);
    try {
      await signInWithWallet(); 
    } catch (error) {
      // Error toast is handled within signInWithWallet context method
    }
    setWalletLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4"
    >
      <Card className="w-full max-w-md bg-slate-800/70 border-slate-700 shadow-2xl backdrop-blur-lg">
        <CardHeader className="text-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center items-center mb-4"
          >
            <img src={logoUrl} alt="Trainava Logo" className="h-12 w-auto mr-2" />
            <h1 className="text-4xl font-bold gradient-text">Trainava</h1>
          </motion.div>
          <CardDescription className="text-slate-400">Access the decentralized future of GPU-powered AI.</CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login with Email'}
                </Button>
                <div className="relative w-full">
                  <Separator className="my-1 bg-slate-600" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/70 px-2 text-xs text-slate-400">OR</span>
                </div>
                <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300" onClick={handleWalletConnect} disabled={walletLoading}>
                  <Wallet className="mr-2 h-4 w-4" />
                  {walletLoading ? 'Connecting...' : 'Connect with Web3 Wallet'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-300">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Choose a strong password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-500"
                  />
                   <p className="text-xs text-slate-500">Password must be at least 6 characters long.</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up with Email'}
                </Button>
                <div className="relative w-full">
                  <Separator className="my-1 bg-slate-600" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/70 px-2 text-xs text-slate-400">OR</span>
                </div>
                <Button variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300" onClick={handleWalletConnect} disabled={walletLoading}>
                   <Wallet className="mr-2 h-4 w-4" />
                  {walletLoading ? 'Connecting...' : 'Sign Up with Web3 Wallet'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};

export default AuthPage;