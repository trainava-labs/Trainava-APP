import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Image as ImageIcon, Mic, FileText, Code, Search, MessageSquare, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const getSimpleResponse = (inputText, toolType) => {
  const input = inputText.toLowerCase();
  switch (toolType) {
    case 'Text Generation':
      if (input.includes('story')) return "Once upon a time, in a land of code and circuits, a new AI was born...";
      if (input.includes('poem')) return "Roses are red, violets are blue, AI is smart, and so are you!";
      if (input.includes('code')) return "```python\ndef hello_ai():\n  print('Hello from your AI assistant!')\nhello_ai()\n```";
      return `Content generated based on: "${inputText}". This text is crafted to fit your prompt's theme.`;
    case 'Text Summarization':
      return `Key points from "${inputText.substring(0, 30)}...": The main idea is X, supported by Y, concluding with Z. (This is a placeholder summary)`;
    case 'Code Assistance':
      if (input.includes('python') && input.includes('loop')) return "A Python 'for' loop example: `for i in range(5): print(i)`";
      if (input.includes('javascript') && input.includes('function')) return "A JavaScript function: `function greet() { console.log('Hello!'); }`";
      return `Code assistance for your query: "${inputText}". Consider using [relevant function/pattern].`;
    case 'Prompt Enhancer':
      return `Enhanced prompt suggestion for "${inputText}": "Could you elaborate on [specific aspect of input] to achieve [desired outcome] with a [specific tone/style]?"`;
    case 'AI Fortune Teller':
      const fortunes = ["You will encounter a new opportunity soon.", "A creative idea will spark great things.", "Good news is on its way.", "Your hard work will pay off."];
      return fortunes[Math.floor(Math.random() * fortunes.length)];
    case 'News Analyzer':
      if (input.includes('stock') || input.includes('market')) return "Analysis of news regarding '${inputText}': Sentiment appears cautiously optimistic. Key factors include recent market trends and upcoming financial reports.";
      return `News analysis for "${inputText}": The article discusses [topic A] and [topic B], with a generally [neutral/positive/negative] sentiment.`;
    default:
      return `Processed output for ${toolType} based on input: "${inputText}".`;
  }
};

