"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  opacity: number;
  phase: number;
  speed: number;
  hue: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface FloatingOrb {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  phase: number;
  speedX: number;
  speedY: number;
  hue: number; // 0 = purple, 1 = gold
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let orbs: FloatingOrb[] = [];
    let time = 0;
    let lastShootingStarTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initStars();
    };

    const initStars = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.floor((w * h) / 10000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        baseOpacity: Math.random() * 0.5 + 0.1,
        opacity: 0,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.06 + 0.008,
        hue: Math.random() > 0.7 ? 45 : Math.random() > 0.5 ? 270 : 240,
      }));

      // Floating ambient orbs — large, soft, slow
      orbs = Array.from({ length: 5 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 60 + 40,
        baseOpacity: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1,
        hue: Math.random() > 0.6 ? 1 : 0,
      }));
    };

    const spawnShootingStar = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const angle = Math.random() * 0.5 + 0.3; // 17-45 degrees
      const speed = Math.random() * 6 + 4;
      shootingStars.push({
        x: Math.random() * w * 0.7,
        y: Math.random() * h * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: Math.random() * 40 + 25,
        size: Math.random() * 1.5 + 0.8,
        trail: [],
      });
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.006;

      // Stars
      for (const star of stars) {
        star.opacity = star.baseOpacity * (0.4 + 0.6 * Math.sin(time * 2 + star.phase));
        star.y -= star.speed;
        if (star.y < -5) {
          star.y = h + 5;
          star.x = Math.random() * w;
        }

        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.r * 3.5
        );

        if (star.hue === 45) {
          gradient.addColorStop(0, `rgba(245, 197, 66, ${star.opacity})`);
          gradient.addColorStop(0.4, `rgba(245, 197, 66, ${star.opacity * 0.3})`);
          gradient.addColorStop(1, `rgba(245, 197, 66, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(167, 139, 255, ${star.opacity})`);
          gradient.addColorStop(0.4, `rgba(167, 139, 255, ${star.opacity * 0.25})`);
          gradient.addColorStop(1, `rgba(167, 139, 255, 0)`);
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = star.hue === 45
          ? `rgba(255, 235, 180, ${star.opacity * 1.3})`
          : `rgba(220, 200, 255, ${star.opacity * 1.3})`;
        ctx.fill();
      }

      // Floating orbs
      for (const orb of orbs) {
        orb.x += orb.speedX;
        orb.y += orb.speedY;
        if (orb.x < -orb.r * 2) orb.x = w + orb.r;
        if (orb.x > w + orb.r * 2) orb.x = -orb.r;
        if (orb.y < -orb.r * 2) orb.y = h + orb.r;
        if (orb.y > h + orb.r * 2) orb.y = -orb.r;

        const pulse = orb.baseOpacity * (0.6 + 0.4 * Math.sin(time * 0.8 + orb.phase));
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        if (orb.hue === 1) {
          gradient.addColorStop(0, `rgba(245, 197, 66, ${pulse})`);
          gradient.addColorStop(0.5, `rgba(245, 197, 66, ${pulse * 0.3})`);
          gradient.addColorStop(1, `rgba(245, 197, 66, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(109, 60, 239, ${pulse})`);
          gradient.addColorStop(0.5, `rgba(109, 60, 239, ${pulse * 0.3})`);
          gradient.addColorStop(1, `rgba(109, 60, 239, 0)`);
        }
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Shooting stars
      if (time - lastShootingStarTime > 3 + Math.random() * 5) {
        spawnShootingStar();
        lastShootingStarTime = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;

        // Add trail point
        ss.trail.push({ x: ss.x, y: ss.y, opacity: 1 });
        if (ss.trail.length > 20) ss.trail.shift();

        // Fade trail
        for (let j = 0; j < ss.trail.length; j++) {
          ss.trail[j].opacity *= 0.88;
        }

        // Draw trail
        for (let j = 1; j < ss.trail.length; j++) {
          const t = ss.trail[j];
          const prevT = ss.trail[j - 1];
          const alpha = t.opacity * (1 - ss.life / ss.maxLife) * 0.6;
          if (alpha < 0.001) continue;

          ctx.beginPath();
          ctx.moveTo(prevT.x, prevT.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = `rgba(220, 200, 255, ${alpha})`;
          ctx.lineWidth = ss.size * (j / ss.trail.length);
          ctx.stroke();
        }

        // Head glow
        const headAlpha = (1 - ss.life / ss.maxLife) * 0.8;
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.size * 4);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${headAlpha})`);
        headGlow.addColorStop(0.3, `rgba(200, 180, 255, ${headAlpha * 0.5})`);
        headGlow.addColorStop(1, `rgba(167, 139, 255, 0)`);
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
