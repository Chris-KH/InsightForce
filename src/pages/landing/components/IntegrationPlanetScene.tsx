import { Icon } from "@iconify-icon/react";
import { Float, Html, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  CanvasTexture,
  MathUtils,
  RepeatWrapping,
  type Group,
  type Mesh,
} from "three";

export type IntegrationPlanetNode = {
  name: string;
  category: string;
  icon: string;
  color: string;
  fallback: string;
};

type IntegrationPlanetSceneProps = {
  nodes: IntegrationPlanetNode[];
  coreTagline: string;
  coreName: string;
};

type OrbitingBadgeProps = {
  node: IntegrationPlanetNode;
  radius: number;
  speed: number;
  phase: number;
  wobble: number;
  altitude: number;
  tilt: number;
};

type OrbitConfig = {
  node: IntegrationPlanetNode;
  radius: number;
  speed: number;
  phase: number;
  wobble: number;
  altitude: number;
  tilt: number;
};

function createPlanetTextures() {
  const size = 1024;

  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext("2d");

  if (!colorCtx || !bumpCtx) {
    const fallback = new CanvasTexture(colorCanvas);
    return { colorMap: fallback, bumpMap: fallback };
  }

  const baseGradient = colorCtx.createLinearGradient(0, 0, size, size);
  baseGradient.addColorStop(0, "#3b82f6");
  baseGradient.addColorStop(0.28, "#22d3ee");
  baseGradient.addColorStop(0.58, "#7c3aed");
  baseGradient.addColorStop(1, "#f43f5e");

  colorCtx.fillStyle = baseGradient;
  colorCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 34; i += 1) {
    const y = (size / 34) * i + Math.random() * 12;
    const height = 24 + Math.random() * 42;
    colorCtx.globalAlpha = 0.1 + Math.random() * 0.22;
    colorCtx.fillStyle =
      i % 3 === 0 ? "#bfdbfe" : i % 3 === 1 ? "#67e8f9" : "#fda4af";
    colorCtx.beginPath();
    colorCtx.ellipse(
      size * 0.5,
      y,
      size * 0.72,
      height,
      Math.random() * 0.4,
      0,
      Math.PI * 2,
    );
    colorCtx.fill();
  }

  colorCtx.globalAlpha = 0.32;
  for (let i = 0; i < 2200; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.6;
    colorCtx.fillStyle = i % 2 === 0 ? "#ffffff" : "#c4b5fd";
    colorCtx.beginPath();
    colorCtx.arc(x, y, r, 0, Math.PI * 2);
    colorCtx.fill();
  }
  colorCtx.globalAlpha = 1;

  const bumpGradient = bumpCtx.createLinearGradient(0, 0, size, size);
  bumpGradient.addColorStop(0, "#6b7280");
  bumpGradient.addColorStop(0.5, "#f8fafc");
  bumpGradient.addColorStop(1, "#334155");
  bumpCtx.fillStyle = bumpGradient;
  bumpCtx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2600; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const shade = Math.floor(120 + Math.random() * 120);
    const alpha = 0.08 + Math.random() * 0.2;
    const dot = 0.8 + Math.random() * 2;
    bumpCtx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
    bumpCtx.beginPath();
    bumpCtx.arc(x, y, dot, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  const colorMap = new CanvasTexture(colorCanvas);
  colorMap.wrapS = RepeatWrapping;
  colorMap.wrapT = RepeatWrapping;
  colorMap.repeat.set(1.2, 1.2);

  const bumpMap = new CanvasTexture(bumpCanvas);
  bumpMap.wrapS = RepeatWrapping;
  bumpMap.wrapT = RepeatWrapping;
  bumpMap.repeat.set(1.3, 1.3);

  return { colorMap, bumpMap };
}

function OrbitingBadge({
  node,
  radius,
  speed,
  phase,
  wobble,
  altitude,
  tilt,
}: OrbitingBadgeProps) {
  const planeRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!bodyRef.current || !planeRef.current) return;

    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.74;
    const y = Math.sin(t * 1.37 + phase) * wobble + altitude;
    const depthScale = MathUtils.mapLinear(z, -radius, radius, 0.82, 1.05);
    const pulse = 1 + Math.sin(t * 1.75) * 0.04;

    bodyRef.current.position.set(x, y, z);
    bodyRef.current.rotation.y = -t;
    bodyRef.current.scale.setScalar(depthScale * pulse);
    planeRef.current.rotation.z = tilt;
  });

  return (
    <group ref={planeRef}>
      <group ref={bodyRef}>
        <mesh castShadow>
          <sphereGeometry args={[0.165, 24, 24]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.24}
          />
        </mesh>

        <Html center transform sprite distanceFactor={12}>
          <span
            className="inline-grid size-7 place-items-center rounded-full border bg-white/94 shadow-[0_8px_22px_rgba(15,23,42,0.42)]"
            style={{ borderColor: `${node.color}bb` }}
          >
            {node.icon ? (
              <Icon
                icon={node.icon}
                width="15"
                height="15"
                style={{ color: node.color }}
                title={`${node.name} - ${node.category}`}
              />
            ) : (
              <span
                className="text-[10px] font-semibold"
                style={{ color: node.color }}
              >
                {node.fallback}
              </span>
            )}
          </span>
        </Html>
      </group>
    </group>
  );
}

