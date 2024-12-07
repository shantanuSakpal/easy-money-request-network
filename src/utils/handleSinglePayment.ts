import {
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import { Wallet, providers } from "ethers";
import { requestClient } from "@/utils/requestClient";

export const handleSinglePayment = async ({
  requestId,
  setLoading,
  setPaymentSuccess,
}: {
  requestId: string;
  setLoading: (status: boolean) => void;
  setPaymentSuccess: (status: boolean) => void;
}) => {
  try {
    setLoading(true);
    const request = await requestClient.fromRequestId(requestId);
    const requestData = request.getData();

    // console.log("request data -----------------", requestData);
    const provider = new providers.JsonRpcProvider(
      "https://endpoints.omniatech.io/v1/eth/sepolia/public"
    );
    const payerWallet = new Wallet(
      process.env.NEXT_PUBLIC_PAYEE_PRIVATE_KEY!, // Must include 0x prefix
      provider
    );
    const payerAddress = payerWallet.address;
    // console.log("payerAddress -------", payerAddress);

    // console.log(
    //   `Checking if payer ${payerWallet.address} has sufficient funds...`
    // );
    const _hasSufficientFunds = await hasSufficientFunds({
      request: requestData,
      address: payerWallet.address,
      providerOptions: { provider: provider },
    });
    // console.log(`_hasSufficientFunds = ${_hasSufficientFunds}`);
    if (!_hasSufficientFunds) {
      throw new Error(`Insufficient Funds: ${payerWallet.address}`);
    }

    const paymentTx = await payRequest(requestData, payerWallet);
    // console.log("payment success", paymentTx);
    setPaymentSuccess(true);
    await paymentTx.wait(2);
    return paymentTx;
  } catch {
    (error: string) => {
      console.log(error);
      throw new Error(error);
    };
  } finally {
    setLoading(false);
  }
};
