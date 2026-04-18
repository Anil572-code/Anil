/* ============================================================
   ANIL ADHIKARI — PREMIUM PORTFOLIO SCRIPT
   Author: Anil Adhikari
   Version: 2.0
   ============================================================ */

'use strict';

/* ============================================================
   PAGE LOADER
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide loader after 1.9s (matches bar fill animation)
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    // Trigger initial reveal animations once loaded
    revealOnScroll();
  }, 1950);
});

// Prevent scroll during load
document.body.style.overflow = 'hidden';


/* ============================================================
   PHOTO FALLBACK HANDLING
   Gracefully shows initials if photo file not found
   ============================================================ */
function initPhotoFallback() {
  const heroPhoto   = document.getElementById('hero-photo');
  const heroFallback = document.getElementById('photo-fallback');
  const aboutPhoto  = document.getElementById('about-photo');
  const aboutFallback = document.getElementById('about-fallback');

  function handleImgError(img, fallback) {
    if (!img || !fallback) return;
    img.addEventListener('error', () => {
      img.style.display = 'none';
      fallback.classList.add('visible');
    });
    // Also check if already broken (cached 404)
    if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none';
      fallback.classList.add('visible');
    }
  }

  handleImgError(heroPhoto,  heroFallback);
  handleImgError(aboutPhoto, aboutFallback);
}
initPhotoFallback();


/* ============================================================
   STICKY NAVBAR + SCROLL SHADOW
   ============================================================ */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});


/* ============================================================
   ACTIVE NAV LINK ON SCROLL (IntersectionObserver)
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(s => sectionObserver.observe(s));


/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   TYPED TEXT ANIMATION (Hero)
   ============================================================ */
const typedEl   = document.getElementById('typed-text');
const typeWords = [
  'Digital Marketer',
  'Web Developer',
  'Prompt Engineer',
  'Brand Strategist',
  'Growth Specialist'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeTimer;

function typeEffect() {
  const currentWord = typeWords[wordIndex];
  const displayText = isDeleting
    ? currentWord.substring(0, charIndex - 1)
    : currentWord.substring(0, charIndex + 1);

  typedEl.textContent = displayText;

  if (!isDeleting) charIndex++;
  else charIndex--;

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 2200; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typeWords.length;
    speed = 400;
  }

  typeTimer = setTimeout(typeEffect, speed);
}
// Start after loader
setTimeout(typeEffect, 2200);


/* ============================================================
   HERO PARTICLE CANVAS
   Creates subtle floating dots in hero background
   ============================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 55;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 1.8 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.5 + 0.15;
      // Purple or cyan tones
      this.color = Math.random() > 0.5
        ? `rgba(168,85,247,${this.alpha})`
        : `rgba(6,182,212,${this.alpha})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Draw connecting lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168,85,247,${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  let animFrameId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animate);
  }
  animate();
}
initParticleCanvas();


/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
function revealOnScroll() {
  const elements = document.querySelectorAll('[data-reveal]');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const visible = rect.top < window.innerHeight - 80;
    if (visible) {
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => {
        el.classList.add('revealed');
        // Animate skill bars when they reveal
        el.querySelectorAll('.sp-fill').forEach(bar => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        });
      }, parseInt(delay));
    }
  });

  // Also trigger bars in already-revealed parents that scroll into view
  document.querySelectorAll('.revealed .sp-fill').forEach(bar => {
    if (!bar.style.width) {
      bar.style.width = bar.getAttribute('data-width') + '%';
    }
  });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });


/* ============================================================
   COUNTER ANIMATION (Hero Stats)
   ============================================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target;
    }
    requestAnimationFrame(update);
  });
}

// Trigger counter once hero is visible
let counterTriggered = false;
const heroSection = document.getElementById('hero');
const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counterTriggered) {
    counterTriggered = true;
    setTimeout(animateCounters, 2100); // after loader
    counterObserver.disconnect();
  }
}, { threshold: 0.3 });
if (heroSection) counterObserver.observe(heroSection);


/* ============================================================
   SKILL BAR ANIMATION (via IntersectionObserver)
   ============================================================ */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.sp-fill').forEach(bar => {
        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-width') + '%';
        }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-main-card').forEach(card => {
  skillObserver.observe(card);
});


/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Filter cards
    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const show = filter === 'all' || categories.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        // Small stagger reveal
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 60);
        });
      } else {
        card.classList.add('hidden');
        card.style.opacity = '';
        card.style.transform = '';
      }
    });
  });
});


/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');
const submitBtn    = document.getElementById('form-submit');

function showError(fieldId, errId, message) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (errEl) errEl.textContent = message;
  return false;
}
function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const errEl = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (errEl) errEl.textContent = '';
  return true;
}

// Real-time validation on input
['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    const errId = id.replace('f-', 'err-').replace('f-message', 'err-message');
    clearError(id, errId);
  });
});

