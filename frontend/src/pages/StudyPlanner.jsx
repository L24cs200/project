import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FiCalendar, FiCheckSquare, FiClock, FiPlus, FiTrash2, 
  FiActivity, FiBookOpen, FiAlertCircle 
} from 'react-icons/fi';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // New Task State
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    type: 'study',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/planner');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tasks");
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/planner', newTask);
      setTasks([...tasks, res.data]);
      setShowForm(false);
      setNewTask({ title: '', subject: '', type: 'study', priority: 'medium', dueDate: '' });
    } catch (err) {
      alert("Error adding task");
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await api.put(`/planner/${id}`);
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/planner/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Analytics Logic ---
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);
  const highPriority = pendingTasks.filter(t => t.priority === 'high').length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">Study Planner</h1>
          <p className="text-gray-500 mt-1">Organize your academic life and boost productivity.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg transition"
        >
          <FiPlus /> {showForm ? 'Close Form' : 'Add Task'}
        </button>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-indigo-500 border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full"><FiCalendar size={24}/></div>
          <div><h3 className="text-2xl font-bold">{pendingTasks.length}</h3><p className="text-gray-500 text-sm">Upcoming Tasks</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-green-500 border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-full"><FiCheckSquare size={24}/></div>
          <div><h3 className="text-2xl font-bold">{completedTasks.length}</h3><p className="text-gray-500 text-sm">Completed</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-red-500 border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-full"><FiAlertCircle size={24}/></div>
          <div><h3 className="text-2xl font-bold">{highPriority}</h3><p className="text-gray-500 text-sm">High Priority</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-l-4 border-l-purple-500 border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-full"><FiActivity size={24}/></div>
          <div><h3 className="text-2xl font-bold">85%</h3><p className="text-gray-500 text-sm">Study Score</p></div>
        </div>
      </div>

      {/* 3. Add Task Form (Collapsible) */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Add New Plan</h3>
          <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input 
              className="p-2 border rounded-lg focus:ring-2 ring-indigo-200 outline-none" 
              placeholder="Task Title (e.g. Finish Chapter 3)"
              value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required 
            />
            <input 
              className="p-2 border rounded-lg focus:ring-2 ring-indigo-200 outline-none" 
              placeholder="Subject (e.g. DBMS)"
              value={newTask.subject} onChange={e => setNewTask({...newTask, subject: e.target.value})} required 
            />
            <select 
              className="p-2 border rounded-lg bg-white"
              value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}
            >
              <option value="study">Study Session</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
            </select>
            <input 
              type="date" className="p-2 border rounded-lg"
              value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} required 
            />
            <button type="submit" className="bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Save Plan</button>
          </form>
        </div>
      )}

      {/* 4. Main Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Upcoming Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><FiBookOpen /> Upcoming Schedule</h2>
          
          {loading ? <p>Loading...</p> : pendingTasks.length === 0 ? (
            <div className="p-10 bg-white rounded-xl text-center text-gray-400 border border-dashed">No upcoming tasks! Time to relax? 🎉</div>
          ) : (
            pendingTasks.map(task => (
              <div key={task._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleComplete(task._id)}
                    className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition"
                  ></button>
                  <div>
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold capitalize 
                        ${task.type === 'exam' ? 'bg-red-100 text-red-600' : task.type === 'assignment' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                        {task.type}
                      </span>
                      <span>• {task.subject}</span>
                      <span className="flex items-center gap-1 text-gray-400"><FiClock size={12}/> {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteTask(task._id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                  <FiTrash2 size={18}/>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Completed (History) */}
        <div>
           <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-400"><FiCheckSquare /> Completed</h2>
           <div className="space-y-3 opacity-60">
             {completedTasks.length === 0 ? <p className="text-sm text-gray-400">Finish tasks to see them here.</p> : completedTasks.map(task => (
               <div key={task._id} className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
                 <div className="text-green-500"><FiCheckSquare /></div>
                 <div className="flex-1">
                    <p className="text-sm font-medium line-through text-gray-500">{task.title}</p>
                 </div>
                 <button onClick={() => toggleComplete(task._id)} className="text-xs text-indigo-500 hover:underline">Undo</button>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudyPlanner;