/* ============================================================
   ANNIVERSARY WEBSITE — script.js
   All interactivity, animations, and dynamic behavior
   ============================================================ */

/* ── WAIT FOR DOM ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LOADING SCREEN
     ============================================================ */
  const loadingScreen = document.getElementById('loading-screen');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.classList.remove('loading');
      // Start typing effect after load
      startTyping();
      // Start letter animation after a short delay
      setTimeout(checkLetterVisible, 1500);
    }, 2400);
  });

  document.body.classList.add('loading');


  /* ============================================================
     2. CUSTOM CURSOR
     ============================================================ */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursor-trail');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    // Trail follows with slight delay via CSS transition
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top  = e.clientY + 'px';
  });

  // Scale cursor on hoverable elements
  const hoverables = document.querySelectorAll(
    'a, button, .gallery-card, .reason-card, .cta-btn, .dot'
  );
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'var(--purple-mid)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      cursor.style.background = 'var(--pink-deep)';
    });
  });


  /* ============================================================
     3. FLOATING HEARTS BACKGROUND
     ============================================================ */
  const heartsContainer = document.getElementById('hearts-container');
  const heartEmojis = ['❤️','💕','💗','💓','💖','💝','🌸','✨','💫'];

  function createHeart(fast = false) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    const size   = Math.random() * 1.2 + 0.7;
    const left   = Math.random() * 100;
    const dur    = fast
      ? (Math.random() * 3 + 3)
      : (Math.random() * 8 + 8);
    const delay  = Math.random() * 4;

    heart.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    heartsContainer.appendChild(heart);

    // Remove after animation to avoid DOM bloat
    setTimeout(() => heart.remove(), (dur + delay) * 1000);
  }

  // Spawn hearts at regular intervals
  let heartInterval = setInterval(() => createHeart(false), 600);

  // Initial batch
  for (let i = 0; i < 12; i++) createHeart(false);

  // Expose for surprise section
  window.burstHearts = function () {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createHeart(true), i * 80);
    }
  };


  /* ============================================================
     4. BACKGROUND MUSIC (Web Audio API — gentle ambient tone)
     ============================================================ */
  const musicBtn   = document.getElementById('music-btn');
  const musicIcon  = document.getElementById('music-icon');
  const musicLabel = document.getElementById('music-label');
  const bgMusic = document.getElementById('bg-music');

 let isPlaying = false;

