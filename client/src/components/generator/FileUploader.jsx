import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Drag Events Handle karna zaroori hai
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    // Validation: Sirf .docx allow karenge
    if (
      selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      selectedFile.name.endsWith('.docx')
    ) {
      setFile(selectedFile);
    } else {
      setError('Only Word (.docx) files are supported!');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!file ? (
          // 1. Upload State
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-3xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : error 
                  ? 'border-secondary bg-secondary/5' 
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-primary/50 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              className="hidden"
              onChange={handleChange}
            />
            
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className={`p-4 rounded-full transition-colors ${
                isDragging ? 'bg-primary/20 text-primary' : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:scale-110 duration-300 shadow-sm'
              }`}>
                <UploadCloud size={32} />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-200 font-semibold text-lg">
                  Click to upload or drag & drop
                </p>
                <p className="text-slate-400 text-sm mt-1">Word Document (.docx) only</p>
              </div>
            </div>

            {/* Error Message if wrong file type */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 flex items-center gap-2 text-secondary text-xs font-medium bg-secondary/10 px-3 py-1.5 rounded-full"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          // 2. Selected File State
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex items-center gap-4 p-5 w-full bg-white dark:bg-slate-900 rounded-2xl border border-primary/30 shadow-lg shadow-primary/5"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <FileText size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setError(''); }}
              className="p-2 text-slate-400 hover:text-secondary hover:bg-secondary/10 rounded-full transition-colors"
              title="Remove file"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;