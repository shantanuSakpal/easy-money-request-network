"use client";
import React from "react";
import { sendInvoiceEmail } from "@/utils/sendInvoiceEmail";
export default function () {
  const data = {
    recipient: {
      name: "John Doe",
      email: "shantanuesakpal1420@gmail.com",
      teamName: "Engineering",
      country: "United States",
      postalCode: "94105",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 0.5,
      notes: "Monthly payment for services",
    },
    payerName: "Acme Corporation",
    payerAddress: "123 Tech Lane, Silicon Valley, CA",
    payerContact: "+1-555-123-4567",
    payerEmail: "bountystream01@gmail.com",
    note: "Payment for Q3 2023 services",
  };

  return (
    <div className="pt-10 px-5">
      Send email with invoice
      <button
        className="bg-blue-500 px-3 py-2 rounded-lg"
        onClick={async () => {
          const res = await sendInvoiceEmail(data);
          console.log("res", res);
        }}
      >
        Send email
      </button>
    </div>
  );
}
