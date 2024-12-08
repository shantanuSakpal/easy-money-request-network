"use client";

import { currencies } from "@/utils/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { Card, CardBody } from "@nextui-org/react";
import TaxComponent from "@/components/Cards/Taxcomponent";
import { FaCopy , FaPaperPlane} from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import { Button } from "@nextui-org/react";


export default function Home() {
  const { address } = useAccount();
  const userAddress: `0x${string}` = address!;
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] =
    useState<(Types.IRequestDataWithEvents | undefined)[]>();

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

      setRequests(requestData);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchRequests();
  }, [address]);

  // Function to get unique payers
  const getUniquePayers = () => {
    const payerSet = new Set(requests?.map(req => req?.payer?.value));
    return Array.from(payerSet);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Address copied!', {
        style: {
          background: '#333',
          color: '#fff',
        }
      });
    });
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      {address ? (
        loading ? (
          <div className="h-screen flex flex-row gap-3 justify-center items-center">
            <BiLoader />
            <p className="text-xl">Fetching data...</p>
          </div>
        ) : (
          <div className="p-5 mx-24 h-screen">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold m-4">Dashboard</h1>
              <Button onClick={() => {}}>
    <a href="/dashboard/tax-gpt">Try TaxGPT</a>
    <FaPaperPlane />
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
                      {["Request ID", "Payer", "Currency", "Amount", "Reason"].map((header, index) => (
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
                    <h2 className="text-xl font-semibold mb-4">Unique Payer Addresses</h2>
                    <div className="space-y-2 overflow-y-auto max-h-96">
                      {getUniquePayers().map((payer, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-3 rounded-lg text-sm flex justify-between items-center"
                        >
                          <span>{payer?.slice(0, 6)}...{payer?.slice(-4)}</span>
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
    </div>
  );
}

const getSymbol = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.symbol;
};

const getDecimals = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.decimals;
};