document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const textElement = document.querySelector(
    ".hero .container .content svg text",
  );
  const ctaButton = document.querySelector(".cta-button");

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.color = Math.random() > 0.5 ? "#8a2be2" : "#ffffff";
      this.alpha = 1;
      this.size = Math.random() * 2 + 1;
    }

    update(centerX, centerY, gravity) {
      if (gravity) {
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
          const force = 0.1;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
        // Dampen velocity
        this.vx *= 0.98;
        this.vy *= 0.98;
      } else {
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.alpha -= 0.002;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create particles
  const particles = [];
  const numParticles = 350;
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  let gravity = false;
  let centerX = 0;
  let centerY = 0;
  let hoverCount = 0;

  // Event handlers
  const handleMouseEnter = (e) => {
    const rect = e.target.getBoundingClientRect();
    centerX = rect.left + rect.width / 2;
    centerY = rect.top + rect.height / 2;
    hoverCount++;
    gravity = hoverCount > 0;
  };

  const handleMouseLeave = () => {
    hoverCount--;
    gravity = hoverCount > 0;
  };

  // Attach listeners to both elements
  textElement.addEventListener("mouseenter", handleMouseEnter);
  textElement.addEventListener("mouseleave", handleMouseLeave);
  ctaButton.addEventListener("mouseenter", handleMouseEnter);
  ctaButton.addEventListener("mouseleave", handleMouseLeave);

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update(centerX, centerY, gravity);
      particle.draw();
    });

    // Remove faded particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].alpha <= 0) {
        particles.splice(i, 1);
        particles.push(new Particle()); // Add new
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});

const ctaButton = document.querySelector(".cta-button");

if (ctaButton) {
  ctaButton.addEventListener("click", function (e) {
    // 1. Chặn nhảy trang ngay lập tức
    e.preventDefault();

    // 2. Lấy đường link từ thẻ a
    const targetUrl = this.getAttribute("href");

    // 3. Bật Fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }

    // 4. Hiệu ứng mờ dần trang hiện tại (Cinematic fade out)
    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = "0";

    // 5. Chuyển sang link GitHub Pages sau khi đợi 1 giây
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1000);

    // Cinematic fade
    document.body.style.transition = "opacity 1.5s ease";
    document.body.style.opacity = "0";

    // Navigate after fade
    setTimeout(() => {
      window.location.href = href;
    }, 1500);
  });
}
