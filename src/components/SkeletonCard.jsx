import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-4 animate-pulse">
      <div className="h-6 bg-white/10 rounded mb-2"></div>
      <div className="h-4 bg-white/10 rounded mb-1"></div>
      <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
      <div className="h-8 bg-white/10 rounded w-1/4"></div>
    </div>
  );
};

export default SkeletonCard;
