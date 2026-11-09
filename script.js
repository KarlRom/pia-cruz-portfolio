const projects=[
 {title:'Universal Music Group',category:'Social & campaigns',filter:'social',cover:'umg-cover.jpg',pages:[8,9,10],description:'Artist promotions and campaign content for Matthew Ifield’s Philippines visit, including artist introduction, pre-visit, on-the-ground, and post-visit content.'},
 {title:'Folliq',category:'Video & ad creatives',filter:'video',cover:'folliq-cover.jpg',pages:[16,17],description:'A selection of hair-care product video creatives from Pia’s e-commerce portfolio.'},
 {title:'Matos du Chef',category:'Email design',filter:'design',cover:'email-cover.jpg',pages:[11],description:'Email designs for Matos du Chef, combining product imagery, layout, and promotional messaging.'},
 {title:'Spud Street PH',category:'Social & design',filter:'design',cover:'spud-cover.jpg',pages:[12,14],description:'Promotional visuals and social content for Spud Street PH.'},
 {title:'Aurum Vault',category:'Video & hook variations',filter:'video',cover:'aurum-cover.jpg',pages:[18,19,20],description:'E-commerce video creatives and alternate hooks, exploring different openings and product stories.'},
 {title:'Drama Ads',category:'Story-led video',filter:'video',cover:'drama-cover.jpg',pages:[15],description:'Drama-style ad samples, using narrative and character-led moments as creative hooks.'},
 {title:'Chef Preserve',category:'E-commerce video',filter:'video',cover:'chef-cover.jpg',pages:[26,27,28,29,30,31],description:'Product-focused video creatives for BBZ Ecommerce, including Chef Preserve and Valentine’s variations.'},
 {title:'92 Creations LLC',category:'Video & ad creatives',filter:'video',cover:'92-cover.jpg',pages:[24,25],description:'Selected e-commerce ad creatives from Pia’s work for 92 Creations LLC.'},
 {title:'FLAIR 2024',category:'Event & social coverage',filter:'social',cover:'flair-cover.jpg',pages:[32,33,34,35],description:'Content from FLAIR 2024, a benefit concert for the Lasallian community, plus Student’s Week, Palarong Lasalyano, and Bizcovery event coverage.'}
];
const asset=name=>window.PORTFOLIO_ASSETS?.[name]||`assets/${name}`;
const galleryState={filter:'all',page:0,expanded:false};
const PAGE_SIZE=3;
const grid=document.getElementById('projects');
const filters=[...document.querySelectorAll('.filters button')];
const prev=document.getElementById('prev-projects');
const next=document.getElementById('next-projects');
const expand=document.getElementById('show-all');
const pad=n=>String(n).padStart(2,'0');
function selection(){const matching=projects.filter(p=>galleryState.filter==='all'||p.filter===galleryState.filter);const start=galleryState.expanded?0:galleryState.page*PAGE_SIZE;return {matching,start,visible:galleryState.expanded?matching:matching.slice(start,start+PAGE_SIZE)}}
function renderProjects(){
 const oldHeight=grid.getBoundingClientRect().height;
 const {matching,start,visible}=selection();
 const cards=visible.map(p=>{
  const button=document.createElement('button');
  const style=p.title==='Matos du Chef'?'email':p.title==='FLAIR 2024'?'event':'';
  button.className=`project ${style}`;button.setAttribute('aria-label',`View ${p.title} project`);button.title=`View ${p.title}`;
  button.innerHTML=`<div class="project-stage"><span class="project-type">${p.filter==='video'?'VIDEO CREATIVE':p.filter==='social'?'CAMPAIGN':'DESIGN'}</span><div class="art-stack"><img src="${asset(p.cover)}" alt="" loading="lazy"><img src="${asset(p.cover)}" alt="${p.title} portfolio preview" loading="lazy"><img src="${asset(p.cover)}" alt="" loading="lazy"></div></div><div class="project-meta"><div><h3>${p.title}</h3><span class="category">${p.category}</span></div><span class="project-open" aria-hidden="true"><svg class="action-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M12 5l7 7-7 7"/></svg></span></div>`;
  button.addEventListener('click',()=>openProject(p));return button;
 });
 grid.replaceChildren(...cards);grid.classList.toggle('expanded',galleryState.expanded);grid.scrollLeft=0;
 if(oldHeight && grid.animate && !reduceInteractions()){const newHeight=grid.getBoundingClientRect().height;grid.animate([{height:oldHeight+"px",opacity:.65},{height:newHeight+"px",opacity:1}],{duration:320,easing:"cubic-bezier(.22,1,.36,1)"});}
 prev.disabled=galleryState.expanded||galleryState.page===0;
 next.disabled=galleryState.expanded||(start+PAGE_SIZE>=matching.length);
 expand.innerHTML=galleryState.expanded?'Show fewer <span aria-hidden="true">−</span>':`All projects (${matching.length}) <span aria-hidden="true">+</span>`;
 expand.setAttribute('aria-expanded',String(galleryState.expanded));expand.setAttribute('aria-controls','projects');
 document.getElementById('project-range').textContent=`${pad(start+1)}—${pad(start+visible.length)} / ${pad(matching.length)}`;
 document.getElementById('filter-status').textContent=`Showing projects ${start+1} to ${start+visible.length} of ${matching.length}${galleryState.filter==='all'?'':` in ${galleryState.filter}`}.`;
}
filters.forEach(button=>button.addEventListener('click',()=>{galleryState.filter=button.dataset.filter;galleryState.page=0;filters.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});renderProjects()}));
prev.addEventListener('click',()=>{if(galleryState.page>0){galleryState.page--;renderProjects()}});
next.addEventListener('click',()=>{if((galleryState.page+1)*PAGE_SIZE<selection().matching.length){galleryState.page++;renderProjects()}});
expand.addEventListener('click',()=>{galleryState.expanded=!galleryState.expanded;galleryState.page=0;renderProjects()});
const dialog=document.getElementById('project-dialog');let lastOpener;
function openProject(p){
 lastOpener=document.activeElement;
 document.getElementById('dialog-title').textContent=p.title;
 document.getElementById('dialog-category').textContent=p.category;
 document.getElementById('dialog-description').textContent=p.description;
 document.getElementById('dialog-images').replaceChildren(...p.pages.map((n,i)=>{const img=document.createElement('img');img.src=asset(`page-${n}.jpg`);img.alt=`${p.title}, portfolio page ${n}`;img.loading=i?'lazy':'eager';img.decoding='async';return img}));
 document.body.classList.add('modal-open');dialog.showModal();dialog.scrollTop=0;appendProjectVideos(p);
 if(dialog.animate && !reduceInteractions()) dialog.animate([{opacity:0,transform:"translateY(18px) scale(.97)"},{opacity:1,transform:"translateY(0) scale(1)"}],{duration:280,easing:"cubic-bezier(.22,1,.36,1)"});
}
document.querySelector('.close').addEventListener('click',()=>closeProject());
dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom )closeProject()});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastOpener?.isConnected)lastOpener.focus()});
document.getElementById('year').textContent=new Date().getFullYear();
renderProjects();

