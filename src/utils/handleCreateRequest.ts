import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { parseEther } from "ethers/lib/utils";
import { requestClient } from "./requestClient";
import { Wallet } from "ethers";
import { Invoice } from "@requestnetwork/data-format";
import { PayerType, RecipientType } from "@/types/actors";
export const handleCreateRequest = async ({
  recipient,
  payerDetails,
  payerWalletAddress,
}: {
  recipient: RecipientType;
  payerDetails: PayerType;
  payerWalletAddress: `0x${string}`;
}) => {
  const payeeIdentity = new Wallet(process.env.NEXT_PUBLIC_PAYEE_PRIVATE_KEY!)
    .address;
  const payerIdentity = payerWalletAddress;
  const paymentRecipient = recipient.walletAddress;
  const feeRecipient = "0x0000000000000000000000000000000000000000";

  // Create an invoice following the rnf_invoice format
  const invoice: Invoice = {
    meta: {
      format: "rnf_invoice",
      version: "0.0.3",
    },
    creationDate: new Date().toISOString(),
    invoiceNumber: payerDetails.invoiceNumber,
    sellerInfo: {
      businessName: recipient?.businessName || recipient?.name,
      firstName: recipient?.firstName,
      lastName: recipient?.lastName,
      email: recipient?.email,
      address: {
        "street-address": recipient?.streetAddress,
        locality: recipient?.city,
        region: recipient?.state,
        "postal-code": recipient?.postalCode,
        "country-name": recipient?.country,
      },
    },
    buyerInfo: {
      businessName: payerDetails?.businessName,
      firstName: payerDetails?.firstName,
      lastName: payerDetails?.lastName,
      email: payerDetails?.email,
      address: {
        "street-address": payerDetails?.streetAddress,
        locality: payerDetails?.city,
        region: payerDetails?.state,
        "postal-code": payerDetails?.postalCode,
        "country-name": payerDetails?.country,
      },
    },
    invoiceItems: [
      {
        name: recipient?.description || "Service Payment",
        quantity: 1,
        unitPrice: "0",
        currency: "ETH",
        tax: {
          type: "percentage",
          amount: "0",
        },
      },
    ],
    paymentTerms: {
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  const requestCreateParameters = {
    requestInfo: {
      currency: {
        type: Types.RequestLogic.CURRENCY.ETH,
        network: "sepolia",
      },
      expectedAmount: parseEther(recipient.amount.toString()).toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity,
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity,
      },
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: "sepolia",
        paymentAddress: paymentRecipient,
        feeAddress: feeRecipient,
        feeAmount: "0",
      },
    },
    contentData: invoice,
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity,
    },
  };

  const request = await requestClient.createRequest(requestCreateParameters);
  const confirmedRequestData = await request.waitForConfirmation();
  console.log(
    "request id of request -  ----------------",
    recipient.email,
    " is ",
    confirmedRequestData
  );

  return confirmedRequestData.requestId;
};
