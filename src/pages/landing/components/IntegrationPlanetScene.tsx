import { Icon } from "@iconify-icon/react";
import { Float, Html, OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh, type ShaderMaterial } from "three";

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
};

const PLANET_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLANET_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
    float latWave = sin(vPosition.y * 4.8 + uTime * 0.7) * 0.5 + 0.5;
    float swirl = sin((vPosition.x + vPosition.z) * 6.2 - uTime * 0.52) * 0.5 + 0.5;

    vec3 base = mix(uColorA, uColorB, latWave);
    vec3 accent = mix(base, uColorC, swirl * 0.34);
    vec3 finalColor = accent + fresnel * 0.28;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function OrbitingBadge({
  node,
  radius,
  speed,
  phase,
  wobble,
}: OrbitingBadgeProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius * 0.68;
    const y = Math.sin(t * 1.42 + phase) * wobble;
    const pulse = 1 + Math.sin(t * 2.1) * 0.08;

    ref.current.position.set(x, y, z);
    ref.current.rotation.y = -t;
    ref.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <sphereGeometry args={[0.19, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.6}
          metalness={0.22}
          roughness={0.2}
        />
      </mesh>

      <Html center transform sprite distanceFactor={12}>
        <span
          className="inline-grid size-7 place-items-center rounded-full border bg-white/92 shadow-[0_8px_24px_rgba(15,23,42,0.42)]"
          style={{ borderColor: `${node.color}99` }}
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
  const shaderRef = useRef<ShaderMaterial>(null);

  const shaderUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new Color("#6366f1") },
      uColorB: { value: new Color("#22d3ee") },
      uColorC: { value: new Color("#f43f5e") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.14;
      planetRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.09;
    }

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[1.85, 96, 96]} />
        <shaderMaterial
          ref={shaderRef}
          uniforms={shaderUniforms}
          vertexShader={PLANET_VERTEX_SHADER}
          fragmentShader={PLANET_FRAGMENT_SHADER}
        />
      </mesh>

      <mesh scale={1.09}>
        <sphereGeometry args={[1.85, 72, 72]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#67e8f9"
          emissiveIntensity={0.24}
          transparent
          opacity={0.17}
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2.55, 0.2, 0]}
        scale={[1.24, 0.78, 1.24]}
      >
        <torusGeometry args={[2.1, 0.058, 36, 260]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.32}
          transparent
          opacity={0.72}
          roughness={0.24}
          metalness={0.34}
        />
      </mesh>

      <Html center transform distanceFactor={8.2}>
        <div className="pointer-events-none rounded-full border border-white/25 bg-slate-900/28 px-6 py-3 text-center shadow-[0_10px_30px_rgba(15,23,42,0.38)] backdrop-blur-sm">
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
  const innerNodes = useMemo(
    () => nodes.filter((_, index) => index % 2 === 0),
    [nodes],
  );
  const outerNodes = useMemo(
    () => nodes.filter((_, index) => index % 2 === 1),
    [nodes],
  );

  return (
    <>
      <ambientLight intensity={0.82} />
      <directionalLight
        castShadow
        position={[7.4, 8.8, 6.4]}
        intensity={1.34}
        color="#dbeafe"
      />
      <pointLight
        position={[-5.4, -3.4, -3.8]}
        intensity={0.95}
        color="#22d3ee"
      />
      <pointLight position={[0.4, 0.3, 2.1]} intensity={1.95} color="#818cf8" />

      <Stars
        radius={24}
        depth={32}
        count={900}
        factor={2.8}
        saturation={0}
        fade
        speed={1.2}
      />

      <Sparkles
        count={78}
        speed={0.45}
        size={2.8}
        scale={[10, 5, 10]}
        color="#a5f3fc"
      />

      <group rotation={[Math.PI / 5.5, 0.28, 0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.4, 0.81, 1]}>
          <torusGeometry args={[3.05, 0.018, 16, 300]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#60a5fa"
            emissiveIntensity={0.22}
            transparent
            opacity={0.58}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.7, 0.85, 1]}>
          <torusGeometry args={[3.78, 0.016, 16, 300]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#93c5fd"
            emissiveIntensity={0.18}
            transparent
            opacity={0.46}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.95, 0.91, 1]}>
          <torusGeometry args={[4.26, 0.012, 16, 300]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.26} />
        </mesh>

        {innerNodes.map((node, index) => (
          <OrbitingBadge
            key={`inner-${node.name}`}
            node={node}
            radius={3.05}
            speed={0.48 + index * 0.03}
            phase={(index / Math.max(1, innerNodes.length)) * Math.PI * 2}
            wobble={0.28}
          />
        ))}

        {outerNodes.map((node, index) => (
          <OrbitingBadge
            key={`outer-${node.name}`}
            node={node}
            radius={3.78}
            speed={-0.34 - index * 0.024}
            phase={(index / Math.max(1, outerNodes.length)) * Math.PI * 2}
            wobble={0.34}
          />
        ))}
      </group>

      <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.46}>
        <PlanetCore coreTagline={coreTagline} coreName={coreName} />
      </Float>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, 0]}
        receiveShadow
      >
        <circleGeometry args={[5.5, 80]} />
        <shadowMaterial transparent opacity={0.25} />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.26}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 2.25}
        maxPolarAngle={Math.PI / 1.86}
      />
    </>
  );
}

export function IntegrationPlanetScene(props: IntegrationPlanetSceneProps) {
  return (
    <div className="relative mx-auto h-[29rem] w-full max-w-[44rem] overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(circle_at_52%_43%,hsl(var(--primary)/0.24),hsl(var(--background))_68%)] shadow-[0_42px_140px_-56px_hsl(var(--primary)/0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(125,211,252,0.22),transparent_40%),radial-gradient(circle_at_80%_18%,rgba(129,140,248,0.2),transparent_35%)]" />

      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 2.45, 8.8], fov: 41 }}
      >
        <PlanetSceneContent {...props} />
      </Canvas>
    </div>
  );
}
