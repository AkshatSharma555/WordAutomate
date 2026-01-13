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

const OnboardingModal = ({ onSkip }) => { 
    // 🔥 FIX: Destructure 'setCurrentUser' instead of 'setUser'
    const { currentUser, setCurrentUser } = useAuth();
    
    const searchParams = new URLSearchParams(window.location.search);
    const isTestMode = searchParams.get('test_mode') === 'true';

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [errors, setErrors] = useState({});
    
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
            if (!res.isValid) newErrors.name = res.error;
            else delete newErrors.name;
        }

        if (field === 'prn') {
            const res = formatAndValidatePRN(value);
            finalValue = res.prn;
            if (!res.isValid) newErrors.prn = res.error;
            else delete newErrors.prn;
        }

        if (field === 'branch' || field === 'year') {
            if (!value) newErrors[field] = "Selection required";
            else delete newErrors[field];
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
                // FIX HERE TOO
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
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 15000 
                }
            );

            if (data.success) {
                const updatedUser = {
                    ...currentUser,
                    ...formData, 
                    name: data.name || formData.name, 
                    isAccountVerified: true, 
                };
                
                // 🔥 CRITICAL FIX: Using the correct function name 'setCurrentUser'
                if (typeof setCurrentUser === 'function') {
                    setCurrentUser(updatedUser);
                } else {
                    console.error("AuthContext: setCurrentUser function not found!");
                }

                toast.success("Dashboard Unlocked! 🚀");

                // Tiny delay for visual smoothness
                setTimeout(() => {
                    setIsExiting(true); 
                }, 100); 

            } else {
                throw new Error(data.message || "Update failed");
            }

        } catch (error) {
            console.error("Onboarding Update Failed:", error);
            let errorMsg = "Failed to update profile.";
            if (error.code === 'ECONNABORTED') errorMsg = "Server took too long.";
            else if (error.response) errorMsg = error.response.data?.message || "Server Error";
            
            toast.error(errorMsg);
            setIsSubmitting(false);
            setIsExiting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return <StepIdentity formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(2)} onSkip={onSkip} />;
            case 2:
                return <StepAcademic formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(3)} onSkip={onSkip} />;
            case 3:
                return <StepGuide onNext={() => setStep(4)} userName={formData.name} />;
            case 4:
                return <StepFeatures onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
            default: return null;
        }
    };

    const getTitles = () => {
        switch(step) {
            case 1: return { title: "Identity Details", subtitle: "Verify your printable details" };
            case 2: return { title: "Academic Profile", subtitle: "Help friends find you" };
            case 3: return { title: "Format Guide", subtitle: "How to setup your Word file" };
            case 4: return { title: "Pro Tips", subtitle: "Get the most out of the app" };
            default: return { title: "Setup", subtitle: "" };
        }
    };

    return (
        <div className="relative z-50">
            <WizardLayout 
                title={getTitles().title} 
                subtitle={getTitles().subtitle} 
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