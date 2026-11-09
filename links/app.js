(()=>{
const root=document.documentElement,media=matchMedia('(prefers-color-scheme:dark)');let manual=false;
function theme(){if(!manual){const h=new Date().getHours();root.classList.toggle('dark',media.matches||h>=19||h<6)}}
theme();media.addEventListener('change',theme);document.getElementById('theme').onclick=()=>{manual=true;root.classList.toggle('dark')};
const $=id=>document.getElementById(id),arena=$('arena'),start=$('start'),pause=$('pause'),sound=$('sound'),message=$('game-message'),announce=$('announcement');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let state='ready',score=0,hits=0,misses=0,combo=0,bestCombo=0,left=30,best=0,muted=false,frame=0,last=0,spawnIn=0,sequence=0,context;
const targets=new Set();
try{best=Number(localStorage.getItem('pia-chrome-score-v2'))||0;muted=localStorage.getItem('pia-game-muted')==='true'}catch{}
function soundLabel(){sound.textContent=muted?'Sound off':'Sound on';sound.setAttribute('aria-pressed',String(!muted))}soundLabel();
function audioReady(){try{if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio)context=new Audio()}if(context?.state==='suspended')context.resume().catch(()=>{})}catch{}}
function tone(freq,duration=.12,delay=0){if(muted||!context||context.state!=='running')return;const t=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain();osc.type='sine';osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(freq*.8,t+duration);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.075,t+.008);gain.gain.exponentialRampToValueAtTime(.001,t+duration);osc.connect(gain);gain.connect(context.destination);osc.start(t);osc.stop(t+duration+.02);osc.onended=()=>{osc.disconnect();gain.disconnect()}}
sound.onclick=()=>{muted=!muted;try{localStorage.setItem('pia-game-muted',String(muted))}catch{}audioReady();soundLabel();if(!muted)tone(660)};
function hud(){ $('score').textContent=String(score).padStart(3,'0');$('timer').textContent=Math.ceil(left)+'s';$('best').textContent='Best '+best;$('combo').textContent=combo>=2?`${combo} streak · ×${Math.min(4,1+Math.floor(combo/4))}`:'Build your streak';$('time-fill').style.transform=`scaleX(${left/30})`;arena.classList.toggle('last-seconds',left<=5&&state==='playing')}
function clearTargets(){targets.forEach(t=>t.el.remove());targets.clear()}
function effect(x,y,text){const el=document.createElement('span');el.className='hit-effect';el.textContent=text;el.style.left=x+'px';el.style.top=y+'px';arena.append(el);setTimeout(()=>el.remove(),700)}
function burst(x,y){if(reduced.matches)return;for(let i=0;i<6;i++){const p=document.createElement('span');p.className='spark';p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',Math.cos(i*Math.PI/3)*42+'px');p.style.setProperty('--dy',Math.sin(i*Math.PI/3)*42+'px');arena.append(p);setTimeout(()=>p.remove(),550)}}
function remove(t){targets.delete(t);t.el.remove()}
function spawn(){
 const bonus=++sequence%7===0,size=bonus?64:72,w=arena.clientWidth,h=arena.clientHeight;
 const t={el:document.createElement('button'),x:0,y:0,size,age:0,life:Math.max(1.6,3.2-(30-left)*.045),vx:(Math.random()-.5)*28,vy:(Math.random()-.5)*22,bonus};
 for(let n=0;n<20;n++){t.x=10+Math.random()*Math.max(0,w-size-20);t.y=10+Math.random()*Math.max(0,h-size-20);if([...targets].every(o=>Math.hypot(t.x-o.x,t.y-o.y)>82))break}
 t.el.className='catch-target'+(bonus?' bonus':'');t.el.style.width=t.el.style.height=size+'px';t.el.setAttribute('aria-label',bonus?'Catch bonus star, triple points':'Catch chrome heart');
 const img=document.createElement('img');img.src='../assets/chrome-'+(bonus?'star':'heart')+'.png';img.alt='';img.draggable=false;t.el.append(img);
 t.el.onclick=e=>{e.stopPropagation();if(state!=='playing'||!targets.has(t))return;const focused=document.activeElement===t.el;combo++;hits++;bestCombo=Math.max(combo,bestCombo);const multiplier=Math.min(4,1+Math.floor(combo/4)),points=(bonus?30:10)*multiplier;score+=points;effect(t.x+size/2,t.y+size/2,`+${points}`);burst(t.x+size/2,t.y+size/2);tone(440+Math.min(combo,16)*35);if(bonus){tone(880,.2,.07);tone(1100,.2,.14)}remove(t);spawnIn=Math.min(spawnIn,.12);hud();if(focused){if(!targets.size)spawn();targets.values().next().value?.el.focus({preventScroll:true})}};
 t.el.style.transform=`translate(${t.x}px,${t.y}px)`;arena.append(t.el);targets.add(t);
}
function finish(){state='done';cancelAnimationFrame(frame);clearTargets();pause.hidden=true;start.hidden=false;start.textContent='One more round ✳';const record=score>best;if(record){best=score;try{localStorage.setItem('pia-chrome-score-v2',String(best))}catch{}}message.hidden=false;message.replaceChildren();const title=document.createElement('strong');title.textContent=record?'A new personal best.':score>=600?'Chrome crush.':score>=250?'You’ve got the touch.':'A little more sparkle?';const result=document.createElement('span');result.textContent=`${score} points · ${hits} catches · best streak ${bestCombo}`;message.append(title,result);announce.textContent=title.textContent+' '+result.textContent;hud();tone(523,.25);tone(659,.25,.12);tone(784,.4,.24)}
function tick(now){if(state!=='playing')return;const dt=Math.min(.05,(now-last)/1000||0);last=now;left=Math.max(0,left-dt);if(!left){finish();return}spawnIn-=dt;if(spawnIn<=0&&targets.size<3){spawn();spawnIn=Math.max(.45,.9-(30-left)*.012)}
 for(const t of targets){t.age+=dt;if(t.age>=t.life&&document.activeElement!==t.el){remove(t);combo=0;misses++;continue}if(!reduced.matches&&document.activeElement!==t.el&&!t.el.matches(':hover')){t.x+=t.vx*dt;t.y+=t.vy*dt;const mx=Math.max(0,arena.clientWidth-t.size),my=Math.max(0,arena.clientHeight-t.size);if(t.x<0||t.x>mx){t.vx*=-1;t.x=Math.max(0,Math.min(mx,t.x))}if(t.y<0||t.y>my){t.vy*=-1;t.y=Math.max(0,Math.min(my,t.y))}}t.el.style.transform=`translate(${t.x}px,${t.y}px)`;t.el.classList.toggle('expiring',t.age>t.life*.72)}hud();frame=requestAnimationFrame(tick)}
start.onclick=()=>{audioReady();clearTargets();score=hits=misses=combo=bestCombo=sequence=0;left=30;spawnIn=.35;state='playing';message.hidden=true;start.hidden=true;pause.hidden=false;pause.textContent='Pause';spawn();spawn();hud();last=performance.now();tone(523);tone(784,.15,.09);frame=requestAnimationFrame(tick)};
function pauseGame(){if(state==='playing'){state='paused';cancelAnimationFrame(frame);pause.textContent='Resume';message.hidden=false;message.textContent='Take your time. Your round is paused.';targets.forEach(t=>t.el.hidden=true);announce.textContent='Game paused.'}else if(state==='paused'){audioReady();state='playing';pause.textContent='Pause';message.hidden=true;targets.forEach(t=>t.el.hidden=false);last=performance.now();frame=requestAnimationFrame(tick)}}
pause.onclick=pauseGame;document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pauseGame()});
arena.addEventListener('click',e=>{if(state==='playing'&&e.target===arena){combo=0;misses++;hud();tone(150,.08)}});
window.addEventListener('resize',()=>targets.forEach(t=>{t.x=Math.max(0,Math.min(t.x,arena.clientWidth-t.size));t.y=Math.max(0,Math.min(t.y,arena.clientHeight-t.size))}));hud();
})();
