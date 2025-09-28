/* =========================================================
   1) Karussel / galleri (prev/next + dots, flere instanser)
   Markup forventes:
   <div class="slider">
     <button class="nav prev">‹</button>
     <div class="viewport"><ul class="track"> ... <li class="slide">...</li> ... </ul></div>
     <button class="nav next">›</button>
     <div class="dots"></div>
   </div>
========================================================= */
document.querySelectorAll('.slider').forEach((slider) => {
    const track = slider.querySelector('.track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsWrap = slider.querySelector('.dots');
  
    if (!track || slides.length === 0) return;
  
    let index = 0;
  
    // Lav dots
    dotsWrap.innerHTML = '';
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Slide ${i+1}`);
      b.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(b);
    });
  
    function update(){
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(${-index * (slideWidth + 16)}px)`; // 16px = gap
      prevBtn && (prevBtn.disabled = index === 0);
      nextBtn && (nextBtn.disabled = index === slides.length - 1);
      [...dotsWrap.children].forEach((d, i) => d.setAttribute('aria-current', i === index ? 'true' : 'false'));
    }
    function goTo(i){ index = Math.max(0, Math.min(slides.length - 1, i)); update(); }
  
    prevBtn && prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => goTo(index + 1));
  
    // Opdater ved resize så bredden måles korrekt
    window.addEventListener('resize', update, { passive:true });
  
    // init
    update();
  });
  
  
  /* =========================================================
     2) Før/Efter slider – vis hele billede (contain) + auto-højde
     Markup:
     <div class="ba-compare">
       <img class="ba-img ba-before" src="..." />
       <img class="ba-img ba-after"  src="..." />
       <div class="ba-handle"><span></span></div>
       <input class="ba-range" type="range" min="0" max="100" value="50">
       <div class="ba-badges">
         <span class="ba-tag before">Før</span>
         <span class="ba-tag after">Efter</span>
       </div>
     </div>
  ========================================================= */
  document.querySelectorAll('.ba-compare').forEach(function(el){
    const range      = el.querySelector('.ba-range');
    const tagBefore  = el.querySelector('.ba-tag.before');
    const tagAfter   = el.querySelector('.ba-tag.after');
    const imgAfter   = el.querySelector('.ba-after');   // reference for ratio
    const imgBefore  = el.querySelector('.ba-before');
  
    // Custom labels via data-attributes (valgfrit)
    const lb = el.getAttribute('data-label-before');
    const la = el.getAttribute('data-label-after');
    if (lb && tagBefore) tagBefore.textContent = lb;
    if (la && tagAfter)  tagAfter.textContent  = la;
  
    function update(val){ el.style.setProperty('--pos', val + '%'); }
    range && range.addEventListener('input', function(){ update(this.value) });
    range && update(range.value || 50);
  
    // Klik på fladen for at hoppe til position
    el.addEventListener('pointerdown', function(e){
      const rect = el.getBoundingClientRect();
      const pos = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100 ));
      if (range){ range.value = pos.toFixed(2); update(range.value); }
    });
  
    // ---- Auto-højde ud fra billedets naturlige ratio ----
    function setHeightFromImage(){
      const w = imgAfter?.naturalWidth;
      const h = imgAfter?.naturalHeight;
      if (w && h){
        const rect = el.getBoundingClientRect();
        const containerWidth = rect.width;
        const newHeight = containerWidth * (h / w);
        el.style.height = `${newHeight}px`;
      }
    }
  
    function whenLoaded(img, cb){
      if (!img) return;
      if (img.complete && img.naturalWidth) cb();
      else img.addEventListener('load', cb, { once:true });
    }
    whenLoaded(imgAfter, setHeightFromImage);
    whenLoaded(imgBefore, setHeightFromImage);
  
    // Reager på resize
    let ro;
    if ('ResizeObserver' in window){
      ro = new ResizeObserver(() => setHeightFromImage());
      ro.observe(el);
    } else {
      window.addEventListener('resize', setHeightFromImage, { passive:true });
    }
  });
     