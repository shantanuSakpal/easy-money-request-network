"use client";
import React, { useEffect, useState } from "react";
import CardTable from "@/components/Cards/CardTable.js";
import CardSettings from "@/components/Cards/CardSettings";
import EmailEditor from "@/components/Cards/EmailEditor";
import CardInvoice from "@/components/Cards/CardInvoice";
import { handleCreateRequest } from "@/utils/handleCreateRequest";
import { processBatchPayments } from "@/utils/processBatchPayments";
import { providers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { RecipientType } from "@/types/recipientList";
import PaymentProgress from "@/components/PaymentProgressIndicator";

export default function Tables() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [requestIds, setRequestIds] = useState<Array<string>>([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [stage, setStage] = useState("creating");
  const [error, setError] = useState(null);
  const [emailIdMap, setEmailIdMap] = useState({});
  useEffect(() => {
    if (window.ethereum && address) {
      const provider = new providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner(address));
    }
  }, [address]);
  // status : pending , completed , delayed
  const [recipientList, setRecipientList] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [invoiceData, setInvoiceData] = useState({
    creationDate: todayDate,
    // invoiceNumber: "",
    note: "You can see the transaction on the provider link on Request Scan !",
    payerName: "",
    payerAddress: "",
    payerContact: "",
    payerEmail: "",
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // pageMode addingUser -> writingEmail -> invoiceDetails
  const [pageMode, setPageMode] = useState("addingUser");

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
  };

  // Function to go backward
  const goPageBackward = () => {
    if (pageMode === "writingEmail") {
      setPageMode("addingUser");
    }
    if (pageMode === "invoiceDetails") {
      setPageMode("writingEmail");
    }
  };

  const createAllRequestIds = async (recipientList: Array<RecipientType>) => {
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
          payerWalletAddress: address!,
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

  const handleBatchPayment = async (recipientList: Array<RecipientType>) => {
    setIsComplete(false); // Reset completion state

    if (!isConnected) {
      alert("Please connect your wallet to proceed!");
      return;
    }

    setLoading(true);
    setStage("creating");
    setProcessingPayment(true);
    try {
      const requestIds = await createAllRequestIds(recipientList);
      setStage("confirm");

      await processBatchPayments(requestIds, signer);
      setStage("processing");

      // Wait for confirmation
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with actual confirmation
      setStage("complete");
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
          <EmailEditor recipientList={recipientList} />
        )}
        {pageMode == "invoiceDetails" && (
          <CardInvoice
            requestIds={requestIds}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
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
              pageMode === "invoiceDetails"
                ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                : "bg-lightBlue-500 active:bg-lightBlue-600"
            } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
            type="button"
            onClick={goPageForward}
            disabled={pageMode === "invoiceDetails"}
          >
            Next Section
          </button>

          {pageMode === "invoiceDetails" && (
            <button
              className={`${
                loading
                  ? "opacity-25 bg-lightBlue-500 cursor-not-allowed"
                  : "bg-lightBlue-500 active:bg-lightBlue-600"
              } text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150`}
              type="button"
              onClick={() => {
                handleBatchPayment(recipientList);
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
