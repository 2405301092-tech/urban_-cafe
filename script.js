/* ============================================================
   URBAN CAFE — Interactive JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Page Loader ─── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  });
  // Fallback: hide loader after 3s regardless
  setTimeout(() => loader.classList.add('hidden'), 3000);

  /* ─── Navbar Scroll ─── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = scrollY;
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Mobile Nav Toggle ─── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ─── Active Nav Link on Scroll ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkElements.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ─── Hero Particles ─── */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.4 + 0.1;
      heroParticles.appendChild(particle);
    }
  }

  /* ─── Counter Animation ─── */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const current = Math.round(target * eased);

        stat.textContent = current;

        if (frame === totalFrames) {
          clearInterval(counter);
          stat.textContent = target;
        }
      }, frameDuration);
    });
  }

  // Trigger counter when hero stats are visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ─── Scroll Reveal ─── */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─── Menu Filter ─── */
  const filterBtns = document.querySelectorAll('.menu-filter');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      menuCards.forEach((card, index) => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          setTimeout(() => {
            card.style.transition = 'opacity 0.4s, transform 0.4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─── Reservation Form ─── */
  const reservationForm = document.getElementById('reservationForm');
  const resSubmitBtn = document.getElementById('resSubmitBtn');

  if (reservationForm) {
    // Set min date to today
    const resDate = document.getElementById('resDate');
    const today = new Date().toISOString().split('T')[0];
    resDate.setAttribute('min', today);

    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnText = resSubmitBtn.querySelector('.btn-text');
      const btnLoading = resSubmitBtn.querySelector('.btn-loading');
      const btnSuccess = resSubmitBtn.querySelector('.btn-success');

      // Show loading
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-flex';
      resSubmitBtn.disabled = true;
      resSubmitBtn.style.opacity = '0.8';

      // Simulate reservation
      setTimeout(() => {
        btnLoading.style.display = 'none';
        btnSuccess.style.display = 'inline-flex';
        resSubmitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        resSubmitBtn.style.boxShadow = '0 4px 20px rgba(76, 175, 80, 0.35)';

        // Reset after 3s
        setTimeout(() => {
          btnSuccess.style.display = 'none';
          btnText.style.display = 'inline-flex';
          resSubmitBtn.disabled = false;
          resSubmitBtn.style.opacity = '1';
          resSubmitBtn.style.background = '';
          resSubmitBtn.style.boxShadow = '';
          reservationForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  /* ─── Newsletter Form ─── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const btn = document.getElementById('newsletterSubmitBtn');

      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';

      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        emailInput.value = '';
      }, 2500);
    });
  }

  /* ─── Gallery Lightbox ─── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.92);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
        opacity: 0;
        transition: opacity 0.3s;
        padding: 40px;
      `;

      const lightboxImg = document.createElement('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        transform: scale(0.9);
        transition: transform 0.3s;
        object-fit: contain;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.style.cssText = `
        position: absolute;
        top: 24px;
        right: 24px;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
      `;

      lightbox.appendChild(lightboxImg);
      lightbox.appendChild(closeBtn);
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(() => {
        lightbox.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';
      });

      const closeLightbox = () => {
        lightbox.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9)';
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = '';
        }, 300);
      };

      lightbox.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', escHandler);
        }
      });
    });
  });

  /* ─── Smooth Parallax on Hero (subtle) ─── */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        hero.style.backgroundPositionY = scrollY * 0.4 + 'px';
      }
    }, { passive: true });
  }

  /* ─── Staggered reveal for menu cards ─── */
  const menuGrid = document.getElementById('menuGrid');
  if (menuGrid) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const cards = menuGrid.querySelectorAll('.menu-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('revealed');
          }, i * 60);
        });
        observer.unobserve(menuGrid);
      }
    }, { threshold: 0.1 });
    observer.observe(menuGrid);
  }

});
