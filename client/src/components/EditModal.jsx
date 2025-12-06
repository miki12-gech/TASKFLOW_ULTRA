import { useState } from 'react';
import { X, Save, Calendar, Flag, LayoutDashboard } from 'lucide-react';
import { format } from 'date-fns';

const EditModal = ({ task, onClose, onUpdate, isLoading }) => {
  // Initialize state with existing task data
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  // Format date safely for HTML input (YYYY-MM-DD)
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ 
      id: task.id, 
      data: { title, priority, dueDate } 
    });
  };

  return (
    // Overlay Backdrop
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Glass Card */}
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-white/10 bg-black/20">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="text-blue-500" />
                Edit Mission
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Title */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/20 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex gap-1 items-center">
                        <Flag size={12} /> Priority
                    </label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-black/20 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex gap-1 items-center">
                        <Calendar size={12} /> Deadline
                    </label>
                    <input 
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-black/20 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
                >
                    Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                    <Save size={18} /> {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

        </form>

      </div>
    </div>
  );
};

export default EditModal;