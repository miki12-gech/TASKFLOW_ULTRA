import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Zap, Shield, Users, Calendar, Layout } from 'lucide-react';
import Footer from '../components/Footer';

const FeatureCard = ({ icon, title, desc }) => (
  // Clean White Card with soft lift effect
  <div className="bg-white/80 p-6 rounded-3xl border border-white shadow-xl shadow-blue-900/5 hover:border-blue-200 hover:-translate-y-1 transition-all group backdrop-blur-sm">
      <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform group-hover:bg-blue-100 shadow-sm">
          {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Landing = () => {
  return (
    <div className="w-full flex flex-col">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pb-20 pt-32">
            {/* Background Decoration specific to Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-70" />
            
            <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
                <div className="inline-block px-4 py-1.5 bg-white border border-slate-100 rounded-full text-blue-600 text-sm font-bold font-mono mb-8 shadow-sm tracking-wide">
                    ✨ v1.0.0 Now Live
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 drop-shadow-sm leading-tight">
  GAMIFY YOUR <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
    PRODUCTIVITY
  </span>
</h1>
                <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop writing boring to-do lists. Turn your daily tasks into quests, earn XP, level up, and compete on the global leaderboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-blue-500/30">
                        Start Your Adventure <ArrowRight />
                    </Link>
                    <Link to="/login" className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-md">
                        Login
                    </Link>
                </div>
                
                {/* Link to About Page */}
                <div className="mt-10 text-sm text-slate-400 font-medium">
                    Curious about the tech stack? <Link to="/about" className="text-blue-500 hover:text-blue-700 font-bold transition-colors underline decoration-blue-200 hover:decoration-blue-500 decoration-2 underline-offset-4">Read the Story</Link>
                </div>
            </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 px-4 bg-white/50 backdrop-blur-3xl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Core Systems Online</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-900">Command Center Features</h3>
                    <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">Everything you need to conquer chaos and master your workflow.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Trophy className="w-6 h-6" />} title="XP System" 
                        desc="Earn experience points for every completed task. Watch your level bar fill up and unlock achievements."
                    />
                    <FeatureCard 
                        icon={<Layout className="w-6 h-6" />} title="Kanban Board" 
                        desc="Visualize your workflow. Drag and drop missions from Active to Complete with zero latency."
                    />
                    <FeatureCard 
                        icon={<Users className="w-6 h-6" />} title="Global Leaderboard" 
                        desc="Compete with other players. See who is the most productive productivity master."
                    />
                    <FeatureCard 
                        icon={<Calendar className="w-6 h-6" />} title="Timeline View" 
                        desc="Review your battle history. A complete calendar view of your daily wins and streaks."
                    />
                    <FeatureCard 
                        icon={<Shield className="w-6 h-6" />} title="Secure Identity" 
                        desc="Custom avatars and secure authentication. Your data is encrypted and safe."
                    />
                    <FeatureCard 
                        icon={<Zap className="w-6 h-6" />} title="Instant Analytics" 
                        desc="Visualize your productivity distribution. Pie charts and bar graphs show where you spend energy."
                    />
                </div>
            </div>
        </section>

        <Footer />
    </div>
  );
};

export default Landing;