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

/* Тележка: голосовые, кружки, звонки и новые функции Премиума (грузится после extra.js) */
const CALL={cur:null},ICES={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]};
const WL={'Закат':'linear-gradient(160deg,#ff9a3c40,#ff3b8d40)','Океан':'linear-gradient(160deg,#18b4a640,#2b6cff40)','Ночь':'linear-gradient(160deg,#1b1740,#3b2a6b)','Мята':'linear-gradient(160deg,#84fab066,#8fd3f466)'};
const fmtT=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');

/* кнопки: голосовое, кружок, звонок */
$('#ph').insertAdjacentHTML('afterend','<button type="button" class="send alt" id="mcr" style="width:40px">🎤</button><button type="button" class="send alt" id="ccr" style="width:40px">⭕</button>');
$('#inp').style.minWidth='0';
$('#gf').insertAdjacentHTML('beforebegin','<button id="cl" style="display:none">📞</button>');
$('#mcr').onclick=()=>rec(0);$('#ccr').onclick=()=>rec(1);$('#cl').onclick=()=>startCall();
const _oc7=openConv;openConv=function(c){_oc7(c);$('#cl').style.display=(cur.other&&!cur.group&&cur.tid)?'':'none'};

/* запись голосовых и кружков */
async function rec(video){
  if(!window.MediaRecorder||!navigator.mediaDevices)return toast('Запись здесь недоступна');
  if(!cur||!cur.path)return;
  let st;try{st=await navigator.mediaDevices.getUserMedia(video?{video:{facingMode:'user',width:480,height:480},audio:true}:{audio:true})}catch(e){return toast('Нет доступа к '+(video?'камере/микрофону':'микрофону')+'. Разреши в настройках')}
  const max=video?60:300,mr=new MediaRecorder(st),ch=[],t0=Date.now();let cancel=0,sec=0;
  mr.ondataavailable=e=>e.data.size&&ch.push(e.data);
  modal(video?'Кружок':'Голосовое','<div style="text-align:center">'+(video?'<video id="pv" muted playsinline style="width:200px;height:200px;border-radius:50%;object-fit:cover;background:#000"></video>':'<div style="font-size:60px">🎙</div>')+'<div id="rt" style="font-weight:800;font-size:20px">0:00</div><small style="color:var(--muted)">Максимум '+fmtT(max)+'</small></div><button class="btn" id="rs">Отправить</button><button class="btn alt" id="rx">Отмена</button>');
  if(video){const v=$('#pv');v.srcObject=st;v.play().catch(()=>{})}
  const fin=()=>{clearInterval(tk);st.getTracks().forEach(t=>t.stop())};
  const tk=setInterval(()=>{sec=Math.floor((Date.now()-t0)/1000);const r=$('#rt');if(r)r.textContent=fmtT(sec);if(sec>=max&&$('#rs'))$('#rs').click()},300);
  $('#rx').onclick=()=>{cancel=1;if(mr.state!=='inactive')mr.stop();fin();closeModal()};
  $('#rs').onclick=()=>{if(mr.state==='inactive')return;sec=Math.floor((Date.now()-t0)/1000);mr.stop();fin();closeModal()};
  mr.onstop=async()=>{if(cancel)return;if(sec<1)return toast('Слишком коротко');toast('Отправляю…');
    try{const ty=mr.mimeType||(video?'video/mp4':'audio/mp4'),ex=ty.includes('webm')?'webm':video?'mp4':'m4a',
        f=new File([new Blob(ch,{type:ty})],'rec.'+ex,{type:ty}),a=await claude.use('assets'),u=(await a.upload(f)).url,tid=cur.tid;
      await send(video?{text:'',circ:u,dur:sec}:{text:'',aud:u,dur:sec});
      if(tid)db.doc('threads/'+tid).update({last:video?'⭕ Кружок':'🎤 Голосовое'}).catch(()=>{})}
    catch(e){toast('Не удалось отправить')}};
  mr.start()}

/* показ голосовых и кружков в чате */
const _rm7=renderMsgs;renderMsgs=function(snap){_rm7(snap);
  Object.keys(MSG).forEach(id=>{const m=MSG[id];if(!m||!(m.aud||m.circ))return;
    const el=document.querySelector('#msgs .m[data-id="'+id+'"]');if(!el||el.querySelector('audio,video'))return;
    let n;
    if(m.aud){n=document.createElement('audio');n.controls=true;n.preload='metadata';n.src=m.aud;n.style.cssText='max-width:230px;display:block'}
    else{n=document.createElement('video');n.src=m.circ+'#t=0.1';n.playsInline=true;n.loop=true;n.preload='metadata';n.style.cssText='width:190px;height:190px;border-radius:50%;object-fit:cover;display:block;background:#000';
      n.onclick=e=>{e.stopPropagation();n.paused?n.play():n.pause()};el.style.background='none';el.style.padding='0'}
    n.addEventListener('click',e=>e.stopPropagation());
    el.insertBefore(n,el.querySelector('.t'))})};

