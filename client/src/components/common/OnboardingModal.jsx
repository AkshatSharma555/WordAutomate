import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatAndValidateName, formatAndValidatePRN } from '../../utils/validators';

import WizardLayout from './onboarding/WizardLayout';
import StepIdentity from './onboarding/StepIdentity';
import StepAcademic from './onboarding/StepAcademic';
import StepGuide from './onboarding/StepGuide';

const OnboardingModal = () => {
    const { currentUser, setUser } = useAuth();
    
    const searchParams = new URLSearchParams(window.location.search);
    const isTestMode = searchParams.get('test_mode') === 'true';

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        name: currentUser?.name || currentUser?.microsoftOriginalName || "",
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
        setIsSubmitting(true);

        if (isTestMode) {
            setTimeout(() => {
                setIsSubmitting(false);
                toast.success("Test Mode: Setup Complete!");
                setUser({ ...currentUser, ...formData });
            }, 1000);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            
            const { data } = await axios.put(
                `${apiUrl}/user/update-personal-info`,
                formData,
                { withCredentials: true }
            );

            if (data.success) {
                // 1. Start Smoke Animation
                setIsExiting(true); 

                // 2. Prepare Data
                const updatedUser = {
                    ...currentUser,
                    name: data.name,
                    prn: data.prn,
                    branch: data.branch,
                    year: data.year
                };

                // 3. Wait exactly for animation duration (600ms) then update state
                // ⚠️ Removed 'window.location.reload()' - this fixes the refresh jerk!
                setTimeout(() => {
                    toast.success("Ready to automate! 🚀");
                    setUser(updatedUser); // Instant seamless update
                }, 600); 
            }
        } catch (error) {
            console.error("Update failed", error);
            const errorMsg = error.response?.data?.message || "Failed to update profile.";
            toast.error(errorMsg);
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return <StepIdentity formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(2)} />;
            case 2:
                return <StepAcademic formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(3)} />;
            case 3:
                return <StepGuide onSubmit={handleSubmit} isSubmitting={isSubmitting} userName={formData.name} />;
            default: return null;
        }
    };

    const getTitles = () => {
        switch(step) {
            case 1: return { title: "Identity Details", subtitle: "Verify your printable details" };
            case 2: return { title: "Academic Profile", subtitle: "Help friends find you" };
            case 3: return { title: "Quick Guide", subtitle: "How to generate documents" };
            default: return { title: "Setup", subtitle: "" };
        }
    };

    return (
        <WizardLayout 
            title={getTitles().title} 
            subtitle={getTitles().subtitle} 
            currentStep={step} 
            totalSteps={3}
            isExiting={isExiting}
        >
            {renderStep()}
        </WizardLayout>
    );
};

export default OnboardingModal;