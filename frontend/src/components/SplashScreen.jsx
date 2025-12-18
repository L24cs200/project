import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

const SplashScreen = ({ duration = 2500 }) => {
  const [progress, setProgress] = useState(0);

  // Animate the progress bar to fill up over the duration
  useEffect(() => {
    const interval = 10; // Update every 10ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 overflow-hidden">
      
      {/* Background Pattern (Subtle Dots) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo with Glow Effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-2xl shadow-2xl border border-indigo-400/20">
            <BookOpen size={56} className="text-white drop-shadow-md" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2 font-sans">
          RvrEdu
        </h1>
        <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-10">
          Student Productivity Suite
        </p>

        {/* Loading Bar Container */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-slate-700">
          <div 
            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="mt-3 text-[10px] text-slate-500 font-mono">
          INITIALIZING {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;