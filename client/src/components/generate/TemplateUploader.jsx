import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import mammoth from 'mammoth';
import { 
  CheckCircle2, AlertCircle, ScanSearch, X, FileType, Sparkles,
  LayoutTemplate, ShieldCheck, Plus, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 👇 Image Path Update (Ensure this path is correct)
import mockDocPreview from '../../assets/mockDoc.png';

const TemplateUploader = ({ file, setFile }) => {
  const [status, setStatus] = useState('idle');
  const [errorDetails, setErrorDetails] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const validateDoc = async (uploadedFile) => {
    setStatus('scanning');
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        const rawText = result.value;
        const hasName = /\{name\}/i.test(rawText);
        const hasPrn = /\{prn\}/i.test(rawText);

        setTimeout(() => {
          if (hasName && hasPrn) {
            setFile(uploadedFile);
            setStatus('success');
            setErrorDetails(null);
          } else {
            const missing = [];
            if (!hasName) missing.push("{name}");
            if (!hasPrn) missing.push("{prn}");
            setErrorDetails({
                title: "Missing Mandatory Placeholders",
                items: missing,
                message: "Your document needs these specific tags to work."
            });
            setStatus('error');
          }
        }, 1500);

      } catch (err) {
        console.error(err);
        setStatus('error');
        setErrorDetails({ 
            title: "File Read Error", 
            message: "We couldn't parse this file. Ensure it's a valid .docx." 
        });
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
    if(e) e.stopPropagation();
    setFile(null);
    setStatus('idle');
    setErrorDetails(null);
  };

  return (
    <>
    {/* Main Container: Flex Column to handle layout properly */}
    <div className="flex flex-col h-full bg-white dark:bg-[#111111] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none font-sans overflow-hidden relative group/container">
      
      {/* --- 1. HEADER (Always Visible) --- */}
      <div className="px-5 py-4 shrink-0 flex justify-between items-center border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-[#151515]">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#1AA3A3] to-[#148f8f] rounded-xl shadow-sm">
                <LayoutTemplate className="text-white" size={18} />
            </div>
            <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    Master Template
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload your .docx file
                </p>
            </div>
        </div>
        {status === 'success' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>}
      </div>

      {/* --- 2. SCROLLABLE BODY (Fixes Zoom Issue) --- */}
      <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center min-h-full p-4 transition-all duration-300 outline-none
            ${isDragActive ? 'bg-[#1AA3A3]/5 ring-4 ring-inset ring-[#1AA3A3]/20' : ''}`}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            
            {/* STATE: IDLE */}
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 w-full"
              >
                 {/* A. Guide Image (Scales nicely) */}
                 <div 
                    className="relative w-full max-w-[280px] cursor-zoom-in group/image"
                    onClick={(e) => { e.stopPropagation(); setShowFullImage(true); }}
                 >
                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-white">
                        {/* max-h restriction ensures it doesn't take full screen on mobile */}
                        <img 
                            src={mockDocPreview} 
                            alt="Format Guide" 
                            className="w-full h-auto max-h-[35vh] object-contain"
                        />
                    </div>
                    
                    {/* Zoom Hint */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px] rounded-lg">
                        <span className="bg-white/90 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Eye size={10} /> View
                        </span>
                    </div>
                 </div>

                 {/* B. Upload Button */}
                 <div className="flex flex-col items-center gap-3">
                    <button className="flex items-center gap-2 bg-[#1AA3A3] hover:bg-[#158585] text-white px-6 py-3 rounded-full shadow-lg shadow-[#1AA3A3]/30 transition-transform active:scale-95 group/btn">
                        <Plus size={20} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
                        <span className="font-bold text-sm">Upload Template</span>
                    </button>
                    
                    <p className="text-[10px] text-slate-400 text-center max-w-[200px]">
                        Drag & Drop or Click to browse.<br/>
                        Required: <code className="text-[#F54A00] font-mono">{`{name}`}</code> & <code className="text-[#1AA3A3] font-mono">{`{prn}`}</code>
                    </p>
                 </div>

              </motion.div>
            )}

            {/* STATE: SCANNING */}
            {status === 'scanning' && (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 py-10"
              >
                 <div className="relative size-20">
                    <div className="absolute inset-0 bg-[#1AA3A3]/10 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-[3px] border-[#1AA3A3] border-t-transparent border-l-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ScanSearch className="text-[#1AA3A3]" size={32} />
                    </div>
                 </div>
                 <p className="text-xs font-bold text-slate-600 dark:text-slate-300 animate-pulse">
                    Validating Structure...
                 </p>
              </motion.div>
            )}

            {/* STATE: SUCCESS */}
            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-6 w-full max-w-xs"
              >
                 <ShieldCheck size={56} className="text-emerald-500 drop-shadow-md" />
                 
                 <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">Perfect!</h3>
                    <p className="text-xs text-slate-500">Document is ready for automation.</p>
                 </div>
                 
                 <div className="w-full bg-slate-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/30 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-white dark:bg-black rounded-lg text-slate-500 shrink-0">
                       <FileType size={20} />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{file?.name}</p>
                    </div>
                    <button onClick={resetUpload} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"><X size={16}/></button>
                 </div>
              </motion.div>
            )}

            {/* STATE: ERROR */}
            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-6 text-center px-4"
              >
                 <AlertCircle size={48} className="text-red-500" />
                 <div>
                    <h3 className="text-base font-bold text-red-600 dark:text-red-400 mb-1">
                        {errorDetails?.title || "Validation Failed"}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-[240px] mx-auto">{errorDetails?.message}</p>
                 </div>
                 <button 
                   onClick={(e) => { e.stopPropagation(); setStatus('idle'); }}
                   className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold rounded-lg shadow-md hover:scale-105 transition-transform"
                 >
                   Try Again
                 </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* --- 3. FOOTER (Always Visible) --- */}
      <div className="px-5 pb-5 shrink-0 bg-white dark:bg-[#111111] pt-2">
         <div className="bg-indigo-50 dark:bg-[#151515] border border-indigo-100 dark:border-slate-800 rounded-xl p-3 flex items-start gap-3">
            <Sparkles size={16} className="text-indigo-500 mt-0.5 shrink-0" />
            <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">
               <span className="font-bold text-slate-800 dark:text-slate-200 block">We handle renaming</span>
               File becomes: <span className="font-mono bg-white dark:bg-black/50 px-1 rounded border border-slate-200 dark:border-slate-700">Lab_User_PRN.pdf</span>
            </div>
         </div>
      </div>

    </div>

    {/* --- FULL IMAGE MODAL (Zoom) --- */}
    <AnimatePresence>
        {showFullImage && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFullImage(false)}
                className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            >
                <motion.img 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    src={mockDocPreview} 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                <button className="absolute top-5 right-5 text-white/70 hover:text-white p-2 bg-white/10 rounded-full">
                    <X size={24} />
                </button>
            </motion.div>
        )}
    </AnimatePresence>
    </>
  );
};

export default TemplateUploader;