function PlanetCore({
  coreTagline,
  coreName,
}: {
  coreTagline: string;
  coreName: string;
}) {
  const planetRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  const { colorMap, bumpMap } = useMemo(() => createPlanetTextures(), []);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.1;
      planetRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.17) * 0.055;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.085;
    }
  });

  return (
    <group>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.68, 96, 96]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.17}
          roughness={0.52}
          metalness={0.16}
          emissive="#1d4ed8"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh scale={1.08}>
        <sphereGeometry args={[1.68, 72, 72]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#67e8f9"
          emissiveIntensity={0.18}
          transparent
          opacity={0.14}
          roughness={0.95}
          metalness={0.04}
        />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2.6, 0.26, 0]}
        scale={[1.22, 0.79, 1.22]}
      >
        <torusGeometry args={[1.96, 0.052, 30, 260]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.28}
          transparent
          opacity={0.72}
          roughness={0.28}
          metalness={0.3}
        />
      </mesh>

      <Html center transform distanceFactor={8.5}>
        <div className="pointer-events-none rounded-full border border-white/25 bg-slate-900/30 px-6 py-3 text-center shadow-[0_10px_30px_rgba(15,23,42,0.4)] backdrop-blur-sm">
          <p className="text-[10px] font-semibold tracking-widest text-slate-100/90 uppercase">
            {coreTagline}
          </p>
          <p className="mt-1 font-heading text-[1.62rem] leading-none font-semibold text-white">
            {coreName}
          </p>
        </div>
      </Html>
    </group>
  );
}

function PlanetSceneContent({
  nodes,
  coreTagline,
  coreName,
}: IntegrationPlanetSceneProps) {
  const orbitConfigs = useMemo<OrbitConfig[]>(
    () =>
      nodes.map((node, index) => {
        const tier = index % 3;
        const radius = 3.55 + tier * 0.92 + (index % 2 === 0 ? 0.18 : -0.08);
        const speedBase = tier === 1 ? -0.26 : tier === 2 ? 0.2 : 0.3;

        return {
          node,
          radius,
          speed: speedBase + (index % 5) * 0.014,
          phase: index * 2.399963 + tier * 0.63,
          wobble: 0.2 + tier * 0.08,
          altitude: (index % 4) * 0.08 - 0.16,
          tilt: (tier - 1) * 0.22 + (index % 3) * 0.04 - 0.06,
        };
      }),
    [nodes],
  );

  return (
    <>
      <ambientLight intensity={0.86} />
      <directionalLight
        castShadow
        position={[8, 8.5, 6.2]}
        intensity={1.28}
        color="#dbeafe"
      />
      <pointLight
        position={[-6.2, -3.6, -4.2]}
        intensity={0.86}
        color="#22d3ee"
      />
      <pointLight position={[0.2, 0.4, 2.8]} intensity={1.72} color="#818cf8" />

      <Stars
        radius={27}
        depth={34}
        count={980}
        factor={2.9}
        saturation={0}
        fade
        speed={0.85}
      />

      <Sparkles
        count={96}
        speed={0.38}
        size={2.4}
        scale={[11, 6, 11]}
        color="#a5f3fc"
      />

      <group rotation={[Math.PI / 5.7, 0.18, 0.03]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.32, 0.8, 1]}>
          <torusGeometry args={[3.55, 0.015, 16, 320]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#60a5fa"
            emissiveIntensity={0.18}
            transparent
            opacity={0.54}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.58, 0.84, 1]}>
          <torusGeometry args={[4.32, 0.013, 16, 320]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#93c5fd"
            emissiveIntensity={0.14}
            transparent
            opacity={0.42}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.82, 0.89, 1]}>
          <torusGeometry args={[5.02, 0.011, 16, 320]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.24} />
        </mesh>

        {orbitConfigs.map((config) => (
          <OrbitingBadge
            key={config.node.name}
            node={config.node}
            radius={config.radius}
            speed={config.speed}
            phase={config.phase}
            wobble={config.wobble}
            altitude={config.altitude}
            tilt={config.tilt}
          />
        ))}
      </group>

      <Float speed={0.95} rotationIntensity={0.12} floatIntensity={0.38}>
        <PlanetCore coreTagline={coreTagline} coreName={coreName} />
      </Float>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]}
        receiveShadow
      >
        <circleGeometry args={[6.25, 88]} />
        <shadowMaterial transparent opacity={0.24} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.2}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.9}
      />
    </>
  );
}

export function IntegrationPlanetScene(props: IntegrationPlanetSceneProps) {
  return (
    <div className="relative mx-auto h-[30rem] w-full max-w-[46rem] overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(circle_at_52%_43%,hsl(var(--primary)/0.22),hsl(var(--background))_70%)] shadow-[0_44px_150px_-62px_hsl(var(--primary)/0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(125,211,252,0.2),transparent_40%),radial-gradient(circle_at_80%_18%,rgba(129,140,248,0.2),transparent_35%)]" />

      <Canvas
        shadows
        dpr={[1, 1.55]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 2.8, 10.2], fov: 38 }}
      >
        <PlanetSceneContent {...props} />
      </Canvas>
    </div>
  );
}
