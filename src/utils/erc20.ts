import { BigNumberish, providers } from "ethers";
import { ERC20__factory } from "@requestnetwork/smart-contracts/types";

export async function getAnyErc20Balance(
  anyErc20Address: string,
  address: string,
  provider: providers.Provider
): Promise<BigNumberish> {
  const erc20Contract = ERC20__factory.connect(anyErc20Address, provider);
  return erc20Contract.balanceOf(address);
}
