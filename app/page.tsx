'use client';
import '@iota/dapp-kit/dist/index.css';
import { Wallet } from '@/components/wallet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from '@/components/dashboard';
import { Actions } from '@/components/actions';
import { Footer } from '@/components/footer';
import { createNetworkConfig, IotaClientProvider } from '@iota/dapp-kit';
import { getFullnodeUrl } from '@iota/iota-sdk/client';
// import { NetworkStatus } from "@/components/network-status"
import dynamic from 'next/dynamic';

const WalletProvider = dynamic(
  () => import('@iota/dapp-kit').then((mod) => mod.WalletProvider),
  {
    ssr: false,
  },
);

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <Insite />
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  );
}

function Insite() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-black opacity-50 z-0"></div>
      <div className="relative z-10">
        <Wallet />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="py-8">
            <h1 className="text-4xl font-bold text-center mb-2 text-white">
              Liquid <span className="text-[#00e0c6]">DeFi</span> Protocol
            </h1>
            <p className="text-center text-gray-400 mb-8">
              LiquidLink points system Staking demo
            </p>
            {/* <NetworkStatus /> */}
            <Dashboard />
            <Actions />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
