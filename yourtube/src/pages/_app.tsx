import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner"; // 1. Import Toaster
import Header from "@/components/ui/Header";
import Sidebar from "@/components/sidebar";
import { UserProvider } from "../lib/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider> 
      <div className="min-h-screen bg-white text-black flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6">
            <Component {...pageProps} />
          </main>
        </div>
        
        {/* 2. Add Toaster here at the bottom of your layout tree */}
        <Toaster position="top-right" richColors /> 
      </div>
    </UserProvider>
  );
}