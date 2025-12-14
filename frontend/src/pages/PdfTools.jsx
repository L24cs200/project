import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFilePdf, FaCut, FaCompress, FaFileWord, 
  FaImages, FaSyncAlt
} from 'react-icons/fa';

const PdfTools = () => {
  const navigate = useNavigate();

  const tools = [
    {
      id: 'merge',
      name: 'Merge PDF',
      desc: 'Combine multiple PDF files into one document.',
      icon: <FaFilePdf className="text-red-500 text-3xl" />,
      path: '/pdf-tools/merge'
    },
    {
      id: 'split',
      name: 'Split PDF',
      desc: 'Extract pages or split a file into multiple parts.',
      icon: <FaCut className="text-orange-500 text-3xl" />,
      path: '/pdf-tools/split'
    },
    {
      id: 'compress',
      name: 'Compress PDF',
      desc: 'Reduce file size while maintaining quality.',
      icon: <FaCompress className="text-green-500 text-3xl" />,
      path: '/pdf-tools/compress'
    },
    {
      id: 'rotate',
      name: 'Rotate PDF',
      desc: 'Rotate pages clockwise or anticlockwise.',
      icon: <FaSyncAlt className="text-indigo-500 text-3xl" />,
      path: '/pdf-tools/rotate'
    },
    {
      id: 'img-to-pdf', // <--- CORRECTED
      name: 'Images to PDF', // <--- CORRECTED
      desc: 'Convert JPG or PNG images into a single PDF.',
      icon: <FaImages className="text-purple-500 text-3xl" />,
      path: '/pdf-tools/img-to-pdf'
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      desc: 'Convert PDF documents into editable Word files.',
      icon: <FaFileWord className="text-blue-500 text-3xl" />,
      path: '/pdf-tools/pdf-to-word'
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">PDF Tools</h1>
          <p className="text-gray-600 mt-2">All essential PDF operations in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600">
                {tool.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PdfTools;