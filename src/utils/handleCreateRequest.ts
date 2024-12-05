import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { parseEther } from "ethers/lib/utils";
import { RecipientType } from "@/types/recipientList";
import { requestClient } from "./requestClient";
import { Wallet } from "ethers";

export const handleCreateRequest = async ({
  recipient,
  payerWalletAddress,
}: {
  recipient: RecipientType;
  payerWalletAddress: `0x${string}`;
}) => {
  const payeeIdentity = new Wallet(process.env.NEXT_PUBLIC_PAYEE_PRIVATE_KEY!)
    .address; //payee is the one creating the request, so he need to sign it

  const payerIdentity = payerWalletAddress; //payer pays the money, we can get data from reqeust scan using this address.
  const paymentRecipient = recipient.walletAddress; //which address recieve the payment, we can get data from reqeust scan using this address.
  const feeRecipient = "0x0000000000000000000000000000000000000000";

  console.log("payee ident", payeeIdentity);
  console.log("payerIdentity", payerIdentity);
  console.log("paymentRecipient", paymentRecipient);

  const requestCreateParameters = {
    requestInfo: {
      // The currency in which the request is denominated
      currency: {
        type: Types.RequestLogic.CURRENCY.ETH,
        network: "sepolia",
      },

      // The expected amount as a string, in parsed units, respecting `decimals`
      // Consider using `parseUnits()` from ethers or viem
      expectedAmount: parseEther(recipient.amount.toString()).toString(),

      // The payee identity. Not necessarily the same as the payment recipient.
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },

      // The payer identity. If omitted, any identity can pay the request.
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },

      // The request creation timestamp.
      timestamp: Utils.getCurrentTimestampInSecond(),
    },

    // The paymentNetwork is the method of payment and related details.
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: "sepolia",
        paymentAddress: paymentRecipient,
        feeAddress: feeRecipient,
        feeAmount: "0",
      },
    },

    // The contentData can contain anything.
    // Consider using rnf_invoice format from @requestnetwork/data-format
    contentData: {
      reason: "🍕",
      dueDate: "2023.06.16",
    },

    // The identity that signs the request, either payee or payer identity.
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };

  const request = await requestClient.createRequest(requestCreateParameters);
  const confirmedRequestData = await request.waitForConfirmation();
  // setRequestId(confirmedRequestData.requestId);
  console.log(
    "request id of request -  ----------------",
    recipient.email,
    " is ",
    confirmedRequestData.requestId
  );
  return confirmedRequestData.requestId;
};
