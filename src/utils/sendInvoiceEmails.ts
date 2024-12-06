import axios from 'axios';
import { EmailData } from '@/context/EmailContext';
import { RecipientType } from '@/types/recipientList';

export const sendInvoiceEmails = async (recipients: Array<RecipientType>, emailData: EmailData) => {
    try {
        await Promise.all(recipients.map(async (recipient) => {
            await axios.post('http://localhost:8080/api/send-email-invoice', {
                recipient: recipient.email,
                businessName: emailData.businessName,
                businessAddress: emailData.businessAddress,
                businessContact: emailData.businessContact,
                businessEmail: emailData.businessEmail,
                note: emailData.note,
                amount: recipient.amount
            });
        }));
    } catch (error) {
        console.error("Error sending invoices:", error);
        throw error; // Re-throw to be handled by the calling function
    }
};