"use client";
import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import HeaderStats from "@/components/Headers/HeaderStats";
// components

import CardTable from "@/components/Cards/CardTable.js";
import CardSettings from "@/components/Cards/CardSettings";
import EmailEditor from "@/components/Cards/EmailEditor";
import CardInvoice from "@/components/Cards/CardInvoice";
import { handleCreateRequest } from "@/utils/handleCreateRequest";
import { handleSinglePayment } from "@/utils/handleSinglePayment";
import { processBatchPayments } from "@/utils/processBatchPayments";
import { providers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import { RecipientType } from "@/types/recipientList";

export default function Tables() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [requestId, setRequestId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    // @ts-ignore
    if (window.ethereum && address) {
      // @ts-ignore
      const provider = new providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner(address));
    }
  }, [address]);
  // status : pending , completed , delayed
  const [recipientList, setRecipientList] = useState([
    {
      name: "Mohammed Mehdi",
      email: "mohdmehdi2003@gmail.com",
      walletAddress: "0x96F00170DA867d5aD7879bc3f4cEdf8f4CDf6926",
      teamName: "Random_state_42",
      amount: 0.01, //in eth
      address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
      city: "New York",
      country: "United States",
      postalCode: 400059,
      notes: "Thank you for taking part in this event",
      status: "pending",
    },
  ]);

  const [invoiceData, setInvoiceData] = useState({
    creationDate: "2018-01-01T18:25:43.511Z",
    // invoiceNumber: "",
    note: "this is a very simple example of invoice",
    businessName: "PayWithRIng",
    businessAddress: " bkc, Mumbai - 400059",
    businessContact: "123987122",
    businessEmail: "ring@something.com"
  });

  // pageMode addingUser -> writingEmail -> invoiceDetails
  const [pageMode, setPageMode] = useState("addingUser");

  const goPageForward = () => {
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
      // Add all request IDs to the array
      allRequestIds.push(...requestIds);
      return allRequestIds;
    } catch (error) {
      console.error("Failed to process requests:", error);
      throw error;
    }
  };

  const handleBatchPayment = async (recipientList: Array<RecipientType>) => {
    if (!isConnected) {
      alert("Please connect your wallet to proceed!.");
    }

    setLoading(true);

    try {
      console.log("Creating requests in parallel...");

      //using private key to make requests
      const requestIds = await createAllRequestIds(recipientList);
      console.log("All requests created:", requestIds);

      // Process batch payment, using connected wallet
      await processBatchPayments(requestIds, signer);
      console.log("Batch payment processed successfully!");
      alert("payment successfull !!");
    } catch (error) {
      console.error("Error in batch payment process:", error);
      throw error; // Re-throw to be handled by the component
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

          {pageMode === "writingEmail" && (
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
      </div>
    </>
  );
}
