import {
  ContractTransaction,
  Signer,
  BigNumber,
  BigNumberish,
  providers,
} from "ethers";

import {
  ClientTypes,
  CurrencyTypes,
  ExtensionTypes,
  TypesUtils,
} from "@requestnetwork/types";

import { RequestLogicTypes } from "@requestnetwork/types";
import { WalletConnection } from "near-api-js";
import { isSolvent } from "@requestnetwork/payment-processor";

export const noConversionNetworks = [
  ExtensionTypes.PAYMENT_NETWORK_ID.ERC777_STREAM,
  ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT,
  ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
  ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE,
  ExtensionTypes.PAYMENT_NETWORK_ID.ETH_INPUT_DATA,
  ExtensionTypes.PAYMENT_NETWORK_ID.NATIVE_TOKEN,
  ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT,
];

export interface IConversionPaymentSettings {
  currency?: RequestLogicTypes.ICurrency;
  maxToSpend: BigNumberish;
  currencyManager?: CurrencyTypes.ICurrencyManager;
}

const getPaymentNetwork = (
  request: ClientTypes.IRequestData
): ExtensionTypes.PAYMENT_NETWORK_ID | undefined => {
  // eslint-disable-next-line
  const id = Object.values(request.extensions).find(
    (x) => x.type === "payment-network"
  )?.id;
  if (TypesUtils.isPaymentNetworkId(id)) {
    return id;
  }
};

/**
 * Error thrown when the network is not supported.
 */
export class UnsupportedNetworkError extends Error {
  constructor(public networkName?: string) {
    super(`Payment network ${networkName} is not supported`);
  }
}

/**
 * Error thrown when the payment currency network is not supported.
 */
export class UnsupportedPaymentChain extends Error {
  constructor(public currencyNetworkName?: string) {
    super(`Payment currency network ${currencyNetworkName} is not supported`);
  }
}

/**
 * Verifies the address has enough funds to pay all the  requests in batch in its currency.
 * Only supports networks with no (on-chain) conversion.
 *
 * @throws UnsupportedNetworkError if network isn't supported
 * @param request the request to verify.
 * @param address the address holding the funds
 * @param providerOptions.provider the Web3 provider. Defaults to getDefaultProvider.
 * @param providerOptions.nearWalletConnection the Near WalletConnection
 */
export async function hasSufficientFundsForBatchPayments({
  requests,
  address,
  providerOptions,
  needsGas = true,
}: {
  requests: Array<ClientTypes.IRequestData>; //taking many requests together
  address: string;
  providerOptions?: {
    provider?: providers.Provider;
    nearWalletConnection?: WalletConnection;
  };
  needsGas?: boolean;
}): Promise<boolean> {
  //calculating the total pending amount
  let sum = 0;
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    sum = sum + Number(request.expectedAmount);
  }

  //to-do: need to check if all requests have same payment network
  //to-do : need to add support for NEAR
  const paymentNetwork = getPaymentNetwork(requests[0]);
  if (!paymentNetwork || !noConversionNetworks.includes(paymentNetwork)) {
    throw new UnsupportedNetworkError(paymentNetwork);
  }

  let totalFeeAmount = 0;
  if (
    paymentNetwork ===
      ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT ||
    paymentNetwork === ExtensionTypes.PAYMENT_NETWORK_ID.ETH_FEE_PROXY_CONTRACT
  ) {
    //calculate the total fee required for all requests
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      let feeAmountForThisRequest =
        request.extensions[paymentNetwork].values.feeAmount || 0;
      totalFeeAmount = totalFeeAmount + Number(feeAmountForThisRequest);
    }
  }

  //need to check if all requests have same currenryInfo
  return isSolvent({
    fromAddress: address,
    currency: requests[0].currencyInfo,
    amount: BigNumber.from(sum).add(totalFeeAmount),
    providerOptions,
    needsGas,
  });
}