/* звонки (голос, WebRTC, сигналы через Firestore) */
function callUI(t,sub,btn){modal(t,'<div style="text-align:center;font-size:48px">📞</div><div id="cs2" style="text-align:center;margin:8px 0">'+sub+'</div><audio id="ra" autoplay playsinline></audio>'+btn);
  const c=CALL.cur,a=$('#ra');if(c&&c.rs&&a){a.srcObject=c.rs;a.play().catch(()=>{})}}
$('#modal').addEventListener('click',e=>{if(CALL.cur&&e.target.id==='modal')e.stopImmediatePropagation()},true);
function mkPc(ms,ref){const pc=new RTCPeerConnection(ICES);ms.getTracks().forEach(t=>pc.addTrack(t,ms));
  pc.ontrack=e=>{CALL.cur.rs=e.streams[0];const a=$('#ra');if(a){a.srcObject=CALL.cur.rs;a.play().catch(()=>{})}};
  pc.onicecandidate=e=>e.candidate&&ref.collection('ice').add({by:uid,c:JSON.stringify(e.candidate)});return pc}
function listenIce(ref,pc){return ref.collection('ice').onSnapshot(s=>s.docChanges().forEach(ch=>{const d=ch.doc.data();if(ch.type==='added'&&d.by!==uid)pc.addIceCandidate(JSON.parse(d.c)).catch(()=>{})}))}
function endCall(n){const c=CALL.cur;if(!c)return;CALL.cur=null;clearTimeout(c.to);[c.un,c.ice].forEach(f=>f&&f());try{c.pc.close()}catch(e){}c.ms.getTracks().forEach(t=>t.stop());
  if(n)c.ref.update({state:'ended'}).catch(()=>{});closeModal();toast('Звонок завершён')}
async function startCall(){
  if(CALL.cur||!cur.other||!window.RTCPeerConnection)return toast(window.RTCPeerConnection?'Ты уже в звонке':'Звонки здесь недоступны');
  let ms;try{ms=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){return toast('Нет доступа к микрофону')}
  const to=cur.other,ref=db.collection('calls').doc();CALL.cur={ref,ms};const pc=mkPc(ms,ref);CALL.cur.pc=pc;
  callUI('Звонок',esc((PR[to]||{}).name||'')+': вызываю…','<button class="btn alt" id="ce">Сбросить</button>');$('#ce').onclick=()=>endCall(1);
  try{const o=await pc.createOffer();await pc.setLocalDescription(o);
    await ref.set({from:uid,to,fromName:S.name,state:'ringing',offer:{type:o.type,sdp:o.sdp},ts:Date.now()})}catch(e){endCall(0);return toast('Ошибка звонка')}
  CALL.cur.to=setTimeout(()=>{if(CALL.cur&&!pc.currentRemoteDescription){endCall(1);toast('Не ответили')}},45000);
  CALL.cur.un=ref.onSnapshot(async s=>{const d=s.data();if(!d||!CALL.cur||CALL.cur.pc!==pc)return;
    if(d.state==='ended')return endCall(0);
    if(d.answer&&!pc.currentRemoteDescription){await pc.setRemoteDescription(d.answer);CALL.cur.ice=listenIce(ref,pc);$('#cs2').textContent='Разговор идёт…'}})}
db_calls();
function db_calls(){const w=setInterval(()=>{if(!db||!uid)return;clearInterval(w);
  db.collection('calls').where('to','==',uid).where('state','==','ringing').onSnapshot(s=>s.docChanges().forEach(ch=>{if(ch.type==='added')incoming(ch.doc)}),()=>{})},500)}
function incoming(doc){const d=doc.data();if(CALL.cur||Date.now()-d.ts>6e4)return;
  try{navigator.vibrate&&navigator.vibrate([300,150,300])}catch(e){}
  callUI('Входящий звонок',esc(d.fromName||'?')+' звонит…','<button class="btn" id="ca2">Ответить</button><button class="btn alt" id="ce">Отклонить</button>');
  const un=doc.ref.onSnapshot(s=>{const x=s.data();if(!x||x.state!=='ended')return;un();if(CALL.cur&&CALL.cur.ref.id===doc.id)endCall(0);else closeModal()});
  $('#ce').onclick=()=>{un();doc.ref.update({state:'ended'}).catch(()=>{});closeModal()};
  $('#ca2').onclick=async()=>{let ms;try{ms=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){return toast('Нет доступа к микрофону')}
    CALL.cur={ref:doc.ref,ms};const pc=mkPc(ms,doc.ref);CALL.cur.pc=pc;CALL.cur.un=un;
    try{await pc.setRemoteDescription(d.offer);const a=await pc.createAnswer();await pc.setLocalDescription(a);
      await doc.ref.update({answer:{type:a.type,sdp:a.sdp},state:'active'});CALL.cur.ice=listenIce(doc.ref,pc)}catch(e){endCall(1);return toast('Ошибка звонка')}
    callUI('Разговор',esc(d.fromName||''),'<button class="btn alt" id="ce">Сбросить</button>');$('#ce').onclick=()=>endCall(1)}}

