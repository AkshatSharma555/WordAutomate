import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Environment, Center } from '@react-three/drei';

const LogoModel = ({ url }) => {
  const meshRef = useRef();
  const svgData = useLoader(SVGLoader, url);
  
  const shapes = useMemo(() => {
    return svgData.paths.flatMap((p) => p.toShapes(true));
  }, [svgData]);

  const extrudeSettings = useMemo(() => ({
    depth: 5, 
    bevelEnabled: false, 
    steps: 1,
    curveSegments: 2 // Low poly for performance
  }), []);

  // Center Geometry
  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.geometry.computeBoundingBox();
      const box = meshRef.current.geometry.boundingBox;
      const xMid = -0.5 * (box.max.x - box.min.x) - box.min.x;
      const yMid = -0.5 * (box.max.y - box.min.y) - box.min.y;
      meshRef.current.geometry.translate(xMid, yMid, 0);
    }
  }, [shapes]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= delta * 3.0; 
    }
  });

  return (
    <group rotation={[0, 0, 0]}>
       <group scale={[1, -1, 1]}>
          {/* 🔥 SCALE REDUCED to 0.020 (Fits strictly inside the ring) */}
          <mesh ref={meshRef} scale={0.020}> 
            <extrudeGeometry args={[shapes, extrudeSettings]} />
            <meshPhysicalMaterial 
              color="#FF4500"       
              emissive="#FF2200"    
              emissiveIntensity={0.5}
              metalness={0.5}       
              roughness={0.2}       
            />
          </mesh>
       </group>
    </group>
  );
};

const ProcessingLogo = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 50 }} 
        gl={{ 
            antialias: true, 
            alpha: true, 
            powerPreference: "high-performance"
        }}
        dpr={[1, 2]} 
      >
        <ambientLight intensity={3} />
        <pointLight position={[10, 10, 10]} intensity={5} color="#ffffff" />
        <Environment preset="city" />
        <LogoModel url="/college-logo.svg" />
      </Canvas>
    </div>
  );
};

export default ProcessingLogo;