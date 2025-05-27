import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Palette, Bot, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBetaFeatureToast } from '@/lib/utils';

const baseModelTypes = [
  "General Purpose Chatbot (GPT-3.5 based)",
  "Creative Text Generator (Advanced)",
  "Image Generation Model (Stable Diffusion based)",
  "Code Assistance Bot (Multi-language)",
  "Customer Service AI",
  "Data Analysis Assistant"
];

const personalityTones = [
  "Friendly & Approachable",
  "Professional & Formal",
  "Witty & Humorous",
  "Empathetic & Supportive",
  "Concise & Direct",
  "Creative & Imaginative"
];

const themeColors = [
  { name: "Default Purple", value: "bg-primary" },
  { name: "Ocean Blue", value: "bg-blue-600" },
  { name: "Forest Green", value: "bg-green-600" },
  { name: "Sunset Orange", value: "bg-orange-500" },
  { name: "Crimson Red", value: "bg-red-600" },
  { name: "Charcoal Gray", value: "bg-slate-700" },
];

const BuildAiAssistantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showBetaToast } = useBetaFeatureToast();

  const [assistantName, setAssistantName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [personality, setPersonality] = useState('');
  const [baseModel, setBaseModel] = useState('');
  const [trainingDataFile, setTrainingDataFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [themeColor, setThemeColor] = useState(themeColors[0].value);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.template) {
      const { template } = location.state;
      setAssistantName(template.name || '');
      setPurpose(template.description || '');
      // Attempt to match template.type to one of the baseModelTypes
      const matchedModel = baseModelTypes.find(bm => bm.toLowerCase().includes(template.type?.toLowerCase() || ''));
      setBaseModel(matchedModel || baseModelTypes[0]);
    }
  }, [location.state]);

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showBetaToast("AI Assistant Creation Notice");
    if (!assistantName || !purpose || !baseModel) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in Assistant Name, Purpose, and Base Model.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    // Simulate API call / processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    setIsLoading(false);
    toast({
      title: "AI Assistant Configured!",
      description: `"${assistantName}" is being processed. You can now proceed to deployment.`,
    });
    
    // Navigate to deployment page with assistant details
    navigate('/deploy-telegram', { 
      state: { 
        assistantName, 
        assistantType: baseModel,
        // Potentially pass other config details if needed by deployment page
      } 
    });
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 }}}}
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-100 flex items-center justify-center">
          <Bot className="mr-3 h-10 w-10 text-primary" /> Create Your AI Assistant
        </h1>
        <p className="text-slate-400 mt-2">Define the core aspects of your new AI companion or tool.</p>
      </motion.div>

      <motion.form onSubmit={handleSubmit} variants={itemVariants}>
        <Card className="bg-slate-800/70 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">Assistant Configuration</CardTitle>
            <CardDescription className="text-slate-400">Fill in the details to build your custom AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="assistantName" className="text-slate-300">Assistant Name*</Label>
                <Input id="assistantName" value={assistantName} onChange={(e) => setAssistantName(e.target.value)} placeholder="E.g., Marketing Maverick AI" required className="bg-slate-700/50 border-slate-600 focus:border-primary" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseModel" className="text-slate-300">Base Model / Type*</Label>
                <Select value={baseModel} onValueChange={setBaseModel} required>
                  <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 focus:border-primary">
                    <SelectValue placeholder="Select a base model" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                    {baseModelTypes.map(type => <SelectItem key={type} value={type} className="hover:bg-primary/20">{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-slate-300">Purpose / Core Functionality*</Label>
              <Textarea id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe what your AI assistant will do (e.g., generate blog posts, answer customer queries)." required className="bg-slate-700/50 border-slate-600 focus:border-primary min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality" className="text-slate-300">Personality / Tone (Optional)</Label>
              <Select value={personality} onValueChange={setPersonality}>
                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 focus:border-primary">
                  <SelectValue placeholder="Choose a personality" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  {personalityTones.map(tone => <SelectItem key={tone} value={tone} className="hover:bg-primary/20">{tone}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="trainingData" className="text-slate-300 flex items-center"><UploadCloud className="mr-2 h-4 w-4" /> Training Data (Optional, .txt, .jsonl, .csv)</Label>
                <Input id="trainingData" type="file" onChange={handleFileChange(setTrainingDataFile)} accept=".txt,.jsonl,.csv" className="bg-slate-700/50 border-slate-600 focus:border-primary file:text-primary file:font-semibold file:mr-2 file:bg-slate-600 file:border-0 file:rounded-md file:px-2 file:py-1" />
                {trainingDataFile && <p className="text-xs text-slate-500">Selected: {trainingDataFile.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar" className="text-slate-300 flex items-center"><UploadCloud className="mr-2 h-4 w-4" /> Avatar (Optional, .png, .jpg)</Label>
                <Input id="avatar" type="file" onChange={handleFileChange(setAvatarFile)} accept=".png,.jpg,.jpeg" className="bg-slate-700/50 border-slate-600 focus:border-primary file:text-primary file:font-semibold file:mr-2 file:bg-slate-600 file:border-0 file:rounded-md file:px-2 file:py-1" />
                {avatarFile && <p className="text-xs text-slate-500">Selected: {avatarFile.name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="themeColor" className="text-slate-300 flex items-center"><Palette className="mr-2 h-4 w-4" /> Theme Color (Optional)</Label>
              <Select value={themeColor} onValueChange={setThemeColor}>
                <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 focus:border-primary">
                  <SelectValue placeholder="Select a theme color" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  {themeColors.map(color => (
                    <SelectItem key={color.value} value={color.value} className="hover:bg-primary/20">
                      <div className="flex items-center">
                        <span className={`w-4 h-4 rounded-full mr-2 ${color.value}`}></span>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity text-lg py-3" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              {isLoading ? 'Processing Configuration...' : 'Save & Proceed to Deployment'}
            </Button>
          </CardFooter>
        </Card>
      </motion.form>
    </motion.div>
  );
};

export default BuildAiAssistantPage;