/* Премиум: фон чата и новые пункты */
function applyWall(){const m=$('#msgs');if(m)m.style.background=(P&&WL[P.wall])||''}
function pxtra2(){if(!P)return;const b=$('#sw-snow').closest('.box');let w=$('#wlr');
  if(!w){b.insertAdjacentHTML('beforeend','<div id="wlr" style="margin-top:8px"></div>');w=$('#wlr');w.onclick=e=>{const c=e.target.closest('[data-w]');if(c)save({wall:c.dataset.w})}}
  w.innerHTML='<small style="color:var(--muted)">Фон чата</small><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><span class="chip '+(!WL[P.wall]?'on':'')+'" data-w="">Без фона</span>'+Object.keys(WL).map(k=>`<span class="chip ${P.wall===k?'on':''}" data-w="${k}">${k}</span>`).join('')+'</div>'}
const _rp7=renderProf;renderProf=function(){_rp7();pxtra2();applyWall()};
if(P)renderProf();

/* ---- новые игры: змейка, сапёр, крестики-нолики, реакция ---- */
function gSnake(){GX.on=1;const N=14,z=$('#gz');
  z.innerHTML='<b id="sn">Очки: 0</b><canvas id="sc" width="280" height="280" style="display:block;margin:8px auto;border-radius:12px;background:var(--bg);border:1px solid var(--line);touch-action:none"></canvas><div class="gg" style="grid-template-columns:repeat(3,1fr);max-width:210px;margin:auto"><i></i><button data-d="u">⬆️</button><i></i><button data-d="l">⬅️</button><button data-d="d">⬇️</button><button data-d="r">➡️</button></div><small>Свайпай по полю или жми стрелки</small>';
  const cx=$('#sc').getContext('2d'),dirs={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};let s=[[7,7],[6,7],[5,7]],d=[1,0],nd=d,f=[10,7],sc=0,sx=0,sy=0;
  const turn=v=>{if((v[0]||v[1])&&(v[0]!==-d[0]||v[1]!==-d[1]))nd=v},put=()=>{do{f=[Math.random()*N|0,Math.random()*N|0]}while(s.some(p=>p[0]===f[0]&&p[1]===f[1]))};
  z.querySelector('.gg').onclick=e=>{const b=e.target.closest('button');if(b)turn(dirs[b.dataset.d])};
  const cv=$('#sc');cv.ontouchstart=e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY};
  cv.ontouchend=e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;turn(Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)])};
  const iv=setInterval(async()=>{if(!$('#sc'))return clearInterval(iv);d=nd;const h=[s[0][0]+d[0],s[0][1]+d[1]];
    if(h[0]<0||h[1]<0||h[0]>=N||h[1]>=N||s.some(p=>p[0]===h[0]&&p[1]===h[1])){clearInterval(iv);const g=await payout(Math.min(15,sc*2));return gEnd('Игра окончена: '+sc+'. +'+g+' 🪙')}
    s.unshift(h);if(h[0]===f[0]&&h[1]===f[1]){sc++;$('#sn').textContent='Очки: '+sc;put()}else s.pop();
    cx.clearRect(0,0,280,280);cx.fillStyle='#ff4d6d';cx.fillRect(f[0]*20+2,f[1]*20+2,16,16);cx.fillStyle='#2ee59d';s.forEach(p=>cx.fillRect(p[0]*20+1,p[1]*20+1,18,18))},150)}
