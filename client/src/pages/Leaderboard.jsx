import { useQuery } from '@tanstack/react-query';
import { getLeaderboardData } from '../api/auth';
import { Trophy, Crown, Medal, ArrowLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardData,
  });

  if (isLoading) return <div className="text-white text-center mt-20 text-xl font-bold">Summoning Champions...</div>;

  return (
    <div className="w-full max-w-3xl mx-auto min-h-screen p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        {/* LINK FIXED: Points to Dashboard to avoid Logout */}
        <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-bold">
            <ArrowLeft size={20} /> Back to Command
        </Link>
        <div className="flex items-center gap-2 text-yellow-400">
            <Trophy size={28} />
            <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent uppercase tracking-wider">
                Hall of Fame
            </h1>
        </div>
      </div>

      {/* The List Container */}
      <div className="bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        
        {users?.map((user, index) => {
            // Styling logic for Top 3 (High Contrast)
            let rankIcon;
            let rankColor = "text-slate-500";
            let rowBg = "border-b border-slate-800 bg-slate-900";

            if (index === 0) { 
                rankIcon = <Crown className="text-yellow-400 fill-yellow-400/20" />; 
                rankColor = "text-yellow-400 font-bold";
                rowBg = "bg-yellow-500/10 border-b border-yellow-500/20"; // Gold tint
            }
            else if (index === 1) { 
                rankIcon = <Medal className="text-slate-300" />; 
                rankColor = "text-slate-300 font-bold";
                rowBg = "bg-slate-800 border-b border-slate-700"; // Silver tint
            }
            else if (index === 2) { 
                rankIcon = <Medal className="text-orange-400" />; 
                rankColor = "text-orange-400 font-bold";
                rowBg = "bg-orange-500/10 border-b border-orange-500/20"; // Bronze tint
            }
            else { 
                rankIcon = <span className="font-mono font-bold text-lg w-6 text-center">{index + 1}</span>; 
            }

            return (
                <div key={user.id} className={`flex items-center justify-between p-5 ${rowBg} hover:bg-white/5 transition-colors group`}>
                    
                    <div className="flex items-center gap-5">
                        <div className={`w-8 flex justify-center scale-110 ${rankColor}`}>
                            {rankIcon}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                {/* User Name */}
                                <p className={`font-bold text-lg group-hover:text-blue-400 transition-colors ${index < 3 ? 'text-white' : 'text-slate-300'}`}>
                                    {user.name}
                                </p>
                                {/* Avatar (Mini) */}
                                {user.avatar && (
                                    <img src={user.avatar} className="w-6 h-6 rounded-full border border-slate-600" alt="avatar" />
                                )}
                            </div>
                            
                            {/* Level Badge */}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-wide">
                                    Level {user.level}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`text-2xl font-black block ${index === 0 ? 'text-yellow-500' : 'text-slate-200'}`}>{user.xp}</span>
                        <span className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">Experience</span>
                    </div>

                </div>
            );
        })}
      </div>

      <div className="mt-8 text-center text-slate-600 text-sm font-bold tracking-widest uppercase opacity-60">
         Compete by completing daily missions
      </div>
    </div>
  );
};

export default Leaderboard;