export const formatAndValidateName = (inputName, originalMicrosoftName) => {
    // 1. Format Name (Capitalize First Letter of each word)
    const formattedName = inputName.replace(/\b\w/g, (char) => char.toUpperCase());

    // 2. Exact 2 Words Validation
    const inputParts = formattedName.trim().split(/\s+/);
    
    if (inputParts.length !== 2) {
        return { 
            name: formattedName, 
            isValid: false, 
            error: "Please enter exactly two words (Name Surname)." 
        };
    }

    // 3. Flexible Matching (Bag of Words)
    if (originalMicrosoftName) {
        // Convert both to lowercase arrays for comparison
        const originalParts = originalMicrosoftName.toLowerCase().trim().split(/\s+/);
        const inputPartsLower = formattedName.toLowerCase().trim().split(/\s+/);

        // Validation Rule: Both words entered by user MUST exist in the original Microsoft name
        const firstWordValid = originalParts.includes(inputPartsLower[0]);
        const secondWordValid = originalParts.includes(inputPartsLower[1]);

        if (!firstWordValid || !secondWordValid) {
            return { 
                name: formattedName, 
                isValid: false, 
                error: "Name parts do not match your official Microsoft ID." 
            };
        }

        // Duplicate Check (e.g., "Sharma Sharma")
        if (inputPartsLower[0] === inputPartsLower[1]) {
             return { 
                name: formattedName, 
                isValid: false, 
                error: "Please enter Name and Surname (do not repeat words)." 
            };
        }
    }

    return { name: formattedName, isValid: true, error: "" };
};

export const formatAndValidatePRN = (inputPrn) => {
    const formattedPrn = inputPrn.toUpperCase().replace(/\s/g, '');

    if (!formattedPrn) {
        return { prn: "", isValid: false, error: "PRN is required for documents." };
    }

    const regex = /^[A-Z0-9]+$/;
    if (!regex.test(formattedPrn)) {
        return { 
            prn: formattedPrn, 
            isValid: false, 
            error: "PRN contains invalid characters. Use alphanumeric only." 
        };
    }

    if (formattedPrn.length < 5) {
        return {
            prn: formattedPrn,
            isValid: false,
            error: "PRN seems too short. Please check again."
        };
    }

    return { prn: formattedPrn, isValid: true, error: "" };
};