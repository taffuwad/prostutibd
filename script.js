// --- 1. INITIALIZE LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: "vertical",
  gestureDirection: "vertical",
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 2. INITIALIZE GSAP & SCROLLTRIGGER ---
gsap.registerPlugin(ScrollTrigger);

// --- 3. HERO TEXT SPLIT ANIMATION ---
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!prefersReducedMotion) {
  const heroLines = document.querySelectorAll(".hero h1 > span");
  const heroSplits = Array.from(
    heroLines,
    (line) => new SplitType(line, { types: "words" }),
  );
  const heroWords = heroSplits.flatMap((split) => split.words);
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from(".navbar", {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })
    .from(
      ".hero-label",
      { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
      "-=0.4",
    )
    .fromTo(
      heroWords,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power4.out",
      },
      "-=0.4",
    )
    .from(
      ".hero p",
      { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5",
    )
    .from(
      ".hero-actions > *",
      {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      },
      "-=0.5",
    );
}

// --- 4. NAVBAR SCROLL EFFECT ---
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- 5. SECTION 2: PROBLEM -> SOLUTION MOUSE FOLLOW ---
const problemItems = document.querySelectorAll(".problem-item");
const solutionPanel = document.getElementById("solutionPanel");
const solutionText = document.getElementById("solutionText");
let mouseX = 0;
let mouseY = 0;
let panelX = 0;
let panelY = 0;

// Only apply mouse follow on non-touch devices
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth animation for panel
  function animatePanel() {
    panelX += (mouseX - panelX) * 0.1;
    panelY += (mouseY - panelY) * 0.1;

    // Offset panel so it doesn't block cursor
    const offsetX = 20;
    const offsetY = 20;

    // Clamp to viewport edges
    const panelRect = solutionPanel.getBoundingClientRect();
    let finalX = panelX + offsetX;
    let finalY = panelY + offsetY;

    if (finalX + panelRect.width > window.innerWidth) {
      finalX = panelX - panelRect.width - offsetX;
    }
    if (finalY + panelRect.height > window.innerHeight) {
      finalY = panelY - panelRect.height - offsetY;
    }

    solutionPanel.style.transform = `translate(${finalX}px, ${finalY}px) scale(1)`;
    requestAnimationFrame(animatePanel);
  }
  animatePanel();

  problemItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const solution = item.getAttribute("data-solution");
      solutionText.textContent = solution;
      solutionPanel.classList.add("active");
    });
    item.addEventListener("mouseleave", () => {
      solutionPanel.classList.remove("active");
    });
  });
} else {
  // Mobile logic: toggle active class on tap
  problemItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Close others
      problemItems.forEach((i) => {
        if (i !== item) i.classList.remove("active");
      });
      item.classList.toggle("active");
    });
  });
}

// --- 6. SECTION 3: FEATURE IMAGE PREVIEW ---
const featureCards = document.querySelectorAll(".feature-card");
const featurePreview = document.getElementById("featurePreview");
const featureImage = document.getElementById("featureImage");
let fMouseX = 0;
let fMouseY = 0;
let fPanelX = 0;
let fPanelY = 0;

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (e) => {
    fMouseX = e.clientX;
    fMouseY = e.clientY;
  });

  function animateFeaturePreview() {
    fPanelX += (fMouseX - fPanelX) * 0.1;
    fPanelY += (fMouseY - fPanelY) * 0.1;

    const offsetX = 30;
    const offsetY = -120; // Show above cursor

    let finalX = fPanelX + offsetX;
    let finalY = fPanelY + offsetY;

    // Clamp
    if (finalX + 360 > window.innerWidth) {
      finalX = fPanelX - 360 - 30;
    }
    if (finalY < 10) finalY = 10;
    if (finalY + 240 > window.innerHeight) {
      finalY = window.innerHeight - 240 - 10;
    }

    featurePreview.style.transform = `translate(${finalX}px, ${finalY}px) scale(1)`;
    requestAnimationFrame(animateFeaturePreview);
  }
  animateFeaturePreview();

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const imgUrl = card.getAttribute("data-image");
      featureImage.src = imgUrl;
      featurePreview.classList.add("active");
    });
    card.addEventListener("mouseleave", () => {
      featurePreview.classList.remove("active");
    });
  });
}

// --- 7. SECTION REVEALS ---
if (!prefersReducedMotion) {
  gsap.to("#stepProgress", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".steps-container",
      start: "top 70%",
      end: "bottom 50%",
      scrub: true,
    },
  });

  gsap.from(".section-header > *", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".section-header",
      start: "top 85%",
      once: true,
    },
  });

  gsap.from(".problem-item", {
    y: 35,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".problem-list",
      start: "top 80%",
      once: true,
    },
  });

  gsap.from(".feature-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".features-grid",
      start: "top 80%",
      once: true,
    },
  });

  gsap.from(".step-item", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".steps-container",
      start: "top 75%",
      once: true,
    },
  });

  gsap.from(".pricing-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".pricing-grid",
      start: "top 85%",
      once: true,
    },
  });

  gsap.from(".final-cta .container > *", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".final-cta",
      start: "top 80%",
      once: true,
    },
  });
}

// --- 9. MOBILE MENU TOGGLE (Basic) ---
const mobileBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const navActions = document.querySelector(".nav-actions");

mobileBtn.addEventListener("click", () => {
  // Simple alert for now, can be expanded to a full screen overlay
  alert("Mobile menu opened. (Implement full drawer if needed)");
});
