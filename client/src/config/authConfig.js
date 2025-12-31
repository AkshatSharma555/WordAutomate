import { PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        // 👇 AB YEH ENV FILE SE ID LEGA
        clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID, 
        
        authority: import.meta.env.VITE_MICROSOFT_AUTHORITY,
        redirectUri: import.meta.env.VITE_REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// 👇 UPDATED: Added 'Files.ReadWrite' permission for Graph API Document Conversion
export const loginRequest = {
    scopes: ["User.Read", "email", "Files.ReadWrite"]
};

export const msalInstance = new PublicClientApplication(msalConfig);