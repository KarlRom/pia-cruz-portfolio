(()=>{
const root=document.documentElement,media=matchMedia('(prefers-color-scheme:dark)');let manual=false;
function theme(){if(!manual){const h=new Date().getHours();root.classList.toggle('dark',media.matches||h>=19||h<6)}}
theme();media.addEventListener('change',theme);document.getElementById('theme').onclick=()=>{manual=true;root.classList.toggle('dark')};
const arena=document.getElementById('arena'),target=document.getElementById('heart-target'),start=document.getElementById('start'),reset=document.getElementById('reset'),message=document.getElementById('game-message'),score=document.getElementById('score'),timer=document.getElementById('timer'),bestLabel=document.getElementById('best'),announce=document.getElementById('announcement');
let count=0,running=false,began=0,elapsed=0,frame=0,best=0;
try{best=Number(localStorage.getItem('pia-heart-best'))||0}catch{}
function showBest(){bestLabel.textContent=best?`Best ${best.toFixed(1)}s`:'Best —'}showBest();
function place(){target.style.left=Math.random()*Math.max(0,arena.clientWidth-70)+'px';target.style.top=Math.random()*Math.max(0,arena.clientHeight-70)+'px'}
function tick(now){if(!running)return;elapsed=(now-began)/1000;timer.textContent=elapsed.toFixed(1)+'s';frame=requestAnimationFrame(tick)}
function stop(text){running=false;cancelAnimationFrame(frame);target.hidden=true;reset.hidden=true;start.hidden=false;start.textContent='Play again ✳';message.hidden=false;message.textContent=text;announce.textContent=text;start.focus()}
start.onclick=()=>{count=0;elapsed=0;running=true;began=performance.now();score.textContent='0 / 10';timer.textContent='0.0s';start.hidden=true;reset.hidden=false;message.hidden=true;target.hidden=false;place();target.focus({preventScroll:true});frame=requestAnimationFrame(tick)};
target.onclick=()=>{if(!running)return;count++;score.textContent=`${count} / 10`;if(count===10){elapsed=(performance.now()-began)/1000;timer.textContent=elapsed.toFixed(1)+'s';const record=!best||elapsed<best;if(record){best=elapsed;try{localStorage.setItem('pia-heart-best',String(best))}catch{}showBest()}stop(`${record?'New best. ':''}10 hearts in ${elapsed.toFixed(1)} seconds. A catch, obviously.`)}else{place();announce.textContent=`${count} of 10 hearts`}};
reset.onclick=()=>stop('A little breather. Play again whenever.');
window.addEventListener('resize',()=>{if(running)place()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stop('Game paused while you were away. Start a fresh round.')});
})();
