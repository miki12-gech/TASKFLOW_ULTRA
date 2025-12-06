import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, toggleTask, deleteTask, updateTask } from '../api/tasks';
import { getUserProfile, logoutUser } from '../api/auth';
import { 
    Trash2, LogOut, Trophy, GripVertical, Calendar as CalendarIcon, 
    Search, AlertCircle, Clock, Flag, Plus, LayoutDashboard, Edit2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { format, isPast, isToday } from 'date-fns';
import EditModal from '../components/EditModal';
import Footer from '../components/Footer';

// --- STYLES & HELPERS ---
const PRIORITY_COLORS = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-blue-500"
};

const DraggableTask = ({ task, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id, data: { task } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;
  
  const isDone = task.isCompleted;
  const isOverdue = !isDone && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = !isDone && task.dueDate && isToday(new Date(task.dueDate));

  const priorityClass = PRIORITY_COLORS[task.priority] || "border-l-white";
  let bgClass = "bg-slate-800 hover:bg-slate-750"; 
  if (isDone) bgClass = "bg-slate-900/40 opacity-60 grayscale"; 
  else if (isOverdue) bgClass = "bg-red-900/20 border-red-500/50"; 

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} 
      className={`group relative flex flex-col p-4 mb-3 rounded-r-xl cursor-grab active:cursor-grabbing touch-none transition-all shadow-lg border-l-4 ${priorityClass} ${bgClass}`}
    >
      {/* Top Row: Title & Actions */}
      <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="p-1 text-slate-500"><GripVertical size={20} /></div>
             <span className={`text-base font-bold truncate ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                 {task.title}
             </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                 onPointerDown={(e) => e.stopPropagation()} 
                 onClick={() => onEdit(task)} 
                 className="text-slate-500 hover:text-blue-400 p-2 rounded hover:bg-blue-500/10 transition-colors"
              >
                  <Edit2 size={16} />
              </button>
              <button 
                 onPointerDown={(e) => e.stopPropagation()} 
                 onClick={() => onDelete(task.id)}
                 className="text-slate-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"
              >
                  <Trash2 size={16} />
              </button>
          </div>
      </div>

      {/* Bottom Row: Metadata */}
      <div className="pl-9 flex items-center gap-3 text-xs">
          <span className={`uppercase font-bold tracking-wider ${task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
              {task.priority}
          </span>

          {task.dueDate && (
             <div className={`flex items-center gap-1 font-mono ${isOverdue ? 'text-red-500 font-bold' : isDueToday ? 'text-yellow-400 font-bold' : 'text-slate-400'}`}>
                {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                {isOverdue && <span>(LATE)</span>}
                {isDueToday && <span>(TODAY)</span>}
             </div>
          )}
      </div>
    </div>
  );
};

const DroppableColumn = ({ id, title, subtitle, children, colorClass, isEmpty, placeholderText }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`flex-1 rounded-2xl flex flex-col min-h-[500px] transition-all border-2 ${isOver ? 'border-blue-400 bg-blue-500/10' : 'border-slate-800 bg-slate-900/60'}`}>
        <div className={`p-5 rounded-t-xl ${colorClass}`}>
           <h3 className="font-black text-xl text-white tracking-widest uppercase">{title}</h3>
           <p className="text-xs text-blue-100/70 font-mono mt-1">{subtitle}</p>
        </div>
        <div className="p-4 flex-1 flex flex-col relative">
            {children}
            {isEmpty && (
                <div className="absolute inset-4 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center pointer-events-none">
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-center px-4">{placeholderText}</p>
                </div>
            )}
        </div>
    </div>
  );
};

