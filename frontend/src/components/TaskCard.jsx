import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CheckCircle, FileText, Trash2, Calendar, Play, Clock } from 'lucide-react'; 
import confetti from 'canvas-confetti';

const TaskCard = ({ task, onComplete, onDelete, onUpdateNotes }) => {
  const navigate = useNavigate(); 
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(task.notes || "");
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  // --- HANDLERS ---
  const handleComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    
    // Celebration Confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#2563EB', '#F59E0B', '#10B981']
    });

    onComplete(task._id);
  };

  const handleBlurNotes = () => {
    if (noteContent !== task.notes) {
      onUpdateNotes(task._id, noteContent);
    }
  };

  const handleStartFocus = () => {
    // Navigate to the focus timer page with this task's data
    navigate('/focus', { state: { task } });
  };

  // --- RENDER ---
  return (
    <div className={`relative bg-white p-4 rounded-xl border transition-all duration-300 group
      ${isCompleted 
        ? 'border-green-200 bg-green-50 opacity-75' 
        : 'border-gray-200 hover:shadow-lg hover:-translate-y-1'}`}
    >
      {/* 1. Subject Badge (Top Right) */}
      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
        {task.subject}
      </span>

      {/* 2. Title */}
      <h3 className={`font-bold text-gray-800 text-lg mb-2 pr-12 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
        {task.title}
      </h3>

      {/* 3. Meta Data (Date & Time) */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
        {/* Date */}
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
            <Calendar size={12} />
            {new Date(task.dueDate).toLocaleDateString()}
        </div>

        {/* Time (Only shows if task has a time set) */}
        {task.time && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-medium">
                <Clock size={12} />
                {task.time}
            </div>
        )}
      </div>

      {/* 4. Notes Section (Expandable) */}
      {showNotes && (
        <div className="mb-4 animate-fadeIn">
          <textarea
            className="w-full text-sm p-3 bg-yellow-50 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none resize-none"
            rows="3"
            placeholder="Type quick notes here..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onBlur={handleBlurNotes}
            autoFocus
          />
        </div>
      )}

      {/* 5. Footer Actions */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        
        {/* Toggle Notes */}
        <button 
          onClick={() => setShowNotes(!showNotes)}
          className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100 text-gray-500'}`}
          title={showNotes ? "Hide Notes" : "Add Notes"}
        >
          <FileText size={18} />
        </button>

        {/* Delete */}
        <button 
          onClick={() => onDelete(task._id)}
          className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Task"
        >
          <Trash2 size={18} />
        </button>

        {/* Focus Button (Hidden if completed) */}
        {!isCompleted && (
           <button 
             onClick={handleStartFocus}
             className="ml-auto flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
           >
             <Play size={14} /> Focus
           </button>
        )}

        {/* Complete Button */}
        <button 
          onClick={handleComplete}
          disabled={isCompleted}
          className={`ml-2 flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all transform active:scale-95
            ${isCompleted 
              ? 'ml-auto bg-green-100 text-green-700 cursor-default' // Moves to right if Focus button is gone
              : 'bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-lg'}`}
        >
          <CheckCircle size={16} />
          {isCompleted ? 'Done' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;