export function triggerConfetti() {
  const duration = 1500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Create confetti particles
    for (let i = 0; i < particleCount; i++) {
      createConfettiParticle(
        randomInRange(0.1, 0.3),
        randomInRange(0.1, 0.3)
      );
    }
  }, 250);
}

function createConfettiParticle(x: number, y: number) {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
  const particle = document.createElement('div');
  
  particle.style.position = 'fixed';
  particle.style.width = '10px';
  particle.style.height = '10px';
  particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  particle.style.left = `${x * 100}%`;
  particle.style.top = `${y * 100}%`;
  particle.style.opacity = '1';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9999';
  particle.style.borderRadius = '50%';
  
  document.body.appendChild(particle);
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 15 + Math.random() * 15;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity - 20;
  
  let posX = parseFloat(particle.style.left);
  let posY = parseFloat(particle.style.top);
  let velocityX = vx;
  let velocityY = vy;
  let opacity = 1;
  
  const animate = () => {
    velocityY += 0.5; // gravity
    posX += velocityX;
    posY += velocityY;
    opacity -= 0.02;
    
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = `${opacity}`;
    
    if (opacity > 0 && posY < 100) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  };
  
  requestAnimationFrame(animate);
}
