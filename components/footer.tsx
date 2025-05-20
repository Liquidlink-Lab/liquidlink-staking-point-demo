import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black py-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">© 2025 Liquid DeFi Protocol. All rights reserved.Design by liquidlink.</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-500 hover:text-[#00e0c6]">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#00e0c6]">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#00e0c6]">
              Help Center
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-[#00e0c6]">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#00e0c6]">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#00e0c6]">
              <Discord className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
