// frontend/src/components/QuizResult.jsx
import React from 'react';
import { FiCheckCircle, FiRefreshCw, FiUploadCloud, FiEye } from 'react-icons/fi';

const QuizResult = ({ score, totalQuestions, onRetake, onNewQuiz, onReview }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  let feedback = {
    text: "Great job!",
    color: "text-green-600",
  };

  if (percentage < 50) {
    feedback = { text: "Keep practicing!", color: "text-red-600" };
  } else if (percentage < 80) {
    feedback = { text: "Good effort!", color: "text-yellow-600" };
  }

  return (
    <div className="bg-white text-center p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 ease-in-out">
      <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h2 className="text-3xl font-bold text-slate-800 mt-4">Quiz Completed!</h2>
      <p className={`text-xl font-medium ${feedback.color} mt-2`}>{feedback.text}</p>
      
      <div className="my-6">
        <p className="text-5xl font-bold text-primary-600">{score} / {totalQuestions}</p>
        <p className="text-2xl font-semibold text-slate-700 mt-1">({percentage}%)</p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-4 mt-8">
         <button
          onClick={onReview} // Call the function passed from QuizGenerator
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          <FiEye />
          Review Answers
        </button>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
            onClick={onRetake}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all"
            >
            <FiRefreshCw />
            Retake Quiz
            </button>
            <button
            onClick={onNewQuiz}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all"
            >
            <FiUploadCloud />
            Upload New PDF
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;