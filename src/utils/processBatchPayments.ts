import { Wallet, providers } from "ethers";
import { payBatchConversionProxyRequest } from "@requestnetwork/payment-processor";
import { EnrichedRequest } from "@requestnetwork/payment-processor/dist/types";
import { CurrencyManager } from "@requestnetwork/currency";
import { requestClient } from "./requestClient";
import { hasSufficientFundsForBatchPayments } from "./hasSufficientFundsForBatchPayments";

export async function processBatchPayments(
  requestIds: string[],
  provider: any,
  signer: any,
  payerAddress: `0x${string}`
): Promise<void> {
  // Process the batch payment
  try {
    // Initialize currency manager
    const currencyManager = CurrencyManager.getDefault();
    // Fetch all requests
    const enrichedRequests = await Promise.all(
      requestIds.map(async (requestId, index) => {
        const request = await requestClient.fromRequestId(requestId);
        const requestData = await request.refresh();

        console.log("request payer address ----- ", payerAddress);
        return {
          request: requestData,
          paymentSettings: {
            maxToSpend: requestData.expectedAmount,
            currencyManager: currencyManager,
          },
          paymentNetworkId: requestData.extensionsData[0].id,
          amount: requestData.expectedAmount,
        };
      })
    );

    const requests = enrichedRequests.map(
      (enrichedRequest) => enrichedRequest.request
    );

    console.log(
      "enrichedRequests",
      enrichedRequests.map((enrichedRequest) => enrichedRequest.request)
    );

    //calculate the sum of all requests amount
    let sum = 0;
    for (let i = 0; i < enrichedRequests.length; i++) {
      const enrichedRequest = enrichedRequests[i];
      sum = sum + Number(enrichedRequest.amount);
    }

    console.log("requests sum", sum);
    const _hasSufficientFunds = await hasSufficientFundsForBatchPayments({
      requests: requests,
      address: payerAddress,
      providerOptions: { provider: provider },
    });

    console.log(" has sufficiant funds? -----", _hasSufficientFunds);
    if (!_hasSufficientFunds) {
      alert("Insufficient funds");
      throw new Error("insufficient funds");
    }

    // const tx = await payBatchConversionProxyRequest(enrichedRequests, signer, {
    //   skipFeeUSDLimit: true,
    //   conversion: {
    //     currencyManager: currencyManager,
    //   },
    //   version: "0.1.0", // Specify the contract version that is deployed on Sepolia
    // });
    // console.log("Batch payment transaction hash:", tx.hash);
    // // Wait for transaction confirmation
    // const receipt = await tx.wait();
    // console.log("Batch payment confirmed in block:", receipt.blockNumber);
    // console.log("receipt", receipt);
  } catch (error) {
    console.error("Error processing batch payment:", error);
    throw error;
  }
}
