import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Section = ({ title, children, id }) => (
  <motion.section 
    id={id}
    className="mb-12 scroll-mt-20"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-3xl font-semibold text-primary mb-3 pb-2 border-b-2 border-primary/30">{title}</h2>
    <div className="space-y-4 text-slate-300 leading-relaxed">
      {children}
    </div>
  </motion.section>
);

const SubSection = ({ title, children, id }) => (
  <motion.div 
    id={id}
    className="mb-8 ml-4 scroll-mt-20"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
  >
    <h3 className="text-2xl font-medium text-slate-100 mb-2">{title}</h3>
    <div className="space-y-3 text-slate-400">
      {children}
    </div>
  </motion.div>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-slate-800 p-4 rounded-md overflow-x-auto text-sm text-slate-300 border border-slate-700 shadow-inner">
    <code>{children}</code>
  </pre>
);

const ListItem = ({ children }) => (
  <li className="ml-5 list-disc list-outside">{children}</li>
);

const DocumentationPage = () => {
  const lastUpdated = "2025-05-22";

  const navItems = [
    { id: "intro", title: "Introduction" },
    { id: "getting-started", title: "Getting Started" },
    { id: "core-features", title: "Core Features" },
    { id: "backend", title: "Backend & Data" },
    { id: "ui-ux", title: "UI & UX" },
    { id: "tech-stack", title: "Tech Stack" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6 lg:p-8">
      <aside className="lg:w-1/4 xl:w-1/5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] overflow-y-auto pr-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {navItems.map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-slate-300 hover:text-primary transition-colors block py-1 text-sm">
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </aside>

      <main className="lg:w-3/4 xl:w-4/5">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold gradient-text mb-2">Trainava Application Documentation</h1>
          <p className="text-slate-500">Last Updated: {lastUpdated}</p>
        </motion.div>
        <Separator className="my-6 bg-slate-700" />

        <Section title="1. Introduction" id="intro">
          <p>Trainava is a comprehensive platform designed for users to engage with GPU computing resources for AI model training, deployment, and earning potential. It offers a suite of tools for managing GPU nodes, renting compute power, training custom AI models, utilizing pre-built AI templates, and deploying AI assistants, particularly to Telegram. The platform integrates Web3 concepts like a tokenized credit system ($TRVN) and wallet-based authentication.</p>
        </Section>

        <Section title="2. Getting Started" id="getting-started">
          <SubSection title="2.1. Account Creation & Login">
            <ul>
              <ListItem><strong>Email/Password:</strong> Users can sign up or log in using traditional email and password credentials. Email confirmation is required for new sign-ups.</ListItem>
              <ListItem><strong>Web3 Wallet:</strong> Alternatively, users can connect their Web3 wallet (e.g., MetaMask) to sign up or log in, providing a decentralized authentication option.</ListItem>
              <ListItem><strong>Logo:</strong> The Trainava logo is prominently displayed on the authentication page, sidebar, and as the browser favicon.</ListItem>
            </ul>
          </SubSection>
          <SubSection title="2.2. Navigating the Platform">
            <p>The platform is organized into several key sections, accessible via a collapsible sidebar:</p>
            <p><strong>Main Navigation:</strong></p>
            <ul>
              <ListItem><code>Dashboard</code>: Overview of user stats and quick actions.</ListItem>
              <ListItem><code>My GPUs</code>: Manage purchased GPU nodes.</ListItem>
              <ListItem><code>Buy GPU Power</code>: Purchase GPU cloud nodes.</ListItem>
              <ListItem><code>Rent GPU</code>: Rent GPU power from a marketplace or Trainava's curated selection.</ListItem>
              <ListItem><code>Train AI</code>: Configure and launch AI model training jobs.</ListItem>
              <ListItem><code>AI Starter Pack</code>: Explore and clone pre-configured AI model templates.</ListItem>
              <ListItem><code>Deploy AI Bot</code>: Deploy trained AI models as Telegram bots.</ListItem>
              <ListItem><code>My Bots</code>: Manage deployed Telegram bots.</ListItem>
            </ul>
            <p><strong>User & Settings (via Header Dropdown):</strong></p>
            <ul>
              <ListItem><code>Profile</code>: View and manage user profile information (name, avatar).</ListItem>
              <ListItem><code>Settings</code>: Access application settings (e.g., theme).</ListItem>
              <ListItem><code>Log Out</code>: Securely end the user session.</ListItem>
            </ul>
            <p><strong>Support & External Links (Sidebar):</strong></p>
            <ul>
              <ListItem>Links to the Trainava Website, External Documentation, App Documentation (this page), X (Twitter), GitHub, and Email Support.</ListItem>
            </ul>
          </SubSection>
        </Section>

        <Section title="3. Core Features & Functionality" id="core-features">
          <SubSection title="3.1. Dashboard (/)" >
            <p>Provides a welcome message and key statistics like Active GPU Nodes, $TRVN Balance, and Models Trained. Includes quick actions and a "Get Started" section for new users.</p>
          </SubSection>
          <SubSection title="3.2. My GPUs (/my-gpus)">
            <p>Lists user-owned GPUs, allowing management of their status (idle, available-for-rent) and rental rates. Users can also delete GPU nodes.</p>
          </SubSection>
          <SubSection title="3.3. Buy GPU Power (/buy-gpu-power)">
            <p>Presents GPU packages for purchase. A simulated payment process adds the GPU to `user_gpus` and updates `$TRVN` credits via the `increment_user_credits` Supabase function.</p>
          </SubSection>
          <SubSection title="3.4. Rent GPU (/rent-gpu)">
            <p>Users can browse and rent GPUs from Trainava's curated selection or a user marketplace. Includes filtering options. Successful rentals are recorded in `gpu_rentals`.</p>
          </SubSection>
          <SubSection title="3.5. Train AI (/train-ai)">
            <p>Allows users to select owned GPUs or opt to rent one later. Users choose a training pipeline (e.g., Image Generation, Voice Cloning), configure parameters, and launch jobs. Jobs are recorded in `ai_training_jobs` and owned GPU status is updated if used.</p>
          </SubSection>
          <SubSection title="3.6. AI Starter Pack (/ai-templates)">
            <p>A library of pre-configured AI model templates. Users can "Try Now" (simulated interaction) or "Create / Clone Bot," which navigates to `/build-ai` with pre-filled details.</p>
          </SubSection>
          <SubSection title="3.7. Build AI Assistant (/build-ai)">
            <p>A form to define a custom AI assistant (name, purpose, base model). Simulates creation and navigates to `/deploy-telegram` with assistant details.</p>
          </SubSection>
          <SubSection title="3.8. Deploy AI Bot (/deploy-telegram)">
            <p>Form for deploying an AI model as a Telegram bot. Requires bot name and Telegram BotFather API token. Records deployment in `user_deployed_bots`.</p>
          </SubSection>
          <SubSection title="3.9. My Bots (/my-bots)">
            <p>Lists all Telegram bots deployed by the user from `user_deployed_bots`. Allows deletion (from platform, not Telegram).</p>
          </SubSection>
          <SubSection title="3.10. User Profile (/profile)">
            <p>Displays user information (name, email, avatar, $TRVN balance) and allows editing name and avatar URL via `EditProfileModal`. Changes are saved to `user_profiles`.</p>
          </SubSection>
          <SubSection title="3.11. Settings (/settings)">
            <p>Allows theme customization (Dark/Light). Includes placeholders for other account management features.</p>
          </SubSection>
        </Section>

        <Section title="4. Backend & Data Management (Supabase)" id="backend">
          <p><strong>Authentication:</strong> Uses Supabase Auth for email/password and wallet-based sign-in/sign-up.</p>
          <p><strong>Database Tables:</strong></p>
          <ul>
            <ListItem><code>user_profiles</code>: User data, $TRVN credits.</ListItem>
            <ListItem><code>user_gpus</code>: Owned GPUs, specs, status, rental rates.</ListItem>
            <ListItem><code>gpu_rentals</code>: GPU rental session records.</ListItem>
            <ListItem><code>ai_training_jobs</code>: AI model training job details.</ListItem>
            <ListItem><code>user_deployed_bots</code>: Deployed Telegram bot information.</ListItem>
          </ul>
          <p><strong>Supabase Functions:</strong></p>
          <ul>
            <ListItem><code>increment_user_credits</code>: RPC function to add $TRVN credits.</ListItem>
          </ul>
        </Section>

        <Section title="5. User Interface & Experience" id="ui-ux">
          <ul>
            <ListItem><strong>Styling:</strong> Modern dark-themed UI with TailwindCSS, shadcn/ui components, glassmorphism/gradient effects.</ListItem>
            <ListItem><strong>Animations:</strong> Framer Motion for page transitions and micro-interactions.</ListItem>
            <ListItem><strong>Responsiveness:</strong> Designed for various screen sizes with a collapsible sidebar.</ListItem>
            <ListItem><strong>Notifications:</strong> Toast notifications for action feedback.</ListItem>
            <ListItem><strong>Icons:</strong> Lucide React for a consistent icon set.</ListItem>
            <ListItem><strong>Loading States:</strong> Skeletons, spinners, and messages for data fetching.</ListItem>
            <ListItem><strong>Error Handling:</strong> Graceful error messages and toasts.</ListItem>
          </ul>
        </Section>

        <Section title="6. Key Technologies" id="tech-stack">
          <ul>
            <ListItem><strong>Frontend:</strong> React 18.2.0, Vite</ListItem>
            <ListItem><strong>Routing:</strong> React Router 6.16.0</ListItem>
            <ListItem><strong>Styling:</strong> TailwindCSS 3.3.2</ListItem>
            <ListItem><strong>UI Components:</strong> shadcn/ui (custom-built)</ListItem>
            <ListItem><strong>Icons:</strong> Lucide React 0.292.0</ListItem>
            <ListItem><strong>Animations:</strong> Framer Motion 10.16.4</ListItem>
            <ListItem><strong>Backend-as-a-Service:</strong> Supabase</ListItem>
            <ListItem><strong>Language:</strong> JavaScript (.jsx, .js)</ListItem>
          </ul>
        </Section>
        
        <motion.div 
            className="mt-12 text-center text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
        >
            <p>This documentation provides a snapshot of the Trainava application. As the application evolves, this document should be updated.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default DocumentationPage;