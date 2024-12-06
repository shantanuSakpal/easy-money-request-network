import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EmailData {
    subject: string;
    body: string;
    recipients: Array<{ email: string; amount: number }>;
}

interface EmailContextType {
    emailData: EmailData;
    setEmailData: React.Dispatch<React.SetStateAction<EmailData>>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmailContext = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error("useEmailContext must be used within an EmailProvider");
    }
    return context;
};

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [emailData, setEmailData] = useState<EmailData>({
        subject: '',
        body: '',
        recipients: []
    });

    return (
        <EmailContext.Provider value={{ emailData, setEmailData }}>
            {children}
        </EmailContext.Provider>
    );
};