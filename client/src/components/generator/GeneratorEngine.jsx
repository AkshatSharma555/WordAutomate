import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileDown, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

// Custom Components
import FileUploader from './FileUploader';
import StudentInput from './StudentInput';
import Button from '../common/Button';
import Toast from '../common/Toast';
import { docService } from '../../services/docService';

const GeneratorEngine = () => {
  // --- States ---
  const [file, setFile] = useState(null);
  const [studentData, setStudentData] = useState({ name: '', prn: '' });
  
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  const [generatedDoc, setGeneratedDoc] = useState(null); // Stores the final PDF URL
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Loading Text Animation Logic ---
  useEffect(() => {
    if (!loading) return;
    
    const messages = [
      "Uploading to Server...", 
      "Authenticating with Microsoft...", 
      "Converting via Graph API...", 
      "Finalizing Formatting...", 
      "Almost there..."
    ];
    
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 2000); // Change text every 2 seconds

    return () => clearInterval(interval);
  }, [loading]);

  // --- Handlers ---

  const handleGenerate = async () => {
    // 1. Validation
    if (!file) {
      setToast({ show: true, message: 'Please upload a Word document first.', type: 'error' });
      return;
    }
    if (!studentData.name || !studentData.prn) {
      setToast({ show: true, message: 'Please fill in Student Name and PRN.', type: 'error' });
      return;
    }

    setLoading(true);
    setGeneratedDoc(null);

    try {
      // 2. Prepare Data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentData', JSON.stringify(studentData));

      // 3. API Call
      const response = await docService.generateDocument(formData);

      // 4. Success
      if (response.success) {
        setGeneratedDoc(response);
        setToast({ show: true, message: 'Document generated successfully!', type: 'success' });
      }

    } catch (error) {
      console.error(error);
      setToast({ show: true, message: error, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStudentData({ name: '', prn: '' });
    setGeneratedDoc(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Toast Notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}

      <motion.div 
        layout
        className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/60 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden"
      >
        {/* Background Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />

        <AnimatePresence mode="wait">
          {!generatedDoc ? (
            // VIEW 1: INPUT FORM
            <motion.div
              key="input-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                  <Sparkles className="text-primary" size={24} /> 
                  Generate Report
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Upload your template and let Microsoft Graph handle the rest.
                </p>
              </div>

              {/* Step 1: Upload */}
              <div className="space-y-3">
                <FileUploader file={file} setFile={setFile} />
              </div>

              {/* Step 2: Student Details */}
              <div className="space-y-3">
                <StudentInput data={studentData} setData={setStudentData} />
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={loading} 
                  className="w-full py-4 text-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  {loading ? loadingText : 'Generate Document'}
                </Button>
                
                {loading && (
                  <p className="text-center text-xs text-slate-400 mt-3 animate-pulse">
                    This usually takes 5-8 seconds for high-quality conversion.
                  </p>
                )}
              </div>
            </motion.div>

          ) : (
            // VIEW 2: SUCCESS / DOWNLOAD
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-6 py-4"
            >
              <div className="size-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-green-500/10">
                <CheckCircle size={40} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Document Ready!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                  Your file has been successfully processed by Microsoft Graph and is ready for download.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
                {/* Download Button */}
                <a 
                  href={generatedDoc.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                    <FileDown size={20} /> Download PDF
                  </Button>
                </a>

                {/* Create New Button */}
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1 gap-2"
                >
                  <RefreshCw size={18} /> Create Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GeneratorEngine;