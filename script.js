(() => {
  "use strict";

  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const playText = document.getElementById("playText");
  const speedBtn = document.getElementById("speedBtn");
  const speedVal = document.getElementById("speedVal");
  const themeBtn = document.getElementById("themeBtn");
  const themeName = document.getElementById("themeName");
  const phrase = document.getElementById("lovePhrase");
  const expressBtn = document.getElementById("expressLoveBtn");
  const dialog = document.getElementById("messageDialog");
  const openDialogBtn = document.getElementById("openMsgBtn");
  const closeDialogBtn = document.getElementById("closeMsgBtn");
  const doneBtn = document.getElementById("doneBtn");

  const notes = [
    "A little light in the dark ✨",
    "Here's to the next adventure",
    "Some memories never fade",
    "Keep looking at the stars",
    "Two names, countless stories"
  ];

  const speeds = [
    { label: "Slow", value: 0.35 },
    { label: "Fast", value: 1 },
    { label: "Hyper", value: 2 }
  ];

  const themes = [
    { label: "Neon Cyan", hue: 190 },
    { label: "Sunset Gold", hue: 28 },
    { label: "Deep Purple", hue: 270 }
  ];

  let width = 0;
  let height = 0;
  let stars = [];
  let speedIndex = 1;
  let themeIndex = 0;
  let noteIndex = -1;
  let running = !reducedMotion.matches;
  let animationId = null;
  let lastTime = 0;
  let elapsed = 0;

  function makeStars() {
    const count = Math.min(180, Math.max(55, Math.floor((width * height) / 8500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.25,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.22 + 0.04
    }));
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
    draw(elapsed);
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const hue = themes[themeIndex].hue;

    for (const star of stars) {
      const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * star.drift + star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue + 35}, 100%, 88%, ${twinkle * 0.8})`;
      ctx.fill();
    }

    // A subtle horizon glow keeps the background atmospheric without distracting from the content.
    const glow = ctx.createRadialGradient(width / 2, height * 0.74, 0, width / 2, height * 0.74, width * 0.55);
    glow.addColorStop(0, `hsla(${hue}, 90%, 55%, 0.08)`);
    glow.addColorStop(1, `hsla(${hue}, 90%, 40%, 0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, height * 0.35, width, height * 0.65);
  }

  function frame(now) {
    if (!running) return;
    if (!lastTime) lastTime = now;
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += delta * speeds[speedIndex].value;
    draw(elapsed);
    animationId = window.requestAnimationFrame(frame);
  }

  function startAnimation() {
    if (reducedMotion.matches || running) {
      draw(elapsed);
      return;
    }
    running = true;
    lastTime = 0;
    animationId = window.requestAnimationFrame(frame);
    playIcon.textContent = "Ⅱ";
    playText.textContent = "Pause";
  }

  function stopAnimation() {
    running = false;
    if (animationId !== null) window.cancelAnimationFrame(animationId);
    animationId = null;
    draw(elapsed);
    playIcon.textContent = "▶";
    playText.textContent = "Play";
  }

  playPauseBtn.addEventListener("click", () => {
    if (running) stopAnimation();
    else startAnimation();
  });

  speedBtn.addEventListener("click", () => {
    speedIndex = (speedIndex + 1) % speeds.length;
    speedVal.textContent = speeds[speedIndex].label;
  });

  themeBtn.addEventListener("click", () => {
    themeIndex = (themeIndex + 1) % themes.length;
    themeName.textContent = themes[themeIndex].label;
    document.body.dataset.theme = ["cyan", "sunset", "purple"][themeIndex];
    draw(elapsed);
  });

  expressBtn.addEventListener("click", () => {
    noteIndex = (noteIndex + 1) % notes.length;
    phrase.style.opacity = "0";
    phrase.style.transform = "translateY(5px)";
    window.setTimeout(() => {
      phrase.textContent = notes[noteIndex];
      phrase.style.opacity = "1";
      phrase.style.transform = "translateY(0)";
    }, 140);
  });

  openDialogBtn.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });

  function closeDialog() {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  closeDialogBtn.addEventListener("click", closeDialog);
  doneBtn.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  window.addEventListener("resize", resize, { passive: true });
  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) stopAnimation();
    else startAnimation();
  });

  resize();
  if (running) {
    playIcon.textContent = "Ⅱ";
    playText.textContent = "Pause";
    animationId = window.requestAnimationFrame(frame);
  } else {
    playIcon.textContent = "▶";
    playText.textContent = "Play";
  }
})();
