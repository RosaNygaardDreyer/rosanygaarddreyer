// Init alle sliders på siden
(function(){
  document.querySelectorAll('.slider').forEach(function(slider){
    const viewport = slider.querySelector('.viewport');
    const track    = slider.querySelector('.track');
    const slides   = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn  = slider.querySelector('.nav.prev');
    const nextBtn  = slider.querySelector('.nav.next');
    const dotsBox  = slider.querySelector('.dots');

    let perView = 1, page = 0, pages = 1;

    function computePerView(){
      perView = (window.innerWidth >= 768) ? 2 : 1;
      pages = Math.max(1, Math.ceil(slides.length / perView));
      buildDots();
      go(page, true);
    }

    function buildDots(){
      if(!dotsBox) return;
      dotsBox.innerHTML = '';
      for(let i=0;i<pages;i++){
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', `Gå til side ${i+1}`);
        if(i===page) b.setAttribute('aria-current','true');
        b.addEventListener('click', ()=> go(i));
        dotsBox.appendChild(b);
      }
    }

    function go(i, instant){
      page = Math.max(0, Math.min(i, pages-1));
      track.style.transition = instant ? 'none' : 'transform .35s ease';
      track.style.transform  = `translateX(${-(page*100)}%)`;
      if(dotsBox){
        dotsBox.querySelectorAll('button').forEach((d,idx)=>{
          d.toggleAttribute('aria-current', idx===page);
        });
      }
      if(prevBtn) prevBtn.disabled = (page===0);
      if(nextBtn) nextBtn.disabled = (page>=pages-1);
      if(instant) requestAnimationFrame(()=> track.style.transition = 'transform .35s ease');
    }

    prevBtn && prevBtn.addEventListener('click', ()=> go(page-1));
    nextBtn && nextBtn.addEventListener('click', ()=> go(page+1));
    window.addEventListener('resize', computePerView, {passive:true});
    computePerView();
  });
})();

