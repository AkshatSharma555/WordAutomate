import React, { useState } from 'react'; // useEffect hata diya (not needed)
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { formatAndValidateName, formatAndValidatePRN } from '../../utils/validators';

import WizardLayout from './onboarding/WizardLayout';
import StepIdentity from './onboarding/StepIdentity';
import StepAcademic from './onboarding/StepAcademic';
import StepGuide from './onboarding/StepGuide';
import StepFeatures from './onboarding/StepFeatures';

const OnboardingModal = () => {
    const { currentUser, setUser } = useAuth();
    
    // Theme logic removed from here (It's now handled globally via Context)

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
        if (isSubmitting) return; 
        setIsSubmitting(true);

        // Test Mode
        if (isTestMode) {
            setTimeout(() => {
                toast.success("Test Mode: Setup Complete!");
                // 🔥 Remove 'theme: light', let it default to dark
                if (setUser) setUser({ ...currentUser, ...formData, isAccountVerified: true });
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
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (data.success) {
                setIsExiting(true); 

                const updatedUser = {
                    ...currentUser,
                    name: data.name || formData.name,
                    prn: data.prn || formData.prn,
                    branch: data.branch || formData.branch,
                    year: data.year || formData.year,
                    isAccountVerified: true, 
                    // 🔥 Note: Theme is NOT passed here. 
                    // Since DB defaults to 'dark', Context stays 'dark'. No flicker.
                };

                setTimeout(() => {
                    toast.success("All Set! Welcome Aboard 🚀");
                    if (typeof setUser === 'function') {
                        setUser(updatedUser);
                    } else {
                        window.location.reload();
                    }
                }, 600); 
            } else {
                throw new Error(data.message || "Update failed");
            }

        } catch (error) {
            console.error("Onboarding Update Failed:", error);
            const errorMsg = error.response?.data?.message || error.message || "Failed to update profile.";
            toast.error(errorMsg);
            setIsSubmitting(false);
            setIsExiting(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return <StepIdentity formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(2)} />;
            case 2:
                return <StepAcademic formData={formData} errors={errors} onChange={handleChange} onNext={() => setStep(3)} />;
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
        <WizardLayout 
            title={getTitles().title} 
            subtitle={getTitles().subtitle} 
            currentStep={step} 
            totalSteps={4} 
            isExiting={isExiting}
        >
            {renderStep()}
        </WizardLayout>
    );
};

export default OnboardingModal;