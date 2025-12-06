import { Github, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">TaskFlow</span> Ultra
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  The ultimate gamified productivity platform. Level up your life, conquer your day, and achieve mastery through organized chaos.
              </p>
          </div>

          {/* Links 1 */}
          <div>
              <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Product</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-blue-400 cursor-pointer transition">Features</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Leaderboard</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Pricing</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Changelog</li>
              </ul>
          </div>

          {/* Links 2 */}
          <div>
              <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Company</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                  <li className="hover:text-blue-400 cursor-pointer transition">About Us</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Careers</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Privacy Policy</li>
                  <li className="hover:text-blue-400 cursor-pointer transition">Contact</li>
              </ul>
          </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">© 2024 TaskFlow Ultra Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
              <Github className="text-slate-500 hover:text-white transition cursor-pointer" size={20} />
              <Twitter className="text-slate-500 hover:text-blue-400 transition cursor-pointer" size={20} />
              <div className="flex items-center gap-1 text-slate-600 text-sm">
                  Made with <Heart size={14} className="text-red-500 fill-red-500" /> by MIKIALE
              </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;