'use client';

import { useState } from 'react';
import { useIotaClient, useSignAndExecuteTransaction } from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_CLOCK_OBJECT_ID } from '@iota/iota-sdk/utils';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  Gift,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';

const PACKAGE_ID =
  '0xe87fadb56ac565aa46d60c1f5fa30b22eb10b6ea0763da70d9eb75adb75fd0b3';
const ACTION = 'stake';
const LOCK_PERIOD = 0;
const TREASURY_CAP_OBJECT_ID =
  '0x91e82a7b9b2b5dfb0993eb01604d9172dc93c809850ca8b470fcd488feaea0b3';
const VAULT_OBJECT_ID =
  '0x7e8e05366388d163257d7d7427293db6795284f5e961cb6244c7273bb28ee652';

export function Actions() {
  const [stakingAmount, setStakingAmount] = useState('');
  const [lendingAmount, setLendingAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [lockPeriod, setLockPeriod] = useState(30);
  const { toast } = useToast();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleStake = async () => {
    if (
      !stakingAmount ||
      isNaN(Number(stakingAmount)) ||
      Number(stakingAmount) <= 0
    ) {
      toast({
        title: 'Error',
        description: 'Please enter a valid staking amount',
        variant: 'destructive',
      });
      return;
    }

    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [stakingAmount]);
    tx.moveCall({
      target: `${PACKAGE_ID}::core::stake`,
      arguments: [
        tx.pure.string(ACTION),
        coin,
        tx.pure.u64(LOCK_PERIOD),
        tx.object(IOTA_CLOCK_OBJECT_ID),
        tx.object(TREASURY_CAP_OBJECT_ID),
        tx.object(VAULT_OBJECT_ID),
      ],
    });

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: 'iota:testnet',
      },
      {
        onSuccess: (result) => {
          console.log('executed transaction', result);
          toast({
            title: 'Staking Successful',
            description: `You have successfully staked ${stakingAmount} IOTA`,
          });
          setStakingAmount('');
        },

        onError: (error) => {
          console.error('error', error);
          toast({
            title: 'Staking Failed',
            description: `You have failed to stake ${stakingAmount} IOTA`,
            variant: 'destructive',
          });
        },
      },
    );
  };

  const handleLend = () => {
    if (
      !lendingAmount ||
      isNaN(Number(lendingAmount)) ||
      Number(lendingAmount) <= 0
    ) {
      toast({
        title: 'Error',
        description: 'Please enter a valid lending amount',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Lending Successful',
      description: `You have successfully lent ${lendingAmount} IOTA`,
    });
    setLendingAmount('');
  };

  const handleWithdraw = () => {
    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0
    ) {
      toast({
        title: 'Error',
        description: 'Please enter a valid withdrawal amount',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Withdrawal Successful',
      description: `You have successfully withdrawn ${withdrawAmount} IOTA`,
    });
    setWithdrawAmount('');
  };

  const handleFreeTokenClaim = () => {
    toast({
      title: 'Free Token Claim',
      description: 'You have successfully claimed 5 IOTA tokens!',
    });
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
        <Zap className="mr-2 h-5 w-5 text-[#00e0c6]" />
        DeFi Actions
      </h2>

      <Tabs defaultValue="stake" className="w-full max-w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-gray-900 w-full">
          <TabsTrigger
            value="stake"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#00e0c6]"
          >
            Stake
          </TabsTrigger>
          {/* <TabsTrigger value="lend" className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#00e0c6]">
            Lend
          </TabsTrigger> */}
          <TabsTrigger
            value="withdraw"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#00e0c6]"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stake">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="mr-2 h-5 w-5 text-[#00e0c6]" />
                Stake IOTA
              </CardTitle>
              <CardDescription className="text-gray-400">
                Stake your IOTA tokens to earn rewards and increase your credit
                score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Stake Amount
                    </label>
                    <span className="text-xs text-gray-500">
                      Available Balance: 2,500 IOTA
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={stakingAmount}
                      onChange={(e) => setStakingAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="outline"
                      className="whitespace-nowrap border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setStakingAmount('2500')}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Lock Period: {lockPeriod} days
                  </label>
                  <Slider
                    defaultValue={[30]}
                    max={365}
                    min={0}
                    step={1}
                    onValueChange={(value) => setLockPeriod(value[0])}
                    className="py-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>No lock</span>
                    <span>1 year</span>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 border border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Estimated APY</span>
                    <span className="font-medium text-white">
                      {12.5 + lockPeriod}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lock Period</span>
                    <span className="font-medium text-white">
                      {lockPeriod === 0
                        ? 'None (withdraw anytime)'
                        : `${lockPeriod} days`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
                onClick={handleStake}
              >
                <Coins className="mr-2 h-4 w-4" />
                Stake Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="lend">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ArrowUpFromLine className="mr-2 h-5 w-5 text-[#00e0c6]" />
                Lend IOTA
              </CardTitle>
              <CardDescription className="text-gray-400">
                Lend your IOTA tokens to earn interest
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Lending Amount
                    </label>
                    <span className="text-xs text-gray-500">
                      Available Balance: 2,500 IOTA
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={lendingAmount}
                      onChange={(e) => setLendingAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="outline"
                      className="whitespace-nowrap border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setLendingAmount('2500')}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 border border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Lending Rate</span>
                    <span className="font-medium text-white">8.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lending Term</span>
                    <span className="font-medium text-white">30 days</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Collateralization</span>
                    <span className="font-medium text-white">150%</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
                onClick={handleLend}
              >
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Lend Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Unlock className="mr-2 h-5 w-5 text-[#00e0c6]" />
                Withdraw IOTA
              </CardTitle>
              <CardDescription className="text-gray-400">
                Withdraw your IOTA tokens from staking or lending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Withdrawal Amount
                    </label>
                    <span className="text-xs text-gray-500">
                      Staked: 1,250 IOTA
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      variant="outline"
                      className="whitespace-nowrap border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => setWithdrawAmount('1250')}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-800 p-4 border border-gray-700">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Withdrawal Fee</span>
                    <span className="font-medium text-white">0.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Processing Time</span>
                    <span className="font-medium text-white">Instant</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-400">Gas Estimate</span>
                    <span className="font-medium text-white">~0.05 IOTA</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
                onClick={handleWithdraw}
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Withdraw Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card className="bg-gray-900 border-gray-800 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-digital-grid.png')] opacity-10"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-white">
              <Gift className="h-5 w-5 mr-2 text-[#00e0c6]" />
              Free Token Claim
            </CardTitle>
            <CardDescription className="text-gray-400 text-xl">
              Claim free tokens and Stake.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-sm text-gray-400">
              By participating in our ecosystem, Withdrawing and staking tokens
              makes it easier for you to understand how the LiquidLink system
              works.
            </p>
          </CardContent>
          <CardFooter className="relative z-10">
            <Button
              className="w-full bg-gradient-to-r from-[#00a0b0] to-[#00e0c6] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
              onClick={handleFreeTokenClaim}
            >
              <Gift className="mr-2 h-4 w-4" />
              Claim Free Tokens
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
