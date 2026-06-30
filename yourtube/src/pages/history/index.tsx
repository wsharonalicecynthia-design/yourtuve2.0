import React, { Suspense } from "react";
import HistoryContentComponent from "@/components/historycontent";

const HistoryPage = () => {
  return (
    <main className="flex-1 p-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          Watch history
        </h1>

        <Suspense
          fallback={
            <div className="p-2 text-sm text-gray-500">
              Loading watch history...
            </div>
          }
        >
          <HistoryContentComponent />
        </Suspense>
      </div>
    </main>
  );
};

export default HistoryPage;