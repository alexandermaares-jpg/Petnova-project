(() => {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const section=document.querySelector('.petmoments'), cards=[...document.querySelectorAll('.pm-card')], header=document.querySelector('.site-header');
 let raf=false;
 function update(){raf=false;if(header)header.classList.toggle('is-scrolled',scrollY>10);if(!section||reduce)return;
  const rect=section.getBoundingClientRect(), span=Math.max(1,section.offsetHeight-innerHeight), p=Math.max(0,Math.min(1,-rect.top/span));
  section.style.setProperty('--pm-progress',p);
  cards.forEach((card,i)=>{const s=getComputedStyle(card),x=parseFloat(s.getPropertyValue('--x'))||0,y=parseFloat(s.getPropertyValue('--y'))||0,z=parseFloat(s.getPropertyValue('--z'))||0,r=parseFloat(s.getPropertyValue('--r'))||0,k=parseFloat(s.getPropertyValue('--s'))||1;
   const phase=p*2-1, drift=(innerWidth<700?55:110)*phase*(i%2?-1:1);
   card.style.transform=`translate3d(calc(-50% + ${x}vw + ${drift}px),calc(-50% + ${y}vh + ${phase*(i%2?16:-16)}px),${z+Math.sin(p*Math.PI*2+i)*35}px) rotateY(${r+phase*5}deg) rotateZ(${r*.12}deg) scale(${k})`;
  });
 }
 function request(){if(!raf){raf=true;requestAnimationFrame(update)}}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});update();
 if(section&&!reduce)cards.forEach(card=>{card.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=card.getBoundingClientRect(),rx=((e.clientY-r.top)/r.height-.5)*-6,ry=((e.clientX-r.left)/r.width-.5)*7;card.style.filter=`drop-shadow(0 25px 32px #100a1e70)`;card.style.setProperty('--tilt-x',rx+'deg');card.style.setProperty('--tilt-y',ry+'deg')});card.addEventListener('pointerleave',()=>card.style.removeProperty('filter'))});
 const targets=document.querySelectorAll('.section-title,.service-card,.values-copy,.workspace-copy,.community-copy');
 if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.setAttribute('data-reveal','');e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});targets.forEach(el=>{el.setAttribute('data-reveal','');io.observe(el)})}else targets.forEach(el=>el.classList.add('is-visible'));
})();