// Populate project.videos with actual local media filenames when supplied.
function appendProjectVideos(project){
 (project.videos||[]).forEach(name=>{const shell=document.createElement('div');shell.className='video-shell';const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.autoplay=true;video.loop=true;video.playsInline=true;video.controls=true;video.preload='metadata';video.setAttribute('muted','');video.setAttribute('playsinline','');video.src=asset(name);const sound=document.createElement('button');sound.className='sound-toggle';sound.textContent='Unmute';sound.setAttribute('aria-label','Unmute video');sound.addEventListener('click',()=>{video.muted=!video.muted;sound.textContent=video.muted?'Unmute':'Mute';sound.setAttribute('aria-label',video.muted?'Unmute video':'Mute video')});video.addEventListener('volumechange',()=>{sound.textContent=video.muted?'Unmute':'Mute'});shell.append(video,sound);document.getElementById('dialog-images').prepend(shell);video.play().catch(()=>{});});
}
dialog.addEventListener('close',()=>dialog.querySelectorAll('video').forEach(v=>{v.pause();v.muted=true}));

function reduceInteractions(){return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)}
let closingProject=false;
async function closeProject(){
 if(closingProject)return;
 if(!dialog.animate||reduceInteractions()){dialog.close();return}
 closingProject=true;dialog.classList.add('is-closing');
 try{await dialog.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(10px) scale(.98)'}],{duration:180,easing:'ease-in',fill:'forwards'}).finished}catch{}
 dialog.close();dialog.classList.remove('is-closing');dialog.getAnimations().forEach(a=>a.cancel());closingProject=false;
}
dialog.addEventListener('cancel',e=>{e.preventDefault();closeProject()});
document.querySelectorAll('details.service-card').forEach(panel=>{
 const summary=panel.querySelector('summary');let running=null;let desired=panel.open;
 summary.addEventListener('click',e=>{
  if(!panel.animate||reduceInteractions())return;
  e.preventDefault();desired=!desired;
  const start=panel.getBoundingClientRect().height;
  if(running){running.onfinish=null;running.cancel()}
  panel.style.height='';panel.style.overflow='hidden';panel.open=desired;
  const end=panel.getBoundingClientRect().height;
  panel.open=true;
  running=panel.animate([{height:start+'px'},{height:end+'px'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
  running.onfinish=()=>{panel.open=desired;panel.style.height='';panel.style.overflow='';running=null};
 });
 panel.addEventListener('toggle',()=>{if(!running)desired=panel.open});
});

// Damped spring motion: tiny deformations suggest fluid metal without moving copy.
(() => {
 const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const metals=[...document.querySelectorAll('.hero-metal,.about-chrome,.contact-chrome')];
 if(!metals.length)return;
 const states=metals.map((el,i)=>({el,section:el.closest('section'),phase:i*2.1,x:0,y:0,vx:0,vy:0,px:0,py:0,visible:true}));
 let frame=0,last=0,heroVisible=false;
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{entries.forEach(entry=>{const state=states.find(s=>s.el===entry.target);if(state)state.visible=entry.isIntersecting})},{rootMargin:'80px'}):null;
 states.forEach(s=>{
  observer?.observe(s.el);
  s.section.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=s.section.getBoundingClientRect();s.px=(e.clientX-r.left)/r.width-.5;s.py=(e.clientY-r.top)/r.height-.5},{passive:true});
  s.section.addEventListener('pointerleave',()=>{s.px=s.py=0});
 });
 function tick(now){
  const dt=Math.min((now-last)/16.667||1,2);last=now;
  const time=now/1000;
  states.forEach(s=>{
   if(!s.visible)return;
   const targetX=Math.sin(time*.55+s.phase)*6+s.px*14;
   const targetY=Math.cos(time*.7+s.phase)*8+s.py*12;
   s.vx=(s.vx+(targetX-s.x)*.025*dt)*Math.pow(.86,dt);
   s.vy=(s.vy+(targetY-s.y)*.025*dt)*Math.pow(.86,dt);
   s.x+=s.vx*dt;s.y+=s.vy*dt;
   s.el.style.setProperty('--metal-x',s.x.toFixed(2)+'px');
   s.el.style.setProperty('--metal-y',s.y.toFixed(2)+'px');
   s.el.style.setProperty('--metal-turn',(Math.sin(time*.4+s.phase)*3+s.vx*.6).toFixed(2)+'deg');
   s.el.style.setProperty('--metal-stretch',(1+Math.sin(time*.65+s.phase)*.018).toFixed(4));
  });
  frame=requestAnimationFrame(tick);
 }
 function sync(){cancelAnimationFrame(frame);last=0;if(!media?.matches&&!document.hidden)frame=requestAnimationFrame(tick);}
 media?.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
})();

// Show a persistent cue only while the document has more content below.
(() => {
 const cue=document.querySelector('.page-scroll');
 if(!cue)return;
 let scheduled=false;
 function update(){
  scheduled=false;
  const page=document.scrollingElement||document.documentElement;
  const atEnd=page.scrollHeight-page.clientHeight-page.scrollTop<=40;
  cue.hidden=false;cue.classList.toggle('at-end',atEnd);cue.setAttribute('aria-label',atEnd?'Back to top':'Scroll down');
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 cue.addEventListener('click',()=>{const behavior=reduceInteractions()?'instant':'smooth';if(cue.classList.contains('at-end'))window.scrollTo({top:0,behavior});else window.scrollBy({top:Math.max(200,window.innerHeight*.75),behavior})});
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});
 if(typeof ResizeObserver==='function')new ResizeObserver(schedule).observe(document.body);
 window.addEventListener('load',schedule,{once:true});update();
})();


