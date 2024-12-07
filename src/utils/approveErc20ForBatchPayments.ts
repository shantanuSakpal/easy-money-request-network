import {
  ContractTransaction,
  Signer,
  BigNumber,
  BigNumberish,
  providers,
} from "ethers";
import { ClientTypes, ExtensionTypes } from "@requestnetwork/types";
import {
  approveErc20Batch,
  prepareApproveErc20,
} from "@requestnetwork/payment-processor";
import {
  getProvider,
  getSigner,
  MAX_ALLOWANCE,
} from "@requestnetwork/payment-processor/dist/payment/utils";
import { ITransactionOverrides } from "@requestnetwork/payment-processor/dist/payment/transaction-overrides";

export async function approveErc20ForBatchPayments(
  request: ClientTypes.IRequestData,
  signerOrProvider: providers.Provider | Signer = getProvider(),
  overrides?: ITransactionOverrides,
  amount: BigNumber = MAX_ALLOWANCE
): Promise<ContractTransaction> {
  const preparedTx = prepareApproveErc20(
    request,
    signerOrProvider,
    overrides,
    amount
  );
  const signer = getSigner(signerOrProvider);
  const tx = await signer.sendTransaction(preparedTx);
  return tx;
}
