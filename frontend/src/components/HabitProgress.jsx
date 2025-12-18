import React from 'react';
import { BookOpen, Monitor, Coffee, Zap, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toggleHabit } from '../services/plannerService';

// Icon Map
const ICONS = {
  read: <BookOpen />,
  code: <Monitor />,
  social: <Coffee />,
  BookOpen: <BookOpen />, // Fallback
  Code: <Monitor />,
  Coffee: <Coffee />
};

const HabitProgress = ({ habits, activityLog, onUpdateData }) => {
  
  // 1. Handle Click
  const handleToggle = async (habitId) => {
    try {
      // Optimistic Update (makes UI fast)
      const updatedHabits = habits.map(h => 
         h.id === habitId ? { ...h, completed: !h.completed } : h
      );
      // Determine if we are completing it (to show confetti)
      const isCompleting = updatedHabits.find(h => h.id === habitId).completed;

      if (isCompleting) {
        confetti({
           particleCount: 50,
           spread: 60,
           origin: { y: 0.7 },
           colors: ['#10B981', '#F59E0B']
        });
      }

      // Call API
      const data = await toggleHabit(habitId);
      
      // Update Parent State (Dashboard) with new Stats
      onUpdateData(data); 

    } catch (error) {
      console.error("Habit error", error);
    }
  };

  // 2. Calculate Chart Data (Last 7 Days)
  const getChartData = () => {
     const days = ['S','M','T','W','T','F','S'];
     const today = new Date();
     const data = [];

     for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Get count from activityLog or 0
        const count = activityLog ? (activityLog[dateStr] || 0) : 0;
        
        // Max height of bar is 100%, assume 10 tasks is "full" day
        const height = Math.min((count / 10) * 100, 100); 

        data.push({ day: days[d.getDay()], height, count });
     }
     return data;
  };

  const chartData = getChartData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* HABITS SECTION */}
      <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Zap size={18} className="text-yellow-500 fill-yellow-500" /> Daily Rituals
          </h3>
          <span className="text-xs text-gray-400">Consistent actions build streaks</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2">
          {habits && habits.map(habit => (
            <div 
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              className={`cursor-pointer flex flex-col items-center justify-center min-w-[100px] h-24 rounded-xl border-2 transition-all duration-200
                ${habit.completed 
                  ? 'border-green-500 bg-green-50 scale-105 shadow-md' 
                  : 'border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}`}
            >
              <div className={`mb-1 transition-colors ${habit.completed ? 'text-green-600' : 'text-gray-400'}`}>
                {/* Render Icon dynamically */}
                {React.cloneElement(ICONS[habit.id] || <BookOpen />, { size: 24 })}
              </div>
              <span className={`text-xs font-bold ${habit.completed ? 'text-green-700' : 'text-gray-500'}`}>
                {habit.name}
              </span>
              {habit.completed && <CheckCircle size={12} className="text-green-500 mt-1"/>}
            </div>
          ))}
          {!habits && <div className="text-sm text-gray-400">Loading habits...</div>}
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800 text-sm">Activity</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-bold">Last 7 Days</span>
        </div>
        
        <div className="flex items-end justify-between h-20 gap-1">
          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1 w-full group relative">
               {/* Tooltip */}
               <div className="opacity-0 group-hover:opacity-100 absolute -top-6 text-[10px] bg-black text-white px-2 py-1 rounded transition-opacity">
                 {item.count}
               </div>

               {/* Bar */}
               <div 
                style={{ height: `${item.height || 5}%` }} 
                className={`w-full rounded-t-md transition-all duration-500
                  ${i === 6 ? 'bg-indigo-600' : 'bg-gray-200 hover:bg-indigo-300'}`} 
               />
               <span className="text-[9px] font-bold text-gray-400">
                 {item.day}
               </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HabitProgress;