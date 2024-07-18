import React, { useEffect, useRef } from 'react';
const SmokeAnimation = () => {
  const canvasRef = useRef(null);
  const particles = [];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let timeoutId;

    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 30 + 10;
      this.alpha = 1;
      this.fadeRate = Math.random() * 0.02 + 0.01;
      this.color = getRandomLightColor();
    }

    Particle.prototype.update = function () {
      this.alpha -= this.fadeRate;
      this.size += 0.5;

      if (this.alpha <= 0) {
        particles.splice(particles.indexOf(this), 1);
      }
    };

    Particle.prototype.draw = function () {
      const rgbaColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;

      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5;

      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size
      );
      gradient.addColorStop(0, rgbaColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    };

    function getRandomLightColor() {
      const r = Math.floor(Math.random() * 150) + 100;
      const g = Math.floor(Math.random() * 150) + 100;
      const b = Math.floor(Math.random() * 150) + 100;
      return { r, g, b };
    }

    function createParticles(x, y) {
      for (let i = 0; i < 4; i++) {
        particles.push(new Particle(x, y));
      }
    }

    function resetTimeout() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        particles.length = 0;
      }, 2000);
    }


    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        if (particles[i] !== undefined) particles[i].draw();
      }

      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('mousemove', (event) => {
      const xPos = event.clientX;
      const yPos = event.clientY;

      resetTimeout();
      createParticles(xPos, yPos);
    });

    animateParticles();

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', (event) => {
        const xPos = event.clientX;
        const yPos = event.clientY;

        resetTimeout();
        createParticles(xPos, yPos);
      });
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        margin: 0,
        overflow: 'hidden',
        backgroundColor: '#000000',
        display: 'block',
      }}
    />
  );
};

export default SmokeAnimation;
