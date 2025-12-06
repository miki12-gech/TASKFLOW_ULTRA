import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import { Link } from 'react-router-dom';
import { ArrowLeft, PieChart as PieIcon, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { subDays, format, isSameDay } from 'date-fns';

// Blue, Amber, Red (Light Theme Colors)
const COLORS = ['#60a5fa', '#f59e0b', '#ef4444']; 

const Analytics = () => {
  const { data: tasks, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });

  if (isLoading) return <div className="text-blue-600 h-screen flex justify-center items-center font-bold animate-pulse">Processing Data...</div>;

  // --- LOGIC ---
  const activeTasks = tasks?.filter(t => !t.isCompleted) || [];
  
  const priorityData = [
    { name: 'Low', value: activeTasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: activeTasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: activeTasks.filter(t => t.priority === 'high').length },
  ].filter(item => item.value > 0); 

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      date: format(d, 'EEE'), // "Mon"
      completed: tasks?.filter(t => t.isCompleted && isSameDay(new Date(t.updatedAt), d)).length || 0
    };
  });

  const totalCompleted = tasks?.filter(t => t.isCompleted).length || 0;
  const completionRate = tasks?.length ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  // Custom Chart Tooltip (Light Theme)
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-800 border border-slate-100 p-3 rounded-xl shadow-xl text-xs font-bold">
          <p>{`${payload[0].value} Missions`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-screen flex flex-col p-6">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            
            <Link to="/dashboard" className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold shadow-sm hover:shadow-md">
                <ArrowLeft size={20} className="text-blue-500" />
                <span>Return to Command</span>
            </Link>

            <div className="text-right">
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wider flex items-center justify-end gap-3">
                    Analytics <Activity className="text-blue-500" size={28} /> 
                </h1>
                <p className="text-slate-500 font-medium text-sm">Real-time Performance Metrics</p>
            </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-blue-900/5">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Total Active Load</h3>
                <p className="text-5xl font-black text-slate-800">{activeTasks.length}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-blue-900/5">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Lifetime Completed</h3>
                <p className="text-5xl font-black text-blue-600">{totalCompleted}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg shadow-blue-900/5">
                <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Success Rate</h3>
                <p className="text-5xl font-black text-green-500">{completionRate}%</p>
            </div>
        </div>

        {/* CHARTS CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
            
            {/* PIE CHART CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-xl shadow-blue-900/5">
                <h3 className="text-slate-700 text-lg font-bold flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <PieIcon size={20} className="text-amber-500" /> Mission Priority Distribution
                </h3>
                
                {priorityData.length > 0 ? (
                    <>
                        <div className="w-full h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={priorityData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                        {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-4">
                            {['Low', 'Medium', 'High'].map((label, i) => (
                                <div key={label} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                                    <span className="text-slate-600 font-bold text-sm">{label}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 font-bold h-[300px]">No active data to analyze.</div>
                )}
            </div>

            {/* BAR CHART CARD */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-xl shadow-blue-900/5">
                <h3 className="text-slate-700 text-lg font-bold flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                    <Activity size={20} className="text-green-500" /> 7-Day Activity Stream
                </h3>
                
                <div className="w-full h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={last7Days}>
                            <XAxis dataKey="date" stroke="#cbd5e1" tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                            <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    </div>
  );
};

export default Analytics;