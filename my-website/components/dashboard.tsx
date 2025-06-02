'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, TrendingUp, Award, Clock, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount } from '@iota/dapp-kit';
import { IotaClient, getFullnodeUrl } from '@iota/iota-sdk/client';


type ScoreResponse = {
  address: string;
  points: {
    pointsByKey: {
      stake: number;
    };
    totalPoints: number;
  };
  rank: number;
};

const client = new IotaClient({
  url: getFullnodeUrl('testnet'),
});

export function Dashboard() {
  const [stakedAmount,setStakedAmount] = useState(0);
  const account = useCurrentAccount();

  const { data: score = 0 } = useQuery({
    queryKey: ['score', account],
    queryFn: async () => {
      const response = await fetch(
        `/api/leaderboard/${account?.address}?network=testnet`,
      );

      const score = (await response.json()) as ScoreResponse;
      const { points } = score;

      return points.totalPoints;
    },
    enabled: !!account?.address,
  });

  const { data: tvl } = useQuery({
    queryKey: ['tvl'],
    queryFn: () => {
      return 4.28;
    },
    enabled: !!account?.address,
  });

  useEffect(() => {

    const getObject=async()=>{
      const iotaObjectId = '0x7e8e05366388d163257d7d7427293db6795284f5e961cb6244c7273bb28ee652'
      const balance = await client.getObject({
        id: iotaObjectId,
        options: { showContent: true },
      });

      const bal = balance.data?.content?.fields?.coin?.fields?.balance;
      const num = Number(bal);
      const decimalFormatted = (num / 1e8).toFixed(8);
      const [intPart, decimalPart] = decimalFormatted.split('.');
      const result = `${intPart}.${decimalPart.slice(0, 4)}`;
      const rounded = Number(result)
      setStakedAmount(rounded);
      console.log('vIotaCoins',rounded);
    }
    getObject();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
        <Zap className="mr-2 h-5 w-5 text-[#9763e0]" />
        Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Staked Amount
              <ArrowUpRight className="h-4 w-4 ml-1 text-[#9763e0]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stakedAmount.toLocaleString()} IOTA
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ≈ ${(stakedAmount * 0.23).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Your Liquidlink Score
              <Award className="h-4 w-4 ml-1 text-[#9763e0]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">
                {score.toFixed(2)}
              </div>
              {/* <div className="text-xs px-2 py-1 rounded-full bg-green-900 text-green-300">Good</div> */}
            </div>
            {/* <Progress value={score} className="h-2 mt-2" /> */}
          </CardContent>
        </Card>

        {/* <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              APY
              <TrendingUp className="h-4 w-4 ml-1 text-[#9763e0]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{apr}%</div>
            <div className="text-xs text-green-400 mt-1">+0.5% from last week</div>
          </CardContent>
        </Card> */}

        {/* <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Next Reward
              <Clock className="h-4 w-4 ml-1 text-[#9763e0]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{timeLeft} hours</div>
            <div className="text-xs text-gray-500 mt-1">Est. +25 IOTA</div>
          </CardContent>
        </Card> */}

        {/* <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              Protocol TVL
              <TrendingUp className="h-4 w-4 ml-1 text-[#9763e0]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${tvl}M</div>
            <div className="text-xs text-green-400 mt-1">+2.3% in 24h</div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
