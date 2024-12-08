"use client";

import { currencies } from "@/utils/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import TaxComponent from "@/components/Cards/Taxcomponent";

export default function Home() {
  const { address } = useAccount();
  const userAddress: `0x${string}` = address!;
  const [loading, setLoading] = useState(false);
  const [relevantDataGPT, setRelevantDataGPT] = useState<any>();

  const [requests, setRequests] =
    useState<(Types.IRequestDataWithEvents | undefined)[]>(); // For table display

  const fetchRequests = async () => {
    console.log("getting requests");
    setLoading(true);

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://sepolia.gateway.request.network/",
      },
    });

    try {
      const fetchedRequests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: userAddress,
      });

      const requestData = await Promise.all(
        fetchedRequests.map((request) => request.getData())
      );

      const relevantData = requestData.map((request) =>
        extractRelevantData(request)
      );

      setRequests(requestData); // All requests for the table
      setRelevantDataGPT(relevantData); // Data for GPT analysis
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

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold m-2 text-center">Your Transactions</h1>

      {address ? (
        loading ? (
          <div className="h-64 flex flex-row gap-3 justify-center items-center">
            <BiLoader />
            <p>Fetching data...</p>
          </div>
        ) : (
          <>
            {/* Transaction Table */}
            <div className="px-20 min-h-screen">
              <TaxComponent jsonData={relevantDataGPT} />
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Payer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Reason
                    </th>
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

            {/* TaxComponent for GPT analysis */}
          </>
        )
      ) : (
        <div className="h-40 flex justify-center items-center">
          <p>Please connect wallet</p>
        </div>
      )}
    </div>
  );
}

const getSymbol = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.symbol;
};

const getDecimals = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.decimals;
};