const TryNowModal = ({ isOpen, setIsOpen, tool }) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!tool) return;
    setIsLoading(true);
    setOutputText('');
    setIsImageGenerating(false);

    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000)); 

    let responseOutput = '';
    switch (tool.type) {
      case 'Text Generation':
      case 'Text Summarization':
      case 'Code Assistance':
      case 'Prompt Enhancer':
      case 'AI Fortune Teller':
      case 'News Analyzer':
        responseOutput = getSimpleResponse(inputText || 'Tell me something interesting.', tool.type);
        break;
      case 'Image Generation':
      case 'Meme Generator':
        setIsImageGenerating(true);
        responseOutput = `Generating image for: "${inputText || 'A creative concept.'}"`;
        
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        setOutputText(`Image for "${inputText || 'A creative concept'}" would appear here.`);
        setIsImageGenerating(false); 
        break;
      case 'Voice Synthesis':
        responseOutput = `Voice synthesized for: "${inputText || 'Hello world.'}". (Audio playback would occur here).`;
        break;
      case 'Speech-to-Text':
        responseOutput = `Transcription of audio input: "${inputText || 'This is a test.'}" (Assuming audio was processed).`;
        break;
      case 'Chatbot Development':
        responseOutput = `Chatbot training initiated with parameters: "${inputText || 'Default training data.'}". This tool helps configure and train bots, direct interaction happens post-deployment.`;
        break;
      default:
        responseOutput = `Output for ${tool.name} using input: "${inputText || 'Default test input.'}"`;
    }
    
    if (tool.type !== 'Image Generation' && tool.type !== 'Meme Generator' || !isImageGenerating) {
        setOutputText(responseOutput);
    }

    setIsLoading(false);
    if (!isImageGenerating) { 
        toast({
          title: "Process Complete!",
          description: `${tool.name} has processed your request.`,
        });
    }
  };

  const getIconForTool = () => {
    if (!tool) return <Sparkles className="h-6 w-6 text-primary" />;
    switch (tool.type) {
      case 'Text Generation': return <FileText className="h-6 w-6 text-primary" />;
      case 'Image Generation':
      case 'Meme Generator': return <ImageIcon className="h-6 w-6 text-primary" />;
      case 'Voice Synthesis': return <Mic className="h-6 w-6 text-primary" />;
      case 'Speech-to-Text': return <Mic className="h-6 w-6 text-primary" />;
      case 'Text Summarization': return <MessageSquare className="h-6 w-6 text-primary" />;
      case 'Code Assistance': return <Code className="h-6 w-6 text-primary" />;
      case 'Prompt Enhancer': return <Search className="h-6 w-6 text-primary" />;
      case 'Chatbot Development': return <Bot className="h-6 w-6 text-primary" />;
      default: return <Sparkles className="h-6 w-6 text-primary" />;
    }
  };

  const renderInputType = () => {
    if (!tool) return null;
    switch (tool.type) {
      case 'Image Generation':
      case 'Meme Generator':
      case 'Text Generation':
      case 'Voice Synthesis':
      case 'Text Summarization':
      case 'Code Assistance':
      case 'Prompt Enhancer':
      case 'AI Fortune Teller':
      case 'News Analyzer':
      case 'Chatbot Development':
        return (
          <Textarea
            placeholder={`Enter your prompt for ${tool.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px] bg-slate-700/50 border-slate-600 focus:border-primary text-slate-200"
          />
        );
      case 'Speech-to-Text':
        return (
          <Input
            type="file"
            accept="audio/*"
            onChange={(e) => setInputText(e.target.files[0] ? e.target.files[0].name : '')}
            className="bg-slate-700/50 border-slate-600 focus:border-primary text-slate-200 file:text-primary file:font-semibold file:mr-2 file:bg-slate-600 file:border-0 file:rounded-md file:px-2 file:py-1"
          />
        );
      default:
        return (
          <Input
            placeholder={`Input for ${tool.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-slate-700/50 border-slate-600 focus:border-primary text-slate-200"
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-slate-800/90 backdrop-blur-md border-slate-700 text-slate-200 shadow-2xl rounded-lg sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl text-slate-100">
            {getIconForTool()}
            <span className="ml-2">Try: {tool?.name || 'AI Tool'}</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Interact with the {tool?.name || 'AI tool'}. Enter your input below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="tool-input" className="text-sm font-medium text-slate-300">Input</label>
            {renderInputType()}
          </div>
          
          {outputText && (
            <div className="space-y-2">
              <label htmlFor="tool-output" className="text-sm font-medium text-slate-300">Output</label>
              {(tool.type === 'Image Generation' || tool.type === 'Meme Generator') && isImageGenerating ? (
                <div className="min-h-[100px] bg-slate-700/30 border-slate-600/50 text-slate-300 rounded-md p-4 flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating image...
                </div>
              ) : (tool.type === 'Image Generation' || tool.type === 'Meme Generator') && !isImageGenerating && outputText.includes("would appear here") ? (
                 <div className="min-h-[100px] bg-slate-700/30 border-slate-600/50 text-slate-300 rounded-md p-4 flex flex-col items-center justify-center">
                    <img  alt={`${tool.name} placeholder image`} className="w-32 h-32 object-contain my-2 opacity-50" src="https://images.unsplash.com/photo-1560870527-94324afeeeac" />
                    <p className="text-center text-sm">{outputText}</p>
                 </div>
              ) : (
                <Textarea
                  id="tool-output"
                  value={outputText}
                  readOnly
                  className="min-h-[100px] bg-slate-700/30 border-slate-600/50 text-slate-300"
                />
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-600 hover:bg-slate-700">
            Close
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || isImageGenerating}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
          >
            {(isLoading || isImageGenerating) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {(isLoading || isImageGenerating) ? 'Processing...' : 'Generate'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TryNowModal;