// Inertial chrome toys: pointer velocity, damped travel, and elastic edge impacts.
(() => {
 const chromeHulls={"chrome-ribbon.webp":[[-0.46,0.235],[-0.455,0.205],[-0.45,0.1825],[-0.44,0.1525],[-0.43,0.13],[-0.225,-0.2375],[-0.195,-0.2825],[-0.18,-0.2975],[-0.15,-0.32],[-0.13,-0.3275],[0.34,-0.44],[0.375,-0.44],[0.395,-0.4325],[0.415,-0.4175],[0.43,-0.395],[0.44,-0.3725],[0.445,-0.3575],[0.45,-0.3275],[0.45,-0.2375],[0.445,-0.2075],[0.44,-0.185],[0.425,-0.14],[0.415,-0.1175],[0.37,-0.05],[-0.03,0.2875],[-0.07,0.3175],[-0.245,0.4225],[-0.275,0.4375],[-0.295,0.445],[-0.32,0.4525],[-0.345,0.4525],[-0.37,0.445],[-0.385,0.4375],[-0.415,0.415],[-0.435,0.385],[-0.445,0.3625],[-0.45,0.3475],[-0.455,0.325],[-0.46,0.295]],"chrome-star.png":[[-0.4139,0.0215],[-0.4091,0.0167],[0.0359,-0.4234],[0.0455,-0.4282],[0.4139,-0.0885],[0.4282,-0.0742],[0.4139,-0.0598],[-0.0933,0.4282],[-0.1029,0.4282],[-0.4139,0.0311]],"chrome-heart.png":[[-0.4474,-0.1842],[-0.4426,-0.2033],[-0.4378,-0.2177],[-0.4282,-0.2416],[-0.4187,-0.2608],[-0.39,-0.3038],[-0.3517,-0.3421],[-0.3325,-0.3565],[-0.2847,-0.3804],[-0.256,-0.39],[-0.2368,-0.3947],[-0.1651,-0.3947],[0.2703,-0.299],[0.2895,-0.2943],[0.3038,-0.2895],[0.3278,-0.2799],[0.3421,-0.2703],[0.3612,-0.256],[0.39,-0.2273],[0.4043,-0.2081],[0.4139,-0.1938],[0.4378,-0.1459],[0.4426,-0.1316],[0.4474,-0.1124],[0.4522,-0.0885],[0.4522,-0.0359],[0.4474,-0.0072],[0.4426,0.012],[0.433,0.0407],[0.4187,0.0742],[0.4043,0.0981],[0.3756,0.1364],[0.3469,0.1651],[0.3182,0.189],[0.2895,0.2081],[0.2656,0.2225],[0.2177,0.2464],[-0.1316,0.39],[-0.1459,0.3947],[-0.1746,0.3947],[-0.1842,0.3852],[-0.4043,0.0072],[-0.4282,-0.0407],[-0.4426,-0.0837],[-0.4474,-0.1029]],"chrome-ring.png":[[-0.3852,0.0167],[-0.3804,-0.012],[-0.366,-0.055],[-0.3565,-0.0742],[-0.3421,-0.0981],[-0.3278,-0.1172],[-0.2751,-0.1699],[-0.256,-0.1842],[-0.2273,-0.2033],[-0.2033,-0.2177],[0.0598,-0.3708],[0.1077,-0.3947],[0.1364,-0.4043],[0.1555,-0.4091],[0.2177,-0.4091],[0.2464,-0.3995],[0.2656,-0.39],[0.2799,-0.3804],[0.3038,-0.3565],[0.3134,-0.3421],[0.3278,-0.3182],[0.3325,-0.3086],[0.3517,-0.2512],[0.3565,-0.2321],[0.3612,-0.2081],[0.366,-0.1794],[0.3708,-0.1364],[0.3708,0.0215],[0.366,0.0646],[0.3565,0.1172],[0.3517,0.1364],[0.3421,0.1699],[0.3373,0.1842],[0.323,0.2177],[0.3134,0.2368],[0.299,0.2608],[0.2895,0.2751],[0.2751,0.2943],[0.2273,0.3421],[0.2081,0.3565],[0.1938,0.366],[0.1459,0.39],[0.1316,0.3947],[0.1124,0.3995],[0.0885,0.4043],[0.0311,0.4043],[0.0024,0.3995],[-0.0167,0.3947],[-0.0455,0.3852],[-0.0694,0.3756],[-0.1077,0.3565],[-0.1411,0.3373],[-0.2273,0.2799],[-0.2656,0.2512],[-0.2943,0.2273],[-0.3325,0.189],[-0.3469,0.1699],[-0.3565,0.1555],[-0.3708,0.1268],[-0.3756,0.1124],[-0.3804,0.0933],[-0.3852,0.0694]],"chrome-drop.png":[[-0.366,0.1746],[-0.3612,0.1364],[-0.3517,0.0981],[-0.323,0.0407],[-0.3038,0.012],[-0.2847,-0.012],[-0.2512,-0.0455],[-0.2273,-0.0646],[-0.2129,-0.0742],[0.3182,-0.4091],[0.3373,-0.3995],[0.3469,-0.39],[0.3565,-0.3756],[0.366,-0.3469],[0.366,-0.2895],[0.3565,-0.2512],[0.1459,0.2512],[0.1268,0.2895],[0.1077,0.3182],[0.055,0.3708],[0.0263,0.39],[-0.0024,0.4043],[-0.0455,0.4187],[-0.0694,0.4234],[-0.1555,0.4234],[-0.1794,0.4187],[-0.2081,0.4091],[-0.2464,0.39],[-0.2608,0.3804],[-0.2799,0.366],[-0.3038,0.3421],[-0.3182,0.323],[-0.3278,0.3086],[-0.3421,0.2847],[-0.3517,0.2608],[-0.3565,0.2464],[-0.3612,0.2273],[-0.366,0.189]]};
 const toys=[...document.querySelectorAll('.chrome-toy')].map((el,index)=>({el,index,stage:el.closest('.hero'),hull:chromeHulls[el.querySelector('img').getAttribute('src').split('/').pop()],x:0,y:0,vx:0,vy:0,drag:null,tilt:0,spin:0,squash:0}));
 if(!toys.length)return;
 let frame=0,last=0,heroVisible=false;
 const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
 function bounds(s){
  // Collide the visible chrome silhouette with the full hero edges, not image padding.
  const w=s.el.offsetWidth,h=s.el.offsetHeight,a=s.tilt*Math.PI/180,c=Math.cos(a),n=Math.sin(a);
  const points=s.hull||[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]];
  const transformed=points.map(([x,y])=>{const px=x*w*(1+s.squash),py=y*h*(1-s.squash);return [px*c-py*n,px*n+py*c]});
  const xs=transformed.map(p=>p[0]),ys=transformed.map(p=>p[1]);
  const cx=s.el.offsetLeft+w/2,cy=s.el.offsetTop+h/2;
  const rect=s.stage.getBoundingClientRect();
  const left=-rect.left,right=document.documentElement.clientWidth-rect.left;
  return {l:left-cx-Math.min(...xs),r:right-cx-Math.max(...xs),t:-cy-Math.min(...ys),b:s.stage.clientHeight-cy-Math.max(...ys)};
 }
 function paint(s){s.el.style.setProperty('--drag-x',s.x+'px');s.el.style.setProperty('--drag-y',s.y+'px');s.el.style.setProperty('--toy-tilt',s.tilt+'deg');s.el.style.setProperty('--toy-stretch',String(1+s.squash))}
 function constrain(s,bounce){const b=bounds(s);if(s.x<b.l){s.x=b.l;if(bounce)s.vx=Math.abs(s.vx)*.76;s.squash=.055;if(bounce)s.spin=clamp(s.spin+s.vy*.16,-240,240)}if(s.x>b.r){s.x=b.r;if(bounce)s.vx=-Math.abs(s.vx)*.76;s.squash=.055;if(bounce)s.spin=clamp(s.spin+s.vy*.16,-240,240)}if(s.y<b.t){s.y=b.t;if(bounce)s.vy=Math.abs(s.vy)*.76;s.squash=-.045;if(bounce)s.spin=clamp(s.spin-s.vx*.16,-240,240)}if(s.y>b.b){s.y=b.b;if(bounce)s.vy=-Math.abs(s.vy)*.76;s.squash=-.045;if(bounce)s.spin=clamp(s.spin-s.vx*.16,-240,240)}}
 function tick(now){
  frame=0;if(!heroVisible)return;const dt=Math.min((now-last)/1000||1/60,.032);last=now;let moving=false;
  toys.forEach(s=>{
   if(s.drag)return;
   if(reduceInteractions()){s.vx=s.vy=s.spin=s.squash=0;paint(s);return}
   const phase=now*.00032+s.index*2.399;
   s.vx+=Math.sin(phase)*8*dt;s.vy+=Math.cos(phase*.83)*7*dt;
   s.x+=s.vx*dt;s.y+=s.vy*dt;
   const friction=Math.exp(-.65*dt);s.vx*=friction;s.vy*=friction;
   s.tilt+=s.spin*dt;s.spin*=Math.exp(-1.2*dt);s.squash*=Math.exp(-dt*12);constrain(s,true);
   if(Math.hypot(s.vx,s.vy)<.15)s.vx=s.vy=0;
   if(Math.abs(s.spin)<.5)s.spin=0;if(Math.abs(s.squash)<.001)s.squash=0;
   paint(s);moving=true;
  });
  if(moving)frame=requestAnimationFrame(tick);
 }
 function wake(){if(!frame&&heroVisible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick)}}
 function reset(s){s.x=s.y=s.vx=s.vy=s.tilt=s.spin=s.squash=0;paint(s)}
 function nudge(s){s.vx=(s.el.offsetLeft+s.x+s.el.offsetWidth/2>s.stage.clientWidth/2?-1:1)*420;s.vy=-240;s.spin=s.vx>0?55:-55;wake()}
 toys.forEach(s=>{
  const el=s.el;
  el.addEventListener('pointerdown',e=>{
   if(e.button!==0||s.drag)return;
   s.vx=s.vy=s.spin=0;s.drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,x:s.x,y:s.y,lastX:e.clientX,lastY:e.clientY,time:performance.now(),moved:false};
   el.setPointerCapture(e.pointerId);el.classList.add('is-dragging');
  });
  el.addEventListener('pointermove',e=>{
   const d=s.drag;if(!d||d.id!==e.pointerId)return;
   const now=performance.now(),dt=Math.max((now-d.time)/1000,.008);
   s.vx=s.vx*.25+clamp((e.clientX-d.lastX)/dt,-1600,1600)*.75;
   s.vy=s.vy*.25+clamp((e.clientY-d.lastY)/dt,-1600,1600)*.75;
   s.x=d.x+e.clientX-d.startX;s.y=d.y+e.clientY-d.startY;
   d.moved ||= Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>5;
   d.lastX=e.clientX;d.lastY=e.clientY;d.time=now;
   s.spin=clamp(s.vx*.055-s.vy*.035,-100,100);constrain(s,false);paint(s);
  });
  function release(e){
   const d=s.drag;if(!d||d.id!==e.pointerId)return;
   s.drag=null;el.classList.remove('is-dragging');
   if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);
   if(e.type!=='pointerup'||performance.now()-d.time>100)s.vx=s.vy=s.spin=0;
   if(e.type==='pointerup'&&!d.moved)nudge(s);else wake();
  }
  el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('lostpointercapture',release);
  el.addEventListener('click',e=>{if(e.detail===0)nudge(s)});
  el.addEventListener('keydown',e=>{
   const step=e.shiftKey?500:250;
   const delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];
   if(delta){e.preventDefault();if(reduceInteractions()){s.x+=delta[0]/12;s.y+=delta[1]/12;constrain(s,false);paint(s)}else{s.vx+=delta[0];s.vy+=delta[1];s.spin+=delta[0]*.2-delta[1]*.15;wake()}}
   if(e.key==='Escape'){e.preventDefault();reset(s)}
  });
  el.addEventListener('dblclick',()=>reset(s));
 });
 const hero=toys[0].stage;
 if(typeof IntersectionObserver==='function')new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)wake();else{cancelAnimationFrame(frame);frame=0}},{threshold:0}).observe(hero);else{heroVisible=true;wake()}
 window.addEventListener('resize',()=>toys.forEach(s=>{constrain(s,false);paint(s)}),{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else wake()});
})();

