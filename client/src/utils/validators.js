export const formatAndValidateName = (inputName, originalMicrosoftName) => {
    // 1. Auto Capitalize
    const formattedName = inputName.replace(/\b\w/g, (char) => char.toUpperCase());

    // 2. Exact 2 Words Validation
    const inputParts = formattedName.trim().split(/\s+/);
    if (inputParts.length !== 2) {
        return { 
            name: formattedName, 
            isValid: false, 
            error: "Please enter exactly two words (First Last)." 
        };
    }

    // 3. 🌟 SMART FLEXIBLE MATCHING
    if (originalMicrosoftName) {
        const originalParts = originalMicrosoftName.toLowerCase().trim().split(/\s+/);
        const inputPartsLower = formattedName.toLowerCase().trim().split(/\s+/);

        // --- RULE A: Father's Name Filter ---
        // Agar original naam mein 3 words hain (Surname Name Father), toh 3rd word Father hai.
        // Usko input mein allow mat karo.
        if (originalParts.length >= 3) {
            const fatherName = originalParts[2]; // Index 2 is usually Father/Middle name in Outlook
            
            if (inputPartsLower.includes(fatherName)) {
                return {
                    name: formattedName,
                    isValid: false,
                    error: `Do not use Father's name (${fatherName.charAt(0).toUpperCase() + fatherName.slice(1)}). Use 'Name Surname'.`
                };
            }
        }

        // --- RULE B: Word Existence Check ---
        // Check karo ki Input ke dono words Original naam mein kahin bhi exist karte hain kya.
        // Hum Order check nahi karenge kyunki 'originalName' ka format fix nahi hai (kabhi First-Last, kabhi Last-First).
        
        const allWordsExist = inputPartsLower.every(word => originalParts.includes(word));

        if (!allWordsExist) {
            // Agar koi naya word hai (Spelling mistake ya invalid name)
            return { 
                name: formattedName, 
                isValid: false, 
                error: "Name parts do not match your official ID records." 
            };
        }
    }

    // Agar sab sahi hai
    return { name: formattedName, isValid: true, error: "" };
};

// ... (purana formatAndValidateName waisa hi rahega)

// 👇 NEW PRN VALIDATOR
export const formatAndValidatePRN = (inputPrn) => {
    // 1. Auto Capitalize & Trim Spaces
    // "123a3049" -> "123A3049"
    const formattedPrn = inputPrn.toUpperCase().replace(/\s/g, '');

    // 2. Empty Check
    if (!formattedPrn) {
        return { prn: "", isValid: false, error: "PRN is required for documents." };
    }

    // 3. Alphanumeric Check (Sirf A-Z aur 0-9 allowed)
    const regex = /^[A-Z0-9]+$/;
    if (!regex.test(formattedPrn)) {
        return { 
            prn: formattedPrn, 
            isValid: false, 
            error: "PRN contains invalid characters. Use alphanumeric only." 
        };
    }

    // 4. Minimum Length Check (College PRN usually has 8-12 chars)
    if (formattedPrn.length < 5) {
        return {
            prn: formattedPrn,
            isValid: false,
            error: "PRN seems too short. Please check again."
        };
    }

    return { prn: formattedPrn, isValid: true, error: "" };
};