function validateForm() {
  let valid = true;
  const name    = document.getElementById('f-name')?.value.trim();
  const email   = document.getElementById('f-email')?.value.trim();
  const subject = document.getElementById('f-subject')?.value.trim();
  const message = document.getElementById('f-message')?.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset all
  ['f-name','f-email','f-subject','f-message'].forEach(id => {
    const errId = 'err-' + id.replace('f-','');
    clearError(id, errId);
  });

  if (!name || name.length < 2) {
    valid = showError('f-name', 'err-name', 'Please enter your full name (at least 2 characters).');
  }
  if (!email || !emailRegex.test(email)) {
    valid = showError('f-email', 'err-email', 'Please enter a valid email address.');
  }
  if (!subject || subject.length < 3) {
    valid = showError('f-subject', 'err-subject', 'Please enter a subject (at least 3 characters).');
  }
  if (!message || message.length < 15) {
    valid = showError('f-message', 'err-message', 'Please write a message (at least 15 characters).');
  }

  return valid;
}

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm()) return;

    // Show loading state
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const btnIcon    = submitBtn.querySelector('svg');

    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    if (btnIcon) btnIcon.style.display = 'none';
    submitBtn.disabled = true;

    // Simulate form submission (replace with real backend/emailjs in production)
    setTimeout(() => {
      // Reset loading state
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
      if (btnIcon) btnIcon.style.display = 'inline';
      submitBtn.disabled = false;

      // Show success
      formSuccess.classList.add('visible');
      contactForm.reset();

      // Hide success after 6s
      setTimeout(() => {
        formSuccess.classList.remove('visible');
      }, 6000);
    }, 1800);
  });
}


/* ============================================================
   SCROLL TO TOP BUTTON
   ============================================================ */
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ============================================================
   FOOTER YEAR (Dynamic)
   ============================================================ */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================================
   3D CARD TILT EFFECT (Desktop only)
   Adds subtle perspective tilt on hover for premium feel
   ============================================================ */
function initTiltEffect() {
  if (window.innerWidth < 1024) return; // Skip on touch devices

  const tiltCards = document.querySelectorAll(
    '.service-card, .project-card, .why-card, .skill-main-card, .testimonial-card'
  );

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5; // max ±5deg
      const rotateY = ((x - cx) / cx) *  5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}
// Init tilt after load
window.addEventListener('load', initTiltEffect);


/* ============================================================
   PARALLAX ORBS (subtle parallax on scroll)
   ============================================================ */
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = (i + 1) * 0.08;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}
initParallax();


/* ============================================================
   PROJECT CARD LINK ENHANCEMENT
   Make entire card clickable (while keeping button)
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  const primaryLink = card.querySelector('.btn-project');
  if (!primaryLink) return;

  card.style.cursor = 'pointer';
  card.addEventListener('click', e => {
    // Only navigate if clicking the card body (not the link itself)
    if (!e.target.closest('.btn-project') && !e.target.closest('.pc-visit-icon')) {
      window.open(primaryLink.href, '_blank', 'noopener,noreferrer');
    }
  });
});


/* ============================================================
   NAV OVERLAY BACKDROP (mobile)
   ============================================================ */
function addNavBackdrop() {
  const backdrop = document.createElement('div');
  backdrop.id = 'nav-backdrop';
  backdrop.style.cssText = `
    position: fixed; inset: 0; z-index: 999;
    background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
    display: none; transition: opacity 0.3s ease;
  `;
  document.body.appendChild(backdrop);

  hamburger.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      backdrop.style.display = 'block';
      requestAnimationFrame(() => { backdrop.style.opacity = '1'; });
    } else {
      backdrop.style.opacity = '0';
      setTimeout(() => { backdrop.style.display = 'none'; }, 300);
    }
  });

  backdrop.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    backdrop.style.opacity = '0';
    setTimeout(() => { backdrop.style.display = 'none'; }, 300);
  });
}
addNavBackdrop();


/* ============================================================
   GLOWING CURSOR TRAIL (subtle premium touch)
   Only on desktop
   ============================================================ */
function initCursorGlow() {
  if (window.innerWidth < 1024 || window.matchMedia('(pointer:coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
initCursorGlow();


/* ============================================================
   INTERSECTION OBSERVER — ALL REVEAL ELEMENTS
   Staggered reveal for grid children
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el    = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, {
  rootMargin: '-60px 0px',
  threshold: 0.1
});

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});


/* ============================================================
   SECTION TAG ANIMATION — Subtle entrance for section tags
   ============================================================ */
document.querySelectorAll('.section-tag').forEach(tag => {
  tag.style.opacity = '0';
  tag.style.transform = 'translateY(10px)';
  tag.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  const tagObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      tag.style.opacity = '1';
      tag.style.transform = 'translateY(0)';
      tagObserver.disconnect();
    }
  }, { threshold: 0.5 });
  tagObserver.observe(tag);
});


/* ============================================================
   CONSOLE SIGNATURE (dev branding)
   ============================================================ */
console.log(
  '%c Anil Adhikari Portfolio ',
  'background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: bold;'
);
console.log('%c Digital Marketing · Web Development · Prompt Engineering', 'color: #a855f7; font-size: 12px;');
console.log('%c📍 Chitwan, Nepal | aniladhikari572@gmail.com', 'color: #9ca3cc; font-size: 11px;');
