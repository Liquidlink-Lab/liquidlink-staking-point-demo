import { Wallet } from "@/components/wallet"
import { Dashboard } from "@/components/dashboard"
import { Actions } from "@/components/actions"
import { Footer } from "@/components/footer"
// import { NetworkStatus } from "@/components/network-status"

export default function Home() {
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
            <p className="text-center text-gray-400 mb-8">LiquidLink points system Staking demo</p>
            {/* <NetworkStatus /> */}
            <Dashboard />
            <Actions />
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
