'use client';

import { useState } from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import { IOTA_CLOCK_OBJECT_ID, IOTA_DECIMALS } from '@iota/iota-sdk/utils';

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
import { IotaClient, getFullnodeUrl } from '@iota/iota-sdk/client';

const PACKAGE_ID =
  '0xdd051fe12344d3c1ec76766d9b6cda2274c45f316fd9e79234f37ba2722ca213';
const ACTION = 'stake';
const LOCK_PERIOD = 86400 * 1000;
const TREASURY_CAP_OBJECT_ID =
  '0x3bb8bd79671b28aef33ff1b8d113e446a6db0e6fb19441928d4047735be71d06';
const VAULT_OBJECT_ID =
  '0x50ced78cad583782542faee933382e48516255894d1b1b692dff80397200312e';
const CERT_TYPE = `0x2::coin::Coin<${PACKAGE_ID}::cert::CERT>`;

const client = new IotaClient({
  url: getFullnodeUrl('testnet'),
});

export function Actions() {
  const [stakingAmount, setStakingAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [vIotaCoins, setVIotaCoins] = useState(0);

  const [lockPeriod, setLockPeriod] = useState(30);
  const { toast } = useToast();

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

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

    console.log(stakingAmount);

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

    try {
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
    } catch (e) {
      console.log(e);
    }
  };

  const handleWithdraw = async () => {
    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0
    ) {
      toast({
        title: 'Error',
        description: 'Please enter a valid staking amount',
        variant: 'destructive',
      });
      return;
    }

    console.log('Withdraw');

    const tx = new Transaction();
    //const [coin] = tx.splitCoins(tx.gas, [stakingAmount]);
    const tokenObject = await getCertObject();
    const [coin] = tx.splitCoins(tx.object(tokenObject), [withdrawAmount]);

    tx.moveCall({
      target: `${PACKAGE_ID}::core::unstake`,
      arguments: [
        tx.pure.string(ACTION),
        coin,
        tx.pure.u64(LOCK_PERIOD),
        tx.object(IOTA_CLOCK_OBJECT_ID),
        tx.object(TREASURY_CAP_OBJECT_ID),
        tx.object(VAULT_OBJECT_ID),
      ],
    });

    try {
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
              description: `You have successfully staked ${withdrawAmount} IOTA`,
            });
            setStakingAmount('');
          },

          onError: (error) => {
            console.error('error', error);
            toast({
              title: 'Staking Failed',
              description: `You have failed to stake ${withdrawAmount} IOTA`,
              variant: 'destructive',
            });
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const getCertObject = async () => {
    //user: string
    const user2 = account?.address;
    if (!user2) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet',
        variant: 'destructive',
      });
      return;
    }

    const vIotaCoins = await client.getOwnedObjects({
      owner: user2,
      options: { showType: true, showContent: true },
    });

    let tokenValue = 0;
    let objectId;
    vIotaCoins.data.map((index) => {
      if (index.data?.type === CERT_TYPE) {
        const bal = parseInt((index as any).data?.content?.fields?.balance);
        //console.log(typeof bal)
        if (typeof bal === 'number' && bal > tokenValue) {
          tokenValue = bal;

          objectId = index;
        }
      }
    });

    // console.log(tokenValue);
    // console.log(objectId?.data.objectId);

    return objectId?.data.objectId;
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
        <Zap className="mr-2 h-5 w-5 text-[#9763e0]" />
        DeFi Actions
      </h2>

      <Tabs defaultValue="stake" className="w-full max-w-full">
        <TabsList className="grid grid-cols-2 mb-4 bg-gray-900 w-full">
          <TabsTrigger
            value="stake"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#9763e0]"
          >
            Stake
          </TabsTrigger>
          {/* <TabsTrigger value="lend" className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#9763e0]">
            Lend
          </TabsTrigger> */}
          <TabsTrigger
            value="withdraw"
            className="data-[state=active]:bg-gray-800 data-[state=active]:text-[#9763e0]"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stake">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="mr-2 h-5 w-5 text-[#9763e0]" />
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
                  {/* <label className="text-sm font-medium text-gray-300">
                    Lock Period: {lockPeriod} days
                  </label>
                  <Slider
                    defaultValue={[30]}
                    max={365}
                    min={0}
                    step={1}
                    onValueChange={(value) => setLockPeriod(value[0])}
                    className="py-2"
                  /> */}
                </div>

                {/* <div className="rounded-lg bg-gray-800 p-4 border border-gray-700">
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
                </div> */}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-[#006db0] to-[#9763e0] hover:from-[#9763e0] hover:to-[#a78bcf] text-black font-medium"
                onClick={handleStake}
              >
                <Coins className="mr-2 h-4 w-4" />
                Stake Now
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Unlock className="mr-2 h-5 w-5 text-[#9763e0]" />
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
                className="w-full bg-gradient-to-r from-[#006db0] to-[#9763e0] hover:from-[#9763e0] hover:to-[#a78bcf] text-black font-medium"
                onClick={handleWithdraw}
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Withdraw Now
              </Button>
              {/* <Button
                className="w-full bg-gradient-to-r from-[#00a0b0] to-[#9763e0] hover:from-[#008a99] hover:to-[#00c6af] text-black font-medium"
                onClick={getCertObject}
              >
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                test
              </Button> */}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card className="bg-gray-900 border-gray-800 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/abstract-digital-grid.png')] opacity-10"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center text-white">
              <Gift className="h-5 w-5 mr-2 text-[#9763e0]" />
              Free Token Claim
            </CardTitle>
            <CardDescription className="text-gray-400 text-xl">
              Claim free IOTA and Stake.
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
              className="w-full bg-gradient-to-r from-[#006db0] to-[#9763e0] hover:from-[#9763e0] hover:to-[#a78bcf] text-black font-medium"
              onClick={handleFreeTokenClaim}
            >
              <Gift className="mr-2 h-4 w-4" />
              Claim Free Testnet IOTA
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
