import { Wallet, providers } from "ethers";
import { payBatchConversionProxyRequest } from "@requestnetwork/payment-processor";
import { EnrichedRequest } from "@requestnetwork/payment-processor/dist/types";
import { CurrencyManager } from "@requestnetwork/currency";
import { requestClient } from "./requestClient";

export async function processBatchPayments(
  requestIds: string[],
  signer: any
): Promise<void> {
  // Initialize currency manager
  const currencyManager = CurrencyManager.getDefault();

  // Fetch all requests
  const enrichedRequests = await Promise.all(
    requestIds.map(async (requestId, index) => {
      const request = await requestClient.fromRequestId(requestId);
      const requestData = await request.refresh();

      console.log("request ----- ", index, "------", requestData.extensions);
      return {
        request: requestData,
        paymentSettings: {
          maxToSpend: requestData.expectedAmount,
          currencyManager: currencyManager,
        },
        paymentNetworkId: requestData.extensionsData[0].id,
      };
    })
  );

  console.log(
    "enrichedRequests",
    enrichedRequests.map((enrichedRequest) => enrichedRequest.request)
  );

  // Process the batch payment
  try {
    const tx = await payBatchConversionProxyRequest(enrichedRequests, signer, {
      skipFeeUSDLimit: true,
      conversion: {
        currencyManager: currencyManager,
      },
      version: "0.1.0", // Specify the contract version that is deployed on Sepolia
    });

    console.log("Batch payment transaction hash:", tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log("Batch payment confirmed in block:", receipt.blockNumber);
    console.log("receipt", receipt);
  } catch (error) {
    console.error("Error processing batch payment:", error);
    throw error;
  }
}
