/* Тележка: мини-игры и новые функции Премиума (грузится после index.html) */
const GX={on:0};
$('#v-play').insertAdjacentHTML('beforeend','<div class="box" id="gbox" style="display:none"></div>');
$('#pt2').insertAdjacentHTML('afterend','<button class="btn alt" id="pt3" style="flex:1">🎮 Игры</button>');
const o1=$('#pt1').onclick,o2=$('#pt2').onclick;
$('#pt1').onclick=()=>{o1();$('#gbox').style.display='none';$('#pt3').className='btn alt'};
$('#pt2').onclick=()=>{o2();$('#gbox').style.display='none';$('#pt3').className='btn alt'};
$('#pt3').onclick=()=>{$('#wbox').style.display='none';$('#ubox').style.display='none';$('#gbox').style.display='';$('#pt1').className='btn alt';$('#pt2').className='btn alt';$('#pt3').className='btn';renderGames()};

const gcap=()=>isPrem(P)?60:30,gdone=()=>P&&P.gd&&P.gd.d===new Date().toDateString()?P.gd.e:0;
async function payout(n){const add=Math.max(0,Math.min(n,gcap()-gdone()));
  if(add)await save({coins:(P.coins||0)+add,gd:{d:new Date().toDateString(),e:gdone()+add}});return add}
function renderGames(){const b=$('#gbox');if(!b||!P||GX.on||b.style.display==='none')return;
  b.innerHTML=`<h3>🎮 Мини-игры</h3><small style="color:var(--muted)">За Memory и Ловца можно заработать до ${gcap()} 🪙 в день${isPrem(P)?' (Премиум ×2)':''}. Сегодня: ${gdone()}/${gcap()}.</small><div class="gg" style="margin-top:10px"><button data-g="mem">🧠<small>Memory</small></button><button data-g="cat">🪙<small>Ловец</small></button><button data-g="hl">🃏<small>Выше/ниже</small></button></div><div id="gz" style="margin-top:12px"></div>`;
  b.querySelector('.gg').onclick=e=>{const x=e.target.closest('button');if(x)({mem:gMem,cat:gCatch,hl:gHL})[x.dataset.g]()}}
function gEnd(m){GX.on=0;$('#gz').insertAdjacentHTML('beforeend','<div style="margin-top:10px"><b>'+m+'</b></div><button class="btn" id="gm" style="margin-top:8px">В меню</button>');$('#gm').onclick=renderGames;toast(m)}

/* 1. Memory: 6 пар, чем меньше ходов, тем больше монет */
function gMem(){GX.on=1;const E=['🐸','🍕','🚀','🎧','🌵','🐙'],d=[...E,...E].sort(()=>Math.random()-.5);let a=null,mv=0,ok=0,lock=0;
  $('#gz').innerHTML='<div class="gg" id="mg" style="grid-template-columns:repeat(4,1fr)">'+d.map((e,i)=>`<button data-i="${i}" style="height:64px">❔</button>`).join('')+'</div><small id="mm">Ходов: 0</small>';
  $('#mg').onclick=async e=>{const x=e.target.closest('button');if(!x||lock||x.dataset.o)return;x.textContent=d[+x.dataset.i];x.dataset.o=1;
    if(!a){a=x;return}
    mv++;$('#mm').textContent='Ходов: '+mv;
    if(a.textContent===x.textContent){a=null;if(++ok===6){const g=await payout(mv<=8?10:mv<=12?6:3);gEnd('Победа за '+mv+' ходов! +'+g+' 🪙')}}
    else{lock=1;const p=a;a=null;setTimeout(()=>{p.textContent=x.textContent='❔';delete p.dataset.o;delete x.dataset.o;lock=0},700)}}}

