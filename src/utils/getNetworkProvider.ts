import {
  getDefaultProvider,
  getPaymentReference,
} from "@requestnetwork/payment-detection";
import { ClientTypes, ExtensionTypes } from "@requestnetwork/types";
import { providers } from "ethers";

export function getNetworkProvider(
  request: ClientTypes.IRequestData
): providers.Provider {
  return getDefaultProvider(request.currencyInfo.network);
}
