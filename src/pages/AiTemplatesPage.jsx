import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Edit3, LayoutGrid, PlayCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const AI_STARTER_PACK = [
  { id: 'text-gen', name: 'Text Generator', description: 'Generate creative text formats, like poems, code, scripts, etc.' },
  { id: 'img-gen', name: 'Image Generator', description: 'Create stunning images from text prompts.' },
  { id: 'voice-clone', name: 'Voice Cloner', description: 'Clone voices with remarkable accuracy.' },
  { id: 'transcriber', name: 'Transcriber', description: 'Convert speech to text with high precision.' },
  { id: 'summarizer', name: 'Summarizer', description: 'Condense long texts into concise summaries.' },
  { id: 'code-helper', name: 'Code Helper', description: 'Assist with coding tasks, debugging, and explanations.' },
  { id: 'meme-gen', name: 'Meme Generator', description: 'Create viral memes instantly.' },
  { id: 'chatbot-train', name: 'Chatbot Trainer', description: 'Tools to train and customize your chatbots.' },
  { id: 'prompt-enhance', name: 'Prompt Enhancer', description: 'Improve your AI prompts for better results.' },
  { id: 'ai-fortune', name: 'AI Fortune Teller', description: 'Get fun, AI-generated fortunes.' },
  { id: 'news-analyzer', name: 'News Analyzer', description: 'Analyze news articles for sentiment and key topics.' },
];

const AiTemplatesPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTemplates = AI_STARTER_PACK.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-slate-100">AI Templates & Starter Pack</h1>
        <p className="text-slate-400">Choose from 11 pre-made AIs or clone and edit them to create your own unique assistants.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        <Input 
          placeholder="Search AI templates..." 
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {filteredTemplates.length === 0 ? (
         <motion.div variants={itemVariants} className="text-center py-12">
          <LayoutGrid className="mx-auto h-16 w-16 text-slate-500 mb-4" />
          <h2 className="text-xl font-semibold text-slate-300 mb-2">No Templates Found</h2>
          <p className="text-slate-400">Your search for "{searchTerm}" did not match any AI templates.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {filteredTemplates.map((template) => (
            <motion.div key={template.id} variants={itemVariants}>
              <Card className="shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-100">{template.name}</CardTitle>
                  <CardDescription className="text-slate-400 h-12 overflow-hidden text-ellipsis">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow" />
                <div className="p-4 border-t border-slate-700/50 flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                    <PlayCircle className="mr-2 h-4 w-4" /> Use Template
                  </Button>
                  <Button variant="outline" className="flex-1 border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary">
                    <Copy className="mr-2 h-4 w-4" /> Clone & Edit
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AiTemplatesPage;