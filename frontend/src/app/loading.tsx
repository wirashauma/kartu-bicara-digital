import React from "react";
import { ClassStatsHeaderSkeleton, ClassListSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col font-sans">
      <ClassStatsHeaderSkeleton />
      <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
        <ClassListSkeleton />
      </div>
    </div>
  );
}

