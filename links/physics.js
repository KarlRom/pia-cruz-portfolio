// A full-page playfield independent of the centered content column.
(()=>{
 const field=document.getElementById('chrome-field');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const pieces=[...field.querySelectorAll('button')].map((el,i)=>({el,x:0,y:0,vx:(i%2?1:-1)*13,vy:9-i*3,angle:i*17,spin:(i%2?1:-1)*3,drag:false}));
 let width=0,height=0,frame=0,last=0;
 function extents(p){const w=p.el.offsetWidth,h=p.el.offsetHeight,a=p.angle*Math.PI/180;return {x:(Math.abs(Math.cos(a))*w+Math.abs(Math.sin(a))*h)/2,y:(Math.abs(Math.sin(a))*w+Math.abs(Math.cos(a))*h)/2}}
 function contain(p,bounce=true){const e=extents(p),minX=e.x,maxX=Math.max(minX,width-e.x),minY=e.y,maxY=Math.max(minY,height-e.y);if(p.x<minX||p.x>maxX){p.x=Math.max(minX,Math.min(maxX,p.x));if(bounce){p.vx=p.x===minX?Math.abs(p.vx)*.85:-Math.abs(p.vx)*.85;p.spin*=-.7}}if(p.y<minY||p.y>maxY){p.y=Math.max(minY,Math.min(maxY,p.y));if(bounce){p.vy=p.y===minY?Math.abs(p.vy)*.85:-Math.abs(p.vy)*.85;p.spin*=-.7}}}
 function paint(p){p.el.style.transform=`translate(${p.x-p.el.offsetWidth/2}px,${p.y-p.el.offsetHeight/2}px) rotate(${p.angle}deg)`}
 function measure(){const oldW=width,oldH=height;width=field.clientWidth;height=field.clientHeight;pieces.forEach((p,i)=>{if(!oldW){const stage=document.querySelector('.portrait-stage').getBoundingClientRect();const positions=[[.23,.3],[.78,.66],[.12,.7],[.88,.3],[.32,.14],[.7,.1],[.13,.25],[.86,.6],[.63,.12],[.33,.65],[.72,.36],[.48,.18]];p.x=width*positions[i%positions.length][0];p.y=stage.top+window.scrollY+stage.height*positions[i%positions.length][1]}else{p.x*=width/oldW;p.y*=height/oldH}contain(p,false);paint(p)})}
 function tick(time){const dt=Math.min((time-last)/1000||.016,.032);last=time;pieces.forEach((p,i)=>{if(!p.drag){if(!reduced.matches){p.vx+=(Math.sin(time/4000+i)*2.5)*dt;p.vy+=Math.cos(time/5000+i)*2*dt}const damping=Math.exp(-.32*dt);p.vx*=damping;p.vy*=damping;p.spin*=Math.exp(-.6*dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=(p.spin+(reduced.matches?0:Math.sin(time/6000+i)*2))*dt;contain(p);paint(p)}});frame=requestAnimationFrame(tick)}
 pieces.forEach(p=>{
  p.el.addEventListener('pointerdown',e=>{if(e.button!==0)return;p.drag=true;p.moved=false;p.pointer=e.pointerId;p.lastX=e.clientX;p.lastY=e.clientY;p.time=performance.now();p.vx=p.vy=0;p.el.setPointerCapture(e.pointerId);p.el.classList.add('dragging')});
  p.el.addEventListener('pointermove',e=>{if(!p.drag||e.pointerId!==p.pointer)return;const now=performance.now(),dt=Math.max(.008,(now-p.time)/1000),dx=e.clientX-p.lastX,dy=e.clientY-p.lastY;p.moved ||= Math.abs(dx)+Math.abs(dy)>2;p.x+=dx;p.y+=dy;p.vx=Math.max(-900,Math.min(900,dx/dt));p.vy=Math.max(-900,Math.min(900,dy/dt));p.spin=Math.max(-75,Math.min(75,dx*3-dy));p.lastX=e.clientX;p.lastY=e.clientY;p.time=now;contain(p,false);paint(p)});
  function release(e){if(!p.drag||e.pointerId!==p.pointer)return;p.drag=false;p.el.classList.remove('dragging');if(e.type==='pointercancel'){p.vx=p.vy=0}else if(!p.moved){p.vx=(p.x<width/2?1:-1)*180;p.vy=-100;p.spin=30}else if(performance.now()-p.time>120){p.vx=p.vy=0}if(p.el.hasPointerCapture(e.pointerId))p.el.releasePointerCapture(e.pointerId)}
  p.el.addEventListener('pointerup',release);p.el.addEventListener('pointercancel',release);p.el.addEventListener('lostpointercapture',release);
  p.el.addEventListener('keydown',e=>{const d={ArrowLeft:[-180,0],ArrowRight:[180,0],ArrowUp:[0,-180],ArrowDown:[0,180],Enter:[120,-100],' ':[120,-100]}[e.key];if(d){e.preventDefault();p.vx=d[0];p.vy=d[1];p.spin=20}});
 });
 new ResizeObserver(measure).observe(document.body);measure();frame=requestAnimationFrame(tick);
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(frame);if(!document.hidden){last=0;frame=requestAnimationFrame(tick)}});
})();
