import React, { useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TemplateUploader = ({ file, setFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || selectedFile.name.endsWith('.docx'))) {
      setFile(selectedFile);
    } else {
      alert("Please upload a .docx file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="shrink-0 mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FileText className="text-[#F54A00]" /> Template Source
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Upload your Word (.docx) document with placeholders.
        </p>
      </div>

      {/* DROP ZONE - Fills available height */}
      <div 
        className={`flex-1 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-all relative overflow-hidden cursor-pointer ${
          file 
            ? 'border-[#1AA3A3] bg-[#1AA3A3]/5' 
            : 'border-slate-300 dark:border-slate-700 hover:border-[#1AA3A3]/50 hover:bg-slate-50 dark:hover:bg-slate-900'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".docx" 
          className="hidden" 
          onChange={handleFileChange}
        />

        {file ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center relative z-10 w-full"
          >
            <div className="size-20 bg-white dark:bg-[#111111] rounded-2xl shadow-lg mx-auto mb-4 flex items-center justify-center">
               <FileText size={40} className="text-[#1AA3A3]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate px-4">
              {file.name}
            </h3>
            <p className="text-xs text-slate-500 mb-6">{(file.size / 1024).toFixed(2)} KB</p>
            
            <div className="flex flex-col gap-2">
               <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-4 py-2 rounded-xl">
                 <CheckCircle2 size={14} /> Ready to Process
               </span>
               <button 
                 onClick={(e) => { e.stopPropagation(); setFile(null); }}
                 className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
               >
                 <X size={14} /> Remove File
               </button>
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400">
               <UploadCloud size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
              Upload Document
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              Drag & drop or click to browse.
            </p>
            <span className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10">
              Browse Files
            </span>
          </div>
        )}
      </div>

      {/* HINT Footer */}
      <div className="shrink-0 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
        <p className="text-[10px] text-yellow-700 dark:text-yellow-500 font-medium leading-relaxed">
          💡 <strong>Tip:</strong> Use <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">{'{{NAME}}'}</code> and <code className="bg-yellow-100 dark:bg-yellow-900/50 px-1 rounded">{'{{PRN}}'}</code> inside your Word file.
        </p>
      </div>
    </div>
  );
};

export default TemplateUploader;