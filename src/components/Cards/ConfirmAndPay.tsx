"use client";
import React, { useEffect, useState } from "react";
import InvoiceTemplate from "@/components/Cards/InvoiceTemplate";
import { useAccount } from "wagmi";
import { PayerType, RecipientType } from "@/types/actors";

export default function ConfirmAndPay({
  invoiceData,
  emailBody,
  requestIds,
  payerDetails,
  setPayerDetails,
  recipient,
}: {
  invoiceData: any;
  emailBody: string;
  requestIds: Array<string>;
  payerDetails: PayerType; // Optional fields
  setPayerDetails: (details: PayerType) => void;
  recipient: RecipientType; // Optional fields
}) {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold ">
        Confirm the details and pay
      </h1>

      <div className="p-5">
        <p className="text-lg font-bold mb-3">Email Body</p>
        <div className="p-5 bg-white rounded-lg">{emailBody}</div>
      </div>

      <div className="p-5">
        <p className="text-lg font-bold mb-3">Invoice</p>
        <InvoiceTemplate
          requestIds={requestIds}
          payerDetails={payerDetails}
          invoiceData={invoiceData}
          recipient={recipient}
        />
      </div>
    </div>
  );
}
