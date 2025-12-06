import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUser, logoutUser } from '../api/auth';
import { ArrowLeft, Save, User, Mail, Shield, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AVATAR_SEEDS = [
    'Felix', 'Aneka', 'Zoe', 'Midnight', 'Jack', 'Luna', 
    'Max', 'Rocky', 'Bandit', 'Abby', 'Bella', 'Gizmo'
];

const Settings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({ 
      queryKey: ['user'], 
      queryFn: getUserProfile,
  });
  
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (user) {
        setName(user.name);
        setSelectedAvatar(user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=Felix`);
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
        queryClient.setQueryData(['user'], data);
        toast.success("Profile Updated!");
    }
  });

  const handleSave = (e) => {
      e.preventDefault();
      if (!selectedAvatar) return; 
      updateProfileMutation.mutate({ name, avatar: selectedAvatar });
  };

  const handleLogout = async () => {
    await logoutUser();
    queryClient.clear(); 
    // Force hard redirect to clear React state
    window.location.href = '/login';
  };

  if (isLoading || !user) return <div className="text-white h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto min-h-screen p-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            {/* LINK TO DASHBOARD to stay logged in */}
            <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} /> Back to Command
            </Link>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                User Settings
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-700 p-8 rounded-3xl shadow-xl space-y-6">
                    <div className="flex items-center gap-3 text-blue-400 border-b border-white/10 pb-4 mb-4">
                        <Shield size={24} />
                        <h2 className="font-bold text-lg text-white">Identity Card</h2>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-blue-500 bg-slate-800 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            {selectedAvatar ? (
                                <img src={selectedAvatar} alt="Current Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-700 animate-pulse" />
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><User size={14} /> Codename</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                           className="w-full bg-black/40 border border-slate-600 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors font-bold" />
                    </div>
                    <div className="space-y-2 opacity-50 cursor-not-allowed">
                        <label className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-2"><Mail size={14} /> Email (Locked)</label>
                        <input type="email" value={user.email} disabled className="w-full bg-black/40 border border-slate-700 rounded-xl p-3 text-slate-400 font-mono" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20">
                        <Save size={18} /> Update Identity
                    </button>
                </form>
                <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-3xl flex justify-between items-center">
                    <div>
                        <h3 className="text-red-400 font-bold">End Session</h3>
                        <p className="text-xs text-red-200/50">Securely log out of this device.</p>
                    </div>
                    <button onClick={handleLogout} className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all"><LogOut /></button>
                </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-3xl shadow-xl">
                 <h2 className="font-bold text-lg text-white mb-6 border-b border-white/10 pb-4">Select Hero Avatar</h2>
                 <div className="grid grid-cols-3 gap-4">
                     {AVATAR_SEEDS.map((seed) => {
                         const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                         const isSelected = selectedAvatar === avatarUrl;
                         return (
                             <div key={seed} onClick={() => setSelectedAvatar(avatarUrl)}
                                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:scale-105 bg-slate-800 ${isSelected ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                                 <img src={avatarUrl} alt={seed} className="w-full h-auto bg-black/20" />
                             </div>
                         )
                     })}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;