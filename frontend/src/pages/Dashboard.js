import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiHelpCircle,
  FiClock,
  FiArrowRight,
} from 'react-icons/fi';
import Spreeder from './Spreeder'; // Component filename remains Spreeder.jsx

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and user name in localStorage
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');

    if (!token) {
      navigate('/login');
    } else {
      // Capitalize the first letter of the name
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: PDF Summarizer */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4">
            <FiFileText size={24} />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">PDF Summarizer</h3>
          <p className="mt-2 text-slate-500">
            Upload a PDF file and our AI will generate a concise, easy-to-read
            summary for you.
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
          <p className="mt-2 text-slate-500">
            Turn any document into an interactive quiz to test your knowledge and
            aid your studies.
          </p>
          <Link
            to="/quiz-generator"
            className="mt-4 inline-flex items-center font-semibold text-green-600 hover:text-green-700"
          >
            Go to Quiz Generator <FiArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Card 3: AI Visualizer (Renamed from Speed Reader) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 text-sky-600 mb-4">
            <FiClock size={24} />
          </div>
          {/* ✅ UPDATED TITLE */}
          <h3 className="text-xl font-semibold text-slate-800">AI Visualizer</h3>
          <p className="mt-2 text-slate-500">
            Visualize text at high speed using our RSVP (Rapid Serial Visual
            Presentation) tool.
          </p>
          {/* ✅ UPDATED LINK TO /visualizer */}
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
        {/* ✅ UPDATED HEADER */}
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Try the Visualizer
        </h2>
        {/* Embedded Spreeder/Visualizer Component */}
        <Spreeder />
      </div>
    </div>
  );
};

export default Dashboard;