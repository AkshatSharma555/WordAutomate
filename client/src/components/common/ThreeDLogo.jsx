import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Environment, Center } from '@react-three/drei';

const LogoModel = ({ url, isHovered }) => {
  const groupRef = useRef();
  
  // SVG Load
  const svgData = useLoader(SVGLoader, url);
  
  // Combine paths (CPU Optimization)
  const shapes = useMemo(() => {
    return svgData.paths.flatMap((p) => p.toShapes(true));
  }, [svgData]);

  // Physics & Rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Idle: 0.5 speed, Hover: 5.0 speed
      const targetSpeed = isHovered ? 5 : 0.5;
      groupRef.current.rotation.z -= delta * targetSpeed;
    }
  });

  // Optimized Geometry
  const extrudeSettings = useMemo(() => ({
    depth: 15,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2,
    curveSegments: 4, 
    steps: 1          
  }), []);

  return (
    <group 
        ref={groupRef}
        rotation={[0, 0, 0]} 
        // 🔥 PERFECT SCALE: Not too big to clip, not too small to hide
        scale={0.011} 
    >
      <Center>
        <group scale={[1, -1, 1]}>
          <mesh>
            <extrudeGeometry args={[shapes, extrudeSettings]} />
            <meshPhysicalMaterial 
              color="#FF4500"       
              emissive="#FF2200"    
              emissiveIntensity={isHovered ? 0.6 : 0.2}
              metalness={0.8}       
              roughness={0.2}       
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </group>
      </Center>
    </group>
  );
};

const ThreeDLogo = ({ className = "", isHovered = false }) => {
  return (
    <div className={`relative z-50 flex items-center justify-center ${className}`}>
      <Canvas 
        // 🔥 CAMERA FIX: Moved to Z=6. 
        // Paas rakhne se cut raha tha, door rakhne se chota dikh raha tha. 6 is sweet spot.
        camera={{ position: [0, 0, 6], fov: 50 }} 
        gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#ffffff" />
        <spotLight position={[-10, -10, 10]} intensity={10} color="#FFAA00" />
        
        <Environment preset="studio" />

        <LogoModel url="/college-logo.svg" isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default ThreeDLogo;