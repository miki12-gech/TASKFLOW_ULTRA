import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Zap, Shield, Users, Calendar, Layout } from 'lucide-react';
import Footer from '../components/Footer';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-slate-900 transition-all group">
      <div className="bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
          {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => {
  return (
    <div className="w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
                <div className="inline-block px-4 py-1 bg-white/5 border border-white/10 rounded-full text-blue-400 text-sm font-mono mb-6">
                    v1.0.0 Live & Ready
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-6">
                    GAMIFY YOUR <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        PRODUCTIVITY
                    </span>
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop writing boring to-do lists. Turn your daily tasks into quests, earn XP, level up, and compete on the global leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
                        Start Your Adventure <ArrowRight />
                    </Link>
                    <Link to="/login" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-700 transition-all">
                        Login
                    </Link>
                </div>
                
                {/* ⬇️ NEW: Link to About Page ⬇️ */}
                <div className="mt-8 text-sm text-slate-500">
                    Curious about the tech stack? <Link to="/about" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-blue-500/30 hover:decoration-blue-500">Read the Story</Link>
                </div>
            </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 px-4 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white uppercase tracking-wide">Command Center Features</h2>
                    <p className="text-slate-500 mt-4">Everything you need to conquer chaos.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard 
                        icon={<Trophy />} title="XP System" 
                        desc="Earn experience points for every completed task. Watch your level bar fill up and unlock achievements."
                    />
                    <FeatureCard 
                        icon={<Layout />} title="Kanban Board" 
                        desc="Visualize your workflow. Drag and drop missions from Active to Complete with zero latency."
                    />
                    <FeatureCard 
                        icon={<Users />} title="Global Leaderboard" 
                        desc="Compete with other players. See who is the most productive productivity master."
                    />
                    <FeatureCard 
                        icon={<Calendar />} title="Timeline View" 
                        desc="Review your battle history. A complete calendar view of your daily wins and streaks."
                    />
                    <FeatureCard 
                        icon={<Shield />} title="Secure Identity" 
                        desc="Custom avatars and secure authentication. Your data is encrypted and safe."
                    />
                    <FeatureCard 
                        icon={<Zap />} title="Instant Analytics" 
                        desc="Visualize your productivity distribution. Pie charts and bar graphs show where you spend energy."
                    />
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <Footer />
    </div>
  );
};

export default Landing;