"use client";

import { useEffect, useRef, useState } from "react";

export default function ZombieGame() {
  const canvasRef = useRef(null);

  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const [hp, setHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [power, setPower] = useState("normal");
  const [shield, setShield] = useState(false);

  const player = useRef({ x: 180, y: 350, size: 18 });
  const bullets = useRef([]);
  const zombies = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const spawnZombie = () => {
      zombies.current.push({
        x: Math.random() * 360,
        y: -20,
        size: 20,
        speed: 0.8 + level * 0.3,
      });
    };

    const interval = setInterval(spawnZombie, Math.max(400, 1200 - level * 100));

    const loop = () => {
      if (!running) return;

      ctx.clearRect(0, 0, 360, 500);

      // Player
      ctx.fillStyle = shield ? "#22d3ee" : "#10b981";
      ctx.beginPath();
      ctx.arc(player.current.x, player.current.y, player.current.size, 0, Math.PI * 2);
      ctx.fill();

      // Bullets
      ctx.fillStyle = power === "fire" ? "#ef4444" : "#f97316";
      bullets.current.forEach((b, i) => {
        b.y -= power === "double" ? 7 : 5;
        ctx.fillRect(b.x, b.y, power === "fire" ? 8 : 4, 10);
        if (b.y < 0) bullets.current.splice(i, 1);
      });

      // Zombies
      ctx.fillStyle = "#ef4444";
      zombies.current.forEach((z, zi) => {
        z.y += z.speed;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.size, 0, Math.PI * 2);
        ctx.fill();

        if (
          Math.hypot(z.x - player.current.x, z.y - player.current.y) < 28 &&
          !shield
        ) {
          setHp((h) => Math.max(h - 10, 0));
          zombies.current.splice(zi, 1);
        }

        bullets.current.forEach((b, bi) => {
          if (Math.hypot(z.x - b.x, z.y - b.y) < 20) {
            zombies.current.splice(zi, 1);
            bullets.current.splice(bi, 1);
            setScore((s) => s + 10);
          }
        });
      });

      if (hp <= 0) setRunning(false);

      requestAnimationFrame(loop);
    };

    loop();
    return () => clearInterval(interval);
  }, [running, hp, level, power, shield]);

  useEffect(() => {
    if (score >= level * 100) setLevel((l) => l + 1);
  }, [score, level]);

  const shoot = () => {
    bullets.current.push({ x: player.current.x, y: player.current.y });
    if (power === "double")
      bullets.current.push({ x: player.current.x + 10, y: player.current.y });
  };

  const move = (dir) => {
    if (dir === "left") player.current.x -= 20;
    if (dir === "right") player.current.x += 20;
    if (dir === "up") player.current.y -= 20;
    if (dir === "down") player.current.y += 20;
  };

  const activatePower = (type) => {
    setPower(type);
    if (type === "shield") {
      setShield(true);
      setTimeout(() => setShield(false), 5000);
    }
    setTimeout(() => setPower("normal"), 6000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: 12 }}>
      <h1>🧟 ZOMBIES SMARTRÓNICA M&M</h1>
      <p style={{ fontSize: 12 }}>
        Reparaciones reales de celulares – WhatsApp: 1137659959
      </p>

      {/* PUBLICIDAD */}
      <div style={{ width: 360, height: 60, background: "#111827", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>
        ESPACIO PARA PUBLICIDAD (AdSense)
      </div>

      <div style={{ width: 360, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span>❤️ {hp}</span>
        <span>🧠 Nivel {level}</span>
        <span>⭐ {score}</span>
      </div>

      <canvas ref={canvasRef} width={360} height={500} style={{ background: "#020617", borderRadius: 16 }} />

      {!running && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <h2>GAME OVER</h2>
          <p>Traé este juego al local y te llevás DESCUENTO REAL</p>
          <button onClick={() => {
            setScore(0);
            setHp(100);
            setLevel(1);
            zombies.current = [];
            bullets.current = [];
            setRunning(true);
          }}>
            REINICIAR
          </button>
        </div>
      )}

      {/* CONTROLES */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => move("up")}>⬆️</button>
        <button onClick={shoot}>🔥</button>
        <button onClick={() => move("down")}>⬇️</button><br />
        <button onClick={() => move("left")}>⬅️</button>
        <button onClick={() => move("right")}>➡️</button>
      </div>

      {/* PODERES */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => activatePower("double")}>⚡ Doble</button>
        <button onClick={() => activatePower("fire")}>🔥 Fuego</button>
        <button onClick={() => activatePower("shield")}>🛡 Escudo</button>
      </div>

      {/* CTA WHATSAPP */}
      <a
        href="https://wa.me/5491137659959"
        target="_blank"
        style={{
          marginTop: 16,
          background: "#22c55e",
          padding: "10px 20px",
          borderRadius: 12,
          color: "black",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        📲 PEDIR DESCUENTO POR WHATSAPP
      </a>
    </div>
  );
}