const Dashboard = () => {
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDate, setNewDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user, isError } = useQuery({ queryKey: ['user'], queryFn: getUserProfile, retry: false });
  const { data: tasks } = useQuery({ queryKey: ['tasks'], queryFn: getTasks, enabled: !!user });

  useEffect(() => { if (isError) navigate('/login'); }, [isError, navigate]);

  // --- LOGOUT HANDLER (Redirects to Landing Page) ---
  const handleLogout = async () => {
      await logoutUser();
      queryClient.clear(); 
      // Redirect to Landing Page (Root) instead of Login Form
      navigate('/'); 
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => { 
        queryClient.invalidateQueries(['tasks']); 
        setNewTask(''); setNewDate(''); setNewPriority('medium');
        toast.success("Mission Added"); 
    }
  });

  const moveTaskMutation = useMutation({
    mutationFn: toggleTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old) => old.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
      return { previousTasks };
    },
    onSuccess: (data) => {
       if (data.task.isCompleted) toast.success("XP Gained!", { icon: '✨' });
       queryClient.invalidateQueries({ queryKey: ['tasks'] }); 
       queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err, newTodo, context) => queryClient.setQueryData(['tasks'], context.previousTasks),
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        setEditingTask(null);
        toast.success("Details Updated");
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => { queryClient.invalidateQueries(['tasks']); toast("Task Deleted", { icon: '🗑️' }); }
  });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const task = active.data.current.task;
    if ((!task.isCompleted && over.id === 'completed-column') || (task.isCompleted && over.id === 'active-column')) {
       moveTaskMutation.mutate(task.id);
    }
  };

  const handleAddTask = (e) => {
      e.preventDefault();
      if(!newTask.trim()) return;
      createTaskMutation.mutate({ title: newTask, priority: newPriority, dueDate: newDate });
  };

  if (!user) return <div className="text-white h-screen flex justify-center items-center">Booting System...</div>;

  const filteredTasks = tasks?.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  
  const sortedTasks = filteredTasks.sort((a, b) => {
     const priorityWeight = { high: 3, medium: 2, low: 1 };
     if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
         return priorityWeight[b.priority] - priorityWeight[a.priority]; 
     }
     return new Date(a.dueDate || '2099-01-01') - new Date(b.dueDate || '2099-01-01');
  });

  const todoTasks = sortedTasks.filter(t => !t.isCompleted);
  const completedTasks = sortedTasks.filter(t => t.isCompleted);

  return (
    <div className="w-full h-full min-h-[80vh] flex flex-col max-w-7xl mx-auto p-2">
      
      {editingTask && (
        <EditModal 
            task={editingTask} 
            onClose={() => setEditingTask(null)}
            onUpdate={updateTaskMutation.mutate}
            isLoading={updateTaskMutation.isPending}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 bg-slate-900/80 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
             <Link to="/leaderboard" className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl hover:bg-yellow-500/20 transition-all">
                <Trophy className="text-yellow-400" size={24} />
             </Link>
             <Link to="/calendar" className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl hover:bg-blue-500/20 transition-all">
                <CalendarIcon className="text-blue-400" size={24} />
             </Link>
             <Link to="/analytics" className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl hover:bg-purple-500/20 transition-all">
                <LayoutDashboard className="text-purple-400" size={24} />
             </Link>
             
             {/* PROFILE LINK: Click name/avatar to go to settings */}
             <Link to="/settings" className="hover:bg-white/5 p-2 -ml-2 rounded-xl transition-colors flex flex-col justify-center">
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{user.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold font-mono">LVL.{user.level}</span>
                    {user.avatar && (
                        <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full border border-blue-500" />
                    )}
                </div>
             </Link>
        </div>
        
        {/* Search */}
        <div className="flex-1 flex justify-center items-center">
             <div className="relative w-full max-w-md">
                 <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search missions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/40 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                 />
             </div>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 text-slate-400 p-3 rounded-xl hover:text-white" title="Logout">
            <LogOut size={20} />
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleAddTask} className="mb-8 p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-end md:items-center">
         <div className="flex-1 w-full group relative">
             <Plus className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-blue-400" size={18} />
             <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New Mission Directive..."
               className="w-full pl-10 pr-4 py-3 bg-black/40 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500" />
         </div>
         <div className="w-full md:w-32 group relative">
             <Flag className={`absolute left-3 top-3.5 ${newPriority === 'high' ? 'text-red-500' : newPriority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`} size={18} />
             <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}
               className="w-full pl-10 pr-8 py-3 bg-black/40 border border-slate-700 rounded-xl text-white outline-none appearance-none focus:border-blue-500 cursor-pointer capitalize">
                 <option value="low">Low</option>
                 <option value="medium">Medium</option>
                 <option value="high">High</option>
             </select>
         </div>
         <div className="w-full md:w-44 group relative">
             <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
               className="w-full px-4 py-3 bg-black/40 border border-slate-700 rounded-xl text-white outline-none focus:border-blue-500 color-white" />
         </div>
         <button type="submit" disabled={!newTask.trim()} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50">
           <Plus size={24} />
         </button>
      </form>

      {/* BOARD */}
      <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-6 flex-1 h-full">
              <DroppableColumn 
                  id="active-column" 
                  title="Active" 
                  subtitle={`${todoTasks.length} missions`} 
                  colorClass="bg-gradient-to-r from-slate-800 to-slate-900" 
                  isEmpty={todoTasks.length === 0} 
                  placeholderText="NO MATCHING MISSIONS"
              >
                  {todoTasks.map(task => <DraggableTask key={task.id} task={task} onDelete={deleteTaskMutation.mutate} onEdit={setEditingTask} />)}
              </DroppableColumn>

              <DroppableColumn 
                  id="completed-column" 
                  title="Complete" 
                  subtitle={`${completedTasks.length} successful`} 
                  colorClass="bg-gradient-to-r from-green-900/60 to-slate-900" 
                  isEmpty={completedTasks.length === 0} 
                  placeholderText="DRAG HERE"
              >
                  {completedTasks.map(task => <DraggableTask key={task.id} task={task} onDelete={deleteTaskMutation.mutate} onEdit={setEditingTask} />)}
              </DroppableColumn>
          </div>
      </DndContext>
      <Footer />
    </div>
  );
};

export default Dashboard;