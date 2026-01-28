// client/src/components/SkeletonCard.jsx
import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border-2 border-transparent animate-pulse">
      {/* Header with title and checkbox */}
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-4/5"></div>
        <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0"></div>
      </div>
      
      {/* Description lines */}
      <div className="space-y-2 mb-5 flex-grow">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Footer with category and price */}
      <div className="flex justify-between items-center mt-auto">
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

