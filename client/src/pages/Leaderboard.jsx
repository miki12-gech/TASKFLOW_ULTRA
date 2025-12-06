import { useQuery } from '@tanstack/react-query';
import { getLeaderboardData } from '../api/auth';
import { Trophy, Crown, Medal, ArrowLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardData,
  });

  if (isLoading) return <div className="text-blue-600 h-screen flex justify-center items-center font-bold animate-pulse">Summoning Champions...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen p-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        {/* Return Button */}
        <Link to="/dashboard" className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold shadow-sm hover:shadow-md">
            <ArrowLeft size={20} className="text-blue-500" />
            <span>Return to Command</span>
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-xl border border-yellow-100">
                <Trophy size={32} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-right">
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Hall of Fame</h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Global Ranking</p>
            </div>
        </div>
      </div>

      {/* The List Container */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5">
        
        {/* Table Header (Optional, mostly visual) */}
        <div className="flex justify-between px-8 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Rank & Player</span>
            <span>Total XP Earned</span>
        </div>

        {users?.map((user, index) => {
            // Updated Styling Logic for Light Theme
            let rankIcon;
            let rankColor = "text-slate-400";
            let rowBg = "border-b border-slate-50 hover:bg-slate-50"; // Default row style

            // 1st Place (Gold)
            if (index === 0) { 
                rankIcon = <Crown className="text-yellow-500 fill-yellow-100" />; 
                rankColor = "text-yellow-600 font-bold";
                rowBg = "bg-yellow-50/50 border-b border-yellow-100 hover:bg-yellow-50"; 
            }
            // 2nd Place (Silver)
            else if (index === 1) { 
                rankIcon = <Medal className="text-slate-400 fill-slate-100" />; 
                rankColor = "text-slate-600 font-bold";
                rowBg = "bg-slate-50/50 border-b border-slate-100 hover:bg-slate-100"; 
            }
            // 3rd Place (Bronze)
            else if (index === 2) { 
                rankIcon = <Medal className="text-orange-400 fill-orange-100" />; 
                rankColor = "text-orange-600 font-bold";
                rowBg = "bg-orange-50/30 border-b border-orange-100 hover:bg-orange-50"; 
            }
            // Others
            else { 
                rankIcon = <span className="font-mono font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-sm">{index + 1}</span>; 
            }

            return (
                <div key={user.id} className={`flex items-center justify-between p-6 transition-all duration-300 group ${rowBg}`}>
                    
                    <div className="flex items-center gap-6">
                        <div className={`w-8 flex justify-center scale-110 ${rankColor}`}>
                            {rankIcon}
                        </div>
                        
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="relative">
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                                    )}
                                    {/* Small Rank Badge for Top 3 */}
                                    {index < 3 && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-white rounded-full"></div>}
                                </div>

                                {/* User Name */}
                                <p className={`font-bold text-lg group-hover:text-blue-600 transition-colors ${index < 3 ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {user.name}
                                </p>
                            </div>
                            
                            {/* Level Badge */}
                            <div className="flex items-center gap-2 mt-1 ml-14">
                                <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm uppercase tracking-wide">
                                    LVL <span className="text-blue-500 text-sm">{user.level}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`text-2xl font-black block tracking-tight ${index === 0 ? 'text-yellow-600' : 'text-slate-700'}`}>
                            {user.xp.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">XP</span>
                    </div>

                </div>
            );
        })}
      </div>

      <div className="mt-8 text-center">
         <p className="text-slate-400 text-sm font-medium">Keep completing daily missions to climb the ranks!</p>
      </div>
    </div>
  );
};

export default Leaderboard;