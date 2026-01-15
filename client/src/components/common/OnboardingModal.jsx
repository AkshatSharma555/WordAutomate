import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatAndValidateName, formatAndValidatePRN } from '../../utils/validators';

import WizardLayout from './onboarding/WizardLayout';
import StepIdentity from './onboarding/StepIdentity';
import StepAcademic from './onboarding/StepAcademic';
import StepGuide from './onboarding/StepGuide';
import StepFeatures from './onboarding/StepFeatures';
import SessionErrorModal from '../common/SessionErrorModal'; // ✅ Import

const OnboardingModal = ({ onSkip }) => { 
    const { currentUser, setCurrentUser } = useAuth();
    const searchParams = new URLSearchParams(window.location.search);
    const isTestMode = searchParams.get('test_mode') === 'true';

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [errors, setErrors] = useState({});
    
    // 🔥 Error Modal State
    const [showSessionError, setShowSessionError] = useState(false);
    
    const [formData, setFormData] = useState({
        name: "", 
        prn: currentUser?.prn || "",
        branch: currentUser?.branch || "",
        year: currentUser?.year || ""
    });

    const handleChange = (field, value) => {
        let newErrors = { ...errors };
        let finalValue = value;
        if (field === 'name') {
            const originalName = currentUser?.microsoftOriginalName || currentUser?.name || "";
            const res = formatAndValidateName(value, originalName);
            finalValue = res.name;
            if (!res.isValid) newErrors.name = res.error; else delete newErrors.name;
        }
        if (field === 'prn') {
            const res = formatAndValidatePRN(value);
            finalValue = res.prn;
            if (!res.isValid) newErrors.prn = res.error; else delete newErrors.prn;
        }
        if (field === 'branch' || field === 'year') {
            if (!value) newErrors[field] = "Selection required"; else delete newErrors[field];
        }
        setFormData(prev => ({ ...prev, [field]: finalValue }));
        setErrors(newErrors);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return; 
        if (errors.name || errors.prn || !formData.name || !formData.prn) {
            toast.error("Please fix errors before submitting.");
            return;
        }

        setIsSubmitting(true);

        if (isTestMode) {
            setTimeout(() => {
                toast.success("Test Mode: Setup Complete!");
                if (setCurrentUser) setCurrentUser({ ...currentUser, ...formData, isAccountVerified: true });
                setIsSubmitting(false);
            }, 1000);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.put(
                `${apiUrl}/user/update-personal-info`,
                formData,
                { withCredentials: true, headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
            );

            if (data.success) {
                const updatedUser = {
                    ...currentUser,
                    ...formData, 
                    name: data.name || formData.name, 
                    isAccountVerified: true, 
                };
                
                if (typeof setCurrentUser === 'function') setCurrentUser(updatedUser);
                toast.success("Dashboard Unlocked! 🚀");
                setTimeout(() => setIsExiting(true), 100); 
            } else {
                throw new Error(data.message || "Update failed");
            }

        } catch (error) {
            console.error("Onboarding Update Failed:", error);

            // 🔥 ROBUST ERROR CATCHING (Status Code OR Message)
            const isSessionError = 
                error.response?.status === 401 || 
                error.code === "ERR_NETWORK" ||
                (error.message && (
                    error.message.includes("Not Authorized") || 
                    error.message.includes("Login Again") ||
                    error.message.includes("jwt expired")
                ));

            if (isSessionError) {
                setShowSessionError(true); // Show the troubleshooting modal
            } else {
                let errorMsg = error.response?.data?.message || error.message || "Failed to update profile.";
                toast.error(errorMsg);
            }

            setIsSubmitting(false);
            setIsExiting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1: return <StepIdentity formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(2)} onSkip={onSkip} />;
            case 2: return <StepAcademic formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(3)} onSkip={onSkip} />;
            case 3: return <StepGuide onNext={() => setStep(4)} userName={formData.name} />;
            case 4: return <StepFeatures onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
            default: return null;
        }
    };

    return (
        <div className="relative z-50">
            {/* 🔥 Session Error Modal */}
            <SessionErrorModal 
                isOpen={showSessionError} 
                onClose={() => setShowSessionError(false)}
                onRetry={() => {
                    setShowSessionError(false);
                    handleSubmit(); // Retry directly
                }} 
            />

            <WizardLayout 
                title="Setup Profile" 
                subtitle="Complete these steps" 
                currentStep={step} 
                totalSteps={4} 
                isExiting={isExiting}
            >
                {renderStep()}
            </WizardLayout>
        </div>
    );
};

export default OnboardingModal;