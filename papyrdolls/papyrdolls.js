// Slider der altid viser 1 (mobil) eller 2 (tablet/desktop) slides pr. visning
(function(){
    const slider   = document.querySelector('.slider');
    if(!slider) return;
  
    const viewport = slider.querySelector('.viewport');
    const track    = slider.querySelector('.track');
    const slides   = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn  = slider.querySelector('.prev, .nav.prev') || slider.querySelector('.nav.prev');
    const nextBtn  = slider.querySelector('.next, .nav.next') || slider.querySelector('.nav.next');
    const dotsBox  = slider.querySelector('.dots');
  
    let perView = 1;       // 1 på mobil, 2 på tablet/desktop
    let page = 0;          // nuværende side
    let pages = 1;         // total antal sider
  
    function computePerView(){
      const w = window.innerWidth;
      perView = (w >= 768) ? 2 : 1;
      pages = Math.max(1, Math.ceil(slides.length / perView));
      buildDots();
      go(page, true);
    }
  
    function buildDots(){
      if(!dotsBox) return;
      dotsBox.innerHTML = '';
      for(let i=0; i<pages; i++){
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Gå til side ${i+1}`);
        if(i === page) b.setAttribute('aria-current','true');
        b.addEventListener('click', ()=> go(i));
        dotsBox.appendChild(b);
      }
    }
  
    function go(i, instant){
      page = Math.max(0, Math.min(i, pages-1));
      // flyt track en hel viewport ad gangen
      if(instant){
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform .35s ease';
      }
      track.style.transform = `translateX(${-(page * 100)}%)`;
  
      // opdater dots
      if(dotsBox){
        dotsBox.querySelectorAll('button').forEach((d,idx)=>{
          if(idx === page) d.setAttribute('aria-current','true');
          else d.removeAttribute('aria-current');
        });
      }
  
      // knapper
      if(prevBtn) prevBtn.disabled = (page === 0);
      if(nextBtn) nextBtn.disabled = (page >= pages - 1);
      if(instant) requestAnimationFrame(()=> track.style.transition = 'transform .35s ease');
    }
  
    if(prevBtn) prevBtn.addEventListener('click', ()=> go(page - 1));
    if(nextBtn) nextBtn.addEventListener('click', ()=> go(page + 1));
    window.addEventListener('resize', computePerView, {passive:true});
  
    // init
    computePerView();
  })();
  