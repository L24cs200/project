import React from 'react';
import { FiCheck, FiX, FiRefreshCw, FiUploadCloud } from 'react-icons/fi';

const QuizReview = ({ reviewData, onRetake, onNewQuiz }) => {

  const getOptionStyle = (question, option, userAnswer) => {
    const isCorrect = option === question.answer;
    const isSelected = option === userAnswer;

    if (isCorrect) {
      return 'border-green-500 bg-green-50'; // Correct answer
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-50'; // User's incorrect choice
    }
    return 'border-slate-200'; // Default
  };

  const getShortAnswerStyle = (isCorrect) => {
    return isCorrect 
        ? 'border-green-500 bg-green-50' 
        : 'border-red-500 bg-red-50';
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Review Your Answers</h2>
      <div className="space-y-8">
        {reviewData.map((item, index) => (
          <div key={index}>
            <p className="font-semibold text-slate-700 mb-3 text-lg">
              {index + 1}. {item.question.question}
            </p>

            {/* Review for Multiple Choice Questions */}
            {item.question.type === 'MCQ' ? (
              <div className="space-y-2">
                {item.question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 ${getOptionStyle(item.question, option, item.userAnswer)}`}
                  >
                    <span className="text-slate-700">{option}</span>
                    {option === item.question.answer && <FiCheck className="text-green-600" />}
                    {option === item.userAnswer && !item.isCorrect && <FiX className="text-red-600" />}
                  </div>
                ))}
              </div>
            ) : (
              /* Review for Short Answer Questions */
              <div className="space-y-2">
                <div className={`p-3 rounded-lg border-2 ${getShortAnswerStyle(item.isCorrect)}`}>
                    <p className="text-sm font-medium text-slate-500">Your Answer:</p>
                    <p className="text-slate-800">{item.userAnswer || <span className="italic text-slate-400">No answer provided</span>}</p>
                </div>
                {!item.isCorrect && (
                    <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50">
                        <p className="text-sm font-medium text-green-700">Correct Answer:</p>
                        <p className="text-green-800 font-semibold">{item.question.answer}</p>
                    </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
       <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={onRetake}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all"
        >
          <FiRefreshCw />
          Retake Quiz
        </button>
        <button
          onClick={onNewQuiz}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          <FiUploadCloud />
          Upload New PDF
        </button>
      </div>
    </div>
  );
};

export default QuizReview;
