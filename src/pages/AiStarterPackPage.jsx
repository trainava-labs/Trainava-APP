import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Added Badge import
import { Sparkles, Bot, FileText, Image as ImageIcon, Mic, Code, Search, MessageSquare, Palette, Wand2, Brain, Newspaper } from 'lucide-react';
import TryNowModal from '@/components/modals/TryNowModal';
import { useBetaFeatureToast } from '@/lib/utils';

const aiTemplates = [
  { id: 'text-gen', name: 'Advanced Text Generator', description: 'Craft articles, stories, scripts, and more with nuanced control over style and tone.', icon: FileText, type: 'Text Generation' },
  { id: 'img-gen', name: 'Photorealistic Image Creator', description: 'Generate stunning, high-resolution images from detailed text prompts.', icon: ImageIcon, type: 'Image Generation' },
  { id: 'voice-synth', name: 'Expressive Voice Synthesizer', description: 'Create natural-sounding speech in various voices and languages.', icon: Mic, type: 'Voice Synthesis' },
  { id: 'code-assist', name: 'Intelligent Code Assistant', description: 'Get help with debugging, code completion, and algorithm design in multiple languages.', icon: Code, type: 'Code Assistance' },
  { id: 'chatbot-dev', name: 'Custom Chatbot Builder', description: 'Design and train conversational AI for customer service, information retrieval, etc.', icon: Bot, type: 'Chatbot Development' },
  { id: 'prompt-enhance', name: 'Prompt Engineering Suite', description: 'Refine and optimize your prompts for better results from any LLM.', icon: Search, type: 'Prompt Enhancer' },
  { id: 'meme-gen', name: 'Viral Meme Generator', description: 'Instantly create humorous and engaging memes with customizable templates.', icon: Palette, type: 'Meme Generator' },
  { id: 'fortune-teller', name: 'AI Fortune Teller', description: 'Get a glimpse into your future with AI-powered mystical insights.', icon: Wand2, type: 'AI Fortune Teller' },
  { id: 'news-analyzer', name: 'Intelligent News Analyzer', description: 'Summarize, analyze sentiment, and extract key insights from news articles.', icon: Newspaper, type: 'News Analyzer' },
];

const AiStarterPackPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isTryNowModalOpen, setIsTryNowModalOpen] = useState(false);
  const { showBetaToast } = useBetaFeatureToast();

  const filteredTemplates = aiTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTryNow = (tool) => {
    showBetaToast("AI Tool 'Try Now' Notice");
    setSelectedTool(tool);
    setIsTryNowModalOpen(true);
  };

  const handleCreateBot = (template) => {
    showBetaToast("Create AI Bot Notice");
    navigate('/build-ai', { state: { template } });
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
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-primary" /> AI Starter Pack & Templates
          </h1>
          <p className="text-slate-400 mt-1">Explore pre-configured AI models and tools to kickstart your projects.</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Input
            type="text"
            placeholder="Search templates (e.g., 'image generator', 'chatbot')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/70 border-slate-700 placeholder:text-slate-500 text-slate-100 focus:border-primary"
          />
        </motion.div>

        {filteredTemplates.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {filteredTemplates.map((template) => (
              <motion.div key={template.id} variants={itemVariants}>
                <Card className="bg-slate-800/60 border-slate-700 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center mb-2">
                      <template.icon className="h-8 w-8 text-primary mr-3" />
                      <CardTitle className="text-xl text-slate-100">{template.name}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400 text-sm h-16 overflow-hidden">{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <Badge variant="outline" className="text-xs text-purple-400 border-purple-500/50 bg-purple-500/10">
                        Type: {template.type}
                      </Badge>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-700/50">
                    <Button 
                      variant="outline" 
                      onClick={() => handleTryNow(template)}
                      className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Sparkles className="mr-2 h-4 w-4" /> Try Now
                    </Button>
                    <Button 
                      onClick={() => handleCreateBot(template)}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                    >
                      <Bot className="mr-2 h-4 w-4" /> Create / Clone Bot
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-12">
            <Search className="mx-auto h-16 w-16 text-slate-500 mb-4" />
            <p className="text-xl text-slate-300">No templates match your search.</p>
            <p className="text-slate-500">Try a different keyword or explore all available templates.</p>
          </motion.div>
        )}
      </motion.div>
      
      {selectedTool && (
        <TryNowModal 
          isOpen={isTryNowModalOpen}
          setIsOpen={setIsTryNowModalOpen}
          tool={selectedTool}
        />
      )}
    </>
  );
};

export default AiStarterPackPage;