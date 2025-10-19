// src/pages/Summarizer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSpinner, FaFilePdf } from 'react-icons/fa'; // For loading and file icons
import BashSummary from '../components/BashSummary'; // <-- 1. Import BashSummary
import './Summarizer.css'; // <-- 2. Import dedicated CSS

const Summarizer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    // Reset state when a new file is chosen
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
      const res = await axios.post('/api/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      // Use the specific error message from the backend, or a default one
      setError(err.response?.data?.msg || 'Error summarizing the file.');
    }
    setIsLoading(false);
  };

  return (
    <div className="summarizer-page">
      <div className="summarizer-header">
        <h2>PDF Summarizer</h2>
        <Link to="/dashboard" className="back-link">
          Back to Dashboard
        </Link>
      </div>
      <p className="summarizer-intro">
        Upload a PDF to get a concise summary for fast learning.
      </p>

      <form onSubmit={handleSubmit} className="summarizer-form">
        <div className="form-group">
          {/* 3. This is the new, improved file input */}
          <label htmlFor="pdfFile" className="file-upload-label">
            <FaFilePdf />
            <span>
              {selectedFile ? selectedFile.name : 'Click to choose a PDF'}
            </span>
          </label>
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the default ugly input
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading || !selectedFile}>
          {isLoading ? (
            <>
              <FaSpinner className="spinner" />
              Summarizing...
            </>
          ) : (
            'Get Summary'
          )}
        </button>
      </form>

      {/* --- Output Section --- */}
      <div className="summary-output">
        {error && (
          <div className="message error">
            {error}
          </div>
        )}
        
        {/* 4. Use the BashSummary component here */}
        {/* Only show summary if it exists AND we are not currently loading */}
        {summary && !isLoading && (
          <BashSummary summary={summary} />
        )}
      </div>
    </div>
  );
};

export default Summarizer;