import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Inline Icons ---
const FiBookOpen = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const FiZoomIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const FiZoomOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>;
const FiMoon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const FiSun = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const FiSidebar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>;
const FiUploadCloud = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>;
const FiFileText = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const FiHelpCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const FiClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const FiWatch = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 6"></polyline></svg>;
const FiPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const FiPause = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const FiRotateCcw = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>;
const FiEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const FiCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

// --- Timer/Stopwatch Widget Component ---
const TimerWidget = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'

  // --- Timer State (Countdown) ---
  const [initialDuration, setInitialDuration] = useState(25 * 60); 
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);

  // --- Stopwatch State (Count Up) ---
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchActive, setIsStopwatchActive] = useState(false);

  // --- Audio ---
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error(e); }
  };

  // --- Timer Logic ---
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      playBeep();
      setTimeout(() => alert("Time's up!"), 100);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // --- Stopwatch Logic ---
  useEffect(() => {
    let interval = null;
    if (isStopwatchActive) {
      interval = setInterval(() => setStopwatchTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchActive]);

  // --- Handlers ---
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(initialDuration); 
  };

  const resetStopwatch = () => {
    setIsStopwatchActive(false);
    setStopwatchTime(0);
  };

  const saveCustomTime = () => {
    const mins = parseInt(inputMinutes);
    if (mins > 0 && !isNaN(mins)) {
      const newSeconds = mins * 60;
      setInitialDuration(newSeconds);
      setTimeLeft(newSeconds);
      setIsEditing(false);
      setIsTimerActive(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    if (hrs > 0) {
       return `${hrs}:${displayMins < 10 ? '0' : ''}${displayMins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${displayMins < 10 ? '0' : ''}${displayMins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
      {/* Timer Toggle Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
        title="Tools"
      >
        <FiClock />
      </button>

      {/* Popup Widget */}
      {isOpen && (
        <div className={`mt-3 p-4 rounded-2xl shadow-xl w-64 backdrop-blur-md border ${darkMode ? 'bg-slate-800/90 border-slate-700 text-white' : 'bg-white/90 border-gray-200 text-slate-800'} animate-in fade-in slide-in-from-top-4 duration-200`}>
          
          {/* Mode Tabs */}
          <div className={`flex p-1 rounded-lg mb-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <button 
                onClick={() => setMode('timer')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'timer' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
            >
                <FiClock size={14} /> Timer
            </button>
            <button 
                onClick={() => setMode('stopwatch')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'stopwatch' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
            >
                <FiWatch size={14} /> Stopwatch
            </button>
          </div>

          {/* === TIMER MODE === */}
          {mode === 'timer' && (
            <>
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Focus Timer</h3>
                 {!isEditing && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-slate-700 opacity-60 hover:opacity-100"><FiEdit size={12}/></button>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isTimerActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                            {isTimerActive ? 'Active' : 'Paused'}
                        </span>
                    </div>
                 )}
               </div>
               
               <div className="mb-6 flex justify-center h-16 items-center">
                {isEditing ? (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <input 
                        type="number" 
                        min="1" max="180" 
                        value={inputMinutes} 
                        onChange={(e) => setInputMinutes(e.target.value)} 
                        className={`w-20 text-3xl font-mono text-center bg-transparent border-b-2 outline-none ${darkMode ? 'border-blue-500 text-white' : 'border-blue-600 text-slate-800'}`} 
                        autoFocus 
                    />
                    <span className="text-sm opacity-60 font-bold mt-2">min</span>
                    <button onClick={saveCustomTime} className="ml-2 p-2 bg-green-500 text-white rounded-full hover:scale-110 transition shadow-md"><FiCheck /></button>
                  </div>
                ) : (
                  <div className="text-5xl font-mono font-bold tracking-tight">{formatTime(timeLeft)}</div>
                )}
              </div>

              {!isEditing && (
                <div className="flex gap-2">
                  <button onClick={() => setIsTimerActive(!isTimerActive)} className={`flex-1 py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isTimerActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {isTimerActive ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
                  </button>
                  <button onClick={resetTimer} className={`p-3 rounded-xl transition ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}><FiRotateCcw /></button>
                </div>
              )}
            </>
          )}

          {/* === STOPWATCH MODE === */}
          {mode === 'stopwatch' && (
             <>
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xs font-bold uppercase tracking-wider opacity-60">Elapsed Time</h3>
                 <span className={`text-[10px] px-2 py-0.5 rounded-full ${isStopwatchActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {isStopwatchActive ? 'Running' : 'Stopped'}
                 </span>
               </div>
               
               <div className="mb-6 flex justify-center h-16 items-center">
                  <div className="text-5xl font-mono font-bold tracking-tight">{formatTime(stopwatchTime)}</div>
               </div>

               <div className="flex gap-2">
                  <button onClick={() => setIsStopwatchActive(!isStopwatchActive)} className={`flex-1 py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition ${isStopwatchActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {isStopwatchActive ? <><FiPause /> Pause</> : <><FiPlay /> Start</>}
                  </button>
                  <button onClick={resetStopwatch} className={`p-3 rounded-xl transition ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}><FiRotateCcw /></button>
               </div>
             </>
          )}

        </div>
      )}
    </div>
  );
};

export default function PdfViewer() {
  const navigate = useNavigate();

  // --- State ---
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [scale, setScale] = useState(1.0);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [notes, setNotes] = useState('');
  
  // --- Load/Save State ---
  useEffect(() => {
    if (fileName) {
      const savedNotes = localStorage.getItem(`pdf_notes_${fileName}`);
      if (savedNotes) setNotes(savedNotes);
    }
  }, [fileName]);

  useEffect(() => {
    if (fileName) {
      localStorage.setItem(`pdf_notes_${fileName}`, notes);
    }
  }, [notes, fileName]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        // ✅ FIX: Use URL.createObjectURL instead of FileReader
        // This is much faster and fixes the "Blank Screen" issue
        const objectUrl = URL.createObjectURL(file);
        setPdfFile(objectUrl);
        setFileName(file.name);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const zoomIn = () => setScale(prev => Math.min(2.0, prev + 0.1));
  const zoomOut = () => setScale(prev => Math.max(0.5, prev - 0.1));

  const handleAIAction = (action) => {
    if (action === 'summarize') navigate('/summarizer');
    if (action === 'quiz') navigate('/quiz-generator');
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-slate-900 text-gray-200' : 'bg-gray-50 text-slate-800'} transition-colors duration-300`}>
      {/* --- Top Bar --- */}
      <div className={`flex items-center justify-between px-6 py-3 shadow-md z-20 ${darkMode ? 'bg-slate-800 border-b border-slate-700' : 'bg-white border-b border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg flex items-center gap-2">
            <FiBookOpen />
            {fileName ? (fileName.length > 25 ? fileName.substring(0, 25) + '...' : fileName) : 'PDF Reader'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 dark:bg-slate-700 rounded-lg">
            <button onClick={zoomOut} className="p-2 hover:text-primary-500"><FiZoomOut /></button>
            <span className="py-2 text-xs font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} className="p-2 hover:text-primary-500"><FiZoomIn /></button>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700" title="Toggle Dark Mode">{darkMode ? <FiSun /> : <FiMoon />}</button>
          <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-full ${showNotes ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-slate-700'}`} title="Toggle Notes"><FiSidebar /></button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 relative bg-gray-200 dark:bg-gray-900">
          <div className="absolute inset-0 overflow-auto flex justify-center p-4">
            {!pdfFile ? (
              <div className={`flex flex-col items-center justify-center w-full max-w-2xl h-96 border-4 border-dashed rounded-3xl m-auto transition-all ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-300 bg-white'}`}>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload"/>
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center p-10 w-full h-full justify-center">
                  <FiUploadCloud />
                  <p className="text-xl font-medium mt-4 text-gray-500">Click to upload a PDF</p>
                  <p className="text-sm text-gray-400 mt-2">Resume exactly where you left off</p>
                </label>
              </div>
            ) : (
              <div className="shadow-2xl w-full h-full transition-transform duration-200 origin-top" style={{ transform: `scale(${scale})`, height: `${100 / scale}%`, width: `${100 / scale}%` }}>
                <iframe src={pdfFile} title="PDF Viewer" className="w-full h-full rounded-lg border-none"/>
              </div>
            )}
          </div>
          <TimerWidget darkMode={darkMode} />
        </div>
        {showNotes && (
          <div className={`w-80 flex-shrink-0 flex flex-col border-l transition-all duration-300 z-10 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
            <div className="p-4 border-b dark:border-slate-700"><h2 className="font-bold flex items-center gap-2"><FiFileText /> Study Notes</h2><p className="text-xs text-gray-500 mt-1">Auto-saved to browser</p></div>
            <textarea className={`flex-1 w-full p-4 resize-none outline-none text-sm leading-relaxed ${darkMode ? 'bg-slate-800 text-gray-300' : 'bg-white text-gray-700'}`} placeholder="Type your notes..." value={notes} onChange={(e) => setNotes(e.target.value)}/>
            <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-700"><h3 className="text-xs font-bold uppercase text-gray-400 mb-3">AI Tools</h3><div className="grid grid-cols-2 gap-2"><button onClick={() => handleAIAction('summarize')} className="flex items-center justify-center gap-2 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition"><FiFileText /> Summarize</button><button onClick={() => handleAIAction('quiz')} className="flex items-center justify-center gap-2 py-2 px-3 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition"><FiHelpCircle /> Quiz Me</button></div></div>
          </div>
        )}
      </div>
    </div>
  );
}