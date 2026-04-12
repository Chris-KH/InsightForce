import type { ReactNode } from "react";
import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import { useRef } from "react";
import type { Group, Mesh } from "three";

import { cn } from "@/lib/utils";

function CrystalCore() {
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

function TetraCore() {
  const shellRef = useRef<Group>(null);
  const tetraRef = useRef<Mesh>(null);
  const pulseRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (shellRef.current) {
      shellRef.current.rotation.y += delta * 0.22;
      shellRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.42) * 0.12;
    }

    if (tetraRef.current) {
      tetraRef.current.rotation.y += delta * 0.3;
      tetraRef.current.rotation.z += delta * 0.1;
    }

    if (pulseRef.current) {
      const scale = 0.82 + Math.sin(clock.elapsedTime * 2.2) * 0.08;
      pulseRef.current.scale.setScalar(scale);
    }
  });

  return (
    <>
      <ambientLight intensity={0.82} />
      <pointLight position={[2.6, 2.2, 2.2]} intensity={1.1} color="#a5b4fc" />
      <pointLight
        position={[-2.2, -2, -2.3]}
        intensity={0.72}
        color="#22d3ee"
      />

      <Sparkles
        count={20}
        speed={0.4}
        size={1.6}
        color="#ddd6fe"
        scale={[3.4, 2.8, 3.4]}
      />

      <group ref={shellRef} rotation={[0.2, 0.4, 0]}>
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.76, 28, 28]} />
          <meshStandardMaterial
            color="#c4b5fd"
            emissive="#818cf8"
            emissiveIntensity={0.3}
            transparent
            opacity={0.14}
            roughness={0.84}
            metalness={0.05}
          />
        </mesh>

        <Float speed={1.1} rotationIntensity={0.24} floatIntensity={0.18}>
          <mesh ref={tetraRef}>
            <tetrahedronGeometry args={[0.95, 0]} />
            <meshStandardMaterial
              color="#e2e8f0"
              emissive="#8b5cf6"
              emissiveIntensity={0.28}
              roughness={0.28}
              metalness={0.42}
              wireframe
            />
          </mesh>
        </Float>

        <mesh rotation={[Math.PI / 2.8, 0.2, 0]}>
          <torusGeometry args={[1.45, 0.018, 12, 100]} />
          <meshBasicMaterial color="#c4b5fd" transparent opacity={0.74} />
        </mesh>
      </group>
    </>
  );
}

function SatelliteCore() {
  const systemRef = useRef<Group>(null);
  const satelliteARef = useRef<Mesh>(null);
  const satelliteBRef = useRef<Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    if (systemRef.current) {
      systemRef.current.rotation.y += delta * 0.12;
      systemRef.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    }

    if (satelliteARef.current) {
      satelliteARef.current.position.set(
        Math.cos(t * 0.92) * 1.35,
        Math.sin(t * 1.18) * 0.26,
        Math.sin(t * 0.92) * 1.35,
      );
    }

    if (satelliteBRef.current) {
      satelliteBRef.current.position.set(
        Math.cos(-t * 1.06) * 1.72,
        Math.sin(t * 0.92) * 0.34,
        Math.sin(-t * 1.06) * 1.72,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.88} />
      <pointLight position={[3.1, 2.6, 2.3]} intensity={1.16} color="#bae6fd" />
      <pointLight
        position={[-2.5, -1.9, -2]}
        intensity={0.68}
        color="#38bdf8"
      />

      <Sparkles
        count={24}
        speed={0.38}
        size={1.9}
        color="#e0f2fe"
        scale={[4, 2.9, 4]}
      />

      <group ref={systemRef} rotation={[0.28, 0.16, 0]}>
        <mesh>
          <sphereGeometry args={[0.7, 30, 30]} />
          <meshStandardMaterial
            color="#99f6e4"
            emissive="#0ea5e9"
            emissiveIntensity={0.28}
            roughness={0.34}
            metalness={0.24}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.55, 0, 0]} scale={[1.05, 0.72, 1]}>
          <torusGeometry args={[1.25, 0.024, 12, 120]} />
          <meshStandardMaterial
            color="#93c5fd"
            emissive="#38bdf8"
            emissiveIntensity={0.18}
            roughness={0.52}
            metalness={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.8, 0.4, 0]} scale={[1.16, 0.74, 1]}>
          <torusGeometry args={[1.56, 0.016, 10, 110]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={0.66} />
        </mesh>

        <mesh ref={satelliteARef}>
          <sphereGeometry args={[0.095, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh ref={satelliteBRef}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#c4b5fd" />
        </mesh>
      </group>
    </>
  );
}

export type PanelOrbital3DVariant = "crystal" | "tetra" | "satellite";

type PanelOrbital3DProps = {
  className?: string;
  variant?: PanelOrbital3DVariant;
};

const PANEL_SCENE: Record<PanelOrbital3DVariant, () => ReactNode> = {
  crystal: CrystalCore,
  tetra: TetraCore,
  satellite: SatelliteCore,
};

const PANEL_GLOW_CLASS: Record<PanelOrbital3DVariant, string> = {
  crystal:
    "bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(14,165,233,0.22),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.22),transparent_42%),radial-gradient(circle_at_82%_80%,rgba(56,189,248,0.2),transparent_38%)]",
  tetra:
    "bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.28),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(167,139,250,0.2),transparent_38%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(167,139,250,0.22),transparent_42%),radial-gradient(circle_at_82%_78%,rgba(196,181,253,0.18),transparent_38%)]",
  satellite:
    "bg-[radial-gradient(circle_at_20%_18%,rgba(16,185,129,0.22),transparent_40%),radial-gradient(circle_at_84%_80%,rgba(56,189,248,0.24),transparent_36%)] dark:bg-[radial-gradient(circle_at_20%_18%,rgba(45,212,191,0.2),transparent_40%),radial-gradient(circle_at_84%_80%,rgba(56,189,248,0.18),transparent_36%)]",
};

export function PanelOrbital3D({
  className,
  variant = "crystal",
}: PanelOrbital3DProps) {
  const SceneComponent = PANEL_SCENE[variant];

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-full",
        className,
      )}
      style={{
        maskImage:
          "radial-gradient(circle at center, rgba(0,0,0,0.95) 42%, rgba(0,0,0,0.78) 58%, rgba(0,0,0,0.18) 78%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, rgba(0,0,0,0.95) 42%, rgba(0,0,0,0.78) 58%, rgba(0,0,0,0.18) 78%, transparent 100%)",
      }}
    >
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full",
          PANEL_GLOW_CLASS[variant],
        )}
        animate={{ opacity: [0.5, 0.78, 0.5], scale: [0.96, 1.04, 0.96] }}
        transition={{
          duration: 9.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 0.2, 4.2], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneComponent />
      </Canvas>
    </div>
  );
}