musicBtn.addEventListener('click', () => {

  if (!isPlaying) {

    bgMusic.play();

    musicIcon.textContent  = '🔊';
    musicLabel.textContent = 'Pause Music';
    musicBtn.classList.add('playing');

    isPlaying = true;

  } else {

    bgMusic.pause();

    musicIcon.textContent  = '🎵';
    musicLabel.textContent = 'Play Music';
    musicBtn.classList.remove('playing');

    isPlaying = false;

  }

});
 


  /* ============================================================
     5. HERO TYPING EFFECT
     ============================================================ */
  const typingEl = document.getElementById('typing-text');
  const messages = [
    "Satu bulan bersama ayang merupakan kisah yang paling indah yang pernah kurasakan.",
    "Setiap hari bersama ayang bagaikan mimpi yang paling indah sampai aku rasa aku tidak ingin bangun dari mimpi indah tersebut.",
    "Ayang membuat setiap momen biasa terasa luar biasa.",
    "Terimakasih ayang sudah hadir di hidup ku 💕"
  ];
  let msgIdx  = 0;
  let charIdx = 0;
  let deleting = false;
  let typingTimer;

  function startTyping() {
    type();
  }

  function type() {
    const current = messages[msgIdx];

    if (!deleting) {
      typingEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        typingTimer = setTimeout(type, 2800);
        return;
      }
    } else {
      typingEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        msgIdx = (msgIdx + 1) % messages.length;
        typingTimer = setTimeout(type, 400);
        return;
      }
    }

    const speed = deleting ? 35 : 55;
    typingTimer = setTimeout(type, speed);
  }


  /* ============================================================
     6. SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ============================================================
     7. NAVIGATION DOTS — active state on scroll
     ============================================================ */
  const sections = document.querySelectorAll('.section');
  const dots     = document.querySelectorAll('.dot');

  const sectionIds = ['hero','story','gallery','reasons','letter','surprise','final'];

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = sectionIds.indexOf(entry.target.id);
        if (idx !== -1) {
          dots.forEach(d => d.classList.remove('active'));
          dots[idx]?.classList.add('active');
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  // Dot click → scroll to section
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      document.getElementById(sectionIds[i])?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // CTA button smooth scroll
  document.querySelectorAll('.scroll-to').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target;
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    });
  });


  /* ============================================================
     8. GALLERY LIGHTBOX
     ============================================================ */
  const lightbox        = document.getElementById('lightbox');
  const lightboxClose   = document.getElementById('lightbox-close');
  const lightboxImgWrap = document.getElementById('lightbox-img-wrap');
  const lightboxCaption = document.getElementById('lightbox-caption');

  const galleryData = [
    { emoji: '🌹', caption: 'Our First Hello' },
    { emoji: '🌙', caption: 'Late Night Talks' },
    { emoji: '☀️', caption: 'Morning Sunshine' },
    { emoji: '🌊', caption: 'Lost in Your Eyes' },
    { emoji: '🌸', caption: 'Spring In My Heart' },
    { emoji: '⭐', caption: 'Stargazing Together' },
    { emoji: '🦋', caption: 'Butterflies Always' },
    { emoji: '💖', caption: 'You & Me, Always' },
  ];

  document.querySelectorAll('.gallery-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      const data = galleryData[i];
      lightboxImgWrap.textContent = data.emoji;
      lightboxImgWrap.style.fontSize = '8rem';
      lightboxCaption.textContent = data.caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeSurpriseModal();
    }
  });


  /* ============================================================
     9. REASON CARDS — tap-to-flip on touch devices
     ============================================================ */
  document.querySelectorAll('.reason-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });


  /* ============================================================
     10. LOVE LETTER — typing animation
     ============================================================ */
  const letterLines = [
    "Awoo sayang, apa kabarnya nih? Aku harap ayangku baik-baik aja hehe. Btw, selamat anniversary jadian kita yang pertama. 🎉",

"Makasih loh ya ayang sudah hadir di dalam hidupku. Aku bener-bener sangat sayang banget sama ayang.",

"Walaupun aku masih banyak salahnya dalam hubungan ini, ayang tetap sabar dan masih mau bersama aku. Itu bikin aku ngerasa sangat bersyukur dan bahagia.",

"Kita juga sudah melewati banyak rintangan bersama. Hehe ya biasalah, LDR memang nggak selalu mudah.",

"Tapi aku bersyukur banget bisa dapetin cewek yang tulusnya kelewatan tulus sama aku, dan memperlakukan aku sebaik ini.",

"Itu yang bikin aku nggak mau ninggalin ayang. Aku pengen terus bersama ayang dan tetap menjalani semua ini bareng-bareng.",

"Bahkan kalaupun ada cewek yang lebih cantik atau kaya, tetap saja aku akan memilih ayang.",

"Jadi ayang nggak perlu takut ya. Aku di sini hanya untuk ayang.",

"Di hatiku juga cuma ada ayang. 💕"
  ];

  const letterTextEl = document.getElementById('letter-text');
  let letterStarted  = false;

  function animateLetter() {
    if (letterStarted) return;
    letterStarted = true;

    letterTextEl.innerHTML = '';

    letterLines.forEach((line, i) => {
      setTimeout(() => {
        const p = document.createElement('p');
        p.style.opacity    = '0';
        p.style.transform  = 'translateY(12px)';
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        p.textContent = line;
        letterTextEl.appendChild(p);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            p.style.opacity   = '1';
            p.style.transform = 'translateY(0)';
          });
        });
      }, i * 600);
    });
  }

  function checkLetterVisible() {
    const letterSection = document.getElementById('letter');
    if (!letterSection) return;
    const rect = letterSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      animateLetter();
    }
  }

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateLetter();
    });
  }, { threshold: 0.2 });

  const letterSection = document.getElementById('letter');
  if (letterSection) letterObserver.observe(letterSection);


  /* ============================================================
     11. SURPRISE BUTTON — confetti + modal + hearts burst
     ============================================================ */
  const surpriseBtn   = document.getElementById('surprise-btn');
  const surpriseModal = document.getElementById('surprise-modal');
  const modalClose    = document.getElementById('modal-close');
  const confettiContainer = document.getElementById('confetti-container');

  const confettiColors = [
    '#f48fb1','#ce93d8','#f9a8c9','#fff176','#80cbc4',
    '#ffcc80','#ef9a9a','#b39ddb','#f48fb1','#a5d6a7'
  ];

  function launchConfetti() {
    for (let i = 0; i < 120; i++) {
      setTimeout(() => {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.cssText = `
          left: ${Math.random() * 100}%;
          background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
          width: ${Math.random() * 10 + 6}px;
          height: ${Math.random() * 10 + 6}px;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          animation-duration: ${Math.random() * 2 + 2}s;
          animation-delay: 0s;
          transform: rotate(${Math.random() * 360}deg);
        `;
        confettiContainer.appendChild(piece);
        setTimeout(() => piece.remove(), 4000);
      }, i * 25);
    }
  }

  function openSurpriseModal() {
    surpriseModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    launchConfetti();
    if (window.burstHearts) window.burstHearts();
  }

  function closeSurpriseModal() {
    surpriseModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  surpriseBtn.addEventListener('click', openSurpriseModal);
  modalClose.addEventListener('click', closeSurpriseModal);
  surpriseModal.addEventListener('click', (e) => {
    if (e.target === surpriseModal) closeSurpriseModal();
  });


  /* ============================================================
     12. FINAL SECTION — set current date
     ============================================================ */
  const currentDateEl = document.getElementById('current-date');
  if (currentDateEl) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
  }


  /* ============================================================
     13. SCROLL LISTENER — misc effects
     ============================================================ */
  window.addEventListener('scroll', () => {
    // Check letter visibility
    if (!letterStarted) checkLetterVisible();

    // Parallax on hero
    const hero = document.getElementById('hero');
    if (hero) {
      const scrollY = window.scrollY;
      const heroInner = hero.querySelector('.hero-inner');
      if (heroInner) {
        heroInner.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroInner.style.opacity   = Math.max(0, 1 - scrollY / 500);
      }
    }
  }, { passive: true });


  /* ============================================================
     14. TOUCH SUPPORT — disable custom cursor on touch devices
     ============================================================ */
  window.addEventListener('touchstart', () => {
    cursor.style.display      = 'none';
    cursorTrail.style.display = 'none';
  }, { once: true });

}); /* END DOMContentLoaded */
