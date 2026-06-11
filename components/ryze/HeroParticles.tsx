"use client";

import { useMemo } from "react";

type Particle = {
  left: string;
  top: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

function rand(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export default function HeroParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${rand(i + 1) * 100}%`,
        top: `${rand(i + 100) * 100}%`,
        size: 2 + rand(i + 200) * 2.5,
        opacity: 0.25 + rand(i + 300) * 0.25,
        duration: 14 + rand(i + 400) * 8,
        delay: rand(i + 500) * -22,
      })),
    [count]
  );

  return (
    <div className="hero-particles" aria-hidden>
      {particles.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