function gMine(){GX.on=1;const W=6,M=6,mines=new Set(),op=new Set(),fl=new Set();let flag=0,over=0,first=1;
  while(mines.size<M)mines.add(Math.random()*36|0);
  const nb=i=>{const x=i%W,y=i/W|0,r=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const X=x+a,Y=y+b;if((a||b)&&X>=0&&Y>=0&&X<W&&Y<W)r.push(Y*W+X)}return r},cnt=i=>nb(i).filter(j=>mines.has(j)).length;
  const draw=()=>{$('#gz').innerHTML='<button class="btn '+(flag?'':'alt')+'" id="mf" style="width:100%;margin-bottom:8px">🚩 Режим флажка: '+(flag?'вкл':'выкл')+'</button><div class="gg" id="mg2" style="grid-template-columns:repeat(6,1fr);gap:4px">'+Array.from({length:36},(_,i)=>`<button data-i="${i}" style="height:48px;font-size:20px;padding:0;${op.has(i)?'background:var(--theirs)':''}">${over&&mines.has(i)?'💣':op.has(i)?(cnt(i)||''):fl.has(i)?'🚩':''}</button>`).join('')+'</div><small>Открой все безопасные клетки. Мин: '+M+'. Цифра = мины рядом.</small>';
    $('#mf').onclick=()=>{flag=!flag;draw()};
    $('#mg2').onclick=async e=>{const b=e.target.closest('button');if(!b||over)return;const i=+b.dataset.i;if(op.has(i))return;
      if(flag){fl.has(i)?fl.delete(i):fl.add(i);return draw()}
      if(fl.has(i))return;
      if(first&&mines.has(i)){mines.delete(i);let k;do{k=Math.random()*36|0}while(mines.has(k)||k===i);mines.add(k)}first=0;
      if(mines.has(i)){over=1;draw();return gEnd('💥 Мина! Игра окончена')}
      const q=[i];while(q.length){const k=q.pop();if(op.has(k))continue;op.add(k);if(!cnt(k))nb(k).forEach(j=>!op.has(j)&&!mines.has(j)&&q.push(j))}
      draw();if(op.size===36-M){over=1;const g=await payout(10);gEnd('Победа! +'+g+' 🪙')}}};
  draw()}
function gTtt(){GX.on=1;const b=Array(9).fill(''),L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];let dn=0;
  const win=p=>L.some(l=>l.every(i=>b[i]===p)),draw=()=>{$('#gz').innerHTML='<div class="gg" id="tg" style="grid-template-columns:repeat(3,1fr)">'+b.map((v,i)=>`<button data-i="${i}" style="height:76px;font-size:40px">${v}</button>`).join('')+'</div><small>Ты ✖️, бот ⭕. Победа 8 🪙, ничья 3 🪙.</small>'};
  const fin=async()=>{let m=0;if(win('X')){m=1;draw();const g=await payout(8);gEnd('Победа! +'+g+' 🪙')}else if(win('O')){m=1;draw();gEnd('Бот победил')}else if(b.every(v=>v)){m=1;draw();const g=await payout(3);gEnd('Ничья. +'+g+' 🪙')}dn=m;return m};
  const find=p=>{for(const l of L){const e=l.filter(i=>!b[i]);if(e.length===1&&l.filter(i=>b[i]===p).length===2)return e[0]}return -1};
  draw();$('#gz').onclick=async e=>{const x=e.target.closest('#tg button');if(!x||dn||b[+x.dataset.i])return;b[+x.dataset.i]='X';if(await fin())return;
    let m=find('O');if(m<0)m=find('X');if(m<0&&Math.random()<.7&&!b[4])m=4;if(m<0){const f=b.map((v,i)=>v?-1:i).filter(i=>i>=0);m=f[Math.random()*f.length|0]}
    b[m]='O';if(await fin())return;draw()}}
function gReact(){GX.on=1;let st=0,t0=0;
  $('#gz').innerHTML='<button id="rb2" style="width:100%;height:160px;border:0;border-radius:18px;font-size:22px;font-weight:800;color:#fff;background:#d33">Жди зелёного…</button><small>Нажми, как только станет зелёным. До 300 мс — 6 🪙, до 450 — 4 🪙.</small>';
  const b=$('#rb2'),tm=setTimeout(()=>{st=1;t0=Date.now();b.style.background='#2ee59d';b.textContent='ЖМИ!'},1500+Math.random()*2500);
  b.onclick=async()=>{if(st===2)return;if(!st){clearTimeout(tm);st=2;return gEnd('Слишком рано! 0 🪙')}
    st=2;const ms=Date.now()-t0,g=await payout(ms<300?6:ms<450?4:2);gEnd(ms+' мс. +'+g+' 🪙')}}
const _rg8=renderGames;renderGames=function(){_rg8();const b=$('#gbox'),g=b&&b.querySelector('.gg');if(!g||g.querySelector('[data-g="sn"]'))return;
  g.insertAdjacentHTML('beforeend','<button data-g="sn">🐍<small>Змейка</small></button><button data-g="mi">💣<small>Сапёр</small></button><button data-g="tt">✖️<small>Крестики</small></button><button data-g="rc">⚡<small>Реакция</small></button>');
  const sm=b.querySelector('small');if(sm)sm.innerHTML=sm.innerHTML.replace('За Memory и Ловца','За игры (кроме «Выше/ниже»)');
  g.onclick=e=>{const x=e.target.closest('button');if(x)({mem:gMem,cat:gCatch,hl:gHL,sn:gSnake,mi:gMine,tt:gTtt,rc:gReact})[x.dataset.g]()}};
if(P)renderProf();

