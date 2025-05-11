'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FrankyEarth component to ensure it's client-side only
const FrankyEarthWithNoSSR = dynamic(
  () => import('./FrankyEarth'),
  { ssr: false }
);

const InteractiveGlobeBackground: React.FC = () => {
  // The scroll handling and state management for rotation will now be
  // internal to the FrankyEarth component or directly manipulated there.
  // This component just acts as a host.

  return (
    <div
      className="fixed inset-0 -z-10" // Fixed position, behind all other content
      aria-hidden="true"
    >
      <FrankyEarthWithNoSSR />
    </div>
  );
};

export default InteractiveGlobeBackground;
