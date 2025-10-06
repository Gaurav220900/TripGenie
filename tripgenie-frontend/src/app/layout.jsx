import "./globals.css";
import Image from "next/image";

export const metadata = {
  title: "TripGenie",
  description: "Plan Less, Travel More with AI ✨",
};

export default function RootLayout({ children}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {/* Navbar */}
        <nav className="w-full flex justify-between items-center px-8 py-4 shadow-sm sticky top-0 bg-white z-50">
          <div className="flex items-center gap-2">
           <Image
                        src="/TripGenie-Icon.png"
                        alt="TripGenie Icon"
                        width={100}
                        height={50}
                        priority
                      />
          </div>
          <div className="hidden md:flex gap-6 text-gray-700">
            <a href="/" className="hover:text-blue-600">Home</a>
            <a href="/features" className="hover:text-blue-600">Features</a>
            <a href="/plan" className="hover:text-blue-600">Plan</a>
            <a href="/about" className="hover:text-blue-600">About</a>
          </div>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
            Get Started
          </button>
        </nav>

        {children}

        {/* Footer */}
        <footer className="bg-gray-100 py-6 mt-16">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
            <span className="font-bold text-blue-700">TripGenie</span>
            <p className="text-sm text-gray-500">Plan Less, Travel More ✈️</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