/* ======== ОБНОВЛЕНИЕ 3: свои иконки, видеозвонки, стикеры, закрепы и поиск, статистика, рамки ======== */
const I=(p,c,s,f)=>`<svg viewBox="0 0 24 24" width="${s||24}" height="${s||24}" fill="${f||'none'}" stroke="${c||'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC={call:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
circ:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
vcall:'<rect x="2" y="6" width="13" height="12" rx="3"/><path d="M15 10l7-4v12l-7-4z"/>',
smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14a4 4 0 0 0 8 0"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/>',
clip:'<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5"/>',
trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6"/>',
back:'<path d="M15 5l-7 7 7 7"/>',send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
stk:'<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8l-6 6H6a2 2 0 0 1-2-2z"/><path d="M14 20v-4a2 2 0 0 1 2-2h4"/>',
pin:'<path d="M12 17v5M8 3h8l-1 7 3 3H6l3-3z"/>',search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>'};
const ic=(n,s)=>I(IC[n],'currentColor',s);
const GI={mem:I('<rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><rect x="13" y="13" width="8" height="7" rx="1.5"/>','#7c5cff',38),cat:I('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 0 1 0 3.5h-3a1.8 1.8 0 0 0 0 3.5h4"/>','#f5b829',38),hl:I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 8l3 4h-6zM12 16l-3-4h6z"/>','#ff4d6d',38),sn:I('<path d="M4 18h8a4 4 0 0 0 0-8H8a3 3 0 0 1 0-6h10"/><circle cx="18" cy="4" r="1.2" fill="#2ee59d"/>','#2ee59d',38),mi:I('<circle cx="11" cy="14" r="6"/><path d="M15 9l3-3M17 4l1 1M19 8l1 1M11 5v-2M5 14H3M19 14h2"/>','#667eea',38),tt:I('<path d="M6 6l12 12M18 6L6 18"/>','#18b4a6',38),rc:I('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>','#ff9f1c',38)};
/* иконки чата */
$('#cl').innerHTML=ic('call');$('#cl').insertAdjacentHTML('afterend','<button id="cl2" style="display:none">'+ic('vcall')+'</button>');
$('#cl').onclick=()=>startCall(0);$('#cl2').onclick=()=>startCall(1);
$('#gf').innerHTML=ic('gift');$('#dl').innerHTML=ic('trash');$('#bk').innerHTML=ic('back');
$('#em').innerHTML=ic('smile',22);$('#ph').innerHTML=ic('clip',22);$('#mcr').innerHTML=ic('mic',22);$('#ccr').innerHTML=ic('circ',22);
$('#f .send:not(.alt)').innerHTML=ic('send',22);
$('#ccr').insertAdjacentHTML('afterend','<button type="button" class="send alt" id="stk">'+ic('stk',22)+'</button>');
$('#f').style.gap='5px';['em','ph','mcr','ccr','stk'].forEach(k=>{$('#'+k).style.width='38px';$('#'+k).style.flex='none'});
const _oc9=openConv;openConv=function(c){_oc9(c);$('#cl2').style.display=$('#cl').style.display;showPin()};
const _rg9=renderGames;renderGames=function(){_rg9();document.querySelectorAll('#gbox [data-g]').forEach(x=>{if(x.querySelector('svg')||!GI[x.dataset.g])return;
  if(x.firstChild&&x.firstChild.nodeType===3)x.removeChild(x.firstChild);x.insertAdjacentHTML('afterbegin',GI[x.dataset.g])})};

/* видеозвонки (и голосовые): переписанные функции */
const ctrl=v=>'<div style="display:flex;gap:8px;margin-top:8px"><button class="btn alt" id="cm" style="flex:1">'+ic('mic',20)+'</button>'+(v?'<button class="btn alt" id="cv" style="flex:1">'+ic('vcall',20)+'</button>':'')+'<button class="btn" id="ce" style="flex:1;background:#d33">'+ic('call',20)+'</button></div>';
function bindCtl(){const c=CALL.cur;$('#ce').onclick=()=>endCall(1);
  $('#cm').onclick=e=>{const t=c.ms.getAudioTracks()[0];if(!t)return;t.enabled=!t.enabled;e.currentTarget.style.opacity=t.enabled?1:.4};
  if($('#cv'))$('#cv').onclick=e=>{const t=c.ms.getVideoTracks()[0];if(!t)return;t.enabled=!t.enabled;e.currentTarget.style.opacity=t.enabled?1:.4}}
function callUI(t,sub,btn){const c=CALL.cur,v=c&&c.video;
  modal(t,(v?'<div style="position:relative"><video id="rv" autoplay playsinline style="width:100%;min-height:220px;border-radius:16px;background:#000"></video><video id="lv" autoplay muted playsinline style="position:absolute;right:8px;bottom:8px;width:90px;border-radius:12px;background:#222;transform:scaleX(-1)"></video></div>':'<div style="text-align:center;color:var(--accent)">'+ic('call',48)+'</div>')+'<div id="cs2" style="text-align:center;margin:8px 0">'+sub+'</div><audio id="ra" autoplay playsinline></audio>'+btn);
  if(c){const a=v?$('#rv'):$('#ra');if(c.rs&&a){a.srcObject=c.rs;a.play().catch(()=>{})}if(v&&$('#lv'))$('#lv').srcObject=c.ms}}
function mkPc(ms,ref){const pc=new RTCPeerConnection(ICES);ms.getTracks().forEach(t=>pc.addTrack(t,ms));
  pc.ontrack=e=>{CALL.cur.rs=e.streams[0];const a=$('#rv')||$('#ra');if(a){a.srcObject=CALL.cur.rs;a.play().catch(()=>{})}};
  pc.onicecandidate=e=>e.candidate&&ref.collection('ice').add({by:uid,c:JSON.stringify(e.candidate)});return pc}
async function startCall(video){
  if(CALL.cur||!cur.other||!window.RTCPeerConnection)return toast(window.RTCPeerConnection?'Ты уже в звонке':'Звонки здесь недоступны');
  let ms;try{ms=await navigator.mediaDevices.getUserMedia({audio:true,video:video?{facingMode:'user'}:false})}catch(e){return toast('Нет доступа к '+(video?'камере и микрофону':'микрофону'))}
  const to=cur.other,ref=db.collection('calls').doc();CALL.cur={ref,ms,video:!!video};const pc=mkPc(ms,ref);CALL.cur.pc=pc;
  callUI(video?'Видеозвонок':'Звонок',esc((PR[to]||{}).name||'')+': вызываю…',ctrl(video));bindCtl();
  try{const o=await pc.createOffer();await pc.setLocalDescription(o);
    await ref.set({from:uid,to,fromName:S.name,state:'ringing',v:video?1:0,offer:{type:o.type,sdp:o.sdp},ts:Date.now()})}catch(e){endCall(0);return toast('Ошибка звонка')}
  CALL.cur.to=setTimeout(()=>{if(CALL.cur&&!pc.currentRemoteDescription){endCall(1);toast('Не ответили')}},45000);
  CALL.cur.un=ref.onSnapshot(async s=>{const d=s.data();if(!d||!CALL.cur||CALL.cur.pc!==pc)return;
    if(d.state==='ended')return endCall(0);
    if(d.answer&&!pc.currentRemoteDescription){await pc.setRemoteDescription(d.answer);CALL.cur.ice=listenIce(ref,pc);$('#cs2')&&($('#cs2').textContent='Разговор идёт…')}})}
function incoming(doc){const d=doc.data();if(CALL.cur||Date.now()-d.ts>6e4)return;const v=!!d.v;
  try{navigator.vibrate&&navigator.vibrate([300,150,300])}catch(e){}
  modal(v?'Входящий видеозвонок':'Входящий звонок','<div style="text-align:center;color:var(--accent)">'+ic(v?'vcall':'call',48)+'</div><div style="text-align:center;margin:8px 0">'+esc(d.fromName||'?')+' звонит…</div><button class="btn" id="ca2">Ответить</button><button class="btn alt" id="ce">Отклонить</button>');
  const un=doc.ref.onSnapshot(s=>{const x=s.data();if(!x||x.state!=='ended')return;un();if(CALL.cur&&CALL.cur.ref.id===doc.id)endCall(0);else closeModal()});
  $('#ce').onclick=()=>{un();doc.ref.update({state:'ended'}).catch(()=>{});closeModal()};
  $('#ca2').onclick=async()=>{let ms;try{ms=await navigator.mediaDevices.getUserMedia({audio:true,video:v?{facingMode:'user'}:false})}catch(e){return toast('Нет доступа к микрофону/камере')}
    CALL.cur={ref:doc.ref,ms,video:v};const pc=mkPc(ms,doc.ref);CALL.cur.pc=pc;CALL.cur.un=un;
    try{await pc.setRemoteDescription(d.offer);const a=await pc.createAnswer();await pc.setLocalDescription(a);
      await doc.ref.update({answer:{type:a.type,sdp:a.sdp},state:'active'});CALL.cur.ice=listenIce(doc.ref,pc)}catch(e){endCall(1);return toast('Ошибка звонка')}
    callUI('Разговор',esc(d.fromName||''),ctrl(v));bindCtl()}}

/* стикеры */
const E2='<circle cx="35" cy="42" r="6" fill="#222"/><circle cx="65" cy="42" r="6" fill="#222"/>',HT='<path d="M0 8C-14-4-12-14-5-14c3 0 5 2 5 4 0-2 2-4 5-4 7 0 9 10-5 22z"/>',SM='<path d="M30 60q20 22 40 0" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>';
const mkFace=(bg,e,m,x)=>`<svg viewBox="0 0 100 100"><circle cx="50" cy="52" r="42" fill="${bg}" stroke="rgba(0,0,0,.2)" stroke-width="3"/>${e}${m||''}${x||''}</svg>`;
const ST={happy:mkFace('#ffd54a',E2,SM),
love:mkFace('#ffd54a','<g fill="#ff3b6b" transform="translate(35 46) scale(1.5)">'+HT+'</g><g fill="#ff3b6b" transform="translate(65 46) scale(1.5)">'+HT+'</g>',SM),
cool:mkFace('#ffd54a','<rect x="18" y="34" width="28" height="18" rx="6" fill="#222"/><rect x="54" y="34" width="28" height="18" rx="6" fill="#222"/><path d="M46 42h8" stroke="#222" stroke-width="4"/>',SM),
sad:mkFace('#ffd54a',E2,'<path d="M32 74q18-18 36 0" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>','<path d="M33 52c-4 8-4 12 0 12s4-4 0-12z" fill="#5cc8ff"/>'),
angry:mkFace('#ff7a5a',E2,'<path d="M32 74q18-14 36 0" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>','<path d="M22 28l22 10M78 28L56 38" stroke="#222" stroke-width="6" stroke-linecap="round"/>'),
party:mkFace('#ffd54a',E2,SM,'<path d="M50 2L34 28h32z" fill="#7c5cff"/><circle cx="50" cy="4" r="4" fill="#ff3b6b"/>'),
sleep:mkFace('#9ad0ff','<path d="M26 46q8 7 16 0M58 46q8 7 16 0" fill="none" stroke="#222" stroke-width="5" stroke-linecap="round"/>','<ellipse cx="50" cy="68" rx="6" ry="5" fill="#222"/>','<path d="M70 12h14l-14 14h14" fill="none" stroke="#5a6bd6" stroke-width="4" stroke-linecap="round"/>'),
fire:'<svg viewBox="0 0 100 100"><path d="M50 6c4 16 26 24 26 46a26 26 0 0 1-52 0c0-14 6-18 11-26 2 8 6 10 9 10 0-14 2-22 6-30z" fill="#ff7a1a"/><path d="M50 48c3 9 13 13 13 24a13 13 0 0 1-26 0c0-9 7-11 9-18 2 4 4 4 4-6z" fill="#ffd54a"/></svg>',
like:'<svg viewBox="0 0 100 100"><rect x="10" y="46" width="20" height="42" rx="5" fill="#4a90ff"/><path d="M36 50l16-36c8 0 13 6 11 14l-3 12h24c6 0 10 6 8 12l-6 24c-1 4-5 6-9 6H36z" fill="#ffd54a" stroke="#c9a020" stroke-width="3" stroke-linejoin="round"/></svg>'};
$('#stk').onclick=()=>{modal('Стикеры','<div class="gg">'+Object.keys(ST).map(k=>`<button data-s="${k}" style="padding:6px"><div style="width:64px;margin:auto">${ST[k]}</div></button>`).join('')+'</div>');
  $('#mb').onclick=async e=>{const b=e.target.closest('[data-s]');if(!b)return;closeModal();const tid=cur.tid;await send({text:'',st:b.dataset.s});if(tid)db.doc('threads/'+tid).update({last:'Стикер'}).catch(()=>{})}};
const _rm9=renderMsgs;renderMsgs=function(snap){_rm9(snap);
  Object.keys(MSG).forEach(id=>{const m=MSG[id];if(!m||!m.st||!ST[m.st])return;const el=document.querySelector('#msgs .m[data-id="'+id+'"]');
    if(!el||el.querySelector('svg'))return;el.style.background='none';el.style.padding='0';
    el.insertBefore(Object.assign(document.createElement('div'),{innerHTML:ST[m.st],style:'width:110px'}),el.querySelector('.t'))})};

/* закреплённое сообщение и поиск */
$('#dl').insertAdjacentHTML('beforebegin','<button id="sr">'+ic('search')+'</button>');
$('#ch .bar').insertAdjacentHTML('afterend','<div id="pinb" style="display:none;align-items:center;gap:8px;padding:6px 12px;background:var(--card);border-bottom:1px solid var(--line);font-size:13px"><span style="color:var(--accent)">'+ic('pin',16)+'</span><div id="pnt" style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer"></div><span id="pnx" style="cursor:pointer;font-size:18px">✕</span></div>');
function jump(id){const el=[...document.querySelectorAll('#msgs .m')].find(x=>x.dataset.id===id);
  if(!el)return toast('Сообщение не найдено');el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1200)}
function showPin(){const t=cur.tid&&TH.find(x=>x.id===cur.tid),b=$('#pinb');if(!b)return;
  if(!t||!t.pin||!$('#ch').classList.contains('on')){b.style.display='none';return}
  b.style.display='flex';$('#pnt').textContent=t.pin.t||'Сообщение';$('#pnt').onclick=()=>jump(t.pin.id);
  $('#pnx').onclick=()=>db.doc('threads/'+t.id).update({pin:firebase.firestore.FieldValue.delete()}).catch(()=>toast('Ошибка'))}
const _rl9=renderList;renderList=function(){_rl9();showPin()};
const _mm9=msgMenu;msgMenu=function(id){_mm9(id);const m=MSG[id];if(!m||!cur.tid)return;
  $('#mb').insertAdjacentHTML('beforeend','<button class="btn alt" id="mpn">Закрепить в чате</button>');
  $('#mpn').onclick=()=>{closeModal();db.doc('threads/'+cur.tid).update({pin:{id,t:(m.text||(m.aud?'Голосовое':m.circ?'Кружок':m.st?'Стикер':m.img?'Фото':'Сообщение')).slice(0,60)}}).then(()=>toast('Закреплено')).catch(()=>toast('Ошибка'))}};
$('#sr').onclick=()=>{const q=(prompt('Поиск по этому чату:')||'').trim().toLowerCase();if(!q)return;
  const ids=Object.keys(MSG).filter(k=>(MSG[k].text||'').toLowerCase().includes(q));
  if(!ids.length)return toast('Ничего не найдено');toast('Найдено: '+ids.length+' (показано последнее)');jump(ids[ids.length-1])};

/* рамки аватара (магазин оформления) */
const FR={gold:['Золото',300,'conic-gradient(#ffd45c,#ff9d00,#ffd45c)'],neon:['Неон',200,'conic-gradient(#18e0ff,#b4ff3c,#18e0ff)'],fire:['Огонь',400,'conic-gradient(#ff3b3b,#ffb02e,#ff3b3b)'],rain:['Радуга',600,'conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)'],ice:['Лёд',250,'conic-gradient(#fff,#7ee0ff,#fff)']};
function av(p,s){p=p||{};const f=FR[p.frame],inner=p.avatar?`<img src="${esc(p.avatar)}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">`:`<div style="width:100%;height:100%;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:800">${esc((p.name||'?')[0]).toUpperCase()}</div>`;
  return `<div style="width:${s}px;height:${s}px;border-radius:50%;padding:${f?4:3}px;background:${f?f[2]:(isPrem(p)?'#ffc83d':'var(--card)')};flex:none">${inner}</div>`}
function frameShop(){const own=P.frames||[];modal('Рамки аватара · '+(P.coins||0)+' 🪙','<div class="gg">'+Object.keys(FR).map(k=>`<div data-f="${k}" style="text-align:center;cursor:pointer">${av({frame:k,name:P.name},64)}<small>${FR[k][0]}</small><small style="display:block">${own.includes(k)?(P.frame===k?'надета':'надеть'):FR[k][1]+' 🪙'}</small></div>`).join('')+'</div><button class="btn alt" id="fn">Снять рамку</button>');
  $('#fn').onclick=()=>{save({frame:''});closeModal()};
  $('#mb').onclick=e=>{const el=e.target.closest('[data-f]');if(!el)return;const k=el.dataset.f;
    if(own.includes(k)){save({frame:k});return closeModal()}
    if((P.coins||0)<FR[k][1])return toast('Не хватает тележкоинов');
    closeModal();save({coins:P.coins-FR[k][1],frames:[...own,k],frame:k});toast('Рамка куплена')}}

/* статистика профиля */
$('#prof').insertAdjacentHTML('afterend','<div class="box" id="stbx"></div>');
function statsRender(){const b=$('#stbx');if(!b||!P)return;
  const lk=vids.filter(v=>v.uid===uid).reduce((a,v)=>a+(likes[v.id]||[]).filter(x=>x!==uid).length,0),mine=ITEMS.filter(i=>i.owner===uid).length,days=P.created?Math.floor((Date.now()-P.created)/864e5)+1:1;
  const row=(a,c)=>`<div class="row"><span>${a}</span><b>${c}</b></div>`;
  b.innerHTML='<h3>Статистика</h3>'+row('Дней с Тележкой',days)+row('Заходов',P.visits||0)+row('Серия заходов',(P.streak||0)+' дн.')+row('Тележкоины','🪙 '+(P.coins||0))+row('Подарков в коллекции',mine)+row('Своих видео',vids.filter(v=>v.uid===uid).length)+row('Лайков получено',lk)+row('Игры сегодня',gdone()+'/'+gcap())+'<button class="btn" id="frs" style="width:100%;margin-top:8px">Рамки для аватара</button>';
  $('#frs').onclick=frameShop}
const _rp9=renderProf;renderProf=function(){_rp9();statsRender()};
if(P)renderProf();
