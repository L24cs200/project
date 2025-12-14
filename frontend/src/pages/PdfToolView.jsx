import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf, FaFileImage, FaFileWord, FaCheckCircle, FaSpinner, FaTimes, FaRedo, FaUndo } from 'react-icons/fa';
import api from '../services/api'; 

const PdfToolView = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  
  const [files, setFiles] = useState([]);
  const [pageRange, setPageRange] = useState(''); 
  const [rotation, setRotation] = useState(90);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 1. Handle File Drops
  const onDrop = (acceptedFiles) => {
    // Determine allowed types based on tool
    const isImageTool = toolId === 'img-to-pdf';
    
    // Filter files (Images for img-to-pdf, PDFs for everything else)
    const validFiles = acceptedFiles.filter(file => 
        isImageTool 
            ? (file.type === 'image/jpeg' || file.type === 'image/png') 
            : file.type === 'application/pdf'
    );
    
    if (validFiles.length === 0) {
      if(acceptedFiles.length > 0) setError(isImageTool ? "Only JPG/PNG images allowed." : "Only PDF files allowed.");
      return;
    }

    // SINGLE FILE TOOLS: Split, Rotate, Compress, PDF-to-Word
    if (['split', 'rotate', 'compress', 'pdf-to-word'].includes(toolId)) {
        setFiles([validFiles[0]]); 
    } else {
        // MULTI FILE TOOLS: Merge, Img-to-PDF
        setFiles(prev => [...prev, ...validFiles]);
    }
    
    setError('');
    setSuccess(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: toolId === 'img-to-pdf' 
        ? {'image/jpeg': [], 'image/png': []} 
        : {'application/pdf': ['.pdf']},
    multiple: ['merge', 'img-to-pdf'].includes(toolId)
  });

  // 2. Process Logic
  const handleProcess = async () => {
    setLoading(true);
    setError('');

    const formData = new FormData();

    // --- LOGIC FOR MERGE ---
    if (toolId === 'merge') {
        if (files.length < 2) { setError("Select at least 2 PDFs."); setLoading(false); return; }
        files.forEach(file => formData.append('files', file));
    }
    // --- LOGIC FOR IMAGES TO PDF ---
    else if (toolId === 'img-to-pdf') {
        if (files.length < 1) { setError("Select at least 1 image."); setLoading(false); return; }
        files.forEach(file => formData.append('files', file));
    }
    // --- SINGLE FILE TOOLS ---
    else {
        if (files.length !== 1) { setError("Upload 1 PDF file."); setLoading(false); return; }
        formData.append('file', files[0]);
        
        if (toolId === 'split') formData.append('pageRange', pageRange);
        if (toolId === 'rotate') formData.append('angle', rotation);
    }

    try {
      const response = await api.post(`/pdf-tools/${toolId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', 
      });

      const timestamp = new Date().getTime();
      // Determine extension
      const ext = toolId === 'pdf-to-word' ? 'docx' : 'pdf';
      const fileName = `${toolId}_result_${timestamp}.${ext}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      setSuccess(true);
      setFiles([]);
      setPageRange('');
    } catch (err) {
      console.error("Processing Error:", err);
      setError("Failed to process. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const toolNames = {
    'merge': 'Merge PDF',
    'split': 'Split PDF',
    'compress': 'Compress PDF',
    'rotate': 'Rotate PDF',
    'img-to-pdf': 'Images to PDF',
    'pdf-to-word': 'PDF to Word'
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
       <button onClick={() => navigate('/pdf-tools')} className="text-indigo-600 mb-4 hover:underline font-medium">
         &larr; Back to Tools
       </button>
       
       <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl mx-auto border border-gray-200">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2 capitalize text-center">
            {toolNames[toolId] || toolId.replace('-', ' ')}
          </h1>
          <p className="text-gray-500 mb-8 text-center">
             {toolId === 'img-to-pdf' ? "Convert JPG/PNG images into a single PDF." : 
              toolId === 'pdf-to-word' ? "Convert PDF text into a Word document." :
              "Process your documents efficiently."}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-100 font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center py-10 animation-fade-in">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">Your file has been downloaded.</p>
              <button onClick={() => setSuccess(false)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Process More
              </button>
            </div>
          ) : (
            <>
              {/* UPLOAD AREA */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
              >
                <input {...getInputProps()} />
                <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                    {toolId === 'img-to-pdf' ? "Drag & drop Images" : "Drag & drop PDF here"}
                </p>
              </div>

              {/* FILE LIST */}
              {files.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Files ({files.length})</h3>
                  <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                          {toolId === 'img-to-pdf' ? <FaFileImage className="text-purple-500" /> : 
                           toolId === 'pdf-to-word' ? <FaFileWord className="text-blue-600" /> :
                           <FaFilePdf className="text-red-500" />}
                          <span className="text-gray-700 text-sm truncate max-w-xs">{file.name}</span>
                        </div>
                        <button onClick={(e) => {
                             e.stopPropagation();
                             setFiles(files.filter((_, i) => i !== idx));
                        }} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                      </div>
                    ))}
                  </div>

                  {/* TOOL SPECIFIC INPUTS */}
                  {toolId === 'split' && (
                      <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                          <label className="block text-indigo-900 font-semibold mb-2">Pages to Extract:</label>
                          <input type="text" placeholder="e.g. 1-5" value={pageRange} onChange={(e) => setPageRange(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" />
                      </div>
                  )}
                  {toolId === 'rotate' && (
                      <div className="mb-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-center">
                          <div className="flex justify-center gap-4">
                              <button onClick={() => setRotation(90)} className="px-4 py-2 bg-white border rounded">Right 90°</button>
                              <button onClick={() => setRotation(180)} className="px-4 py-2 bg-white border rounded">180°</button>
                          </div>
                      </div>
                  )}

                  <button 
                    onClick={handleProcess}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaSpinner className="animate-spin" /> Processing...</> : "Convert / Process"}
                  </button>
                </div>
              )}
            </>
          )}
       </div>
    </div>
  );
};

export default PdfToolView;