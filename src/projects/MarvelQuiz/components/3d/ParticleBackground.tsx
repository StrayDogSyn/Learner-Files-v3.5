import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../stores/gameStore';

// Particle system component
function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { settings } = useGameStore();
  
  // Generate particle positions
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);
    
    // Marvel color palette
    const marvelColors = [
      new THREE.Color('#e50914'), // Marvel Red
      new THREE.Color('#ffd700'), // Gold
      new THREE.Color('#1e40af'), // Blue
      new THREE.Color('#8a2be2'), // Purple (Power Stone)
      new THREE.Color('#00ff00'), // Green (Time Stone)
      new THREE.Color('#ff4500'), // Orange (Soul Stone)
    ];
    
    for (let i = 0; i < 1000; i++) {
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
  
  // Animation loop
  useFrame((state) => {
    if (!ref.current || !settings.graphics.animations) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire particle system
    ref.current.rotation.x = time * 0.1;
    ref.current.rotation.y = time * 0.05;
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
  const ref = useRef<THREE.Mesh>(null!);
  const { settings } = useGameStore();
  
  useFrame((state) => {
    if (!ref.current || !settings.graphics.animations) return;
    
    const time = state.clock.getElapsedTime();
    
    // Animate the cosmic waves
    ref.current.rotation.z = time * 0.2;
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(time) * 0.05;
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
  const groupRef = useRef<THREE.Group>(null!);
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
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire group
    groupRef.current.rotation.y = time * 0.3;
    
    // Individual stone animations
    groupRef.current.children.forEach((stone, index) => {
      stone.rotation.x = time * (0.5 + index * 0.1);
      stone.rotation.z = time * (0.3 + index * 0.05);
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 2 + index) * 0.2;
      stone.scale.setScalar(scale);
    });
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
  
  if (!settings.graphics.particles) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
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
    </div>
  );
}

export default ParticleBackground;