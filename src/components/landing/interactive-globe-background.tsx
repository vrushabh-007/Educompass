'use client';

import React, { useEffect, useRef } from 'react';

const InteractiveGlobeBackground: React.FC = () => {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!globeContainerRef.current) return;

      const scrollY = window.scrollY;
      // Example: Calculate rotation based on scroll. Adjust multiplier for speed.
      // const rotationY = scrollY * 0.1;

      // In a real 3D implementation (e.g., with Three.js & react-three-fiber),
      // you would update the 3D globe model's rotation here.
      // For this placeholder, we'll just log it.
      // console.log(`ScrollY: ${scrollY}, Globe Target Rotation Y: ${rotationY}deg`);

      // If globeRef was a ref to a Three.js mesh, it would be:
      // if (globeMeshRef.current) {
      //   globeMeshRef.current.rotation.y = THREE.MathUtils.degToRad(rotationY);
      // }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={globeContainerRef}
      className="fixed inset-0 -z-10" // Fixed position, behind all other content
      aria-hidden="true"
    >
      {/* Placeholder for 3D Globe */}
      <div className="absolute inset-0 flex items-center justify-center bg-transparent">
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-primary/5 animate-pulse flex items-center justify-center text-center p-4">
          <p className="text-muted-foreground text-xs sm:text-sm">
            [3D Interactive Globe Background Placeholder]
            <br />
            A 3D globe would be rendered here, rotating with scroll.
            <br />
            Requires 3D libraries (e.g., Three.js, react-three-fiber).
          </p>
        </div>
      </div>
      {/*
        To implement the actual 3D globe:
        1. Install necessary libraries:
           `npm install three @react-three/fiber @react-three/drei`
        2. Create a `GlobeModel.tsx` component using `@react-three/fiber`. Example:
           ```tsx
           // components/landing/GlobeModel.tsx
           'use client';
           import { useRef } from 'react';
           import { Canvas, useFrame, useLoader } from '@react-three/fiber';
           import { Sphere, OrbitControls } from '@react-three/drei';
           import * as THREE from 'three';

           interface GlobeModelProps {
             scrollRotationY: number; // Rotation controlled by scroll
           }

           function Globe({ scrollRotationY }: GlobeModelProps) {
             const meshRef = useRef<THREE.Mesh>(null!);
             // const texture = useLoader(THREE.TextureLoader, '/earth-texture.jpg'); // Ensure you have a texture

             // Update rotation based on scroll prop
             useFrame(() => {
               meshRef.current.rotation.y = THREE.MathUtils.degToRad(scrollRotationY);
             });

             return (
               <mesh ref={meshRef}>
                 <Sphere args={[2, 64, 64]}> // args: radius, widthSegments, heightSegments
                   <meshStandardMaterial color="dodgerblue" wireframe /> // Replace with texture: map={texture}
                 </Sphere>
               </mesh>
             );
           }

           export default function GlobeCanvas({ scrollRotationY }: GlobeModelProps) {
             return (
               <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                 <ambientLight intensity={0.7} />
                 <pointLight position={[10, 10, 10]} intensity={1} />
                 <Globe scrollRotationY={scrollRotationY} />
                 // <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
               </Canvas>
             );
           }
           ```
        3. In `InteractiveGlobeBackground.tsx`, manage a `scrollRotationY` state updated by `handleScroll`,
           and pass it as a prop to `<GlobeCanvas scrollRotationY={scrollRotationY} />`.
           Replace the placeholder div with `<GlobeCanvas />`.
        4. Ensure you have an earth texture image (e.g., `public/earth-texture.jpg`).
      */}
    </div>
  );
};

export default InteractiveGlobeBackground;
