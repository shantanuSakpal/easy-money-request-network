"use client";
import { currencies } from "@/utils/currency";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

// EDIT THIS TO SELECT THE USER'S ADDRESS

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
      const requests = await requestClient.fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: userAddress,
      });
      console.log(requests[0]);

      setRequests(requests.map((request) => request.getData()));
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) fetchRequests();
  }, [address]);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold m-2 text-center">Your transactions </h1>

      {address ? (
        loading ? (
          <div className="h-64 flex flex-row gap-3 justify-center items-center">
            <BiLoader />
            <p> Fetching data... </p>
          </div>
        ) : (
          <div>
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Timestamp
                  </th>
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
                    Expected Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests?.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request?.timestamp}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request?.contentData.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              {calculateStatus(request?.state as string, 
                BigInt(request?.expectedAmount as number), 
                BigInt(request?.balance?.balance || 0)) === 'Paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'}"
                      >
                        {calculateStatus(
                          request?.state as string,
                          BigInt(request?.expectedAmount as number),
                          BigInt(request?.balance?.balance || 0)
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatUnits(
                        BigInt(request?.balance?.balance || 0),
                        getDecimals(
                          request!.currencyInfo.network!,
                          request!.currencyInfo.value
                        ) || 18
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="h-40 flex justify-center items-center">
          <p>Please connect wallet</p>
        </div>
      )}
    </div>
  );
}

const calculateStatus = (
  state: string,
  expectedAmount: bigint,
  balance: bigint
) => {
  if (balance >= expectedAmount) {
    return "Paid";
  }
  if (state === Types.RequestLogic.STATE.ACCEPTED) {
    return "Accepted";
  } else if (state === Types.RequestLogic.STATE.CANCELED) {
    return "Canceled";
  } else if (state === Types.RequestLogic.STATE.CREATED) {
    return "Created";
  } else if (state === Types.RequestLogic.STATE.PENDING) {
    return "Pending";
  }
};

const getSymbol = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.symbol;
};

const getDecimals = (network: string, value: string) => {
  return currencies.get(network.concat("_", value))?.decimals;
};
