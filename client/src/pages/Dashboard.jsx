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

// --- STYLES: CLEAN LIGHT THEME ---
const PRIORITY_STYLES = {
    high: "border-l-red-500 bg-red-50",
    medium: "border-l-amber-400 bg-amber-50",
    low: "border-l-blue-400 bg-white"
};

const DraggableTask = ({ task, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id, data: { task } });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 999 } : undefined;
  
  const isDone = task.isCompleted;
  const isOverdue = !isDone && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = !isDone && task.dueDate && isToday(new Date(task.dueDate));

  const priorityStyle = PRIORITY_STYLES[task.priority] || "border-l-slate-200 bg-white";
  
  // Base classes for the card
  let cardClasses = `group relative flex flex-col p-4 mb-3 rounded-r-xl cursor-grab active:cursor-grabbing touch-none transition-all shadow-sm hover:shadow-md border-y border-r border-slate-100 border-l-4 ${priorityStyle}`;
  
  // Override for Done tasks
  if (isDone) {
      cardClasses = "bg-slate-50 border-l-4 border-l-slate-300 opacity-60 border-y border-r border-slate-100 rounded-r-xl p-4 mb-3 flex flex-col group relative";
  } else if (isOverdue) {
      cardClasses = `bg-red-50 border-l-4 border-red-500 border-y border-r border-red-100 p-4 mb-3 rounded-r-xl shadow-sm flex flex-col group relative`;
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={cardClasses}>
      
      {/* Top Row */}
      <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="p-1 text-slate-400"><GripVertical size={20} /></div>
             {/* Text Color changed to Dark Slate */}
             <span className={`text-base font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                 {task.title}
             </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                 onPointerDown={(e) => e.stopPropagation()} 
                 onClick={() => onEdit(task)} 
                 className="text-slate-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors"
              >
                  <Edit2 size={16} />
              </button>
              <button 
                 onPointerDown={(e) => e.stopPropagation()} 
                 onClick={() => onDelete(task.id)}
                 className="text-slate-400 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors"
              >
                  <Trash2 size={16} />
              </button>
          </div>
      </div>

      {/* Bottom Row */}
      <div className="pl-9 flex items-center gap-3 text-xs">
          <span className={`uppercase font-bold tracking-wider ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`}>
              {task.priority}
          </span>

          {task.dueDate && (
             <div className={`flex items-center gap-1 font-mono ${isOverdue ? 'text-red-600 font-bold' : isDueToday ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
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

const DroppableColumn = ({ id, title, subtitle, children, headerBg, isEmpty, placeholderText }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    // Updated container borders/backgrounds for light theme
    <div ref={setNodeRef} className={`flex-1 rounded-3xl flex flex-col min-h-[500px] transition-all border-2 ${isOver ? 'border-blue-400 bg-blue-50' : 'border-transparent bg-white/50'}`}>
        <div className={`p-5 rounded-t-3xl ${headerBg} border-b border-slate-100`}>
           <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase">{title}</h3>
           <p className="text-xs text-slate-500 font-bold mt-1">{subtitle}</p>
        </div>
        <div className="p-4 flex-1 flex flex-col relative bg-slate-50/50 rounded-b-3xl">
            {children}
            {isEmpty && (
                <div className="absolute inset-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center pointer-events-none">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-center px-4 text-sm">{placeholderText}</p>
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

  const handleLogout = async () => {
      await logoutUser();
      queryClient.clear(); 
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

  if (!user) return <div className="text-blue-600 h-screen flex justify-center items-center font-bold animate-pulse">Initializing Interface...</div>;

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
    <div className="w-full h-full min-h-[80vh] flex flex-col max-w-7xl mx-auto p-4">
      
      {editingTask && (
        <EditModal 
            task={editingTask} 
            onClose={() => setEditingTask(null)}
            onUpdate={updateTaskMutation.mutate}
            isLoading={updateTaskMutation.isPending}
        />
      )}

      {/* HEADER: White/Glass Theme */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 bg-white/80 p-6 rounded-3xl border border-white/60 shadow-xl shadow-blue-900/5 backdrop-blur-md">
        
        {/* Nav */}
        <div className="flex items-center gap-4">
             <Link to="/leaderboard" className="bg-yellow-50 border border-yellow-200 p-3 rounded-2xl hover:bg-yellow-100 transition-all text-yellow-600"><Trophy size={24} /></Link>
             <Link to="/calendar" className="bg-blue-50 border border-blue-200 p-3 rounded-2xl hover:bg-blue-100 transition-all text-blue-600"><CalendarIcon size={24} /></Link>
             <Link to="/analytics" className="bg-purple-50 border border-purple-200 p-3 rounded-2xl hover:bg-purple-100 transition-all text-purple-600"><LayoutDashboard size={24} /></Link>
             
             {/* Profile */}
             <Link to="/settings" className="hover:bg-slate-100 p-2 -ml-2 rounded-xl transition-colors flex flex-col justify-center">
                <h1 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">{user.name}</h1>
                <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold font-mono text-sm bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">LVL.{user.level}</span>
                    {user.avatar && (
                        <img src={user.avatar} alt="Profile" className="w-6 h-6 rounded-full border border-slate-200" />
                    )}
                </div>
             </Link>
        </div>
        
        {/* Search - Light Mode */}
        <div className="flex-1 flex justify-center items-center">
             <div className="relative w-full max-w-md">
                 <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                 />
             </div>
        </div>
        <button onClick={handleLogout} className="bg-white border border-slate-200 text-slate-400 p-3 rounded-xl hover:text-red-500 hover:border-red-200 transition-all" title="Logout">
            <LogOut size={20} />
        </button>
      </div>

      {/* FORM: Clean Light */}
      <form onSubmit={handleAddTask} className="mb-8 p-3 bg-white border border-slate-100 rounded-3xl flex flex-col md:flex-row gap-4 items-end md:items-center shadow-lg shadow-blue-900/5">
         <div className="flex-1 w-full group relative">
             <Plus className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500" size={20} />
             <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Type a new mission..."
               className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl text-slate-800 font-medium placeholder-slate-400 outline-none" />
         </div>
         <div className="flex gap-2 items-center">
            {/* Priority Selector Styled Light */}
            <div className="relative">
                <Flag className={`absolute left-3 top-3.5 pointer-events-none ${newPriority === 'high' ? 'text-red-500' : newPriority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} size={18} />
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}
                className="pl-10 pr-8 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-700 font-bold text-sm focus:ring-2 focus:ring-blue-100 cursor-pointer capitalize outline-none appearance-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)}
               className="px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 text-sm font-bold border-none focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer" />
            
            <button type="submit" disabled={!newTask.trim()} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 active:scale-95">
            <Plus size={24} />
            </button>
         </div>
      </form>

      {/* BOARD: Updated Column Backgrounds */}
      <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-6 flex-1 h-full">
              <DroppableColumn 
                  id="active-column" 
                  title="To Do" 
                  subtitle={`${todoTasks.length} OPEN TASKS`} 
                  headerBg="bg-gradient-to-r from-blue-50 to-white" 
                  isEmpty={todoTasks.length === 0} 
                  placeholderText="All caught up!"
              >
                  {todoTasks.map(task => <DraggableTask key={task.id} task={task} onDelete={deleteTaskMutation.mutate} onEdit={setEditingTask} />)}
              </DroppableColumn>

              <DroppableColumn 
                  id="completed-column" 
                  title="Done" 
                  subtitle={`${completedTasks.length} COMPLETED`} 
                  headerBg="bg-gradient-to-r from-emerald-50 to-white" 
                  isEmpty={completedTasks.length === 0} 
                  placeholderText="Drag items here to complete"
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