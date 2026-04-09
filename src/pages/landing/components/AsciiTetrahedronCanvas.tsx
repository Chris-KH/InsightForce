import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type AsciiTetrahedronCanvasProps = {
  className?: string;
};

type Point3 = { x: number; y: number; z: number };

const VERTICES: Point3[] = [
  { x: 0, y: 1, z: 0 },
  { x: -0.943, y: -0.333, z: -0.5 },
  { x: 0.943, y: -0.333, z: -0.5 },
  { x: 0, y: -0.333, z: 1 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [2, 3],
  [3, 1],
];

const FACES: [number, number, number][] = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 1],
  [1, 3, 2],
];

function rotateY(point: Point3, angle: number): Point3 {
  return {
    x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
    y: point.y,
    z: point.x * Math.sin(angle) + point.z * Math.cos(angle),
  };
}

function rotateX(point: Point3, angle: number): Point3 {
  return {
    x: point.x,
    y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
    z: point.y * Math.sin(angle) + point.z * Math.cos(angle),
  };
}

function rotateZ(point: Point3, angle: number): Point3 {
  return {
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    z: point.z,
  };
}

export function AsciiTetrahedronCanvas({
  className,
}: AsciiTetrahedronCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const chars = " .,:-=+*#%@";
    let time = 0;

    const pickColor = () =>
      document.documentElement.classList.contains("dark")
        ? "236, 239, 246"
        : "15, 20, 30";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const rgb = pickColor();
      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;
      const scale = Math.min(rect.width, rect.height) * 0.35;

      ctx.font = "13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      for (const [i, j] of EDGES) {
        const v1 = VERTICES[i];
        const v2 = VERTICES[j];

        for (let t = 0; t <= 1; t += 0.08) {
          let point: Point3 = {
            x: v1.x + (v2.x - v1.x) * t,
            y: v1.y + (v2.y - v1.y) * t,
            z: v1.z + (v2.z - v1.z) * t,
          };

          point = rotateY(point, time * 0.42);
          point = rotateX(point, time * 0.29);
          point = rotateZ(point, time * 0.24);

          const depth = (point.z + 1.5) / 3;
          const charIndex = Math.min(
            chars.length - 1,
            Math.floor(depth * chars.length),
          );

          points.push({
            x: centerX + point.x * scale,
            y: centerY - point.y * scale,
            z: point.z,
            char: chars[charIndex],
          });
        }
      }

      for (const [i, j, k] of FACES) {
        const v1 = VERTICES[i];
        const v2 = VERTICES[j];
        const v3 = VERTICES[k];

        for (let u = 0; u <= 1; u += 0.16) {
          for (let v = 0; v <= 1 - u; v += 0.16) {
            const w = 1 - u - v;
            let point: Point3 = {
              x: v1.x * u + v2.x * v + v3.x * w,
              y: v1.y * u + v2.y * v + v3.y * w,
              z: v1.z * u + v2.z * v + v3.z * w,
            };

            point = rotateY(point, time * 0.42);
            point = rotateX(point, time * 0.29);
            point = rotateZ(point, time * 0.24);

            const depth = (point.z + 1.5) / 3;
            const charIndex = Math.min(
              chars.length - 1,
              Math.floor(depth * chars.length),
            );

            points.push({
              x: centerX + point.x * scale,
              y: centerY - point.y * scale,
              z: point.z,
              char: chars[charIndex],
            });
          }
        }
      }

      points.sort((a, b) => a.z - b.z);

      for (const point of points) {
        const alpha = 0.09 + (point.z + 1.5) * 0.2;
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(alpha, 0.82)})`;
        ctx.fillText(point.char, point.x, point.y);
      }

      time += 0.017;
      frameRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full", className)}
      style={{ display: "block" }}
    />
  );
}
