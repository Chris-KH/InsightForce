import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type AsciiWaveCanvasProps = {
  className?: string;
};

export function AsciiWaveCanvas({ className }: AsciiWaveCanvasProps) {
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

    const chars = ".,:;-~+=*#%@";
    let time = 0;

    const pickColor = () =>
      document.documentElement.classList.contains("dark")
        ? "236, 238, 244"
        : "18, 24, 34";

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
      const cell = 22;
      const cols = Math.max(1, Math.floor(rect.width / cell));
      const rows = Math.max(1, Math.floor(rect.height / cell));

      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const px = (x + 0.5) * (rect.width / cols);
          const py = (y + 0.5) * (rect.height / rows);

          const waveA =
            Math.sin(x * 0.18 + time * 2.1) * Math.cos(y * 0.15 + time * 1.1);
          const waveB = Math.sin((x + y) * 0.12 + time * 1.6);
          const waveC = Math.cos(x * 0.09 - y * 0.1 + time * 0.95);
          const combined = (waveA + waveB + waveC) / 3;
          const normalized = (combined + 1) * 0.5;

          const charIndex = Math.min(
            chars.length - 1,
            Math.floor(normalized * chars.length),
          );
          const alpha = 0.08 + normalized * 0.48;
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.fillText(chars[charIndex], px, py);
        }
      }

      time += 0.026;
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
