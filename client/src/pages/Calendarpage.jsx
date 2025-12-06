import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/tasks';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: tasks, isLoading } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });

  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  if (isLoading) return <div className="text-white text-center mt-20">Loading Timeline...</div>;

  const getDayStatus = (day) => {
      // Find tasks updated on this day AND completed
      const completedOnDay = tasks?.filter(t => t.isCompleted && isSameDay(new Date(t.updatedAt), day));
      if (completedOnDay?.length > 0) return { count: completedOnDay.length };
      return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[90vh] flex flex-col p-4">
       
       {/* HEADER */}
       <div className="flex items-center justify-between mb-8">
            <Link to="/dashboard" className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
            <h1 className="text-4xl font-black text-white uppercase tracking-widest flex flex-col md:flex-row items-center gap-2">
                TIMELINE <span className="text-blue-500 font-mono text-xl">// {format(currentDate, 'MMM yyyy')}</span>
            </h1>
            <div className="flex gap-2">
                <button onClick={prevMonth} className="p-3 bg-slate-800 text-white rounded-xl hover:bg-blue-600 transition"><ChevronLeft /></button>
                <button onClick={nextMonth} className="p-3 bg-slate-800 text-white rounded-xl hover:bg-blue-600 transition"><ChevronRight /></button>
            </div>
       </div>

       {/* CALENDAR GRID */}
       <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex-1 flex flex-col overflow-hidden">
            {/* Week Headers */}
            <div className="grid grid-cols-7 mb-4 pb-2 border-b border-white/5">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-center text-slate-500 font-bold text-xs tracking-[0.2em]">{day}</div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2 flex-1">
                {days.map((day) => {
                    const status = getDayStatus(day);
                    const today = isToday(day);

                    return (
                        <div key={day.toString()} className={`
                            relative rounded-xl border flex flex-col items-center justify-start py-3 transition-all duration-300
                            ${today ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 bg-white/5'}
                            ${status ? 'border-green-500/50 bg-green-900/20 hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'hover:bg-white/10'}
                        `}>
                            <span className={`text-lg font-bold font-mono ${today ? 'text-blue-400' : 'text-slate-400'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Status Indicator */}
                            {status && (
                                <div className="mt-2 flex flex-col items-center animate-bounce">
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1.5 rounded-full shadow-lg">
                                        <Trophy size={14} className="text-black" />
                                    </div>
                                    <span className="text-[10px] text-green-300 font-bold uppercase mt-1 tracking-widest">
                                        {status.count} WINS
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
       </div>
    </div>
  );
};

export default CalendarPage;