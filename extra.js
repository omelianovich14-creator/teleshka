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
