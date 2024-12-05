import { Web3SignatureProvider } from "@requestnetwork/web3-signature";
import { EthereumPrivateKeySignatureProvider } from "@requestnetwork/epk-signature";
import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";

const getRequestClient = (provider: any) => {
  if (!provider) return null;

  const web3SignatureProvider = new Web3SignatureProvider(provider);

  return new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network/",
    },
    signatureProvider: web3SignatureProvider,
  });
};

const delegatePrivateKey = process.env.NEXT_PUBLIC_PAYEE_PRIVATE_KEY!;
const signatureProvider = new EthereumPrivateKeySignatureProvider({
  method: Types.Signature.METHOD.ECDSA,
  privateKey: delegatePrivateKey,
});

export const requestClient = new RequestNetwork({
  signatureProvider,
  nodeConnectionConfig: {
    baseURL: "https://sepolia.gateway.request.network/",
  },
});
