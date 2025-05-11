// src/components/landing/FrankyEarth.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// GSAP is not used for scroll animation in this version, consider removing if not needed for other interactions.
// import gsap from 'gsap';

// HSL to RGB conversion function (values 0-1)
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

// Theme colors converted to RGB [0-1]
// Primary: HSL(275, 70%, 60%) -> RGB(165, 82, 224)
const primaryColorRGB = hslToRgb(275, 70, 60); // approx [0.647, 0.321, 0.878]
// Accent for Earth's internal atmosphere: HSL(275, 70%, 70%) -> RGB(195, 143, 224)
const earthAtmosphereColorRGB = hslToRgb(275, 70, 70); // approx [0.765, 0.561, 0.878]


// Vertex shader for Earth
const earthVertexShader = `
  varying vec2 vertexUV;
  varying vec3 vertexNormal;

  void main() {
    vertexUV = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for Earth
const earthFragmentShader = `
  uniform sampler2D globeTexture;
  uniform vec3 customAtmosphereColor; // Color for the glow on Earth itself
  varying vec2 vertexUV;
  varying vec3 vertexNormal;

  void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphereGlow = customAtmosphereColor * pow(intensity, 1.5);
    
    vec4 textureColor = texture2D(globeTexture, vertexUV);
    // If texture is mostly transparent (e.g. water part of a typical map), 
    // make it dark purple instead of black.
    // This simple check might need adjustment based on the actual texture.
    // For a globe.jpg, this might make landmasses have a purple tint where oceans are.
    // If the texture is opaque, this will mostly affect edges.
    vec3 baseColor = textureColor.rgb;
    if (textureColor.a < 0.5) { // Heuristic for "transparent" parts if using a map with alpha
        baseColor = vec3(${primaryColorRGB[0]}, ${primaryColorRGB[1]}, ${primaryColorRGB[2]}) * 0.2; // Dark purple
    }
    
    gl_FragColor = vec4(atmosphereGlow + baseColor, 1.0);
  }
`;

// Vertex shader for Atmosphere
const atmosphereVertexShader = `
  varying vec3 vertexNormal;

  void main() {
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for Atmosphere
const atmosphereFragmentShader = `
  uniform vec3 atmosphereColor; // Color for the outer atmosphere object
  varying vec3 vertexNormal;

  void main() {
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(atmosphereColor, 1.0) * intensity;
  }
`;


const FrankyEarth: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Make canvas transparent
    });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    // controls.enableRotate = true; // Allow mouse rotation

    // Group for Earth and Atmosphere
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(5, 50, 50);
    const earthMaterial = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        globeTexture: {
          value: new THREE.TextureLoader().load('/assets/globe.jpg', 
            (texture) => {
                // console.log("Globe texture loaded successfully");
            }, 
            undefined,
            (error) => {
                console.error("Error loading globe texture:", error);
                // Fallback: if texture fails, use a solid color (maybe dark purple)
                // This part of the fallback is tricky with shaders; easier to ensure texture path is correct.
            }
          )
        },
        customAtmosphereColor: {
          value: new THREE.Vector3(...earthAtmosphereColorRGB),
        }
      },
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    group.add(earth);

    // Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(5, 50, 50);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      uniforms: {
        atmosphereColor: {
          value: new THREE.Vector3(...primaryColorRGB),
        }
      }
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.scale.set(1.1, 1.1, 1.1);
    group.add(atmosphere);

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff }); // White stars
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = -Math.random() * 3000; // Place stars behind the globe
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);


    // Scroll-based rotation
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      if (groupRef.current) {
        groupRef.current.rotation.y += deltaScroll * 0.0005; // Adjust multiplier for sensitivity
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });


    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // For damping
      if (groupRef.current) {
         groupRef.current.rotation.y += 0.0005; // Slow continuous auto-rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (currentMount && renderer.domElement) {
         currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose geometries and materials if needed
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full -z-10" />;
};

export default FrankyEarth;
