import { Icon } from "@iconify-icon/react";
import { Float, Html, Sparkles, Stars, useTexture } from "@react-three/drei";
import { Canvas, type RootState, useFrame } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  LinearFilter,
  MathUtils,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type WebGLRenderer,
} from "three";
import { useIsMobile } from "@/hooks/use-mobile";
import earthCloudsUrl from "@/assets/textures/earth-clouds.png";
import earthDiffuseUrl from "@/assets/textures/earth-diffuse.jpg";
import earthNormalUrl from "@/assets/textures/earth-normal.jpg";

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

type SceneInteractionState = {
  yaw: number;
  pitch: number;
  distance: number;
};

type PlanetSceneContentProps = IntegrationPlanetSceneProps & {
  isMobile: boolean;
  interactionRef: RefObject<SceneInteractionState>;
};

const ORBIT_RADII = [4.6, 5.45, 6.35, 7.25, 8.05];
const ORBIT_ALTITUDE = [-0.26, 0.02, 0.29, -0.08, 0.16];
const ORBIT_TILT = [-0.24, -0.1, 0.08, 0.21, 0.31];

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
    const z = Math.sin(t) * radius * 0.72;
    const y = Math.sin(t * 1.3 + phase) * wobble + altitude;
    const depthScale = MathUtils.mapLinear(z, -radius, radius, 0.78, 1.02);
    const pulse = 1 + Math.sin(t * 1.72) * 0.028;

    bodyRef.current.position.set(x, y, z);
    bodyRef.current.rotation.y = -t;
    bodyRef.current.scale.setScalar(depthScale * pulse);
    planeRef.current.rotation.z = tilt;
  });

  return (
    <group ref={planeRef}>
      <group ref={bodyRef}>
        <mesh>
          <sphereGeometry args={[0.136, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.42}
            metalness={0.18}
            roughness={0.28}
          />
        </mesh>

        <Html center transform sprite distanceFactor={13}>
          <span
            className="inline-grid h-6 w-6 place-items-center rounded-full border bg-white/95 text-[12px] shadow-[0_8px_22px_rgba(15,23,42,0.44)] sm:size-7 sm:text-[14px]"
            style={{ borderColor: `${node.color}bb` }}
          >
            {node.icon ? (
              <Icon
                icon={node.icon}
                width="1em"
                height="1em"
                style={{ color: node.color }}
                title={`${node.name} - ${node.category}`}
              />
            ) : (
              <span
                className="text-[0.78em] font-semibold"
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
  isMobile,
}: {
  coreTagline: string;
  coreName: string;
  isMobile: boolean;
}) {
  const planetRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);

  const [diffuseMap, normalMap, cloudsMap] = useTexture(
    [earthDiffuseUrl, earthNormalUrl, earthCloudsUrl],
    ([diffuse, normal, clouds]) => {
      [diffuse, normal, clouds].forEach((t) => {
        t.minFilter = LinearFilter;
        t.magFilter = LinearFilter;
        t.generateMipmaps = false;
      });

      diffuse.colorSpace = SRGBColorSpace;
      clouds.colorSpace = SRGBColorSpace;
    },
  );

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.078;
      planetRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.035;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.112;
      cloudsRef.current.rotation.z += delta * 0.01;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.36, isMobile ? 52 : 72, isMobile ? 52 : 72]} />
        <meshStandardMaterial
          map={diffuseMap}
          normalMap={normalMap}
          roughness={0.56}
          metalness={0.08}
          emissive="#1d4ed8"
          emissiveIntensity={0.08}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={1.018}>
        <sphereGeometry args={[1.36, isMobile ? 42 : 58, isMobile ? 42 : 58]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.24}
          alphaTest={0.02}
          depthWrite={false}
          roughness={1}
          metalness={0}
        />
      </mesh>

      <mesh scale={1.055}>
        <sphereGeometry args={[1.36, isMobile ? 40 : 56, isMobile ? 40 : 56]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#67e8f9"
          emissiveIntensity={0.12}
          transparent
          opacity={0.1}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2.65, 0.24, 0]}
        scale={[1.18, 0.78, 1.18]}
      >
        <torusGeometry args={[1.65, 0.042, 24, isMobile ? 168 : 220]} />
        <meshStandardMaterial
          color="#93c5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.22}
          transparent
          opacity={0.62}
          roughness={0.28}
          metalness={0.28}
        />
      </mesh>

      <Html center transform distanceFactor={9.5}>
        <div className="pointer-events-none rounded-full border border-white/25 bg-slate-900/30 px-6 py-3 text-center shadow-[0_10px_30px_rgba(15,23,42,0.4)] backdrop-blur-sm">
          <p className="text-[10px] font-semibold tracking-widest text-slate-100/90 uppercase">
            {coreTagline}
          </p>
          <p className="mt-1 font-heading text-[1.6rem] leading-none font-semibold text-white">
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
  isMobile,
  interactionRef,
}: PlanetSceneContentProps) {
  const orbitGroupRef = useRef<Group>(null);
  const orbitSegments = isMobile ? 176 : 280;
  const sparklesCount = isMobile ? 90 : 150;
  const starsCount = isMobile ? 980 : 1600;

  const orbitConfigs = useMemo<OrbitConfig[]>(
    () =>
      nodes.map((node, index) => {
        const ringIndex = index % ORBIT_RADII.length;
        const jitter = ((index * 1.27) % 0.52) - 0.26;
        const direction = ringIndex % 2 === 0 ? 1 : -1;

        return {
          node,
          radius: ORBIT_RADII[ringIndex] + jitter,
          speed: direction * (0.12 + ringIndex * 0.02 + (index % 4) * 0.008),
          phase: index * 2.399963 + ringIndex * 0.48,
          wobble: 0.12 + ringIndex * 0.05,
          altitude: ORBIT_ALTITUDE[ringIndex] + ((index % 5) - 2) * 0.032,
          tilt: ORBIT_TILT[ringIndex] + (index % 3) * 0.03 - 0.04,
        };
      }),
    [nodes],
  );

  useFrame((_, delta) => {
    if (!orbitGroupRef.current) return;
    orbitGroupRef.current.rotation.y += delta * 0.02;
  });

  useFrame((state, delta) => {
    const hoverYaw = isMobile ? 0 : state.pointer.x * 0.1;
    const hoverPitch = isMobile ? 0 : -state.pointer.y * 0.06;
    const targetYaw = interactionRef.current.yaw + hoverYaw;
    const targetPitch = MathUtils.clamp(
      interactionRef.current.pitch + hoverPitch,
      -0.45,
      0.45,
    );
    const targetDistance = interactionRef.current.distance;
    const cosPitch = Math.cos(targetPitch);
    const targetX = Math.sin(targetYaw) * targetDistance * cosPitch;
    const targetZ = Math.cos(targetYaw) * targetDistance * cosPitch;
    const targetY = 2.8 + Math.sin(targetPitch) * targetDistance * 0.42;

    state.camera.position.x = MathUtils.damp(
      state.camera.position.x,
      targetX,
      3,
      delta,
    );
    state.camera.position.y = MathUtils.damp(
      state.camera.position.y,
      targetY,
      3,
      delta,
    );
    state.camera.position.z = MathUtils.damp(
      state.camera.position.z,
      targetZ,
      3,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.86} />
      <directionalLight
        position={[8.4, 9.2, 7.2]}
        intensity={1.12}
        color="#dbeafe"
      />
      <pointLight
        position={[-7.5, -4.1, -5.1]}
        intensity={0.64}
        color="#22d3ee"
      />
      <pointLight position={[0.2, 0.8, 3.6]} intensity={1.28} color="#818cf8" />

      <Stars
        radius={36}
        depth={42}
        count={starsCount}
        factor={3.4}
        saturation={0}
        fade
        speed={1.05}
      />

      <Sparkles
        count={sparklesCount}
        speed={0.5}
        size={2.8}
        scale={[15, 9, 15]}
        color="#e2e8f0"
      />

      <group ref={orbitGroupRef} rotation={[Math.PI / 5.95, 0.15, 0.02]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.26, 0.8, 1]}>
          <torusGeometry args={[4.6, 0.014, 14, orbitSegments]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#60a5fa"
            emissiveIntensity={0.15}
            transparent
            opacity={0.5}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.42, 0.82, 1]}>
          <torusGeometry args={[5.45, 0.013, 14, orbitSegments]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#93c5fd"
            emissiveIntensity={0.13}
            transparent
            opacity={0.42}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.58, 0.85, 1]}>
          <torusGeometry args={[6.35, 0.012, 14, orbitSegments]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.32} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.76, 0.88, 1]}>
          <torusGeometry args={[7.25, 0.011, 14, orbitSegments]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.24} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.9, 0.92, 1]}>
          <torusGeometry args={[8.05, 0.01, 14, orbitSegments]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.17} />
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

      <Float speed={0.82} rotationIntensity={0.08} floatIntensity={0.2}>
        <PlanetCore
          coreTagline={coreTagline}
          coreName={coreName}
          isMobile={isMobile}
        />
      </Float>
    </>
  );
}

