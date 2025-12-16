import React, { useState } from 'react';
import api from '../services/api'; 
// ✅ FIX: Change 'react-icons/fa' to 'react-icons/fi'
import { FiUploadCloud, FiFileText, FiCpu, FiCheckCircle, FiAlertCircle, FiLoader, FiTrash2 } from 'react-icons/fi';

const QuizGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setQuizData(null);
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  // 2. Generate Quiz
  const handleGenerate = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setScore(null);
    setSelectedAnswers({});

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    try {
      // The backend route is likely '/api/quiz/generate' or just '/api/quiz'
      // Based on your previous backend code (if using Hugging Face), check your route.
      // If your server.js uses app.use('/api/quiz', quizRoutes) and router is router.post('/generate'...)
      // Then the URL below should be '/quiz/generate'.
      // If it is just router.post('/', ...) then use '/quiz'.
      
      // I will assume '/quiz/generate' for safety based on previous steps, 
      // but if you kept the simple one, change this to '/quiz'.
      const response = await api.post('/quiz/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log("Quiz Received:", response.data);
      
      // Handle both possible response structures (array or object with quiz key)
      const data = response.data.quiz || response.data;
      
      if (Array.isArray(data)) {
        setQuizData(data);
      } else {
        throw new Error("Invalid response format from server.");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || err.response?.data?.error || 'Server error. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Answers & Scoring
  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let newScore = 0;
    quizData.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer || selectedAnswers[idx] === q.correctAnswer) newScore++;
    });
    setScore(newScore);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 flex items-center justify-center gap-2">
          <FiCpu /> AI Quiz Generator
        </h1>
        <p className="text-gray-500 mt-2">Upload a PDF lecture or article to generate a practice test.</p>
      </div>

      {/* --- Upload Section --- */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6">
        {!selectedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <FiUploadCloud size={48} className="text-indigo-400 mb-4" />
            <p className="text-lg font-medium text-gray-700">Click to upload PDF</p>
            <p className="text-sm text-gray-400 mt-1">Limit 10MB • .pdf only</p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-indigo-200 rounded-xl p-6 flex flex-col items-center justify-center bg-indigo-50/50">
            <FiFileText size={40} className="text-indigo-600 mb-2" />
            <p className="font-medium text-gray-800 text-center">{selectedFile.name}</p>
            <button onClick={() => setSelectedFile(null)} className="mt-4 text-red-500 text-sm flex items-center gap-1 hover:underline">
              <FiTrash2 /> Remove File
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <FiAlertCircle /> {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !selectedFile}
          className={`mt-6 w-full py-3.5 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-3
            ${loading || !selectedFile ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {loading ? <><FiLoader className="animate-spin" /> Generating Questions...</> : 'Generate Quiz'}
        </button>
      </div>

      {/* --- Quiz Display Section --- */}
      {quizData && (
        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Practice Quiz</h2>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{quizData.length} Questions</span>
          </div>
          
          <div className="space-y-6">
            {quizData.map((q, qIndex) => (
              <div key={qIndex} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-semibold text-lg mb-4 text-gray-800">
                  <span className="text-indigo-600 mr-2">{qIndex + 1}.</span>
                  {q.question}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((option, oIndex) => {
                    const isSelected = selectedAnswers[qIndex] === option;
                    const correctAns = q.answer || q.correctAnswer;
                    const isCorrect = option === correctAns;
                    const showResult = score !== null;

                    let btnClass = "border-gray-300 bg-white hover:bg-gray-100 text-gray-700";
                    
                    if (showResult) {
                      if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-800 font-bold ring-1 ring-green-500";
                      else if (isSelected && !isCorrect) btnClass = "bg-red-100 border-red-500 text-red-800 ring-1 ring-red-500";
                      else btnClass = "opacity-50";
                    } else if (isSelected) {
                      btnClass = "bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold ring-1 ring-indigo-500";
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => !showResult && handleOptionSelect(qIndex, option)}
                        disabled={showResult}
                        className={`p-3 text-left border rounded-lg transition-all text-sm ${btnClass}`}
                      >
                        <span className="inline-block w-6 font-bold opacity-50">{String.fromCharCode(65 + oIndex)}.</span> 
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Submit */}
          <div className="mt-8 pt-6 border-t flex flex-col items-center">
            {score === null ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < quizData.length}
                className="w-full md:w-1/3 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
              >
                Submit Answers
              </button>
            ) : (
              <div className="text-center w-full bg-gray-100 p-6 rounded-xl">
                <p className="text-3xl font-bold mb-2">
                  Score: <span className={score === quizData.length ? "text-green-600" : "text-indigo-600"}>{score} / {quizData.length}</span>
                </p>
                <p className="text-gray-500 mb-4">{score === quizData.length ? "Perfect Score! 🎉" : "Keep practicing!"}</p>
                
                <button 
                  onClick={() => { setQuizData(null); setScore(null); setSelectedFile(null); }}
                  className="text-indigo-600 hover:text-indigo-800 font-bold underline"
                >
                  Start New Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;