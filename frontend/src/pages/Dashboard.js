import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText, FiHelpCircle, FiClock, FiArrowRight, FiBook, FiLayout, FiTrash2
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

import TaskCard from '../components/TaskCard';
import Visualizer from './Visualizer'; 

// Import services
import { 
  fetchTasks, 
  updateTask, 
  deleteTask 
} from '../services/plannerService';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');

    if (!token) {
      navigate('/login');
    } else {
      setUserName(name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Student');
      loadTasksData();
    }
  }, [navigate]);

  const loadTasksData = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, isCompleted: true } : t));
      await updateTask(taskId, { isCompleted: true });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    }
  };
  
  const handleResetDashboard = async () => {
    if (window.confirm("⚠️ This will delete ALL tasks (Pending & Completed). Are you sure?")) {
        try {
            await Promise.all(tasks.map(t => deleteTask(t._id)));
            setTasks([]); 
            alert("Dashboard Reset!");
        } catch (error) {
            console.error("Error resetting:", error);
        }
    }
  };

  const handleUpdateNotes = async (taskId, newNotes) => {
    await updateTask(taskId, { notes: newNotes });
  };

  const filterTasks = (priority) => tasks.filter(t => t.priority === priority && !t.isCompleted);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen font-sans animate-fadeIn">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName} 👋</h1>
            <p className="text-gray-500 mt-1">Here is your study overview for today.</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-6">
             {/* STATS */}
             <div className="flex gap-4">
                <div className="text-center px-4">
                    <span className="block text-xl font-bold text-indigo-600">{tasks.filter(t => !t.isCompleted).length}</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Pending</span>
                </div>
                <div className="text-center px-4 border-l">
                    <span className="block text-xl font-bold text-green-600">{tasks.filter(t => t.isCompleted).length}</span>
                    <span className="text-xs text-gray-400 uppercase font-bold">Completed</span>
                </div>
             </div>

             {/* RESET BUTTON */}
             <button 
                onClick={handleResetDashboard}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Reset Dashboard (Delete All)"
             >
                <FiTrash2 size={20} />
             </button>
        </div>
      </div>

      {/* MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiLayout /> Priority Matrix
          </h2>
          <Link to="/study-planner" className="text-sm font-semibold text-indigo-600 hover:underline">
             Open Full Planner &rarr;
          </Link>
        </div>

        {/* ✅ CHANGED: Grid layout updated to 2 columns for wider cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-3">
            <h3 className="font-bold text-red-600 bg-red-50 p-3 rounded-lg text-center border border-red-100 shadow-sm">🔥 Do First</h3>
            {filterTasks('do_first').map(task => (
              <TaskCard key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onUpdateNotes={handleUpdateNotes} />
            ))}
            {filterTasks('do_first').length === 0 && <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">No urgent tasks</div>}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-blue-600 bg-blue-50 p-3 rounded-lg text-center border border-blue-100 shadow-sm">📅 Schedule</h3>
            {filterTasks('schedule').map(task => (
              <TaskCard key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onUpdateNotes={handleUpdateNotes} />
            ))}
          </div>

          <div className="space-y-3">
             <h3 className="font-bold text-orange-600 bg-orange-50 p-3 rounded-lg text-center border border-orange-100 shadow-sm">🤝 Delegate</h3>
             {filterTasks('delegate').map(task => (
              <TaskCard key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onUpdateNotes={handleUpdateNotes} />
            ))}
          </div>

          <div className="space-y-3">
             <h3 className="font-bold text-gray-600 bg-gray-100 p-3 rounded-lg text-center border border-gray-200 shadow-sm">🗑️ Eliminate</h3>
             {filterTasks('delete').map(task => (
              <TaskCard key={task._id} task={task} onComplete={handleCompleteTask} onDelete={handleDeleteTask} onUpdateNotes={handleUpdateNotes} />
            ))}
          </div>
        </div>
      </div>

      {/* QUICK TOOLS */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 mt-8">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 mb-4"><FiFileText size={24} /></div>
            <h3 className="text-lg font-bold text-slate-800">PDF Summarizer</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">AI-generated summaries of your PDF documents to save time.</p>
            <Link to="/summarizer" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-800">Go to Summarizer <FiArrowRight className="ml-2" /></Link>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 mb-4"><FiHelpCircle size={24} /></div>
            <h3 className="text-lg font-bold text-slate-800">AI Quiz Generator</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">Instantly generate interactive quizzes from any study text.</p>
            <Link to="/quiz-generator" className="inline-flex items-center font-semibold text-emerald-600 hover:text-emerald-800">Go to Quiz Generator <FiArrowRight className="ml-2" /></Link>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-50 text-purple-600 mb-4"><FiBook size={24} /></div>
            <h3 className="text-lg font-bold text-slate-800">PDF Viewer</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">Distraction-free reading with highlighting and notes.</p>
            <Link to="/pdf-viewer" className="inline-flex items-center font-semibold text-purple-600 hover:text-purple-800">Open Viewer <FiArrowRight className="ml-2" /></Link>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-50 text-sky-600 mb-4"><FiClock size={24} /></div>
            <h3 className="text-lg font-bold text-slate-800">AI Visualizer</h3>
            <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">Read text at super-human speeds using RSVP technology.</p>
            <Link to="/visualizer" className="inline-flex items-center font-semibold text-sky-600 hover:text-sky-800">Go to Visualizer <FiArrowRight className="ml-2" /></Link>
          </div>
        </div>
      </div>

      {/* VISUALIZER WIDGET */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Practice</h2>
        <Visualizer />
      </div>

    </div>
  );
};

export default Dashboard;