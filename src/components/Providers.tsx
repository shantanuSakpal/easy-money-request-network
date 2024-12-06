"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmiConfig";
import { EmailProvider } from '@/context/emailContext';
const queryClient = new QueryClient();

function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <EmailProvider>
          <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
        </EmailProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}


export default Providers;
