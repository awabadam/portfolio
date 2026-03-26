"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleProps {
  initialPosition: [number, number, number];
  size: number;
  rotationSpeed: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  color: string;
  wireframe?: boolean;
  flowSpeed: number;
  flowDirection: [number, number, number];
  bounds: { minY: number; maxY: number; minX: number; maxX: number };
}

function Particle({
  initialPosition,
  size,
  rotationSpeed,
  mousePosition,
  color,
  wireframe = false,
  flowSpeed,
  flowDirection,
  bounds,
}: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useRef(new THREE.Vector3(...initialPosition));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const baseFlowVelocity = useRef(
    new THREE.Vector3(...flowDirection).multiplyScalar(flowSpeed)
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow, smooth rotation
    meshRef.current.rotation.x += delta * rotationSpeed * 0.15;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.1;
    meshRef.current.rotation.z += delta * rotationSpeed * 0.05;

    // Calculate mouse influence (force field effect)
    const mouseX = mousePosition.current.x * 6;
    const mouseY = mousePosition.current.y * 5;

    const distanceX = position.current.x - mouseX;
    const distanceY = position.current.y - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Strong force field - pushes cubes away from cursor
    const forceRadius = 4;
    const forceStrength = 3;

    if (distance < forceRadius && distance > 0) {
      const force = (1 - distance / forceRadius) * forceStrength;
      velocity.current.x += (distanceX / distance) * force * delta * 2;
      velocity.current.y += (distanceY / distance) * force * delta * 2;
    }

    // Gradually return to base flow velocity
    velocity.current.lerp(baseFlowVelocity.current, delta * 0.5);

    // Apply very smooth damping
    velocity.current.multiplyScalar(0.98);

    // Update position with smooth movement
    position.current.add(velocity.current.clone().multiplyScalar(delta));

    // Respawn when out of bounds (continuous flow)
    if (position.current.y > bounds.maxY + 1) {
      position.current.y = bounds.minY - 1;
      position.current.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      position.current.z = -3 + Math.random() * 2;
    }
    if (position.current.y < bounds.minY - 2) {
      position.current.y = bounds.maxY + 1;
      position.current.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    }
    if (position.current.x > bounds.maxX + 2) {
      position.current.x = bounds.minX - 1;
    }
    if (position.current.x < bounds.minX - 2) {
      position.current.x = bounds.maxX + 1;
    }

    meshRef.current.position.copy(position.current);
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.4 : 0.7}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  );
}

function Scene({ cubeCount = 60, isDark = true }: { cubeCount?: number; isDark?: boolean }) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Smooth mouse tracking - faster response
  useFrame(() => {
    smoothMouse.current.x += (mousePosition.current.x - smoothMouse.current.x) * 0.15;
    smoothMouse.current.y += (mousePosition.current.y - smoothMouse.current.y) * 0.15;
  });

  const bounds = {
    minX: -6,
    maxX: 6,
    minY: -5,
    maxY: 5,
  };

  // Generate particle configurations
  const particles = useMemo(() => {
    const configs = [];
    for (let i = 0; i < cubeCount; i++) {
      const isWireframe = Math.random() > 0.6;
      // Random starting positions spread across the scene
      const startX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const startY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      const startZ = -4 + Math.random() * 3;

      // Flow direction - mostly upward with slight variation
      const flowAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5; // Mostly up
      const flowDirection: [number, number, number] = [
        Math.cos(flowAngle) * 0.3,
        Math.sin(flowAngle) * -1, // Negative because we want upward
        0,
      ];

      configs.push({
        id: i,
        position: [startX, startY, startZ] as [number, number, number],
        size: 0.2 + Math.random() * 0.4,
        rotationSpeed: 0.2 + Math.random() * 0.5,
        color: isDark
          ? isWireframe
            ? "#ffffff"
            : `hsl(0, 0%, ${50 + Math.random() * 40}%)`
          : isWireframe
            ? "#000000"
            : `hsl(0, 0%, ${20 + Math.random() * 30}%)`,
        wireframe: isWireframe,
        flowSpeed: 0.15 + Math.random() * 0.25, // Slow, varied speeds
        flowDirection,
      });
    }
    return configs;
  }, [cubeCount, isDark]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.6 : 0.8}
        color={isDark ? "#ffffff" : "#000000"}
      />
      <pointLight
        position={[-5, -5, -5]}
        intensity={isDark ? 0.2 : 0.3}
        color={isDark ? "#aaaaaa" : "#666666"}
      />

      {particles.map((particle) => (
        <Particle
          key={particle.id}
          initialPosition={particle.position}
          size={particle.size}
          rotationSpeed={particle.rotationSpeed}
          mousePosition={smoothMouse}
          color={particle.color}
          wireframe={particle.wireframe}
          flowSpeed={particle.flowSpeed}
          flowDirection={particle.flowDirection}
          bounds={bounds}
        />
      ))}
    </>
  );
}

interface InteractiveCubesProps {
  className?: string;
  cubeCount?: number;
  isDark?: boolean;
}

export default function InteractiveCubes({
  className = "",
  cubeCount = 60,
  isDark = true,
}: InteractiveCubesProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <Scene cubeCount={cubeCount} isDark={isDark} />
      </Canvas>
    </div>
  );
}
