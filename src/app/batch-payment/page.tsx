"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import Link from "next/link";
import { RecipientType } from "@/types/recipientList";
import { handleCreateRequest } from "@/utils/handleCreateRequest";
import { handleSinglePayment } from "@/utils/handleSinglePayment";
import { processBatchPayments } from "@/utils/processBatchPayments";
import { providers } from "ethers";

export default function Page() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [requestIds, setRequestIds] = useState<Array<string>>([
    "0136f971f60c265e30639d125237a294f026616f90dad23a8eadfefa88b265b055",
  ]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  useEffect(() => {
    if (window.ethereum && address) {
      const provider = new providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner(address));
      setProvider(provider);
    }
  }, [address]);

  // Sample test data

  const testRecipient1 = {
    id: "rec_123",
    name: "Tech Solutions Inc.",
    businessName: "Tech Solutions Inc.",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@techsolutions.com",
    streetAddress: "123 Innovation Drive",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
    description: "Software Development Services",
    amount: "0.001", // 1.5 ETH
    walletAddress:
      "0x96F00170DA867d5aD7879bc3f4cEdf8f4CDf6926" as `0x${string}`,
    phone: "+1 (555) 123-4567",
    taxRegistration: "US123456789",
  };

  const recipientList = [testRecipient1];

  const payer = {
    businessName: "Global Enterprises LLC",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@globalenterprises.com",
    streetAddress: "456 Corporate Boulevard",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    phone: "+1 (555) 987-6543",
    taxRegistration: "US987654321",
  };

  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC address

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
          payer,
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
    if (!isConnected) return;
    setLoading(true);

    try {
      // console.log("Creating requests in parallel...");/
      // using private key to make requests
      const requestIds = await createAllRequestIds(recipientList);
      console.log("All requests created:", requestIds);
      setRequestIds(requestIds);

      // Process batch payment, using connected wallet
      // if (!address) {
      //   throw new Error("Wallet not connected");
      // }
      // await processBatchPayments(requestIds, provider, signer, address);
    } catch (error) {
      console.error("Error in batch payment process:", error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Batch RecipientType Payment</h1>

      <ConnectButton />

      <div className="mt-6">
        {recipientList.map((recipient, index) => (
          <div key={index} className="border p-4 mb-2 rounded ">
            <p className="font-bold">{recipient.name}</p>
            <p>Wallet Address: {recipient.walletAddress}</p>
            <p>Email: {recipient.email}</p>
            <p>Amount: {recipient.amount} eth</p>
            {/* <button
              onClick={async () => {
                if (!isConnected) return;
                await handleCreateRequest({
                  recipient,
                });
              }}
              disabled={!isConnected || loading}
              className="p-3 my-3 rounded bg-blue-600 font-bold text-white disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Create request"}
            </button> */}
            {requestIds.length > 0 &&
              requestIds.map((requestId, index) => {
                return (
                  <div>
                    <Link
                      className="text-blue-600 underline "
                      target="_blank"
                      href={`https://scan.request.network/request/${requestId}`}
                    >
                      view on request scan
                    </Link>
                  </div>
                );
              })}

            {paymentSuccess && (
              <div className="font-bold p-5 text-lg text-green-500">
                Payment successfull !!
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          handleBatchPayment(recipientList);
        }}
        disabled={!isConnected || loading}
        className="p-3 rounded bg-blue-600 font-bold text-white disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Make batch Payment"}
      </button>

      {/* {status.results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Payment Results:</h2>
          {status.results.map((result, index) => (
            <div key={index} className="mt-2">
              <p>
                Paid {result.recipient.name}: {result.status}
              </p>
              <p className="text-sm">Request ID: {result.requestId}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