// Keep the same logo visible as it reaches its fixed top position.
(() => {
 const original=document.querySelector('.header .wordmark');
 if(!original)return;
 const placeholder=document.createElement('span');
 placeholder.className='wordmark brand-placeholder';
 placeholder.innerHTML=original.innerHTML;
 placeholder.setAttribute('aria-hidden','true');
 original.replaceWith(placeholder);
 const floating=document.createElement('div');
 floating.className='floating-brand';
 original.setAttribute('aria-label','Pia Cruz — back to top');
 floating.append(original);document.body.append(floating);
 let scheduled=false;
 function update(){
  scheduled=false;
  floating.style.setProperty('--brand-scroll-top',`${Math.max(0,placeholder.getBoundingClientRect().top)}px`);
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule);
 if(document.fonts)document.fonts.ready.then(schedule);
 update();
})();

// One type-in per page visit, preserving semantic text and the final layout.
(() => {
 const title=document.getElementById('contact-title');
 if(!title||typeof IntersectionObserver!=='function'||reduceInteractions())return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const label=title.innerText.replace(/\s+/g,' ').trim();title.setAttribute('aria-label',label);
 const nodes=[];const walker=document.createTreeWalker(title,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode);
 const chars=[];
 nodes.forEach(node=>{
  const fragment=document.createDocumentFragment();
  for(const character of Array.from(node.textContent)){const span=document.createElement('span');span.className='type-char';span.textContent=character;span.setAttribute('aria-hidden','true');fragment.append(span);chars.push(span)}
  node.replaceWith(fragment);
 });
 if(!chars.length)return;
 title.classList.add('typewriter-ready');chars[0].classList.add('caret-start');
 let started=false,index=0,timer=null;
 function type(){
  chars.forEach(c=>c.classList.remove('caret','caret-start'));
  const char=chars[index++];char.classList.add('typed','caret');
  if(index<chars.length)timer=setTimeout(type,char.textContent===' '?45:65);
 }
 const observer=new IntersectionObserver(entries=>{
  if(!started&&entries.some(entry=>entry.isIntersecting)){started=true;observer.disconnect();timer=setTimeout(type,180)}
 },{threshold:.35});observer.observe(title);
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(timer);observer.disconnect();started=true;chars.forEach(c=>{c.classList.add('typed');c.classList.remove('caret','caret-start')})}});
})();

