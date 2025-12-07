import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// Added FiHome to the imports
import { FiGrid, FiFileText, FiLogOut, FiBarChart2, FiHelpCircle, FiFastForward, FiBook, FiHome } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-primary-600 text-white";

  return (
    <div className="hidden lg:flex flex-col w-64 bg-slate-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-slate-700">
        <FiBarChart2 className="text-3xl text-primary-400" />
        <h1 className="text-2xl font-bold ml-2">RvrEdu</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        
        {/* --- NEW: Home Feed Link --- */}
        <NavLink
          to="/home"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiHome className="mr-3" />
          Home Feed
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiGrid className="mr-3" />
          Dashboard
        </NavLink>
        
        <NavLink
          to="/summarizer"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiFileText className="mr-3" />
          Summarizer
        </NavLink>
        
        <NavLink
          to="/quiz-generator"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiHelpCircle className="mr-3" />
          Quiz Generator
        </NavLink>
        
        <NavLink
          to="/visualizer"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiFastForward className="mr-3" />
          Visualizer
        </NavLink>

        <NavLink
          to="/pdf-viewer"
          className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiBook className="mr-3" />
          PDF Viewer
        </NavLink>
        
      </nav>

      <div className="px-4 py-6 border-t border-slate-700">
        <div className="text-sm text-gray-400 mb-2">Signed in as</div>
        <div className="font-semibold mb-4">{userName}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-300 bg-slate-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
        >
          <FiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;