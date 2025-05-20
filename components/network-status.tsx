"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Activity, Cpu, Layers, Lock } from "lucide-react"

export function NetworkStatus() {
  const [blockHeight, setBlockHeight] = useState(3452167)
  const [tps, setTps] = useState(42)
  const [validators, setValidators] = useState(128)
  const [latency, setLatency] = useState(0.24)

  useEffect(() => {
    // Simulate changing network stats
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + Math.floor(Math.random() * 3) + 1)
      setTps(42 + Math.floor(Math.random() * 8) - 4)
      setLatency(0.2 + (Math.random() * 0.1).toFixed(2))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-3">
      <TooltipProvider>
        <div className="flex flex-wrap justify-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="py-2 px-3 border-gray-700 bg-black/50 backdrop-blur-sm flex items-center gap-2"
              >
                <Layers className="h-3.5 w-3.5 text-[#00e0c6]" />
                <span className="text-xs font-medium">
                  Block: <span className="text-white">{blockHeight.toLocaleString()}</span>
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Current block height on the Tangle</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="py-2 px-3 border-gray-700 bg-black/50 backdrop-blur-sm flex items-center gap-2"
              >
                <Activity className="h-3.5 w-3.5 text-[#00e0c6]" />
                <span className="text-xs font-medium">
                  TPS: <span className="text-white">{tps}</span>
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Transactions per second</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="py-2 px-3 border-gray-700 bg-black/50 backdrop-blur-sm flex items-center gap-2"
              >
                <Cpu className="h-3.5 w-3.5 text-[#00e0c6]" />
                <span className="text-xs font-medium">
                  Validators: <span className="text-white">{validators}</span>
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Active network validators</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="py-2 px-3 border-gray-700 bg-black/50 backdrop-blur-sm flex items-center gap-2"
              >
                <Lock className="h-3.5 w-3.5 text-[#00e0c6]" />
                <span className="text-xs font-medium">
                  Latency: <span className="text-white">{latency}s</span>
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Network confirmation time</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
