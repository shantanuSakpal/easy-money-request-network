"use client";

import { useState } from "react";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect } from "react";
import { BiLoader } from "react-icons/bi";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import TaxComponent from "@/components/Cards/Taxcomponent";
import { FaCopy, FaPaperPlane, FaTimes } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import Chat from "@/components/chat/chat";
import { currencies } from "@/utils/currency";
import { requestClient } from "@/utils/requestClient";

export default function Home() {
  const { address } = useAccount();
  const userAddress: `0x${string}` = address!;
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] =
    useState<(Types.IRequestDataWithEvents | undefined)[]>();

  // New state for chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [relevantDataGPT, setRelevantDataGPT] = useState<any[] | null>(null);

  const fetchRequests = async () => {
    console.log("getting requests for ------ ", address);
    setLoading(true);

    try {
      const fetchedRequests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: userAddress,
      });

      console.log("fetched", fetchedRequests);

      const requestData = await Promise.all(
        fetchedRequests.map((request) => request.getData())
      );

      const relevantData = requestData.map((request) =>
        extractRelevantData(request)
      );

      setRequests(requestData);
      setRelevantDataGPT(relevantData);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractRelevantData = (request: Types.IRequestDataWithEvents) => ({
    requestId: request.requestId,
    currency: request.currencyInfo.type,
    network: request.currencyInfo.network,
    expectedAmount: formatUnits(request.expectedAmount, "ether"), // Assuming it's in wei
    state: request.state,
    reason: request.contentData?.reason || "No reason provided",
    dueDate: request.contentData?.dueDate || "No due date",
    payee: request.payee.value,
    payer: request.payer.value,
    paymentAddress:
      request.extensions["pn-eth-fee-proxy-contract"]?.values.paymentAddress ||
      "N/A",
    feeAddress:
      request.extensions["pn-eth-fee-proxy-contract"]?.values.feeAddress ||
      "N/A",
  });

  useEffect(() => {
    if (address) fetchRequests();
  }, [address]);

  // Function to get unique payers
  const getUniquePayers = () => {
    const payerSet = new Set(requests?.map((req) => req?.payer?.value));
    return Array.from(payerSet);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Address copied!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    });
  };

  // Toggle chat modal
  const toggleChatModal = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="relative">
      <Toaster position="bottom-right" />
      {address ? (
        loading ? (
          <div className="h-screen flex flex-row gap-3 justify-center items-center">
            <BiLoader />
            <p className="text-xl">Fetching data...</p>
          </div>
        ) : (
          <div className="p-5 mx-24 ">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold m-4">Dashboard</h1>
              <Button
                onClick={toggleChatModal}
                color={isChatOpen ? "default" : "primary"}
              >
                {isChatOpen ? "Close EasyFinance AI" : "Try EasyFinance AI"}
                {isChatOpen ? <FaTimes /> : <FaPaperPlane />}
              </Button>
            </div>

            <div className="min-w-screen">
              <TaxComponent jsonData={requests} />
            </div>
            <div className="flex space-x-4 min-w-full">
              <div className="w-3/4">
                <table className="min-h-[50%] min-w-full bg-white rounded-lg overflow-hidden shadow-lg text-base">
                  <thead className="bg-gray-100">
                    <tr>
                      {[
                        "Request ID",
                        "Payer",
                        "Currency",
                        "Amount",
                        "Reason",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests?.map((request, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {request?.requestId.slice(0, 4)}...
                          {request?.requestId.slice(62, 66)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {request?.payer?.value.slice(0, 5)}...
                          {request?.payer?.value.slice(39, 42)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getSymbol(
                            request!.currencyInfo.network!,
                            request!.currencyInfo.value
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatUnits(
                            BigInt(request?.expectedAmount as number),
                            getDecimals(
                              request!.currencyInfo.network!,
                              request!.currencyInfo.value
                            ) || 18
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request?.contentData.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-1/4">
                <Card className="h-full">
                  <CardBody>
                    <h2 className="text-xl font-semibold mb-4">
                      Unique Payer Addresses
                    </h2>
                    <div className="space-y-2 overflow-y-auto max-h-96">
                      {getUniquePayers().map((payer, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-3 rounded-lg text-sm flex justify-between items-center"
                        >
                          <span>
                            {payer?.slice(0, 6)}...{payer?.slice(-4)}
                          </span>
                          <FaCopy
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => copyToClipboard(payer!)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="h-screen flex justify-center items-center">
          <p className="text-2xl">Please connect wallet</p>
        </div>
      )}

      {/* Chat Modal */}
      <Modal
        isOpen={isChatOpen}
        onOpenChange={toggleChatModal}
        placement="right"
        size="lg"
        backdrop="blur"
        className="h-[90%]"
        classNames={{
          base: "h-full rounded-xl min-w-[65%]  rounded-none",
          wrapper: "items-stretch",
          backdrop: "bg-black/50",
        }}
      >
        <ModalContent className="rounded-2xl rounded">
          {(onClose) => (
            <>
              <ModalBody>
                <div className="pb-12 rounded-xl overflow">
                  <Chat relevantData={relevantDataGPT} />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

const getSymbol = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.symbol;
};

const getDecimals = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.decimals;
};
