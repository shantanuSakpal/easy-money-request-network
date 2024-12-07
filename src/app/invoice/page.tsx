"use client";
import React from "react";
import { sendInvoiceEmail } from "@/utils/sendInvoiceEmail";
export default function () {
  const recipientList = [
    {
      id: "c9f5eec1-c634-4201-b2a0-8fbc610ebee3",
      name: "Shantanu Sakpal",
      businessName: "brogrammers",
      firstName: "Shantanu",
      lastName: "Sakpal",
      email: "shantanuesakpal1420@gmail.com",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      description: "",
      amount: "0.001",
      walletAddress: "0x96F00170DA867d5aD7879bc3f4cEdf8f4CDf6926",
      phone: "",
      taxRegistration: "",
      deductions: "0",
    },
  ];
  const payerDetails = {
    walletAddress: "0xFe53F81e87379e6730C0a2E0Afab0B7e011b1C55",
    businessName: "DoraHacks",
    email: "vineetchotaliya30@gmail.com",
    phone: "9324406353",
    taxRegistration: "12123123",
    invoiceNumber: "INV-1733556610875",
  };
  const emailBody = `  Hey $name! Congratulations on your win! 
      Your bounty rewards have been sent to your wallet: $walletAddress`;

  return (
    <div className="pt-10 px-5">
      Send email with invoice
      <button
        className="bg-blue-500 px-3 py-2 rounded-lg"
        onClick={async () => {
          const res = await sendInvoiceEmail(
            recipientList[0],
            payerDetails,
            emailBody
          );
          // console.log("res", res);
        }}
      >
        Send email
      </button>
    </div>
  );
}
