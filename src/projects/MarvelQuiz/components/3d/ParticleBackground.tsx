import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

// Error boundary for Three.js components
function ThreeErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}

// Context loss handler
function ContextHandler() {
  const { gl } = useThree();
  
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleContextLost = (event: Event) => {
      console.warn('WebGL context lost, attempting to recover...');
      event.preventDefault();
    };
    
    const handleContextRestored = () => {
      console.log('WebGL context restored');
    };
    
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);
  
  return null;
}

// Particle system component
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const { settings } = useGameStore();
  
  // Generate particle positions (reduced count for better performance)
  const [positions, colors] = useMemo(() => {
    const particleCount = 500; // Reduced from 1000
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Marvel color palette
    const marvelColors = [
      new THREE.Color('#e50914'), // Marvel Red
      new THREE.Color('#ffd700'), // Gold
      new THREE.Color('#1e40af'), // Blue
      new THREE.Color('#8a2be2'), // Purple (Power Stone)
      new THREE.Color('#00ff00'), // Green (Time Stone)
      new THREE.Color('#ff4500'), // Orange (Soul Stone)
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 25 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors from Marvel palette
      const color = marvelColors[Math.floor(Math.random() * marvelColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);
  
  // Animation loop with error handling and throttling
  useFrame((state) => {
    if (!ref.current || !settings.graphics.animations) return;
    
    try {
      const time = state.clock.getElapsedTime();
      
      // Throttle animations to reduce DOM manipulation
      if (Math.floor(time * 30) % 2 === 0) { // Only update every other frame at 30fps
        ref.current.rotation.x = time * 0.05; // Reduced rotation speed
        ref.current.rotation.y = time * 0.025;
      }
    } catch (error) {
      console.warn('Error in particle animation:', error);
    }
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        transparent
        vertexColors
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Cosmic energy waves
function CosmicWaves() {
  const ref = useRef<THREE.Mesh>(null);
  const { settings } = useGameStore();
  
  useFrame((state) => {
    if (!ref.current || !settings.graphics.animations) return;
    
    try {
      const time = state.clock.getElapsedTime();
      
      // Throttle animations to reduce DOM manipulation
      if (Math.floor(time * 20) % 3 === 0) { // Update every 3rd frame at 20fps
        ref.current.rotation.z = time * 0.1; // Reduced rotation speed
        const material = ref.current.material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = 0.05 + Math.sin(time * 0.5) * 0.03; // Reduced opacity changes
        }
      }
    } catch (error) {
      console.warn('Error in cosmic waves animation:', error);
    }
  });
  
  return (
    <mesh ref={ref}>
      <torusGeometry args={[20, 0.5, 16, 100]} />
      <meshBasicMaterial
        color="#ffd700"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

// Infinity Stone orbits
function InfinityStones() {
  const groupRef = useRef<THREE.Group>(null);
  const { settings } = useGameStore();
  
  const stones = useMemo(() => [
    { color: '#8a2be2', position: [8, 0, 0] }, // Power Stone
    { color: '#0000ff', position: [0, 8, 0] }, // Space Stone
    { color: '#ff0000', position: [-8, 0, 0] }, // Reality Stone
    { color: '#00ff00', position: [0, -8, 0] }, // Time Stone
    { color: '#ff4500', position: [0, 0, 8] }, // Soul Stone
    { color: '#ffff00', position: [0, 0, -8] }, // Mind Stone
  ], []);
  
  useFrame((state) => {
    if (!groupRef.current || !settings.graphics.animations) return;
    
    try {
      const time = state.clock.getElapsedTime();
      
      // Throttle animations to reduce DOM manipulation
      if (Math.floor(time * 15) % 2 === 0) { // Update every other frame at 15fps
        groupRef.current.rotation.y = time * 0.15; // Reduced rotation speed
        
        // Individual stone animations (less frequent)
        groupRef.current.children.forEach((stone, index) => {
          if (stone && Math.floor(time * 10 + index) % 4 === 0) {
            stone.rotation.x = time * (0.25 + index * 0.05); // Reduced rotation
            stone.rotation.z = time * (0.15 + index * 0.025);
            
            // Pulsing effect (less dramatic)
            const scale = 1 + Math.sin(time + index) * 0.1; // Reduced scale change
            stone.scale.setScalar(scale);
          }
        });
      }
    } catch (error) {
      console.warn('Error in infinity stones animation:', error);
    }
  });
  
  return (
    <group ref={groupRef}>
      {stones.map((stone, index) => (
        <mesh key={index} position={stone.position as [number, number, number]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color={stone.color}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Subtle camera movement
    camera.position.x = Math.sin(time * 0.1) * 2;
    camera.position.y = Math.cos(time * 0.15) * 1;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main particle background component
export function ParticleBackground() {
  const { settings } = useGameStore();
  const [hasError, setHasError] = useState(false);
  
  if (!settings.graphics.particles || hasError) {
    return null;
  }
  
  const handleCreated = ({ gl }: { gl: THREE.WebGLRenderer }) => {
    // Configure renderer for better performance and error handling
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setClearColor(0x000000, 0);
    gl.toneMapping = THREE.NoToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  };
  
  const handleError = (error: Error | unknown) => {
    console.error('Three.js error:', error);
    setHasError(true);
  };
  
  return (
    <div className="absolute inset-0 -z-10">
      <ThreeErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 30], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]}
          gl={{ 
            antialias: false, 
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
          }}
          onCreated={handleCreated}
          onError={handleError}
          frameloop="demand"
          performance={{ min: 0.5 }}
        >
          <ContextHandler />
          <CameraController />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />
          
          {/* Point light for depth */}
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffd700" />
          
          {/* Particle field */}
          <ParticleField />
          
          {/* Cosmic waves */}
          <CosmicWaves />
          
          {/* Infinity stones */}
          <InfinityStones />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}

export default ParticleBackground;