import {
  ethers,
  Signer,
  providers,
  BigNumber,
  BigNumberish,
  ContractTransaction,
} from "ethers";
import {
  ClientTypes,
  CurrencyTypes,
  ExtensionTypes,
  RequestLogicTypes,
} from "@requestnetwork/types";
import { EvmChains } from "@requestnetwork/currency";
import { ERC20__factory } from "@requestnetwork/smart-contracts/types";
import { getNetworkProvider } from "./getNetworkProvider";
import {
  Erc20PaymentNetwork,
  getPaymentNetworkExtension,
} from "@requestnetwork/payment-detection";

export const getProxyNetwork = (
  pn: ExtensionTypes.IState,
  currency: RequestLogicTypes.ICurrency
): string => {
  if (pn.values.network) {
    return pn.values.network;
  }
  if (currency.network) {
    return currency.network;
  }
  throw new Error("Payment currency must have a network");
};

export function getPnAndNetwork(request: ClientTypes.IRequestData): {
  paymentNetwork: ExtensionTypes.IState<any>;
  network: string;
} {
  const pn = getPaymentNetworkExtension(request);
  if (!pn) {
    throw new Error("PaymentNetwork not found");
  }
  return {
    paymentNetwork: pn,
    network: getProxyNetwork(pn, request.currencyInfo),
  };
}

export const genericGetProxyAddress = (
  request: ClientTypes.IRequestData,
  getDeploymentInformation: (
    network: CurrencyTypes.EvmChainName,
    version: string
  ) => { address: string } | null,
  version?: string
): string => {
  const { paymentNetwork, network } = getPnAndNetwork(request);
  EvmChains.assertChainSupported(network);
  const deploymentInfo = getDeploymentInformation(
    network,
    version || paymentNetwork.version
  );
  if (!deploymentInfo) {
    throw new Error(
      `No deployment found for network ${network}, version ${
        version || paymentNetwork.version
      }`
    );
  }
  return deploymentInfo.address;
};

function getProxyAddress(request: ClientTypes.IRequestData): string {
  const pn = getPaymentNetworkExtension(request);
  const id = pn?.id;
  if (id === ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_ADDRESS_BASED) {
    throw new Error(
      `ERC20 address based payment network doesn't need approval`
    );
  }

  if (id === ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_PROXY_CONTRACT) {
    return genericGetProxyAddress(
      request,
      Erc20PaymentNetwork.ERC20ProxyPaymentDetector.getDeploymentInformation
    );
  }
  if (id === ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT) {
    return genericGetProxyAddress(
      request,
      Erc20PaymentNetwork.ERC20FeeProxyPaymentDetector.getDeploymentInformation
    );
  }
  if (id === ExtensionTypes.PAYMENT_NETWORK_ID.ERC20_TRANSFERABLE_RECEIVABLE) {
    return genericGetProxyAddress(
      request,
      Erc20PaymentNetwork.ERC20TransferableReceivablePaymentDetector
        .getDeploymentInformation
    );
  }

  throw new Error(`Unsupported payment network: ${id}`);
}

export async function getErc20Allowance(
  ownerAddress: string,
  spenderAddress: string,
  signerOrProvider: providers.Provider | Signer,
  tokenAddress: string
): Promise<BigNumber> {
  const erc20Contract = ERC20__factory.connect(tokenAddress, signerOrProvider);
  return await erc20Contract.allowance(ownerAddress, spenderAddress);
}

export async function checkErc20Allowance(
  ownerAddress: string,
  spenderAddress: string,
  signerOrProvider: providers.Provider | Signer,
  tokenAddress: string,
  amount: BigNumberish
): Promise<boolean> {
  const allowance = await getErc20Allowance(
    ownerAddress,
    spenderAddress,
    signerOrProvider,
    tokenAddress
  );
  return allowance.gte(amount);
}

export async function hasErc20ApprovalForBatchPayments(
  requests: Array<ClientTypes.IRequestData>,
  account: string,
  signerOrProvider: providers.Provider | Signer = getNetworkProvider(
    requests[0]
  )
): Promise<boolean> {
  let sum = 0;
  for (let i = 0; i < requests.length; i++) {
    const request = requests[i];
    sum = sum + Number(request.expectedAmount);
  }

  return checkErc20Allowance(
    account,
    getProxyAddress(requests[0]),
    signerOrProvider,
    requests[0].currencyInfo.value,
    sum
  );
}
