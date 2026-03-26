"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface CubeProps {
  position: [number, number, number];
  size: number;
  rotationSpeed: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
  color: string;
  wireframe?: boolean;
}

function Cube({ position, size, rotationSpeed, mousePosition, color, wireframe = false }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalPosition = useRef(new THREE.Vector3(...position));
  const currentPosition = useRef(new THREE.Vector3(...position));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotate the cube
    meshRef.current.rotation.x += delta * rotationSpeed * 0.5;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.3;

    // Calculate mouse influence (force field effect)
    const mouseX = mousePosition.current.x * 5;
    const mouseY = mousePosition.current.y * 5;

    const distanceX = currentPosition.current.x - mouseX;
    const distanceY = currentPosition.current.y - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Force field radius and strength
    const forceRadius = 3;
    const forceStrength = 2;

    if (distance < forceRadius && distance > 0) {
      // Repel from mouse
      const force = (1 - distance / forceRadius) * forceStrength;
      velocity.current.x += (distanceX / distance) * force * delta;
      velocity.current.y += (distanceY / distance) * force * delta;
    }

    // Spring back to original position
    const springStrength = 2;
    velocity.current.x += (originalPosition.current.x - currentPosition.current.x) * springStrength * delta;
    velocity.current.y += (originalPosition.current.y - currentPosition.current.y) * springStrength * delta;
    velocity.current.z += (originalPosition.current.z - currentPosition.current.z) * springStrength * delta;

    // Apply damping
    velocity.current.multiplyScalar(0.95);

    // Update position
    currentPosition.current.add(velocity.current.clone().multiplyScalar(delta * 60));

    meshRef.current.position.copy(currentPosition.current);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        transparent
        opacity={wireframe ? 0.6 : 0.9}
        metalness={0.1}
        roughness={0.2}
      />
    </mesh>
  );
}

function Scene({ cubeCount = 15, isDark = true }: { cubeCount?: number; isDark?: boolean }) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Generate cube configurations
  const cubes = useMemo(() => {
    const configs = [];
    for (let i = 0; i < cubeCount; i++) {
      const isWireframe = Math.random() > 0.5;
      configs.push({
        id: i,
        position: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 2,
        ] as [number, number, number],
        size: 0.3 + Math.random() * 0.5,
        rotationSpeed: 0.5 + Math.random() * 1.5,
        color: isDark
          ? (isWireframe ? "#ffffff" : "#888888")
          : (isWireframe ? "#000000" : "#444444"),
        wireframe: isWireframe,
        floatSpeed: 1 + Math.random() * 2,
        floatIntensity: 0.5 + Math.random() * 1,
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
      <ambientLight intensity={isDark ? 0.3 : 0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 0.8 : 1}
        color={isDark ? "#ffffff" : "#000000"}
      />
      <pointLight
        position={[-5, -5, -5]}
        intensity={isDark ? 0.3 : 0.4}
        color={isDark ? "#888888" : "#666666"}
      />

      {cubes.map((cube) => (
        <Float
          key={cube.id}
          speed={cube.floatSpeed}
          rotationIntensity={0.2}
          floatIntensity={cube.floatIntensity}
        >
          <Cube
            position={cube.position}
            size={cube.size}
            rotationSpeed={cube.rotationSpeed}
            mousePosition={mousePosition}
            color={cube.color}
            wireframe={cube.wireframe}
          />
        </Float>
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
  cubeCount = 15,
  isDark = true
}: InteractiveCubesProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene cubeCount={cubeCount} isDark={isDark} />
      </Canvas>
    </div>
  );
}