// Add approved hosted tracks here; local selection is a private preview only.
const musicTracks=[]; // Entries: {title:'Song title',file:'song.mp3'} in assets/.
(() => {
 const audio=document.getElementById('background-audio'),title=document.getElementById('music-title'),toggle=document.getElementById('audio-toggle'),next=document.getElementById('audio-next'),picker=document.getElementById('music-files'),status=document.getElementById('audio-status');
 const widget=title.closest('.music-player');let tracks=musicTracks.map(t=>({title:t.title,url:asset(t.file)})),index=0,localUrls=[],request=0;
 function render(){const track=tracks[index];title.textContent=track?.title||'Choose music';title.title=track?track.title:'Choose audio files to preview';toggle.disabled=!track;next.disabled=tracks.length<2;widget.classList.toggle('is-playing',!audio.paused);toggle.setAttribute('aria-label',audio.paused?'Play music':'Pause music')}
 async function play(){const token=++request;try{await audio.play();if(token===request)status.textContent='Playing '+tracks[index].title}catch(error){if(token===request&&error.name!=='AbortError')status.textContent=error.name==='NotAllowedError'?'Press play to start music.':'Could not play this file. Choose another supported audio file.'}render()}
 function select(n,resume=false){request++;audio.pause();index=n;if(tracks[index]){audio.src=tracks[index].url;audio.load()}render();if(resume)play()}
 let selectionChanged=false;
 function storedFiles(mode,files){
  return new Promise((resolve,reject)=>{
   const opening=indexedDB.open('pia-music',1);
   opening.onupgradeneeded=()=>opening.result.createObjectStore('playlist');
   opening.onerror=()=>reject(opening.error);
   opening.onsuccess=()=>{
    const db=opening.result,tx=db.transaction('playlist',mode),store=tx.objectStore('playlist');
    const op=mode==='readwrite'?store.put(files,'files'):store.get('files');
    tx.oncomplete=()=>{db.close();resolve(op.result)};
    tx.onerror=()=>{db.close();reject(tx.error)};
    tx.onabort=()=>{db.close();reject(tx.error)};
   };
  });
 }
 function loadFiles(files,resume){
  request++;audio.pause();audio.removeAttribute('src');audio.load();
  localUrls.forEach(url=>URL.revokeObjectURL(url));localUrls=[];
  tracks=files.map(file=>{const url=URL.createObjectURL(file);localUrls.push(url);return {title:file.name.replace(/\.[^.]+$/,''),url}});
  select(0,resume);
 }
 title.addEventListener('click',()=>picker.click());
 picker.addEventListener('change',()=>{
  const files=[...picker.files];if(!files.length)return;
  selectionChanged=true;loadFiles(files,true);picker.value='';
  storedFiles('readwrite',files).catch(()=>{status.textContent='Music is ready, but this browser could not save it for your next visit.'});
 });
 storedFiles('readonly').then(files=>{
  if(selectionChanged||!files?.length)return;
  loadFiles(files,false);status.textContent='Your music is ready. Press play.';
 }).catch(()=>{});
 toggle.addEventListener('click',()=>{if(audio.paused)play();else{request++;audio.pause()}});
 next.addEventListener('click',()=>{if(tracks.length>1)select((index+1)%tracks.length,!audio.paused)});
 audio.addEventListener('ended',()=>{if(tracks.length)select((index+1)%tracks.length,true)});
 ['play','pause','loadedmetadata'].forEach(event=>audio.addEventListener(event,render));
 audio.addEventListener('error',()=>{status.textContent='This audio file could not be loaded. Choose another file.';render()});
 window.addEventListener('pagehide',()=>{audio.pause()});
 if(tracks.length)select(0);else render();
})();

// Follow the system dark setting and the visitor’s local evening hours.
(() => {
 const media=window.matchMedia('(prefers-color-scheme: dark)');
 function update(){const hour=new Date().getHours();document.documentElement.classList.toggle('night-mode',media.matches||hour>=19||hour<6)}
 update();media.addEventListener('change',update);setInterval(update,60000);
})();

// Gentle reversible photo zoom, driven by the collage's progress through the viewport.
(() => {
 const frame=document.querySelector('.about-photo'),image=frame?.querySelector('.about-photo-crop img');
 if(!image)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let pending=false;
 function update(){pending=false;if(reduced.matches){image.style.removeProperty('--photo-zoom');return}const rect=frame.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));image.style.setProperty('--photo-zoom',(1+progress*.12).toFixed(4))}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule,{once:true});reduced.addEventListener('change',schedule);update();
})();
