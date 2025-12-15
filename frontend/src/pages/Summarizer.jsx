import React, { useState } from 'react';
import api from '../services/api'; // <--- UPDATED: Import central API helper
// import axios from 'axios';     // <--- REMOVED
import { FiUploadCloud, FiFile, FiLoader } from 'react-icons/fi';
import BashSummary from '../components/BashSummary'; 

const Summarizer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSummary('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setSummary('');
    setError('');

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);

    try {
      // <--- UPDATED: Use 'api.post'
      // Note: We use '/summarize' because api.js already adds the '/api' prefix
      const res = await api.post('/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'An error occurred while summarizing the file.');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-800">AI Document Summarizer</h1>
      <p className="mt-2 text-lg text-slate-600">Upload a PDF to distill key insights instantly.</p>

      <div className="mt-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <FiUploadCloud className="mx-auto h-12 w-12 text-slate-400" />
            <label htmlFor="pdfFile" className="mt-4 block text-sm font-semibold text-primary-600 hover:text-primary-500 cursor-pointer">
              {selectedFile ? 'Change File' : 'Upload a file'}
            </label>
            <input id="pdfFile" name="pdfFile" type="file" accept="application/pdf" className="sr-only" onChange={handleFileChange} />
            {selectedFile ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600">
                    <FiFile /> <span>{selectedFile.name}</span>
                </div>
            ) : (
                <p className="mt-1 text-xs text-slate-500">PDF up to 15MB</p>
            )}
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <FiLoader className="spinner" /> : null}
              {isLoading ? 'Generating Summary...' : 'Get Summary'}
            </button>
          </div>
        </form>

        <div className="mt-8">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center">{error}</div>}
            {summary && !isLoading && <BashSummary summary={summary} />}
        </div>
      </div>
    </div>
  );
};

export default Summarizer;