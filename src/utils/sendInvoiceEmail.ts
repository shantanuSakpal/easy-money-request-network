import { PayerType, RecipientType } from "@/types/actors";

export const sendInvoiceEmail = async (
  recipientDetails: Partial<RecipientType>,
  payerDetails: Partial<PayerType>,
  emailBody: string,
  note: string,
  transactionLink: string
) => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("sending email");
  const response = await fetch(`${BACKEND_URL}/api/send-email-invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: recipientDetails,
      payer: payerDetails,
      emailBody: emailBody,
      note: note || "No additional notes.", // Optional field with fallback
      transactionLink: transactionLink || "N/A", // Optional field with fallback
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to send email: ${error.message || response.statusText}`
    );
  }

  return response.json();
};