/* 2. Ловец: 15 секунд ловишь прыгающую монету */
function gCatch(){GX.on=1;let s=0,t=15;
  $('#gz').innerHTML='<div style="display:flex;justify-content:space-between"><b id="cs">Очки: 0</b><b id="ct2">15</b></div><div style="position:relative;height:260px;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-top:6px"><button id="cb" style="position:absolute;font-size:34px;background:none;border:0;padding:0">🪙</button></div>';
  const cb=$('#cb'),mv=()=>{cb.style.left=Math.random()*80+'%';cb.style.top=Math.random()*80+'%'};mv();
  cb.onclick=()=>{s++;$('#cs').textContent='Очки: '+s;mv()};
  const iv=setInterval(mv,800),tm=setInterval(async()=>{t--;$('#ct2').textContent=t;
    if(t<=0){clearInterval(iv);clearInterval(tm);cb.remove();const g=await payout(Math.min(12,Math.floor(s/2)));gEnd('Поймано: '+s+'. +'+g+' 🪙')}},1000)}

/* 3. Выше/ниже: ставка тележкоинов, коэффициент зависит от шанса */
function gHL(){GX.on=1;let bet=10,c=1+Math.floor(Math.random()*13),busy=0;const z=$('#gz');
  const mu=p=>p>0?Math.floor(.88/p*100)/100:0;
  const draw=()=>{const ph=(13-c)/13,pl=(c-1)/13;
    z.innerHTML=`<div style="text-align:center"><div style="font-size:64px;font-weight:800">🃏 ${c}</div><small style="color:var(--muted)">Карта от 1 до 13. Угадай, следующая будет выше или ниже. Ничья возвращает ставку.</small><div style="display:flex;gap:6px;justify-content:center;margin:10px 0">${[10,25,50].map(b=>`<span class="chip ${b===bet?'on':''}" data-b="${b}">${b} 🪙</span>`).join('')}</div><div style="display:flex;gap:8px"><button class="btn" data-h="1" style="flex:1" ${ph?'':'disabled'}>⬆️ Выше ×${mu(ph)}</button><button class="btn" data-h="0" style="flex:1" ${pl?'':'disabled'}>⬇️ Ниже ×${mu(pl)}</button></div><button class="btn alt" id="gq" style="width:100%;margin-top:8px">Выйти</button></div>`};
  draw();
  z.onclick=async e=>{if(busy)return;
    if(e.target.id==='gq'){GX.on=0;z.onclick=null;return renderGames()}
    const ch=e.target.closest('[data-b]');if(ch){bet=+ch.dataset.b;return draw()}
    const h=e.target.closest('[data-h]');if(!h)return;
    if((P.coins||0)<bet)return toast('Не хватает тележкоинов');
    busy=1;const n=1+Math.floor(Math.random()*13),up=h.dataset.h==='1',p=up?(13-c)/13:(c-1)/13;
    const win=up?n>c:n<c,back=n===c?bet:win?Math.floor(bet*mu(p)):0;
    try{await save({coins:P.coins-bet+back});toast(n===c?'Ничья: '+n:win?'🎉 Выпало '+n+': +'+(back-bet)+' 🪙':'Выпало '+n+': −'+bet+' 🪙')}catch(er){}
    c=n;busy=0;draw()}}

/* Премиум: ×2 лимит в играх (выше) и статус под ником */
function pxtra(){const b=$('#pbox');if(!b||!P)return;
  b.insertAdjacentHTML('beforeend','<small style="display:block;margin-top:8px;line-height:1.7">✅ Мини-игры: лимит заработка ×2 (60 🪙 в день)<br>✅ Статус под ником в профиле</small>');
  if(isPrem(P)){b.insertAdjacentHTML('beforeend','<div style="display:flex;gap:8px;margin-top:8px"><input type="text" id="stx" maxlength="40" placeholder="Статус (до 40 символов)" style="flex:1" value="'+esc(P.status||'')+'"><button class="btn" id="sts">OK</button></div>');
    $('#sts').onclick=()=>{save({status:$('#stx').value.trim().slice(0,40)});toast('Статус сохранён')}}}
const _rp6=renderProf;renderProf=function(){_rp6();renderGames();pxtra()};
const _vp=viewProfile;viewProfile=function(u){_vp(u);const p=PR[u];
  if(p&&isPrem(p)&&p.status)$('#mb').insertAdjacentHTML('afterbegin','<div style="color:var(--muted);font-size:13px;margin-bottom:6px">💬 '+esc(p.status)+'</div>')};
if(P)renderProf();
