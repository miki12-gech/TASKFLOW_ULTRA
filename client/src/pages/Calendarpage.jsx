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

  if (isLoading) return <div className="text-blue-600 h-screen flex justify-center items-center font-bold animate-pulse">Loading Timeline...</div>;

  const getDayStatus = (day) => {
      // Find tasks updated on this day AND completed
      const completedOnDay = tasks?.filter(t => t.isCompleted && isSameDay(new Date(t.updatedAt), day));
      if (completedOnDay?.length > 0) return { count: completedOnDay.length };
      return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[90vh] flex flex-col p-6">
       
       {/* HEADER */}
       <div className="flex items-center justify-between mb-8">
            <Link to="/dashboard" className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold shadow-sm">
                <ArrowLeft size={20} className="text-blue-500" /> Back
            </Link>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight flex flex-col md:flex-row items-center gap-2">
                TIMELINE <span className="text-blue-500 font-mono text-xl">// {format(currentDate, 'MMM yyyy')}</span>
            </h1>
            <div className="flex gap-2">
                <button onClick={prevMonth} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronLeft /></button>
                <button onClick={nextMonth} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><ChevronRight /></button>
            </div>
       </div>

       {/* CALENDAR GRID */}
       <div className="bg-white/90 backdrop-blur-md border border-white shadow-xl shadow-blue-900/5 rounded-3xl p-6 flex-1 flex flex-col overflow-hidden">
            {/* Week Headers */}
            <div className="grid grid-cols-7 mb-4 pb-2 border-b border-slate-100">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-center text-slate-400 font-bold text-xs tracking-[0.2em]">{day}</div>
                ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-3 flex-1">
                {days.map((day) => {
                    const status = getDayStatus(day);
                    const today = isToday(day);

                    return (
                        <div key={day.toString()} className={`
                            relative rounded-2xl border flex flex-col items-center justify-start py-3 transition-all duration-300
                            ${today ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md'}
                            ${status ? 'border-emerald-200 bg-emerald-50 hover:scale-105 shadow-sm' : ''}
                        `}>
                            <span className={`text-lg font-bold font-mono ${today ? 'text-blue-600' : 'text-slate-400'}`}>
                                {format(day, 'd')}
                            </span>

                            {/* Status Indicator */}
                            {status && (
                                <div className="mt-2 flex flex-col items-center animate-fade-in-up">
                                    <div className="bg-white p-1.5 rounded-full shadow-md border border-emerald-100">
                                        <Trophy size={14} className="text-emerald-500 fill-emerald-500" />
                                    </div>
                                    <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1 tracking-widest hidden sm:block">
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