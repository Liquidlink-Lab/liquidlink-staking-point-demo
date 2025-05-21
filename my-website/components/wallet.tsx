'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WalletIcon, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

import {
  ConnectButton,
  useCurrentWallet,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@iota/dapp-kit';

export function Wallet() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const { toast } = useToast();

  const connectWallet = () => {
    // Simulate wallet connection
    setConnected(true);
    setAddress('iot1...' + Math.random().toString(36).substring(2, 8));
    setBalance(Math.floor(Math.random() * 10000) + 1000);
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    setBalance(0);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: 'Address copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  return (
    <header className="bg-black/80 backdrop-blur-md border-b border-gray-800 py-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] flex items-center justify-center mr-2">
            <WalletIcon className="h-5 w-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white">
            Liquid <span className="text-[#00e0c6]">DeFi</span>
          </span>
        </div>

        {connected ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-gray-900 rounded-full py-1.5 px-3 border border-gray-800">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">{address}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
                >
                  <span className="mr-2">{balance.toLocaleString()} IOTA</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-gray-200">
                <DropdownMenuLabel>Wallet</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="hover:bg-gray-800 cursor-pointer"
                  onClick={copyAddress}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View on Explorer</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="hover:bg-gray-800 cursor-pointer text-red-400"
                  onClick={disconnectWallet}
                >
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div
            className="bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
            // onClick={connectWallet}
          >
            <ConnectButton />
          </div>
        )}
      </div>
    </header>
  );
}
