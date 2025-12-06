import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Environment } from '@react-three/drei';
import { Bot } from '@/store/useStore';
import * as THREE from 'three';

interface Warehouse3DProps {
  bots: Bot[];
}

// Individual bot component with animation
function BotMesh({ bot, index }: { bot: Bot; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const targetPosition = useMemo(() => {
    // Convert percentage positions to 3D coordinates (-5 to 5 range)
    const x = (bot.position.x / 100) * 10 - 5;
    const z = (bot.position.y / 100) * 10 - 5;
    return new THREE.Vector3(x, 0.3, z);
  }, [bot.position.x, bot.position.y]);

  // Smooth movement animation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPosition, delta * 2);
      
      // Rotate wheels for busy bots
      if (bot.status === 'busy') {
        meshRef.current.rotation.y += delta * 2;
      }
    }
  });

  // Status-based colors
  const getColor = () => {
    switch (bot.status) {
      case 'idle': return '#6b7280';
      case 'busy': return '#22c55e';
      case 'charging': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const color = getColor();
  const emissiveIntensity = bot.status === 'busy' ? 0.5 : 0.2;

  return (
    <group ref={meshRef} position={[0, 0.3, 0]}>
      {/* Bot body - cylindrical shape */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 16]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.7} 
          roughness={0.3}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Top dome */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Status light */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      
      {/* Wheels */}
      {[-0.2, 0.2].map((x) => (
        [-0.2, 0.2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.15, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      ))}
      
      {/* Bot label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {bot.name.split(' ')[1]}
      </Text>
      
      {/* Battery indicator bar */}
      <mesh position={[0, 0.5, 0.3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[-0.15 + (bot.battery / 100) * 0.15, 0.5, 0.31]} rotation={[0, 0, 0]}>
        <boxGeometry args={[(bot.battery / 100) * 0.28, 0.04, 0.02]} />
        <meshStandardMaterial 
          color={bot.battery > 30 ? '#22c55e' : bot.battery > 15 ? '#f59e0b' : '#ef4444'} 
          emissive={bot.battery > 30 ? '#22c55e' : bot.battery > 15 ? '#f59e0b' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// Warehouse floor with zones
function WarehouseFloor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Grid overlay */}
      <Grid
        args={[12, 12]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#0ea5e9"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#06b6d4"
        fadeDistance={25}
        fadeStrength={1}
        position={[0, 0.01, 0]}
      />
      
      {/* Zone markers */}
      {[
        { pos: [-4, 0.02, -4], label: 'Zone A', color: '#22c55e' },
        { pos: [4, 0.02, -4], label: 'Zone B', color: '#3b82f6' },
        { pos: [-4, 0.02, 4], label: 'Zone C', color: '#f59e0b' },
        { pos: [4, 0.02, 4], label: 'Zone D', color: '#ef4444' },
      ].map((zone) => (
        <group key={zone.label} position={zone.pos as [number, number, number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            <meshStandardMaterial 
              color={zone.color} 
              opacity={0.2} 
              transparent 
            />
          </mesh>
          <Text
            position={[0, 0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color={zone.color}
            anchorX="center"
            anchorY="middle"
          >
            {zone.label}
          </Text>
        </group>
      ))}
      
      {/* Charging station */}
      <group position={[0, 0, -5]}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2, 0.3, 0.5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.4} />
        </mesh>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.2}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          ⚡ Charging Station
        </Text>
      </group>
    </group>
  );
}

// Warehouse walls
function WarehouseWalls() {
  const wallMaterial = (
    <meshStandardMaterial 
      color="#0f172a" 
      metalness={0.3} 
      roughness={0.7}
      transparent
      opacity={0.5}
    />
  );

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 1.5, -6]}>
        <boxGeometry args={[12, 3, 0.1]} />
        {wallMaterial}
      </mesh>
      {/* Left wall */}
      <mesh position={[-6, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 12]} />
        {wallMaterial}
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 1.5, 0]}>
        <boxGeometry args={[0.1, 3, 12]} />
        {wallMaterial}
      </mesh>
    </group>
  );
}

// Shelving units
function Shelves() {
  const positions = [
    [-2, 0, -2],
    [2, 0, -2],
    [-2, 0, 2],
    [2, 0, 2],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Shelf frame */}
          <mesh position={[0, 0.75, 0]}>
            <boxGeometry args={[1.5, 1.5, 0.4]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Shelf levels */}
          {[0.3, 0.75, 1.2].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[1.4, 0.05, 0.35]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Warehouse3D({ bots }: Warehouse3DProps) {
  return (
    <div className="w-full h-full min-h-[500px] bg-background rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#0ea5e9" />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Scene elements */}
        <WarehouseFloor />
        <WarehouseWalls />
        <Shelves />
        
        {/* Bots */}
        {bots.map((bot, index) => (
          <BotMesh key={bot.id} bot={bot} index={index} />
        ))}
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Canvas>
    </div>
  );
}
