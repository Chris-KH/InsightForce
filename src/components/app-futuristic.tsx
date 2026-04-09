import type { ReactNode } from "react";
import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import { useRef } from "react";
import type { Group, Mesh } from "three";

import { cn } from "@/lib/utils";

type RevealBlockProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function RevealBlock({
  children,
  className,
  delay = 0,
  y = 12,
}: RevealBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type FloatingOrbProps = {
  className?: string;
  duration?: number;
  delay?: number;
  drift?: number;
};

export function FloatingOrb({
  className,
  duration = 8,
  delay = 0,
  drift = 12,
}: FloatingOrbProps) {
  return (
    <motion.div
      aria-hidden
      className={cn("absolute rounded-full blur-3xl", className)}
      animate={{
        y: [0, -drift, 0],
        x: [0, drift * 0.5, 0],
        opacity: [0.25, 0.45, 0.25],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
}

type SurfaceGridProps = {
  className?: string;
};

export function SurfaceGrid({ className }: SurfaceGridProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-[radial-gradient(circle,rgba(15,23,42,0.12)_1px,transparent_1px)] bg-size-[22px_22px] opacity-35 dark:opacity-20",
        className,
      )}
    />
  );
}

type PulseDotProps = {
  className?: string;
};

export function PulseDot({ className }: PulseDotProps) {
  return (
    <span className={cn("relative inline-flex size-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-70" />
      <span className="relative inline-flex size-2 rounded-full bg-current" />
    </span>
  );
}

function OrbitalCore() {
  const orbitRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.18;
      orbitRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.35) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.34;
      coreRef.current.rotation.z += delta * 0.09;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.24;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[3.2, 2.4, 2.6]} intensity={1.2} color="#7dd3fc" />
      <pointLight
        position={[-2.4, -1.8, -2.2]}
        intensity={0.7}
        color="#1d4ed8"
      />

      <Sparkles
        count={26}
        speed={0.35}
        size={1.8}
        color="#c7d2fe"
        scale={[3.8, 2.8, 3.8]}
      />

      <group ref={orbitRef} rotation={[0.36, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[1.28, 0.04, 16, 120]} />
          <meshStandardMaterial
            color="#93c5fd"
            emissive="#60a5fa"
            emissiveIntensity={0.32}
            roughness={0.42}
            metalness={0.2}
            transparent
            opacity={0.56}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.8, 0, 0]} scale={[1.02, 0.72, 1]}>
          <torusGeometry args={[1.55, 0.02, 12, 100]} />
          <meshStandardMaterial
            color="#a5b4fc"
            emissive="#818cf8"
            emissiveIntensity={0.34}
            roughness={0.58}
            metalness={0.15}
            transparent
            opacity={0.52}
          />
        </mesh>

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.24}>
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.64, 1]} />
            <meshStandardMaterial
              color="#bfdbfe"
              emissive="#3b82f6"
              emissiveIntensity={0.55}
              roughness={0.3}
              metalness={0.34}
            />
          </mesh>
        </Float>

        <mesh ref={ringRef} rotation={[0.68, 0, 0]}>
          <torusGeometry args={[0.88, 0.016, 10, 90]} />
          <meshBasicMaterial color="#dbeafe" transparent opacity={0.75} />
        </mesh>
      </group>
    </>
  );
}

type PanelOrbital3DProps = {
  className?: string;
};

export function PanelOrbital3D({ className }: PanelOrbital3DProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(14,165,233,0.22),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.22),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(56,189,248,0.2),transparent_38%)]" />

      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 0.2, 4.2], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <OrbitalCore />
      </Canvas>
    </div>
  );
}
