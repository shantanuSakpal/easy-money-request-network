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
  const [requestId, setRequestId] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    if (window.ethereum && address) {
      const provider = new providers.Web3Provider(window.ethereum);
      setSigner(provider.getSigner(address));
    }
  }, [address]);

  const employees = [
    {
      name: "Mohammed Mehdi",
      email: "mohdmehdi2003@gmail.com",
      walletAddress: "0x96F00170DA867d5aD7879bc3f4cEdf8f4CDf6926",
      teamName: "Random_state_42",
      amount: 7500,
      address: "Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09",
      city: "New York",
      country: "United States",
      postalCode: 400059,
      notes: "Thank you for taking part in this event",
      status: "pending",
    },
  ];

  const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC address

  const createAllRequestIds = async (employees: Array<RecipientType>) => {
    const allRequestIds: string[] = [];

    try {
      if (!walletClient) {
        throw new Error("Wallet not connected");
      }

      // Create an array of promises for all employee requests
      const requestPromises = employees.map(async (employee) => {
        //using private key to make requests
        const requestId = await handleCreateRequest({
          employee,
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

  const handleBatchPayment = async (employees: Array<RecipientType>) => {
    if (!isConnected) return;
    setLoading(true);

    try {
      console.log("Creating requests in parallel...");

      //using private key to make requests
      const requestIds = await createAllRequestIds(employees);
      console.log("All requests created:", requestIds);

      // Process batch payment, using connected wallet
      await processBatchPayments(requestIds, signer);
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
        {employees.map((employee, index) => (
          <div key={index} className="border p-4 mb-2 rounded ">
            <p className="font-bold">{employee.name}</p>
            <p>Wallet Address: {employee.walletAddress}</p>
            <p>Email: {employee.email}</p>
            <p>Amount: {employee.amount} ETH</p>
            {/* <button
              onClick={async () => {
                if (!isConnected) return;
                await handleCreateRequest({
                  employee,
                });
              }}
              disabled={!isConnected || loading}
              className="p-3 my-3 rounded bg-blue-600 font-bold text-white disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Create request"}
            </button> */}
            {requestId && (
              <div className="p-5">
                <div className="">
                  Request created successfully!
                  <br />
                  <Link
                    target="_blank"
                    href={`https://scan.request.network/request/${requestId}`}
                    className="font-bold text-blue-500"
                  >
                    View Request on request scan
                  </Link>
                </div>
                <button
                  onClick={async () => {
                    if (!isConnected) return;
                    await handleSinglePayment({
                      requestId,
                      setLoading,
                      setPaymentSuccess,
                    });
                  }}
                  disabled={!isConnected || loading}
                  className="p-3 rounded bg-blue-600 font-bold text-white disabled:bg-gray-400"
                >
                  {loading ? "Processing..." : "Make Payment"}
                </button>
              </div>
            )}

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
          handleBatchPayment(employees);
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
                Paid {result.employee.name}: {result.status}
              </p>
              <p className="text-sm">Request ID: {result.requestId}</p>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
