import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type AsciiSphereCanvasProps = {
  className?: string;
};

export function AsciiSphereCanvas({ className }: AsciiSphereCanvasProps) {
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

    const chars = " .:-=+*#%@";
    let time = 0;

    const pickColor = () =>
      document.documentElement.classList.contains("dark")
        ? "237, 240, 247"
        : "16, 22, 34";

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
      const radius = Math.min(rect.width, rect.height) * 0.42;

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      for (let phi = 0; phi < Math.PI * 2; phi += 0.17) {
        for (let theta = 0; theta < Math.PI; theta += 0.17) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.55);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.55);
          const z = Math.cos(theta);

          const rotateY = time * 0.32;
          const x2 = x * Math.cos(rotateY) - z * Math.sin(rotateY);
          const z2 = x * Math.sin(rotateY) + z * Math.cos(rotateY);

          const rotateX = time * 0.21;
          const y2 = y * Math.cos(rotateX) - z2 * Math.sin(rotateX);
          const z3 = y * Math.sin(rotateX) + z2 * Math.cos(rotateX);

          const depth = (z3 + 1) * 0.5;
          const charIndex = Math.min(
            chars.length - 1,
            Math.floor(depth * chars.length),
          );

          points.push({
            x: centerX + x2 * radius,
            y: centerY + y2 * radius,
            z: z3,
            char: chars[charIndex],
          });
        }
      }

      points.sort((a, b) => a.z - b.z);

      for (const point of points) {
        const alpha = 0.1 + (point.z + 1) * 0.34;
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(alpha, 0.78)})`;
        ctx.fillText(point.char, point.x, point.y);
      }

      time += 0.019;
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
