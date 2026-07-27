document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Element references ---------- */
  const intro            = document.getElementById('intro');
  const book              = document.getElementById('book');
  const bgMusic           = document.getElementById('bgMusic');
  const musicBtn          = document.getElementById('musicBtn');
  const volumeSlider      = document.getElementById('volume');
  const beginBtn          = document.getElementById('beginBtn');
  const letterText        = document.getElementById('letterText');
  const giftButton        = document.getElementById('giftButton');
  const giftBox           = document.querySelector('.giftBox');
  const videoSection      = document.querySelector('.video');
  const birthdayVideo = document.getElementById('birthdayVideo');
  const futureSection     = document.querySelector('.future');
  const letterSection     = document.querySelector('.letter');
  const fireworksCanvas   = document.getElementById('fireworks');
  const floatingHeartsBox = document.getElementById('floatingHearts');
  const sparklesBox       = document.getElementById('sparkles');

  /* ---------- Intro / book reveal ---------- */
  book.style.opacity = '0';
  book.style.transition = 'opacity 1.2s ease';

  bgMusic.volume = parseFloat(volumeSlider.value) || 0.5;

  let musicStarted = false;
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    bgMusic.play().catch(() => { /* autoplay may be blocked until a tap happens, which is fine */ });
  }

  intro.addEventListener('click', openBook);
  intro.addEventListener('touchend', openBook, { passive: true });

  function openBook() {
    if (book.style.opacity === '1') return;
    startMusic();
    intro.style.transition = 'opacity .8s ease';
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      book.style.opacity = '1';
    }, 800);
  }

  /* ---------- Music controls ---------- */
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicBtn.textContent = '🔊';
    } else {
      bgMusic.pause();
      musicBtn.textContent = '🔈';
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = parseFloat(e.target.value);
  });

  function raiseMusicVolume(amount = 0.25) {
    const target = Math.min(bgMusic.volume + amount, 1);
    const step = 0.02;
    const raiseInterval = setInterval(() => {
      const next = Math.min(bgMusic.volume + step, target);
      bgMusic.volume = next;
      volumeSlider.value = next;
      if (next >= target) clearInterval(raiseInterval);
    }, 90);
  }

  /* ---------- Begin button ---------- */
  beginBtn.addEventListener('click', () => {
    letterSection.scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Typing effect for the letter ---------- */
  const letterFullText = letterText.textContent.trim();
  letterText.textContent = '';
  let typed = false;

  function typeLetter() {
    if (typed) return;
    typed = true;
    letterText.classList.add('typing');
    let i = 0;
    const interval = setInterval(() => {
      letterText.textContent += letterFullText[i];
      i++;
      if (i >= letterFullText.length) {
        clearInterval(interval);
        letterText.classList.remove('typing');
      }
    }, 32);
  }

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        typeLetter();
        letterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  letterObserver.observe(letterSection);

  /* ---------- Reveal-on-scroll (polaroids, timeline, notes) ---------- */
  function setupReveal(selector, staggerMs = 120) {
    const items = document.querySelectorAll(selector);
    items.forEach((el, idx) => {
      el.classList.add('reveal-target');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('revealed'), idx * staggerMs);
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      observer.observe(el);
    });
  }

  setupReveal('.polaroid', 150);
  setupReveal('.timeline li', 130);
  setupReveal('.note', 120);

  /* ---------- Floating hearts ---------- */
  function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['❤', '💕', '💗', '💓'][Math.floor(Math.random() * 4)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (14 + Math.random() * 20) + 'px';
    heart.style.animationDuration = (6 + Math.random() * 6) + 's';
    floatingHeartsBox.appendChild(heart);
    setTimeout(() => heart.remove(), 13000);
  }
  setInterval(spawnHeart, 900);

  /* ---------- Sparkles ---------- */
  function spawnSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = Math.random() * 100 + 'vw';
    sparkle.style.top = Math.random() * 100 + 'vh';
    sparkle.style.animationDuration = (2 + Math.random() * 2) + 's';
    sparklesBox.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 4200);
  }
  setInterval(spawnSparkle, 450);

  /* ---------- Fireworks / confetti canvas ---------- */
  const ctx = fireworksCanvas.getContext('2d');
  function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let particles = [];
  const colors = ['#ff4f7b', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585', '#ffffff'];

  function createBurst(x, y) {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 60 + Math.random() * 30,
        size: 2 + Math.random() * 3
      });
    }
  }

  let animRunning = false;
  function animateParticles() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life -= 1;
      ctx.globalAlpha = Math.max(p.life / 90, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    particles = particles.filter((p) => p.life > 0);
    if (particles.length > 0) {
      requestAnimationFrame(animateParticles);
    } else {
      animRunning = false;
    }
  }

  function launchFireworks(duration = 3000) {
    const endTime = Date.now() + duration;
    (function burstLoop() {
      if (Date.now() > endTime) return;
      createBurst(Math.random() * fireworksCanvas.width, Math.random() * fireworksCanvas.height * 0.6);
      if (!animRunning) {
        animRunning = true;
        animateParticles();
      }
      setTimeout(burstLoop, 350);
    })();
  }

  /* Trigger a fireworks moment once the "Our Future" section comes into view */
  let futureFireworksTriggered = false;
  if (futureSection) {
    const futureObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !futureFireworksTriggered) {
          futureFireworksTriggered = true;
          launchFireworks(4000);
          raiseMusicVolume(0.2);
          futureObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    futureObserver.observe(futureSection);
  }

  /* ---------- Gift box ---------- */
  let giftOpened = false;
  giftButton.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;
    giftBox.classList.add('opened');
    giftButton.textContent = 'Opening... 🎁';
    giftButton.disabled = true;

    launchFireworks(2800);
    raiseMusicVolume(0.3);

    setTimeout(() => {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }, 1300);
  });
/* ---------- Video & Background Music ---------- */

birthdayVideo.addEventListener("play", () => {
  bgMusic.pause();
});

birthdayVideo.addEventListener("pause", () => {
  if (!birthdayVideo.ended) {
    bgMusic.play().catch(() => {});
  }
});

birthdayVideo.addEventListener("ended", () => {
  bgMusic.play().catch(() => {});
});

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement === birthdayVideo) {
    bgMusic.pause();
  } else {
    if (birthdayVideo.paused || birthdayVideo.ended) {
      bgMusic.play().catch(() => {});
    }
  }
});
});
