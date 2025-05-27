import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, ShoppingCart, BrainCircuit, LayoutGrid, Bot, Send, ListChecks, LayoutDashboard, CreditCard, LifeBuoy, ExternalLink, Github, Twitter, Mail, BookOpen, ChevronLeft, ChevronRight, FileText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const mainNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-gpus', label: 'My GPUs', icon: Cpu },
  { to: '/buy-gpu-power', label: 'Buy GPU Power', icon: CreditCard },
  { to: '/rent-gpu', label: 'Rent GPU', icon: ShoppingCart },
  { to: '/train-ai', label: 'Train AI', icon: BrainCircuit },
  { to: '/ai-templates', label: 'AI Starter Pack', icon: LayoutGrid },
  { to: '/deploy-telegram', label: 'Deploy AI Bot', icon: Send },
  { to: '/my-bots', label: 'My Bots', icon: ListChecks },
];

const supportNavItems = [
  { href: 'https://trainava.com', label: 'Website', icon: ExternalLink, target: '_blank' },
  { href: 'https://trainava.gitbook.io/trainava-docs', label: 'External Docs', icon: BookOpen, target: '_blank' },
  { to: '/documentation', label: 'App Documentation', icon: FileText },
  { href: 'https://t.me/Trainava_Laps', label: 'Community Telegram', icon: MessageCircle, target: '_blank' },
  { href: 'https://x.com/Trainava_Laps', label: 'X (Twitter)', icon: Twitter, target: '_blank' },
  { href: 'https://github.com/trainava', label: 'GitHub', icon: Github, target: '_blank' },
  { href: 'mailto:support@trainava.com', label: 'Email Support', icon: Mail },
];


const NavItem = ({ item, isExpanded, variants }) => {
  const commonClasses = 'flex items-center px-3 py-3 rounded-lg transition-all duration-200 ease-in-out hover:bg-primary/20 hover:text-primary group text-sm';
  const expandedClasses = "space-x-3 justify-start";
  const collapsedClasses = "justify-center";

  if (item.to) { // Internal NavLink
    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          cn(
            commonClasses,
            isActive ? 'bg-primary/30 text-primary font-semibold shadow-inner' : 'text-slate-300 hover:text-slate-100',
            isExpanded ? expandedClasses : collapsedClasses
          )
        }
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <motion.span 
          variants={variants}
          className="whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      </NavLink>
    );
  } else { // External Link
    return (
      <a
        href={item.href}
        target={item.target || '_self'}
        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
        className={cn(
          commonClasses,
          'text-slate-300 hover:text-slate-100',
          isExpanded ? expandedClasses : collapsedClasses
        )}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        <motion.span 
          variants={variants}
          className="whitespace-nowrap"
        >
          {item.label}
        </motion.span>
      </a>
    );
  }
};


const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const sidebarVariants = {
    expanded: { width: '16rem' }, 
    collapsed: { width: '4.5rem' } 
  };

  const logoTextVariants = {
    expanded: { opacity: 1, x: 0, display: 'block', transition: { delay: 0.1 } },
    collapsed: { opacity: 0, x: -10, transitionEnd: { display: 'none' } }
  };

  const navLabelVariants = {
    expanded: { opacity: 1, x: 0, display: 'inline', transition: { delay: 0.1 } },
    collapsed: { opacity: 0, x: -10, transitionEnd: { display: 'none' } }
  };

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.3, type: 'spring', stiffness: 120, damping: 18 }}
        className="fixed left-0 top-0 z-40 h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black text-foreground shadow-2xl flex flex-col"
      >
        <div className={cn(
          "flex items-center border-b border-slate-800/70 transition-all duration-300 h-20", 
          isExpanded ? "px-6 space-x-3" : "px-4 justify-center"
        )}>
          <img  
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3daea674-347e-4582-8ebd-6ff780aaa4b4/3c042fdfee3f846dd125c33667764280.png" 
            alt="Trainava Logo" 
            className={cn("transition-all duration-300 object-contain", isExpanded ? "h-10 w-auto" : "h-8 w-auto")} 
          />
          <motion.h1 
            variants={logoTextVariants}
            className="text-3xl font-bold gradient-text whitespace-nowrap"
          >
            Trainava
          </motion.h1>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsExpanded(!isExpanded)} 
          className={cn(
            "absolute top-[1.375rem] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-all duration-300 z-50", 
            "rounded-full border border-slate-700 w-9 h-9", 
            isExpanded ? "right-[-1.125rem]" : "right-[-1.125rem]"
          )}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>

        <nav className="flex-grow p-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-slate-800/50">
          {mainNavItems.map((item) => (
            <Tooltip key={item.to || item.href} disableHoverableContent={isExpanded}>
              <TooltipTrigger asChild>
                <NavItem item={item} isExpanded={isExpanded} variants={navLabelVariants} />
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700 ml-2 shadow-lg">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ delay: isExpanded ? 0.1 : 0 }}
            className={cn(isExpanded ? "pt-3" : "pt-1")}
          >
            <Separator className="bg-slate-700/70 my-2" />
          </motion.div>
          
          <motion.div
            variants={navLabelVariants}
            className={cn("px-3 pt-1 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider", isExpanded ? "block" : "hidden")}
          >
            Support
          </motion.div>

          {supportNavItems.map((item) => (
            <Tooltip key={item.href || item.to} disableHoverableContent={isExpanded}>
              <TooltipTrigger asChild>
                 <NavItem item={item} isExpanded={isExpanded} variants={navLabelVariants} />
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700 ml-2 shadow-lg">
                  <p>{item.label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        <motion.div 
          className="p-4 border-t border-slate-800/70"
          initial={{opacity: 0}}
          animate={{opacity: isExpanded ? 1: 0}}
          transition={{delay: isExpanded ? 0.2 : 0}}
        >
          <p className="text-xs text-slate-500 text-center whitespace-nowrap">&copy; {new Date().getFullYear()} Trainava</p>
        </motion.div>
      </motion.aside>
    </TooltipProvider>
  );
};

export default Sidebar;