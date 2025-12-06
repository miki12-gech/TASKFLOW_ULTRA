import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Database, Server, Layout, Heart, Coffee, Globe } from 'lucide-react';
import Footer from '../components/Footer';
// 1. IMPORT YOUR PHOTO (Ensure file is at client/src/assets/im1.png)
import profilePic from '../assets/im1.png';

const TechCard = ({ icon, title, desc, color }) => (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 transition-all hover:-translate-y-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-slate-800 ${color}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm">{desc}</p>
    </div>
);

const About = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6">
           {/* Background Decorations */}
           <div className="absolute top-20 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute bottom-20 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

           <div className="max-w-4xl mx-auto relative z-10">
               <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors font-bold">
                   <ArrowLeft size={20} /> Return Home
               </Link>
               
               <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                   NOT JUST ANOTHER <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">TODO LIST.</span>
               </h1>
               <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                   TaskFlow Ultra was born from a simple idea: Productivity shouldn't feel like a chore. It should feel like a game. By combining psychology with clean design, we turn your daily grind into an RPG adventure.
               </p>
           </div>
      </section>

      {/* 2. THE TECH STACK */}
      <section className="py-24 px-6 bg-slate-900/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-black text-white uppercase tracking-wider">Powered By PERN</h2>
                  <p className="text-slate-500 mt-2">Built with industry-standard technologies.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <TechCard 
                    icon={<Database />} title="PostgreSQL" color="text-blue-400"
                    desc="Robust, scalable SQL database managed via Neon Tech and controlled with Prisma ORM." 
                  />
                  <TechCard 
                    icon={<Server />} title="Express + Node" color="text-green-400"
                    desc="High-performance backend REST API ensuring secure and fast data transmission." 
                  />
                  <TechCard 
                    icon={<Layout />} title="React + Vite" color="text-cyan-400"
                    desc="Blazing fast frontend using Hooks, Context, and Modern Javascript (ES6+)." 
                  />
                  <TechCard 
                    icon={<Code />} title="Tailwind CSS" color="text-pink-400"
                    desc="Utility-first styling framework enabling complex, responsive, glassmorphism designs." 
                  />
              </div>
          </div>
      </section>

      {/* 3. THE CREATOR SECTION */}
      <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-700 p-8 md:p-12 rounded-3xl relative overflow-hidden">
               {/* Decorative Gradient */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   
                   {/* 2. YOUR PHOTO HERE */}
                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-slate-800 shadow-2xl bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                       <img src={profilePic} alt="MIKIALE" className="w-full h-full object-cover" />
                   </div>
                   
                   <div className="text-center md:text-left">
                       
                       {/* 3. YOUR NAME HERE */}
                       <h2 className="text-2xl font-bold text-white mb-2">
                           Built with <Heart className="inline text-red-500 fill-red-500 mx-1 w-5" /> by MIKIALE
                       </h2>
                       
                       <p className="text-slate-400 mb-6">
                           Hi! I am a Full Stack Engineer passionate about building software that people love to use. 
                           TaskFlow Ultra represents the culmination of modern web development practices: 
                           Authentication, Real-time Interaction, and Beautiful UI.
                       </p>
                       <div className="flex justify-center md:justify-start gap-4">
                           <a href="#" className="flex items-center gap-2 text-white bg-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">
                               <Globe size={18} /> Portfolio
                           </a>
                           
                           {/* 4. TELEGRAM LINK HERE */}
                           <a 
                                href="https://t.me/MIKI_GW" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-300 border border-slate-600 px-6 py-2 rounded-full font-bold hover:bg-white/10 transition"
                           >
                               <Coffee size={18} /> Contact @MIKI_GW
                           </a>
                       </div>
                   </div>
               </div>
          </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;