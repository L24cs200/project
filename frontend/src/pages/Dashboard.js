import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiHelpCircle,
  FiClock,
  FiArrowRight,
  FiBook // 👈 Import Book Icon
} from 'react-icons/fi';
import Visualizer from './Visualizer';


const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');

    if (!token) {
      navigate('/login');
    } else {
      setUserName(name ? name.charAt(0).toUpperCase() + name.slice(1) : '');
    }
  }, [navigate]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-4xl font-bold text-slate-800">Welcome, {userName}!</h1>
      <p className="mt-2 text-lg text-slate-600">
        This is your central hub. Get started by choosing an action below.
      </p>

      {/* --- Card Layout --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Updated to 4 columns */}
        
        {/* Card 1: PDF Summarizer */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
            <FiFileText size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">PDF Summarizer</h3>
          <p className="mt-2 text-slate-500 text-sm">
            AI-generated summaries of your PDF documents.
          </p>
          <Link
            to="/summarizer"
            className="mt-4 inline-flex items-center font-semibold text-primary-600 hover:text-primary-700"
          >
            Go to Summarizer <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Card 2: AI Quiz Generator */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
            <FiHelpCircle size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">AI Quiz Generator</h3>
          <p className="mt-2 text-slate-500 text-sm">
            Generate interactive quizzes from any text.
          </p>
          <Link
            to="/quiz-generator"
            className="mt-4 inline-flex items-center font-semibold text-green-600 hover:text-green-700"
          >
            Go to Quiz Generator <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Card 3: PDF Viewer (NEW) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
            <FiBook size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">PDF Viewer</h3>
          <p className="mt-2 text-slate-500 text-sm">
            Distraction-free reading with highlighting and notes.
          </p>
          <Link
            to="/pdf-viewer"
            className="mt-4 inline-flex items-center font-semibold text-purple-600 hover:text-purple-700"
          >
            Open Viewer <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Card 4: AI Visualizer */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 text-sky-600 mb-4">
            <FiClock size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">AI Visualizer</h3>
          <p className="mt-2 text-slate-500 text-sm">
            Read text at super-human speeds using RSVP.
          </p>
          <Link
            to="/visualizer"
            className="mt-4 inline-flex items-center font-semibold text-sky-600 hover:text-sky-700"
          >
            Go to Visualizer <FiArrowRight className="ml-2" />
          </Link>
        </div>

      </div>

      {/* --- Full-Width Visualizer Component --- */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Try the Visualizer
        </h2>
        <Visualizer />
      </div>
    </div>
  );
};

export default Dashboard;