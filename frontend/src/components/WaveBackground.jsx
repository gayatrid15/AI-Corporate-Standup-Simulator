import { useEffect, useRef } from "react";

export default function WaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const state = {
      speed: 1,
      creativity: 0.8,
      density: 4,
      glow: 30,
      time: 0,
    };

    const particles = [];
    const maxParticles = 35;

    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 250,
      force: 0,
      targetForce: 0,

      clickRipple: {
        x: 0,
        y: 0,
        active: false,
        radius: 0,
        maxRadius: 240,
        alpha: 0,
      },
    };

    const waveStyles = [
      {
        startColor: "rgba(96,165,250,0.30)",
        endColor: "rgba(96,165,250,0.01)",
        phaseOffset: 0,
        speedFactor: 0.8,
        baseHeightOffset: 0.1,
      },
      {
        startColor: "rgba(59,130,246,0.25)",
        endColor: "rgba(59,130,246,0.01)",
        phaseOffset: Math.PI / 3,
        speedFactor: 1.1,
        baseHeightOffset: -0.05,
      },
      {
        startColor: "rgba(0,229,255,0.18)",
        endColor: "rgba(0,229,255,0.01)",
        phaseOffset: (Math.PI * 2) / 3,
        speedFactor: 0.9,
        baseHeightOffset: 0.05,
      },
      {
        startColor: "rgba(37,99,235,0.15)",
        endColor: "rgba(37,99,235,0.01)",
        phaseOffset: Math.PI,
        speedFactor: 1.25,
        baseHeightOffset: -0.1,
      },
    ];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnParticle(x, y) {
      if (particles.length >= maxParticles) {
        particles.shift();
      }

      particles.push({
        x,
        y,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 3,
        speedY: (Math.random() - 0.8) * 3 - 1,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.005,
      });
    }

    function triggerExplosion(x, y) {
      pointer.clickRipple.x = x;
      pointer.clickRipple.y = y;
      pointer.clickRipple.active = true;
      pointer.clickRipple.radius = 0;
      pointer.clickRipple.alpha = 1;

      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          size: Math.random() * 6 + 3,
          speedX: (Math.random() - 0.5) * 12,
          speedY: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.03 + 0.01,
        });
      }
    }

    resizeCanvas();

    const handleResize = () => resizeCanvas();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.targetForce = 1;

      if (Math.random() < 0.2) {
        spawnParticle(pointer.targetX, pointer.targetY);
      }
    };

    const handleMouseLeave = () => {
      pointer.targetForce = 0;
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();

      triggerExplosion(e.clientX - rect.left, e.clientY - rect.top);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    window.addEventListener("click", handleClick);

    let animationFrame;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pointer.x += (pointer.targetX - pointer.x) * 0.1;
      pointer.y += (pointer.targetY - pointer.y) * 0.1;
      pointer.force += (pointer.targetForce - pointer.force) * 0.08;

      state.time += 0.012 * state.speed;

      const baseHeight = canvas.height * 0.75;

      if (pointer.clickRipple.active) {
        pointer.clickRipple.radius +=
          (pointer.clickRipple.maxRadius - pointer.clickRipple.radius) * 0.08;

        pointer.clickRipple.alpha -= 0.025;

        if (pointer.clickRipple.alpha <= 0) {
          pointer.clickRipple.active = false;
        } else {
          ctx.save();

          ctx.beginPath();
          ctx.arc(
            pointer.clickRipple.x,
            pointer.clickRipple.y,
            pointer.clickRipple.radius,
            0,
            Math.PI * 2,
          );

          ctx.strokeStyle = `rgba(59,130,246,${
            pointer.clickRipple.alpha * 0.4
          })`;

          ctx.lineWidth = 3;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(59,130,246,0.8)";
          ctx.stroke();

          ctx.restore();
        }
      }

      ctx.globalCompositeOperation = "screen";

      for (let w = 0; w < state.density; w++) {
        const style = waveStyles[w];

        const phase = state.time * style.speedFactor + style.phaseOffset;

        const waveBase = baseHeight + style.baseHeightOffset * canvas.height;

        ctx.beginPath();

        for (let x = 0; x <= canvas.width; x += 4) {
          let y = waveBase;

          y += Math.sin(x * 0.003 + phase) * 65 * state.creativity;

          y += Math.sin(x * 0.008 - phase * 0.6) * 25 * state.creativity;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < pointer.radius) {
            const influence = 1 - distance / pointer.radius;

            y += (pointer.y - y) * influence * pointer.force * 0.9;
          }

          if (pointer.clickRipple.active) {
            const rDx = x - pointer.clickRipple.x;

            const rDistance = Math.abs(rDx);

            const diff = Math.abs(rDistance - pointer.clickRipple.radius);

            if (diff < 45) {
              const rippleForce = (1 - diff / 45) * pointer.clickRipple.alpha;

              y += Math.sin(rDistance * 0.1) * 35 * rippleForce;
            }
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(
          0,
          waveBase - 120,
          0,
          canvas.height,
        );

        gradient.addColorStop(0, style.startColor);
        gradient.addColorStop(1, style.endColor);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = state.glow;
        ctx.shadowColor = style.startColor;

        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(
          96,
          165,
          250,
          ${p.alpha}
        )`;

        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(96,165,250,1)";

        ctx.fill();

        ctx.restore();
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
