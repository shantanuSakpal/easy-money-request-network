"use client";
import React, { useEffect, useState } from "react";
import InvoiceTemplate from "@/components/Cards/InvoiceTemplate";
import { useAccount } from "wagmi";
import { PayerType, RecipientType } from "@/types/actors";

export default function InvoiceForm({
  emailBody,
  requestIds,
  payerDetails,
  setPayerDetails,
  recipient,
  invoiceData,
  setInvoiceData,
}: {
  emailBody: string;
  invoiceData: any;
  requestIds: Array<string>;
  payerDetails: PayerType; // Optional fields
  setPayerDetails: (details: PayerType) => void;
  recipient: RecipientType; // Optional fields
  setInvoiceData: (data: any) => void;
}) {
  //parse the email body before rendering the invoice template
  function personalizeEmail(template: string, recipientDetails: RecipientType) {
    // Replace placeholders with corresponding recipient details
    return template
      .replace(/\$name/g, recipientDetails.name)
      .replace(/\$walletAddress/g, recipientDetails.walletAddress);
  }
  const personalizedEmail = personalizeEmail(emailBody, recipient);

  const { address, isConnected } = useAccount();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setInvoiceData((prev: any) => ({
      ...prev,
      walletAddress: address,
    }));
  }, [address]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-lg font-bold">
              Invoice Details
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
              Payer Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={invoiceData.businessName || ""}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={invoiceData.email || ""}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={invoiceData.phone || ""}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Tax Registration
                  </label>
                  <input
                    type="text"
                    name="taxRegistration"
                    value={invoiceData.taxRegistration || ""}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-lg font-bold">
              Invoice Preview
            </h6>
          </div>
        </div>
        <div className="flex flex-col mt-5 w-11/12 bg-white mx-auto">
          <InvoiceTemplate
            requestIds={requestIds}
            payerDetails={payerDetails}
            invoiceData={invoiceData}
            recipient={recipient}
          />
        </div>
      </div>
    </>
  );
}
