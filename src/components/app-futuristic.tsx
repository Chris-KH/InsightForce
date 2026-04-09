import type { ReactNode } from "react";
import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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

type SketchFlowLinesProps = {
  className?: string;
  tone?: "primary" | "mixed";
};

export function SketchFlowLines({
  className,
  tone = "mixed",
}: SketchFlowLinesProps) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1600 1000"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        tone === "primary" ? "text-primary/36" : "text-foreground/26",
        className,
      )}
    >
      <motion.path
        d="M-30 182 C 250 40 520 272 812 154 C 1124 36 1326 246 1648 126"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeDasharray="9 11"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.56, 0] }}
        transition={{
          duration: 9.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      />
      <motion.path
        d="M84 834 C 268 700 510 930 752 842 C 1014 746 1210 932 1500 818"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="6 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0, 0.42, 0] }}
        transition={{
          duration: 9.2,
          delay: 0.7,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.1,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}

type SignalWaveCanvasProps = {
  className?: string;
  cell?: number;
  speed?: number;
};

export function SignalWaveCanvas({
  className,
  cell = 26,
  speed = 0.022,
}: SignalWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);

      const dark = document.documentElement.classList.contains("dark");
      const rgb = dark ? "147, 197, 253" : "37, 99, 235";

      const cols = Math.max(1, Math.floor(rect.width / cell));
      const rows = Math.max(1, Math.floor(rect.height / cell));

      for (let row = 0; row <= rows; row += 1) {
        for (let col = 0; col <= cols; col += 1) {
          const x = (col + 0.5) * (rect.width / cols);
          const y = (row + 0.5) * (rect.height / rows);

          const waveA = Math.sin(col * 0.34 + time * 2.1);
          const waveB = Math.cos(row * 0.28 + time * 1.7);
          const waveC = Math.sin((col + row) * 0.16 + time * 1.3);
          const normalized = (waveA + waveB + waveC + 3) / 6;

          const radius = 0.6 + normalized * 1.65;
          const alpha = (dark ? 0.09 : 0.12) + normalized * 0.32;

          context.beginPath();
          context.fillStyle = `rgba(${rgb}, ${Math.min(alpha, 0.5)})`;
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      time += speed;
      frameRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [cell, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      style={{ display: "block" }}
    />
  );
}

type CometRailOverlayProps = {
  className?: string;
  density?: "low" | "medium" | "high";
  tone?: "primary" | "mixed";
};

type CometSeed = {
  top: string;
  left: string;
  width: number;
  delay: number;
  duration: number;
  tilt: number;
  drift: number;
};

const COMET_SEEDS: CometSeed[] = [
  {
    top: "10%",
    left: "8%",
    width: 124,
    delay: 0.15,
    duration: 6.7,
    tilt: 8,
    drift: 170,
  },
  {
    top: "22%",
    left: "28%",
    width: 112,
    delay: 1.1,
    duration: 7.2,
    tilt: 12,
    drift: 162,
  },
  {
    top: "36%",
    left: "14%",
    width: 134,
    delay: 0.65,
    duration: 7,
    tilt: -5,
    drift: 182,
  },
  {
    top: "48%",
    left: "46%",
    width: 128,
    delay: 1.7,
    duration: 7.5,
    tilt: 10,
    drift: 176,
  },
  {
    top: "62%",
    left: "20%",
    width: 118,
    delay: 0.35,
    duration: 6.8,
    tilt: -8,
    drift: 168,
  },
  {
    top: "72%",
    left: "54%",
    width: 142,
    delay: 2.1,
    duration: 7.6,
    tilt: 9,
    drift: 188,
  },
  {
    top: "84%",
    left: "11%",
    width: 106,
    delay: 1.4,
    duration: 6.9,
    tilt: -6,
    drift: 158,
  },
  {
    top: "90%",
    left: "36%",
    width: 122,
    delay: 2.45,
    duration: 7.3,
    tilt: 7,
    drift: 172,
  },
];

const COMET_COUNT: Record<
  NonNullable<CometRailOverlayProps["density"]>,
  number
> = {
  low: 3,
  medium: 5,
  high: 8,
};

function cometTone(
  index: number,
  tone: NonNullable<CometRailOverlayProps["tone"]>,
) {
  if (tone === "primary") {
    return "via-primary/72 bg-linear-to-r from-transparent";
  }

  return index % 2 === 0
    ? "via-primary/70 bg-linear-to-r from-transparent"
    : "via-chart-2/70 bg-linear-to-r from-transparent";
}

function cometHead(
  index: number,
  tone: NonNullable<CometRailOverlayProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/86";
  }

  return index % 2 === 0 ? "bg-primary/84" : "bg-chart-2/84";
}

export function CometRailOverlay({
  className,
  density = "medium",
  tone = "mixed",
}: CometRailOverlayProps) {
  const visible = COMET_SEEDS.slice(0, COMET_COUNT[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((seed, index) => (
        <motion.div
          key={`${seed.left}-${seed.top}`}
          className="absolute"
          style={{ top: seed.top, left: seed.left }}
          animate={{
            opacity: [0, 0.95, 0],
            x: [-seed.drift, seed.drift],
            y: [0, -10, 0],
            rotate: [seed.tilt, seed.tilt, seed.tilt],
          }}
          transition={{
            duration: seed.duration,
            delay: seed.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.95 + index * 0.09,
            ease: "easeInOut",
          }}
        >
          <span
            className={cn(
              "block h-0.5 rounded-full to-transparent",
              cometTone(index, tone),
            )}
            style={{ width: `${seed.width}px` }}
          />
          <span
            className={cn(
              "absolute top-1/2 right-0 size-2 -translate-y-1/2 rounded-full blur-[2px]",
              cometHead(index, tone),
            )}
          />
        </motion.div>
      ))}
    </div>
  );
}

type OrbitHaloProps = {
  className?: string;
  tone?: "primary" | "mixed";
  spin?: "slow" | "medium" | "fast";
};

const ORBIT_SPEED: Record<NonNullable<OrbitHaloProps["spin"]>, number> = {
  slow: 22,
  medium: 16,
  fast: 11,
};

function orbitRingClass(
  index: number,
  tone: NonNullable<OrbitHaloProps["tone"]>,
) {
  if (tone === "primary") {
    return "border-primary/42";
  }

  return index % 2 === 0 ? "border-primary/40" : "border-chart-2/40";
}

function orbitDotClass(
  index: number,
  tone: NonNullable<OrbitHaloProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/82";
  }

  return index % 2 === 0 ? "bg-primary/80" : "bg-chart-2/80";
}

export function OrbitHalo({
  className,
  tone = "mixed",
  spin = "medium",
}: OrbitHaloProps) {
  const base = ORBIT_SPEED[spin];

  return (
    <div
      className={cn("pointer-events-none absolute isolate", className)}
      aria-hidden
    >
      <motion.div
        className="absolute inset-1/2 h-18 w-18 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/16 blur-2xl"
        animate={{ opacity: [0.2, 0.52, 0.2], scale: [0.92, 1.12, 0.92] }}
        transition={{
          duration: base * 0.62,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {[0, 1, 2].map((index) => {
        const size = 110 + index * 46;

        return (
          <motion.div
            key={`orbit-ring-${index}`}
            className={cn(
              "absolute inset-1/2 rounded-full border border-dashed",
              orbitRingClass(index, tone),
            )}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `${size * -0.5}px`,
              marginTop: `${size * -0.5}px`,
            }}
            animate={{ rotate: index % 2 === 0 ? [0, 360] : [360, 0] }}
            transition={{
              duration: base + index * 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <span
              className={cn(
                "absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]",
                orbitDotClass(index, tone),
              )}
            />
          </motion.div>
        );
      })}

      <motion.div
        className="absolute inset-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/68"
        animate={{ opacity: [0.36, 1, 0.36], scale: [0.82, 1.2, 0.82] }}
        transition={{
          duration: base * 0.42,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

type FloatingShardFieldProps = {
  className?: string;
  density?: "low" | "medium" | "high";
  tone?: "primary" | "mixed";
};

type ShardSeed = {
  top: string;
  left: string;
  width: number;
  height: number;
  tilt: number;
  delay: number;
  duration: number;
};

const SHARD_SEEDS: ShardSeed[] = [
  {
    top: "10%",
    left: "14%",
    width: 14,
    height: 28,
    tilt: -22,
    delay: 0.14,
    duration: 8.8,
  },
  {
    top: "18%",
    left: "38%",
    width: 12,
    height: 24,
    tilt: 28,
    delay: 1.2,
    duration: 9.1,
  },
  {
    top: "32%",
    left: "68%",
    width: 15,
    height: 30,
    tilt: -14,
    delay: 0.65,
    duration: 8.9,
  },
  {
    top: "46%",
    left: "52%",
    width: 16,
    height: 32,
    tilt: 20,
    delay: 1.85,
    duration: 9.4,
  },
  {
    top: "60%",
    left: "21%",
    width: 12,
    height: 24,
    tilt: -30,
    delay: 1.35,
    duration: 8.7,
  },
  {
    top: "72%",
    left: "77%",
    width: 11,
    height: 26,
    tilt: 21,
    delay: 0.42,
    duration: 8.3,
  },
  {
    top: "82%",
    left: "45%",
    width: 14,
    height: 30,
    tilt: -24,
    delay: 2.08,
    duration: 9.2,
  },
  {
    top: "90%",
    left: "62%",
    width: 12,
    height: 22,
    tilt: -12,
    delay: 2.32,
    duration: 8.8,
  },
];

const SHARD_COUNT: Record<
  NonNullable<FloatingShardFieldProps["density"]>,
  number
> = {
  low: 3,
  medium: 5,
  high: 8,
};

function shardClass(
  index: number,
  tone: NonNullable<FloatingShardFieldProps["tone"]>,
) {
  if (tone === "primary") {
    return "bg-primary/30 border-primary/42";
  }

  return index % 2 === 0
    ? "bg-primary/28 border-primary/40"
    : "bg-chart-2/28 border-chart-2/40";
}

export function FloatingShardField({
  className,
  density = "medium",
  tone = "mixed",
}: FloatingShardFieldProps) {
  const visible = SHARD_SEEDS.slice(0, SHARD_COUNT[density]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {visible.map((seed, index) => (
        <motion.span
          key={`${seed.left}-${seed.top}-${seed.delay}`}
          className={cn(
            "absolute block rounded-[3px] border backdrop-blur-[1px]",
            shardClass(index, tone),
          )}
          style={{
            top: seed.top,
            left: seed.left,
            width: `${seed.width}px`,
            height: `${seed.height}px`,
            transform: `rotate(${seed.tilt}deg)`,
          }}
          animate={{
            opacity: [0.14, 0.56, 0.14],
            y: [0, -14, 0],
            rotate: [seed.tilt, seed.tilt + 12, seed.tilt],
          }}
          transition={{
            duration: seed.duration,
            delay: seed.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

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

type PanelOrbital3DVariant = "crystal" | "tetra" | "satellite";

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
