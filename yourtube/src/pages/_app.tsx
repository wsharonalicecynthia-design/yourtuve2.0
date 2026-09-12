import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/sidebar";
import { UserProvider } from "@/lib/AuthContext";

export default function App({
  Component,
  pageProps,
}: AppProps) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-white text-black flex flex-col">

        {/* Header */}
        <Header />

        {/* Main Layout */}
        <div className="flex flex-1">

          {/* Sidebar */}
          <Sidebar />

          {/* Page Content */}
          <main className="flex-1 min-w-0">
            <Component {...pageProps} />
          </main>

        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />

      </div>
    </UserProvider>
  );
}