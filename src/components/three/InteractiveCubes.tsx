"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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

  // Target position - follows the intended path
  const targetPosition = useRef(new THREE.Vector3(...initialPosition));
  // Actual rendered position - can be displaced by mouse
  const actualPosition = useRef(new THREE.Vector3(...initialPosition));
  // Velocity for the flow
  const flowVelocity = useRef(
    new THREE.Vector3(...flowDirection).multiplyScalar(flowSpeed)
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth rotation
    meshRef.current.rotation.x += delta * rotationSpeed * 0.2;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.15;
    meshRef.current.rotation.z += delta * rotationSpeed * 0.08;

    // Move target position along the flow path (this is where the cube WANTS to be)
    targetPosition.current.add(flowVelocity.current.clone().multiplyScalar(delta));

    // Respawn target when out of bounds
    if (targetPosition.current.y > bounds.maxY + 1) {
      targetPosition.current.y = bounds.minY - 1;
      targetPosition.current.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      targetPosition.current.z = -4 + Math.random() * 3;
      // Also reset actual position to prevent large spring jumps
      actualPosition.current.copy(targetPosition.current);
    }
    if (targetPosition.current.y < bounds.minY - 2) {
      targetPosition.current.y = bounds.maxY + 1;
      targetPosition.current.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      actualPosition.current.copy(targetPosition.current);
    }
    if (targetPosition.current.x > bounds.maxX + 2) {
      targetPosition.current.x = bounds.minX - 1;
      actualPosition.current.x = targetPosition.current.x;
    }
    if (targetPosition.current.x < bounds.minX - 2) {
      targetPosition.current.x = bounds.maxX + 1;
      actualPosition.current.x = targetPosition.current.x;
    }

    // Calculate mouse force on actual position
    const mouseX = mousePosition.current.x * 6;
    const mouseY = mousePosition.current.y * 5;

    const distanceX = actualPosition.current.x - mouseX;
    const distanceY = actualPosition.current.y - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Strong force field
    const forceRadius = 4;
    const forceStrength = 4;

    let mouseForceX = 0;
    let mouseForceY = 0;

    if (distance < forceRadius && distance > 0) {
      const force = (1 - distance / forceRadius) * forceStrength;
      mouseForceX = (distanceX / distance) * force;
      mouseForceY = (distanceY / distance) * force;
    }

    // Spring back to target position (where it should be on its path)
    const springStrength = 3;
    const springX = (targetPosition.current.x - actualPosition.current.x) * springStrength * delta;
    const springY = (targetPosition.current.y - actualPosition.current.y) * springStrength * delta;
    const springZ = (targetPosition.current.z - actualPosition.current.z) * springStrength * delta;

    // Apply forces to actual position
    actualPosition.current.x += springX + mouseForceX * delta * 3;
    actualPosition.current.y += springY + mouseForceY * delta * 3;
    actualPosition.current.z += springZ;

    meshRef.current.position.copy(actualPosition.current);
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.4 : 0.75}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  );
}

function Scene({ cubeCount = 60, isDark = true }: { cubeCount?: number; isDark?: boolean }) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Smooth mouse tracking
  useFrame(() => {
    smoothMouse.current.x += (mousePosition.current.x - smoothMouse.current.x) * 0.12;
    smoothMouse.current.y += (mousePosition.current.y - smoothMouse.current.y) * 0.12;
  });

  const bounds = {
    minX: -7,
    maxX: 7,
    minY: -6,
    maxY: 6,
  };

  // Generate particle configurations
  const particles = useMemo(() => {
    const configs = [];
    for (let i = 0; i < cubeCount; i++) {
      const isWireframe = Math.random() > 0.6;
      // Random starting positions spread across the scene
      const startX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const startY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);
      const startZ = -5 + Math.random() * 4;

      // Flow direction - mostly upward with slight variation
      const flowAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      const flowDirection: [number, number, number] = [
        Math.cos(flowAngle) * 0.4,
        Math.sin(flowAngle) * -1,
        0,
      ];

      configs.push({
        id: i,
        position: [startX, startY, startZ] as [number, number, number],
        size: 0.15 + Math.random() * 0.35,
        rotationSpeed: 0.3 + Math.random() * 0.6,
        color: isDark
          ? isWireframe
            ? "#ffffff"
            : `hsl(0, 0%, ${50 + Math.random() * 40}%)`
          : isWireframe
            ? "#000000"
            : `hsl(0, 0%, ${20 + Math.random() * 30}%)`,
        wireframe: isWireframe,
        flowSpeed: 0.4 + Math.random() * 0.5, // Faster flow
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
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene cubeCount={cubeCount} isDark={isDark} />
      </Canvas>
    </div>
  );
}
