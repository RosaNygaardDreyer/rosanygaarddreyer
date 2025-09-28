// === LIGHTBOX: klik for at åbne + next/prev knapper ===
(function () {
    // Find alle mulige thumbnails (du kan nøjes med én af klasserne hvis du vil)
    const thumbNodes = document.querySelectorAll('.thumbnail, .openLightbox, #openLightbox');
    const thumbnails = Array.from(new Set(Array.from(thumbNodes))); // dedupe
  
    // Dine eksisterende lightbox-elementer
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn    = document.getElementById('close-btn');
  
    if (!thumbnails.length || !lightbox || !lightboxImg || !closeBtn) return;
  
    let currentIndex = 0;
  
    function isOpen() {
      // robust tjek, virker uanset display-type
      return getComputedStyle(lightbox).display !== 'none';
    }
  
    function render(i) {
      const el = thumbnails[i];
      if (!el) return;
      lightboxImg.src = el.src;
      lightboxImg.alt = el.alt || '';
    }
  
    function openLightbox(i) {
      currentIndex = i;
      render(currentIndex);
      lightbox.style.display = 'flex';   // rører ikke din CSS-klasser
      document.body.style.overflow = 'hidden';
    }
  
    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  
    function showNext() {
      currentIndex = (currentIndex + 1) % thumbnails.length;
      render(currentIndex);
    }
  
    function showPrev() {
      currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
      render(currentIndex);
    }
  
    // Gør funktionerne tilgængelige for evt. andre scripts (ikke strengt nødvendigt)
    window.__lbShowNext = showNext;
    window.__lbShowPrev = showPrev;
  
    // Klik på alle thumbnails åbner
    thumbnails.forEach((thumb, i) => {
      thumb.addEventListener('click', () => openLightbox(i));
    });
  
    // Luk på kryds
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  
    // Klik udenfor billedet lukker
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  
    // Klik på billedet = næste
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  
    // Tastatur
    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });
  
    // Tilføj next/prev knapper dynamisk (ingen behov for HTML/CSS ændringer)
    function addBtn(id, arrow, side) {
      let btn = document.getElementById(id);
      if (btn) return btn;
      btn = document.createElement('button');
      btn.id = id;
      btn.setAttribute('aria-label', side === 'left' ? 'Previous' : 'Next');
      btn.textContent = arrow;
      Object.assign(btn.style, {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [side === 'left' ? 'left' : 'right']: '16px',
        width: '48px',
        height: '48px',
        borderRadius: '999px',
        border: '0',
        background: 'rgba(0,0,0,0.35)',
        color: '#fff',
        fontSize: '28px',
        lineHeight: '1',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        zIndex: '1'
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        side === 'left' ? showPrev() : showNext();
      });
      btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,0,0,0.5)');
      btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,0,0,0.35)');
      lightbox.appendChild(btn);
      return btn;
    }
  
    addBtn('lb-prev-dyn', '‹', 'left');
    addBtn('lb-next-dyn', '›', 'right');
  
    // (valgfrit) swipe på touch
    let startX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      startX = (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
    }, { passive: true });
  
    lightbox.addEventListener('touchend', (e) => {
      const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
      const delta = endX - startX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) showNext(); else showPrev();
      }
    }, { passive: true });
  })();
  
