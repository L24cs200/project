// frontend/src/pages/QuizGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiFile, FiLoader, FiHelpCircle } from 'react-icons/fi';
import InteractiveQuiz from '../components/InteractiveQuiz';
import QuizResult from '../components/QuizResult';
import QuizReview from '../components/QuizReview'; // Import the review component

const QuizGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null); // State for detailed review data
  const [isReviewing, setIsReviewing] = useState(false); // State to toggle review screen

  const handleFileChange = (event) => {
    // Reset everything when a new file is chosen
    setSelectedFile(event.target.files[0]);
    setQuizData(null);
    setUserAnswers({});
    setScore(null);
    setError('');
    setReviewData(null);
    setIsReviewing(false);
  };

  const handleGenerateQuiz = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }
    
    setIsLoading(true);
    // Reset previous results
    setQuizData(null);
    setUserAnswers({});
    setScore(null);
    setError('');
    setReviewData(null);
    setIsReviewing(false);

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('/api/generate-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      setQuizData(res.data.questions);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred while generating the quiz.');
    }
    setIsLoading(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  // Called when the user clicks "Submit Quiz" in InteractiveQuiz
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    // Create the detailed data needed for the review screen
    const detailedReview = quizData.map((question, index) => {
        const correctAnswer = question.answer.trim().toLowerCase();
        const userAnswer = (userAnswers[index] || "").trim().toLowerCase();
        const isCorrect = correctAnswer === userAnswer;
        if (isCorrect) {
            correctAnswers++;
        }
        return {
            question: question, // Contains question text, type, options, answer
            userAnswer: userAnswers[index] || "", // User's submitted answer
            isCorrect: isCorrect, // Boolean flag
        };
    });
    setScore(correctAnswers);
    setReviewData(detailedReview); // Store the detailed results
    setIsReviewing(false); // Make sure we show the score screen first
  };
  
  // Called from QuizResult or QuizReview to go back to the quiz
  const handleRetakeQuiz = () => {
    setUserAnswers({});
    setScore(null);
    setReviewData(null);
    setIsReviewing(false);
  };

  // Called from QuizResult to switch to the review view
  const handleShowReview = () => {
    setIsReviewing(true);
  };

  // Called from QuizResult or QuizReview to go back to the file upload
  const handleNewQuiz = () => {
    handleFileChange({ target: { files: [null] }}); // Simulate file change to reset state
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800">AI Quiz Generator</h1>
      <p className="mt-2 text-lg text-slate-600">Upload course notes to generate practice questions and test your knowledge.</p>

      <div className="mt-8 max-w-3xl">
        {/* --- File Upload Form --- */}
        {/* Only show the upload form if no quiz data exists yet */}
        {!quizData && (
            <form onSubmit={handleGenerateQuiz} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <label htmlFor="pdfFile" className="mt-4 block text-sm font-semibold text-primary-600 hover:text-primary-500 cursor-pointer">
                    {selectedFile ? 'Change PDF File' : 'Upload a PDF file'}
                    </label>
                    <input id="pdfFile" type="file" accept="application/pdf" className="sr-only" onChange={handleFileChange} />
                    {selectedFile && <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600"><FiFile /> <span>{selectedFile.name}</span></div>}
                </div>
                <div className="mt-6">
                    <button type="submit" disabled={isLoading || !selectedFile} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 disabled:opacity-50 transition-all">
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiHelpCircle />}
                    {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
                    </button>
                </div>
            </form>
        )}

        {/* --- Quiz and Results Display Area --- */}
        <div className="mt-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center mb-6">{error}</div>}
          
          {/* State 1: Taking the quiz (Quiz data exists, score is null) */}
          {quizData && score === null && (
            <InteractiveQuiz 
              quizData={quizData} 
              userAnswers={userAnswers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmitQuiz} // This calculates score and reviewData
            />
          )}

          {/* State 2: Viewing the score (Score exists, not reviewing) */}
          {score !== null && !isReviewing && (
            <QuizResult 
                score={score}
                totalQuestions={quizData.length}
                onRetake={handleRetakeQuiz}
                onNewQuiz={handleNewQuiz}
                onReview={handleShowReview} // Pass the function to switch to review mode
            />
          )}

          {/* State 3: Reviewing the answers (Reviewing is true, review data exists) */}
          {isReviewing && reviewData && (
              <QuizReview 
                reviewData={reviewData} // Pass the detailed data to the review component
                onRetake={handleRetakeQuiz}
                onNewQuiz={handleNewQuiz}
              />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGenerator;