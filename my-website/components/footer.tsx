import { Github, Twitter } from 'lucide-react';

const openTwitter = () => {
  window.open('https://x.com/Liquidlink_io', 'LiquidLink');
};

const openGithub = () => {
  window.open(
    'https://github.com/Liquidlink-Lab/liquidlink-staking-point-demo',
    'liquidlink-staking-point-demo',
  );
};

export function Footer() {
  return (
    <footer className="bg-black py-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              © 2025 Liquid DeFi Protocol.liquidlink point system demo. All
              rights reserved.Design by liquidlink.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={openGithub}
              className="text-gray-500 hover:text-[#9763e0]"
            >
              <Github className="h-5 w-5" />
              openTwitter
            </button>
            <button
              onClick={openTwitter}
              className="text-gray-500 hover:text-[#9763e0]"
            >
              <Twitter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
