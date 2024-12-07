"use client";
import React, { useEffect, useState } from "react";
import CardTable from "@/components/Cards/CardTable";
import CardSettings from "@/components/Cards/CardSettings";
import EmailEditor from "@/components/Cards/EmailEditor";
import CardInvoice from "@/components/Cards/CardInvoice";
import { handleCreateRequest } from "@/utils/handleCreateRequest";
import { processBatchPayments } from "@/utils/processBatchPayments";
import { providers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import PaymentProgress from "@/components/PaymentProgressIndicator";
import { sendInvoiceEmail } from "@/utils/sendInvoiceEmail";
import { PayerType, RecipientType } from "@/types/actors";
import ConfirmAndPay from "@/components/Cards/ConfirmAndPay";

export default function Tables() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [requestIds, setRequestIds] = useState<Array<string>>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [stage, setStage] = useState("creating");
  const [error, setError] = useState(null);
  const [emailBody, setEmailBody] = useState("");

  const [recipientList, setRecipientList] = useState<Array<RecipientType>>([
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
  ]);
  const [payerDetails, setPayerDetails] = useState<PayerType>({});

  const todayDate = Date.now();
  const [invoiceData, setInvoiceData] = useState<any>({
    ...payerDetails,
    walletAddress: address,
    invoiceNumber: `INV-${Date.now()}`, // Autofill payer address from connected account
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // pageMode addingUser -> writingEmail -> invoiceDetails
  const [pageMode, setPageMode] = useState("addingUser");

  useEffect(() => {
    if (window.ethereum && address) {
      const provider = new providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner(address));
    }
  }, [address]);

  const goPageForward = () => {
    if (recipientList.length <= 0) {
      alert("please add recipient first");
      return;
    }

    if (pageMode === "addingUser") {
      setPageMode("writingEmail");
    }
    if (pageMode === "writingEmail") {
      setPageMode("invoiceDetails");
    }
    if (pageMode === "invoiceDetails") {
      setPayerDetails(invoiceData);
      setPayerDetails((prev) => ({
        ...prev,
        walletAddress: address!,
      }));
      setPageMode("confirmAndPay");
    }
  };

  // Function to go backward
  const goPageBackward = () => {
    if (pageMode === "writingEmail") {
      setPageMode("addingUser");
    }
    if (pageMode === "invoiceDetails") {
      setPageMode("writingEmail");
    }
    if (pageMode === "confirmAndPay") {
      setPageMode("invoiceDetails");
    }
  };

  const createAllRequestIds = async (
    recipientList: Array<RecipientType>,
    payerDetails: PayerType
  ) => {
    const allRequestIds: string[] = [];

    try {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      // Create an array of promises for all recipient requests
      const requestPromises = recipientList.map(async (recipient) => {
        //using private key to make requests
        const requestId = await handleCreateRequest({
          recipient,
          payerDetails,
          payerWalletAddress: payerDetails.walletAddress,
        });
        return requestId;
      });

      // Wait for all promises to resolve - if any fail, the whole Promise.all will fail
      const requestIds = await Promise.all(requestPromises);
      setRequestIds(requestIds);
      // Add all request IDs to the array
      allRequestIds.push(...requestIds);
      return allRequestIds;
    } catch (error) {
      console.error("Failed to process requests:", error);
      throw error;
    }
  };

  const handleBatchPayment = async () => {
    setIsComplete(false); // Reset completion state
    if (!isConnected) {
      alert("Please connect your wallet to proceed!");
      return;
    }
    console.log("recipient List --------------- ", recipientList);
    console.log("payer details =------------------", payerDetails);
    console.log("invoice data---------", invoiceData);
    console.log("email body -------------- ", emailBody);
    setLoading(true);
    setStage("creating");
    setProcessingPayment(true);
    try {
      const requestIds = await createAllRequestIds(recipientList, payerDetails);
      console.log("request ids --------------- ", requestIds);
      setStage("confirm");

      const receipt = await processBatchPayments(requestIds, signer);
      console.log("receipt --------------- ", receipt);
      setStage("processing");

      // Wait for confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStage("complete");
      // send invoice to users
      console.log("sending emails with invoice");
      const transactionLink = `https://scan.request.network/request/${requestIds[0]}`;

      const note = "";
      const res = await sendInvoiceEmail(
        recipientList[0],
        payerDetails,
        emailBody,
        note,
        transactionLink
      );
      console.log("res", res);
      if (res.message != "success") {
        throw new Error(res.message);
      }

      setIsComplete(true);
    } catch (error: any) {
      setError(error.message);
      console.error("Error in batch payment process:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-wrap p-5 min-h-screen">
        <CardTable
          recipientList={recipientList}
          setRecipientList={setRecipientList}
        />
        {pageMode == "addingUser" && (
          <CardSettings
            recipientList={recipientList}
            setRecipientList={setRecipientList}
          />
        )}
        {pageMode == "writingEmail" && (
          <EmailEditor
            recipientList={recipientList}
            emailBody={emailBody}
            setEmailBody={setEmailBody}
          />
        )}
        {pageMode == "invoiceDetails" && (
          <CardInvoice
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            emailBody={emailBody}
            requestIds={requestIds}
            payerDetails={payerDetails}
            setPayerDetails={setPayerDetails}
            recipient={recipientList[0]}
          />
        )}

        {pageMode == "confirmAndPay" && (
          <ConfirmAndPay
            invoiceData={invoiceData}
            emailBody={emailBody}
            requestIds={requestIds}
            payerDetails={payerDetails}
            setPayerDetails={setPayerDetails}
            recipient={recipientList[0]}
          />
        )}

        <div className="flex ">
          <button
            className={`${
              pageMode === "addingUser"
                ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                : "bg-lightBlue-500 active:bg-lightBlue-600"
            } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={goPageBackward}
            disabled={pageMode === "addingUser"}
          >
            Previous Section
          </button>

          <button
            className={`${
              pageMode === "confirmAndPay"
                ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                : "bg-lightBlue-500 active:bg-lightBlue-600"
            } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={goPageForward}
            disabled={pageMode === "confirmAndPay"}
          >
            Next Section
          </button>

          {pageMode === "confirmAndPay" && (
            <button
              className={`${
                loading
                  ? "opacity-25 bg-green-500 cursor-not-allowed"
                  : "bg-green-500 active:bg-green-600"
              } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
              type="button"
              onClick={() => {
                handleBatchPayment();
              }}
              disabled={loading}
            >
              {loading ? "Processing" : "Make Payment"}
            </button>
          )}
        </div>
        {processingPayment && (
          <PaymentProgress
            stage={stage}
            error={error}
            isComplete={isComplete}
          />
        )}
      </div>
    </>
  );
}
