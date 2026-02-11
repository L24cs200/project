import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiHelpCircle,
  FiClock,
  FiBook,
  FiLayout,
  FiTrash2,
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

import TaskCard from '../components/TaskCard';
import Visualizer from './Visualizer';
import {
  fetchTasks,
  updateTask,
  deleteTask,
} from '../services/plannerService';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // 🔐 Auth check + initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');

    if (!token) {
      navigate('/login');
    } else {
      setUserName(
        name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Student'
      );
      loadTasksData();
    }
  }, [navigate]);

  // 📥 Load tasks
  const loadTasksData = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Complete task
  const handleCompleteTask = async (taskId) => {
    try {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, isCompleted: true } : t
        )
      );
      await updateTask(taskId, { isCompleted: true });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 🗑️ Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete task?')) {
      try {
        await deleteTask(taskId);
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 🔄 Reset dashboard
  const handleResetDashboard = async () => {
    if (window.confirm('Reset all tasks?')) {
      try {
        await Promise.all(tasks.map((t) => deleteTask(t._id)));
        setTasks([]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 📝 Update notes
  const handleUpdateNotes = async (taskId, newNotes) => {
    await updateTask(taskId, { notes: newNotes });
  };

  // 🎯 Filter tasks by priority
  const filterTasks = (priority) =>
    tasks.filter((t) => t.priority === priority && !t.isCompleted);

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here is your study overview for today.
          </p>
        </div>

        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="flex gap-4">
            <div className="text-center px-4">
              <span className="block text-xl font-bold text-indigo-600">
                {tasks.filter((t) => !t.isCompleted).length}
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold">
                Pending
              </span>
            </div>
            <div className="text-center px-4 border-l">
              <span className="block text-xl font-bold text-green-600">
                {tasks.filter((t) => t.isCompleted).length}
              </span>
              <span className="text-xs text-gray-400 uppercase font-bold">
                Completed
              </span>
            </div>
          </div>

          <button
            onClick={handleResetDashboard}
            className="text-red-500 hover:bg-red-50 p-2 rounded-full"
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      </div>

      {/* PRIORITY MATRIX */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FiLayout /> Priority Matrix
          </h2>
          <Link
            to="/study-planner"
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            Open Full Planner →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-red-600 bg-red-50 p-3 rounded-lg text-center">
              🔥 Do First
            </h3>
            {filterTasks('do_first').map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-blue-600 bg-blue-50 p-3 rounded-lg text-center">
              📅 Schedule
            </h3>
            {filterTasks('schedule').map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-orange-600 bg-orange-50 p-3 rounded-lg text-center">
              🤝 Delegate
            </h3>
            {filterTasks('delegate').map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-gray-600 bg-gray-100 p-3 rounded-lg text-center">
              🗑️ Eliminate
            </h3>
            {filterTasks('delete').map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onUpdateNotes={handleUpdateNotes}
              />
            ))}
          </div>
        </div>
      </div>

      {/* QUICK TOOLS */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Quick Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link to="/summarizer" className="tool-card">
            <FiFileText size={24} />
            <h3>Summarizer</h3>
          </Link>

          <Link to="/quiz-generator" className="tool-card">
            <FiHelpCircle size={24} />
            <h3>Quiz Gen</h3>
          </Link>

          <Link to="/pdf-viewer" className="tool-card">
            <FiBook size={24} />
            <h3>PDF Viewer</h3>
          </Link>

          <Link to="/visualizer" className="tool-card">
            <FiClock size={24} />
            <h3>Visualizer</h3>
          </Link>
        </div>
      </div>

      {/* QUICK PRACTICE */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Quick Practice
        </h2>
        <Visualizer />
      </div>
    </div>
  );
};

export default Dashboard;
