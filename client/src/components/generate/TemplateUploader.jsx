import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { 
  FileText, CheckCircle2, AlertCircle, 
  ScanSearch, X, Plus, FileUp, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TemplateUploader = ({ file, setFile }) => {
  const [status, setStatus] = useState('idle'); // idle | scanning | success | error
  const [missingTags, setMissingTags] = useState([]);

  // --- SMART VALIDATION LOGIC ---
  const validateDoc = async (uploadedFile) => {
    setStatus('scanning');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const rawText = result.value;

        // 1. Check Valid Tags
        const hasValidName = rawText.includes('{name}') || rawText.includes('{NAME}');
        const hasValidPRN = rawText.includes('{prn}') || rawText.includes('{PRN}');

        // 2. Check for Mixed Case Errors
        const mixedCaseNameMatch = rawText.match(/{(?!name|NAME)(n|N)[a-zA-Z]{3}}/); 
        const mixedCasePRNMatch = rawText.match(/{(?!prn|PRN)(p|P)[a-zA-Z]{2}}/);

        setTimeout(() => {
          if (hasValidName && hasValidPRN) {
            setFile(uploadedFile);
            setStatus('success');
            setMissingTags([]);
          } else {
            const missing = [];
            
            if (!hasValidName) {
                if (mixedCaseNameMatch) {
                    missing.push(`Invalid: ${mixedCaseNameMatch[0]}`);
                    missing.push('Use {NAME} or {name}');
                } else {
                    missing.push('{NAME} or {name}');
                }
            }
            
            if (!hasValidPRN) {
                if (mixedCasePRNMatch) {
                    missing.push(`Invalid: ${mixedCasePRNMatch[0]}`);
                    missing.push('Use {PRN} or {prn}');
                } else {
                    missing.push('{PRN} or {prn}');
                }
            }
            
            setMissingTags(missing);
            setStatus('error');
          }
        }, 1200); 

      } catch (err) {
        console.error(err);
        setStatus('error');
        setMissingTags(['Invalid File Structure']);
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const selected = acceptedFiles[0];
    if (selected) validateDoc(selected);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    multiple: false,
    disabled: status === 'scanning' || status === 'success'
  });

  const resetUpload = (e) => {
    e.stopPropagation();
    setFile(null);
    setStatus('idle');
    setMissingTags([]);
  };

  return (
    // Fixed container - No internal scrollbars
    <div className="flex flex-col h-full bg-white dark:bg-[#111111] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* --- HEADER --- */}
      <div className="px-6 py-4 shrink-0">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-1.5 bg-[#1AA3A3]/10 rounded-lg">
            <FileText className="text-[#1AA3A3]" size={18} />
          </div>
          Template Source
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-10">
          Upload your <strong>.docx</strong> master file here.
        </p>
      </div>

      {/* --- MAIN BODY (Occupies remaining space) --- */}
      <div className="flex-1 px-4 pb-2 flex flex-col min-h-0">
        
        {/* DROPZONE */}
        <div 
          {...getRootProps()} 
          className={`flex-1 relative rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer group w-full
            ${status === 'error' 
              ? 'border-red-300 bg-red-50/50 dark:border-red-900/50 dark:bg-red-900/10' 
              : status === 'success'
                ? 'border-green-300 bg-green-50/50 dark:border-green-900/50 dark:bg-green-900/10'
                : isDragActive 
                  ? 'border-[#1AA3A3] bg-[#1AA3A3]/5 scale-[0.99]' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-[#151515] hover:border-[#1AA3A3]/40 hover:bg-slate-100 dark:hover:bg-[#1a1a1a]'
            }`}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            
            {/* STATE 1: IDLE */}
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-3"
              >
                 {/* Floating Add Button */}
                 <div className="relative group-hover:-translate-y-1 transition-transform duration-300">
                    <div className="absolute inset-0 bg-[#1AA3A3] blur-xl opacity-20 rounded-full"></div>
                    <div className="size-14 bg-white dark:bg-[#222] rounded-full flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 relative z-10">
                        <Plus size={28} className="text-[#1AA3A3]" strokeWidth={3} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#1AA3A3] text-white p-1 rounded-full border-[3px] border-white dark:border-[#151515] z-20">
                        <FileUp size={12} />
                    </div>
                 </div>

                 <div className="space-y-0.5">
                   <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      Click or Drag File
                   </h3>
                   <p className="text-[10px] text-slate-400 max-w-[180px] mx-auto leading-tight">
                      Only .docx files supported
                   </p>
                 </div>
              </motion.div>
            )}

            {/* STATE 2: SCANNING */}
            {status === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                 <div className="relative size-16 mb-4">
                    <div className="absolute inset-0 border-[3px] border-slate-200 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-[3px] border-[#1AA3A3] border-t-transparent rounded-full animate-spin"></div>
                    <ScanSearch className="absolute inset-0 m-auto text-[#1AA3A3] animate-pulse" size={24} />
                 </div>
                 <h3 className="text-xs font-bold text-slate-800 dark:text-white tracking-wide uppercase">
                    Analyzing Structure...
                 </h3>
                 <p className="text-[10px] text-slate-500 mt-1">Verifying tags: {`{NAME}, {PRN}`}</p>
              </motion.div>
            )}

            {/* STATE 3: SUCCESS */}
            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full"
              >
                 <div className="size-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-3 shadow-sm ring-4 ring-green-50 dark:ring-green-900/10">
                    <CheckCircle2 size={24} />
                 </div>
                 <h3 className="text-sm font-bold text-green-700 dark:text-green-400">Template Verified!</h3>
                 
                 {/* File Chip */}
                 <div className="mt-4 w-full max-w-[220px] px-3 py-2 bg-white dark:bg-black/40 border border-green-200 dark:border-green-900/50 rounded-xl flex items-center gap-2 shadow-sm">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                       <FileText size={16} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 truncate flex-1 text-left">
                       {file.name}
                    </span>
                    <button 
                        onClick={resetUpload} 
                        className="p-1 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Remove file"
                    >
                       <X size={14} />
                    </button>
                 </div>
              </motion.div>
            )}

            {/* STATE 4: ERROR */}
            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center w-full px-1"
              >
                 <div className="size-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2">
                    <AlertCircle size={20} />
                 </div>
                 <h3 className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">Validation Failed</h3>
                 
                 <div className="flex flex-wrap justify-center gap-1.5 mb-3 w-full">
                    {missingTags.map((tag, idx) => (
                       <span key={idx} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-[9px] font-mono font-bold rounded border border-red-200 dark:border-red-800 text-center">
                          {tag}
                       </span>
                    ))}
                 </div>

                 <button 
                   onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                   className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline decoration-dashed"
                 >
                   Try another file
                 </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* --- FOOTER TIP (Always visible, no scroll) --- */}
      <div className="px-4 pb-4 shrink-0">
         <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 flex items-start gap-2.5">
            <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div className="text-left">
               <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 mb-0.5 uppercase tracking-wide">
                  Strict Requirement
               </p>
               <p className="text-[10px] text-amber-600/90 dark:text-amber-500/80 leading-relaxed font-medium">
                  Use exactly <code className="font-mono bg-white dark:bg-black/50 px-1 rounded border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">{`{NAME}`}</code> and <code className="font-mono bg-white dark:bg-black/50 px-1 rounded border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">{`{PRN}`}</code>. Mixed case (e.g. {`{Name}`}) not supported.
               </p>
            </div>
         </div>
      </div>

    </div>
  );
};

export default TemplateUploader;