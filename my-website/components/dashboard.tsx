'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, TrendingUp, Award, Clock, Zap } from 'lucide-react';

export function Dashboard() {
  const [stakedAmount, setStakedAmount] = useState(1250);
  const [score, setScore] = useState(78);
  const [apr, setApr] = useState(12.5);
  const [timeLeft, setTimeLeft] = useState(14);
  const [tvl, setTvl] = useState(4.28);

  useEffect(() => {
    // Simulate score increasing over time
    const interval = setInterval(() => {
      setScore((prev) => {
        const newScore = prev + 0.1;
        return newScore > 100 ? 100 : Number.parseFloat(newScore.toFixed(1));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
        <Zap className="mr-2 h-5 w-5 text-[#9763e0]" />
        Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <div className="text-2xl font-bold text-white">{score}</div>
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

        <Card className="bg-gray-900 border-gray-800">
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
        </Card>
      </div>
    </div>
  );
}
