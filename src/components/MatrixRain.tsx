import { useEffect, useRef } from 'react';

export function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let raf = 0;
    let last = 0;
    let columns: number[] = [];
    const font = 16;
    const charset = '01アイウエオカキクケコ<>/{}';
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));
      columns = Array.from({ length: Math.ceil(canvas.width / font) }, () => Math.random() * -80);
      context.fillStyle = '#07110c';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 65) return;
      last = now;
      context.fillStyle = 'rgba(7,17,12,.10)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = `${font}px monospace`;
      context.fillStyle = '#43e884';
      for (let i = 0; i < columns.length; i++) {
        context.fillText(charset[Math.floor(Math.random() * charset.length)], i * font, columns[i] * font);
        if (columns[i] * font > canvas.height && Math.random() > .97) columns[i] = 0;
        else columns[i]++;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); };
  }, [active]);
  return <canvas className="matrix-rain" ref={canvasRef} aria-hidden="true" />;
}