export function IntegrationPlanetScene(props: IntegrationPlanetSceneProps) {
  const isMobile = useIsMobile();
  const isMobileRef = useRef(isMobile);
  const [contextLost, setContextLost] = useState(false);
  const [sceneVersion, setSceneVersion] = useState(0);
  const canvasCleanupRef = useRef<(() => void) | null>(null);
  const dragStateRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const interactionRef = useRef<SceneInteractionState>({
    yaw: 0,
    pitch: 0,
    distance: 13.2,
  });

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(
    () => () => {
      canvasCleanupRef.current?.();
    },
    [],
  );

  const handleCreated = useCallback((state: RootState) => {
    const renderer = state.gl as WebGLRenderer;
    const canvas = renderer.domElement;
    canvas.style.cursor = isMobileRef.current ? "default" : "grab";

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };

    const onContextRestored = () => {
      setContextLost(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isMobileRef.current || event.button !== 0) return;

      dragStateRef.current.active = true;
      dragStateRef.current.lastX = event.clientX;
      dragStateRef.current.lastY = event.clientY;
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isMobileRef.current || !dragStateRef.current.active) return;

      const dx = event.clientX - dragStateRef.current.lastX;
      const dy = event.clientY - dragStateRef.current.lastY;

      dragStateRef.current.lastX = event.clientX;
      dragStateRef.current.lastY = event.clientY;

      interactionRef.current.yaw += dx * 0.0065;
      interactionRef.current.pitch = MathUtils.clamp(
        interactionRef.current.pitch + dy * 0.0045,
        -0.42,
        0.42,
      );
    };

    const stopDragging = () => {
      if (!dragStateRef.current.active) return;

      dragStateRef.current.active = false;
      canvas.style.cursor = isMobileRef.current ? "default" : "grab";
    };

    const onWheel = (event: WheelEvent) => {
      if (isMobileRef.current) return;

      event.preventDefault();
      interactionRef.current.distance = MathUtils.clamp(
        interactionRef.current.distance + event.deltaY * 0.012,
        10.8,
        16.4,
      );
    };

    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);
    canvas.addEventListener("pointerdown", onPointerDown, false);
    window.addEventListener("pointermove", onPointerMove, false);
    window.addEventListener("pointerup", stopDragging, false);
    window.addEventListener("pointercancel", stopDragging, false);
    window.addEventListener("blur", stopDragging, false);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    canvasCleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      canvas.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
        false,
      );
      canvas.removeEventListener("pointerdown", onPointerDown, false);
      window.removeEventListener("pointermove", onPointerMove, false);
      window.removeEventListener("pointerup", stopDragging, false);
      window.removeEventListener("pointercancel", stopDragging, false);
      window.removeEventListener("blur", stopDragging, false);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  const resetScene = useCallback(() => {
    dragStateRef.current.active = false;
    interactionRef.current = { yaw: 0, pitch: 0, distance: 13.2 };
    setContextLost(false);
    setSceneVersion((value) => value + 1);
  }, []);

  return (
    <div className="relative mx-auto h-128 w-full max-w-200 overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(circle_at_50%_36%,#1f3a8a_0%,#0b1c44_42%,#030712_100%)] shadow-[0_44px_150px_-62px_hsl(var(--primary)/0.95)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(125,211,252,0.26),transparent_40%),radial-gradient(circle_at_84%_18%,rgba(129,140,248,0.25),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(96,165,250,0.16),transparent_35%)]" />

      <Canvas
        key={sceneVersion}
        dpr={isMobile ? 1 : [1, 1.25]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 3.5, 13.2], fov: 35 }}
        onCreated={handleCreated}
      >
        <PlanetSceneContent
          {...props}
          isMobile={isMobile}
          interactionRef={interactionRef}
        />
      </Canvas>

      {contextLost ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950/42 backdrop-blur-[2px]">
          <div className="rounded-2xl border border-white/25 bg-slate-900/78 px-5 py-4 text-center shadow-[0_18px_45px_rgba(2,6,23,0.45)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-200/90 uppercase">
              3D scene paused
            </p>
            <p className="mt-2 text-sm text-slate-100/90">
              WebGL context was interrupted. Restart the orbit scene.
            </p>
            <button
              type="button"
              onClick={resetScene}
              className="mt-3 rounded-full border border-white/30 bg-white/12 px-3.5 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/18"
            >
              Restart 3D
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

useTexture.preload([earthDiffuseUrl, earthNormalUrl, earthCloudsUrl]);
