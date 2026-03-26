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
  opacity: number;
  depth: number;
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
  opacity,
  depth,
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

    // Smooth rotation - slower for far objects, faster for close
    const depthFactor = (depth + 10) / 15;
    meshRef.current.rotation.x += delta * rotationSpeed * 0.2 * depthFactor;
    meshRef.current.rotation.y += delta * rotationSpeed * 0.15 * depthFactor;
    meshRef.current.rotation.z += delta * rotationSpeed * 0.08 * depthFactor;

    // Move target position along the flow path
    targetPosition.current.add(flowVelocity.current.clone().multiplyScalar(delta));

    // Respawn target when out of bounds
    if (targetPosition.current.y > bounds.maxY + 1) {
      targetPosition.current.y = bounds.minY - 1;
      targetPosition.current.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
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

    // Calculate mouse force - stronger effect on closer objects
    const mouseX = mousePosition.current.x * 6;
    const mouseY = mousePosition.current.y * 5;

    const distanceX = actualPosition.current.x - mouseX;
    const distanceY = actualPosition.current.y - mouseY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Force field - stronger for closer cubes
    const forceRadius = 4 + (depth + 5) * 0.3;
    const forceStrength = 4 * depthFactor;

    let mouseForceX = 0;
    let mouseForceY = 0;

    if (distance < forceRadius && distance > 0) {
      const force = (1 - distance / forceRadius) * forceStrength;
      mouseForceX = (distanceX / distance) * force;
      mouseForceY = (distanceY / distance) * force;
    }

    // Spring back to target position
    const springStrength = 3;
    const springX = (targetPosition.current.x - actualPosition.current.x) * springStrength * delta;
    const springY = (targetPosition.current.y - actualPosition.current.y) * springStrength * delta;
    const springZ = (targetPosition.current.z - actualPosition.current.z) * springStrength * delta;

    // Apply forces
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
        opacity={opacity}
        metalness={wireframe ? 0 : 0.3}
        roughness={wireframe ? 1 : 0.4}
        emissive={wireframe ? color : "#000000"}
        emissiveIntensity={wireframe ? 0.4 : 0}
      />
    </mesh>
  );
}


// Atmospheric glow
function AtmosphericGlow({ isDark }: { isDark: boolean }) {
  return (
    <>
      {/* Main backlight glow */}
      <mesh position={[0, 0, -12]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial
          color={isDark ? "#1a1a2e" : "#e0e0e0"}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Secondary glow - top right */}
      <mesh position={[5, 4, -10]}>
        <circleGeometry args={[4, 32]} />
        <meshBasicMaterial
          color={isDark ? "#16213e" : "#d0d0d0"}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Accent glow - bottom left */}
      <mesh position={[-4, -3, -11]}>
        <circleGeometry args={[3, 32]} />
        <meshBasicMaterial
          color={isDark ? "#0f3460" : "#c0c0c0"}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
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
    minX: -8,
    maxX: 8,
    minY: -7,
    maxY: 7,
  };

  // Generate particle configurations with depth layers
  const particles = useMemo(() => {
    const configs = [];
    for (let i = 0; i < cubeCount; i++) {
      const isWireframe = Math.random() > 0.55;

      // Create depth layers: far (-10 to -6), mid (-6 to -2), close (-2 to 2)
      const depthRandom = Math.random();
      let depth: number;
      let sizeMultiplier: number;
      let opacityMultiplier: number;
      let speedMultiplier: number;

      if (depthRandom < 0.3) {
        // Far layer - smaller, slightly dimmer, slower
        depth = -10 + Math.random() * 4;
        sizeMultiplier = 0.5;
        opacityMultiplier = 0.6;
        speedMultiplier = 0.5;
      } else if (depthRandom < 0.7) {
        // Mid layer - medium
        depth = -6 + Math.random() * 4;
        sizeMultiplier = 0.8;
        opacityMultiplier = 0.85;
        speedMultiplier = 0.8;
      } else {
        // Close layer - larger, full brightness, faster
        depth = -2 + Math.random() * 4;
        sizeMultiplier = 1.3;
        opacityMultiplier = 1;
        speedMultiplier = 1.2;
      }

      const startX = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      const startY = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

      // Flow direction - mostly upward with variation
      const flowAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
      const flowDirection: [number, number, number] = [
        Math.cos(flowAngle) * 0.4,
        Math.sin(flowAngle) * -1,
        0,
      ];

      const baseSize = 0.2 + Math.random() * 0.4;
      const baseOpacity = isWireframe ? 0.6 : 0.9;

      configs.push({
        id: i,
        position: [startX, startY, depth] as [number, number, number],
        size: baseSize * sizeMultiplier,
        rotationSpeed: (0.3 + Math.random() * 0.6) * speedMultiplier,
        color: isDark
          ? isWireframe
            ? "#ffffff"
            : `hsl(0, 0%, ${70 + Math.random() * 25}%)`
          : isWireframe
            ? "#000000"
            : `hsl(0, 0%, ${20 + Math.random() * 30}%)`,
        wireframe: isWireframe,
        flowSpeed: (0.4 + Math.random() * 0.5) * speedMultiplier,
        flowDirection,
        opacity: baseOpacity * opacityMultiplier,
        depth,
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
      {/* Strong ambient for base visibility */}
      <ambientLight intensity={isDark ? 0.7 : 0.6} />

      {/* Key light - top right */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={isDark ? 1.8 : 1.2}
        color="#ffffff"
      />

      {/* Fill light - left side */}
      <directionalLight
        position={[-5, 3, 3]}
        intensity={isDark ? 1.2 : 0.8}
        color="#ffffff"
      />

      {/* Bottom fill - illuminates undersides */}
      <directionalLight
        position={[0, -5, 3]}
        intensity={isDark ? 0.8 : 0.5}
        color="#ffffff"
      />

      {/* Front light - ensures faces toward camera are lit */}
      <pointLight
        position={[0, 0, 10]}
        intensity={isDark ? 1.5 : 1}
        color="#ffffff"
      />

      {/* Back rim light for depth */}
      <pointLight
        position={[0, 0, -10]}
        intensity={isDark ? 0.5 : 0.3}
        color="#aaaaaa"
      />

      {/* Atmospheric glow in background */}
      <AtmosphericGlow isDark={isDark} />


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
          opacity={particle.opacity}
          depth={particle.depth}
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
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <Scene cubeCount={cubeCount} isDark={isDark} />
      </Canvas>
    </div>
  );
}
