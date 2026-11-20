
const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SHOW={'C#':'C#/Db','D#':'D#/Eb','F#':'F#/Gb','G#':'G#/Ab','A#':'A#/Bb'};
const STR=[{n:'G',num:1,o:7,s:15},{n:'D',num:2,o:2,s:10},{n:'A',num:3,o:9,s:5},{n:'E',num:4,o:4,s:0}];
const noteAt=(si,f)=>NAMES[(STR[si].o+f)%12];
const isNat=n=>n.indexOf('#')<0;
const rnd=a=>a[Math.floor(Math.random()*a.length)];
let actx=null;
function tone(freq,when,dur,vol){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const t=actx.currentTime+(when||0);const o=actx.createOscillator(),g=actx.createGain();o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol||.35,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+(dur||.5));o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+(dur||.5)+.05);}catch(e){}}
function play(si,f,when,dur){tone(82.41*2*Math.pow(2,(STR[si].s+f)/12),when,dur);}
function chime(ok){if(ok){tone(880,0,.15,.15);tone(1320,.1,.2,.15);}else{tone(220,0,.25,.15);}}

const NS='http://www.w3.org/2000/svg';
function mk(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function Board(host,opt){
  opt=opt||{};const F=opt.frets||12,X0=70,WD=760,fw=(WD-X0-14)/F,Y=si=>34+si*42;
  const X=f=>f===0?X0-26:X0+(f-.5)*fw;
  const svg=mk('svg',{viewBox:'0 0 '+WD+' 222',role:'img','aria-label':'베이스 지판 0~'+F+'프렛'});
  mk('rect',{x:X0,y:14,width:F*fw,height:166,rx:6,fill:'var(--board)'},svg);
  [3,5,7,9].forEach(f=>{if(f<=F)mk('circle',{cx:X(f),cy:97,r:7,fill:'var(--inlay)',opacity:.55},svg);});
  if(F>=12){mk('circle',{cx:X(12),cy:76,r:7,fill:'var(--inlay)',opacity:.55},svg);mk('circle',{cx:X(12),cy:118,r:7,fill:'var(--inlay)',opacity:.55},svg);}
  for(let f=0;f<=F;f++)mk('line',{x1:X0+f*fw,y1:14,x2:X0+f*fw,y2:180,stroke:f?'var(--board-line)':'var(--inlay)','stroke-width':f?2:7},svg);
  STR.forEach((s,si)=>{mk('line',{x1:X0-40,y1:Y(si),x2:X0+F*fw,y2:Y(si),stroke:'var(--string)','stroke-width':1.2+si*.8},svg);
    const t=mk('text',{x:4,y:Y(si)+4,class:'lab'},svg);t.textContent=s.num+'번 '+s.n;});
  for(let f=0;f<=F;f++){const t=mk('text',{x:X(f),y:204,class:'lab','text-anchor':'middle'},svg);t.textContent=f;}
  const links=mk('g',{},svg),dots=mk('g',{},svg),hits=mk('g',{},svg);
  if(opt.onPick)STR.forEach((s,si)=>{for(let f=0;f<=F;f++){const r=mk('rect',{x:f===0?X0-46:X0+(f-1)*fw,y:Y(si)-21,width:f===0?40:fw,height:42,class:'hit',tabindex:0,'aria-label':s.num+'번줄 '+f+'프렛'},hits);
    const go=()=>opt.onPick(si,f);r.addEventListener('click',go);r.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go();}});}});
  host.appendChild(svg);
  return {
    clear(){dots.innerHTML='';links.innerHTML='';},
    dot(si,f,label,kind){const g=mk('g',{class:'pop'},dots);mk('circle',{cx:X(f),cy:Y(si),r:16,class:'dot '+(kind||'note')},g);
      const t=mk('text',{x:X(f),y:Y(si),class:'dl'+(kind==='root'?' inv':kind==='q'?' dk':'')},g);t.textContent=label;return g;},
    link(a,b){mk('path',{d:'M'+X(a[1])+' '+Y(a[0])+' L'+X(b[1])+' '+Y(b[0]),class:'link'},links);}
  };
}
function el(tag,attrs,html){const e=document.createElement(tag);if(attrs)for(const k in attrs)e.setAttribute(k,attrs[k]);if(html!==undefined)e.innerHTML=html;return e;}
function btn(txt,fn,cls){const b=el('button',cls?{class:cls,type:'button'}:{type:'button'},txt);b.addEventListener('click',fn);return b;}

/* 찾기 퀴즈: 이름을 보여주고 지판에서 찾게 함 */
function findQuiz(tool,cfg){
  const pr=el('div',{class:'prompt'}),fbk=el('div',{class:'fb'}),sc=el('div',{class:'score muted'});
  let target=null,score=0,streak=0,tries=0,busy=false;
  const wrap=el('div',{class:'boardwrap'});
  const b=Board(wrap,{onPick:(si,f)=>{if(!target||busy)return;play(si,f,0,.4);tries++;
    const okStr=cfg.strings.includes(si),ok=okStr&&noteAt(si,f)===target;
    b.clear();
    if(ok){score++;streak++;chime(true);fbk.className='fb ok';fbk.textContent='정답! '+STR[si].num+'번줄 '+f+'프렛 = '+(SHOW[target]||target)+(streak>=3?'  ('+streak+'연속)':'');
      cfg.strings.forEach(s=>{for(let q=0;q<=12;q++)if(noteAt(s,q)===target)b.dot(s,q,target,q===f&&s===si?'root':'good');});
      busy=true;setTimeout(()=>{busy=false;next();},1300);}
    else{streak=0;chime(false);b.dot(si,f,noteAt(si,f),'bad');fbk.className='fb no';
      fbk.textContent=!okStr?'이번엔 '+cfg.strings.map(s=>STR[s].num+'번줄').join('·')+'에서 찾아요.':'거기는 '+(SHOW[noteAt(si,f)]||noteAt(si,f))+'예요. '+(cfg.hint?cfg.hint(target):'다시 해 보세요.');}
    sc.textContent='맞힘 '+score+' / 시도 '+tries;}});
  function next(){b.clear();let t;do{t=rnd(cfg.pool);}while(t===target&&cfg.pool.length>1);target=t;
    pr.textContent=cfg.strings.map(s=>STR[s].num+'번줄').join(' 또는 ')+'에서 '+(SHOW[t]||t)+' 를 눌러 보세요';fbk.textContent='';fbk.className='fb';}
  tool.append(el('div',{class:'row'}),pr,wrap,fbk,sc);
  tool.firstChild.append(btn('퀴즈 시작',()=>{score=0;tries=0;streak=0;sc.textContent='';next();},'primary'),btn('답 보기',()=>{if(!target)return;b.clear();cfg.strings.forEach(s=>{for(let q=0;q<=12;q++)if(noteAt(s,q)===target)b.dot(s,q,target,'warn');});}));
  return b;
}
function seq(steps,gap){let i=0;const ids=[];steps.forEach((fn,k)=>ids.push(setTimeout(fn,k*(gap||550))));return ids;}

/* ===== 음정 지도 공통 ===== */
const INT={0:'R',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',7:'5',8:'b6',9:'6',10:'b7',11:'7',12:'8'};
const MAJ=[0,2,4,5,7,9,11,12];
const NF=14;
const pitch=(si,f)=>STR[si].s+f;
function playPitch(p,when,dur){tone(82.41*2*Math.pow(2,p/12),when,dur||.5);}
/* 루트(rs줄,rf프렛) 주변 13칸: k=몇 줄 위, d=반음 거리 */
function positions(rs,rf){const out=[];for(let k=0;k<=2;k++){const si=rs-k;if(si<0)continue;
  for(let d=0;d<=12;d++){const f=rf+d-5*k,dl=f-rf;
    const ok=k===0?(dl>=0&&dl<=3):k===1?(dl>=-2&&dl<=3):(dl>=-2&&dl<=2);
    if(ok&&f>=0&&f<=NF)out.push({si,f,d,k});}}return out;}
const FING={'-1':'1','0':'2','1':'3','2':'4'};
function drawMap(b,rs,rf,o){o=o||{};if(!o.keep)b.clear();
  positions(rs,rf).forEach(p=>{
    if(o.ks&&!o.ks.includes(p.k))return;
    const inSet=!o.pick||o.pick(p);
    if(!inSet&&!o.showDim)return;
    const kind=!inSet?'dim':(p.d===0||p.d===12)?'root':(o.alt&&o.alt.includes(p.d))?'warn':'note';
    const lab=o.mode==='name'?noteAt(p.si,p.f):o.mode==='finger'?(o.fingFn?o.fingFn(p.f-rf):(FING[p.f-rf]||'0')):INT[p.d];
    b.dot(p.si,p.f,lab,kind);});}
function where(c){return positions(c.rs,c.rf).filter(q=>q.d===c.d).map(q=>{const dl=q.f-c.rf;
  return (q.k===0?'같은 줄':q.k===1?'한 줄 위':'두 줄 위')+' '+(dl>0?dl+'칸 오른쪽':dl<0?(-dl)+'칸 왼쪽':'같은 칸');}).join(' 또는 ');}

function rootPicker(parent,on,init){const st={rs:init?init[0]:3,rf:init?init[1]:5};const r=el('div',{class:'row'});
  const bs=[3,2].map(si=>btn(STR[si].num+'번줄 루트',()=>{st.rs=si;sync();on(st);}));
  const sl=el('input',{type:'range',min:1,max:12,value:st.rf,'aria-label':'루트 프렛'});const lab=el('span',{class:'score'});
  function sync(){bs.forEach((b,i)=>b.classList.toggle('on',[3,2][i]===st.rs));sl.value=st.rf;lab.textContent=STR[st.rs].num+'번줄 '+st.rf+'프렛 = '+noteAt(st.rs,st.rf)+' (루트)';}
  sl.addEventListener('input',()=>{st.rf=+sl.value;sync();on(st);});
  r.append(...bs,el('span',{class:'muted'},'프렛'),sl,lab);parent.append(r);sync();return st;}
function modeBar(parent,on,modes){let cur=modes[0][0];
  const bs=modes.map(([k,t])=>btn(t,()=>{cur=k;sync();on(cur);}));
  function sync(){bs.forEach((b,i)=>b.classList.toggle('on',modes[i][0]===cur));}
  const r=el('div',{class:'row'},'<span class="muted">점 안에 표시</span>');r.append(...bs);parent.append(r);sync();return ()=>cur;}
const NUMNAME=[['num','음정 번호'],['name','음 이름']];

/* 번호 찾기 퀴즈 (cfg.timed면 60초 게임) */
function mapQuiz(tool,cfg){
  const pr=el('div',{class:'prompt'}),fbk=el('div',{class:'fb'}),sc=el('div',{class:'score muted'}),tm=el('span',{class:'timer'},'');
  let cur=null,score=0,tries=0,busy=false,left=0,iv=null,miss=[];
  const wrap=el('div',{class:'boardwrap'});
  const b=Board(wrap,{frets:NF,onPick:(si,f)=>{
    if(!cur||busy)return;tries++;play(si,f,0,.4);
    const hit=positions(cur.rs,cur.rf).find(p=>p.d===cur.d&&p.si===si&&p.f===f);
    b.clear();b.dot(cur.rs,cur.rf,'R','root');
    if(hit){score++;chime(true);b.dot(si,f,INT[cur.d],'good');b.link([cur.rs,cur.rf],[si,f]);fbk.className='fb ok';fbk.textContent='정답! '+INT[cur.d]+' = '+where(cur);
      if(cfg.timed)next();else{busy=true;setTimeout(()=>{busy=false;next();},1200);}}
    else{chime(false);const dd=(((pitch(si,f)-pitch(cur.rs,cur.rf))%12)+12)%12;b.dot(si,f,INT[dd],'bad');miss.push(INT[cur.d]);
      fbk.className='fb no';fbk.textContent='거기는 '+INT[dd]+' 예요. '+(cfg.timed?'':INT[cur.d]+'는 '+where(cur)+' 이에요.');if(cfg.timed)setTimeout(()=>{if(cur&&!busy)next();},600);}
    sc.textContent='맞힘 '+score+' / 시도 '+tries;}});
  function next(){const rs=rnd([3,2]),rf=1+Math.floor(Math.random()*10),d=rnd(cfg.pool);cur={rs,rf,d};
    b.clear();b.dot(rs,rf,'R','root');pr.textContent='루트 '+noteAt(rs,rf)+' ('+STR[rs].num+'번줄 '+rf+'프렛) 기준, 음정 "'+INT[d]+'" 는 어디일까요?';}
  function end(){clearInterval(iv);iv=null;cur=null;pr.textContent='끝!';
    const u=[...new Set(miss)];fbk.className='fb';fbk.textContent='점수 '+score+'점. '+(u.length?'자주 놓친 음정: '+u.join(', ')+' — 번호판에서 다시 확인해 보세요.':'틀린 곳이 없어요!');}
  const r=el('div',{class:'row'});
  r.append(btn(cfg.timed?'60초 시작':'퀴즈 시작',()=>{score=0;tries=0;miss=[];sc.textContent='';fbk.textContent='';
    if(cfg.timed){left=60;tm.textContent=left;if(iv)clearInterval(iv);iv=setInterval(()=>{left--;tm.textContent=left;if(left<=0)end();},1000);}next();},'primary'));
  if(!cfg.timed)r.append(btn('답 보기',()=>{if(!cur)return;b.clear();b.dot(cur.rs,cur.rf,'R','root');positions(cur.rs,cur.rf).filter(p=>p.d===cur.d).forEach(p=>b.dot(p.si,p.f,INT[cur.d],'warn'));}));
  else r.append(el('span',{class:'muted'},'남은 시간'),tm);
  tool.append(r,pr,wrap,fbk,sc);}

function degreeQuiz(tool,D,label){D=D||MAJ;label=label||'메이저';
  const pr=el('div',{class:'prompt'}),fbk=el('div',{class:'fb'}),sc=el('div',{class:'score muted'}),nb=el('div',{class:'names'});
  let cur=null,score=0,tries=0;
  const scaleOf=k=>D.slice(0,7).map(d=>NAMES[(k+d)%12]);
  function next(){const k=Math.floor(Math.random()*12),n=2+Math.floor(Math.random()*6);cur={k,n};pr.textContent=NAMES[k]+' '+label+'의 '+n+'번 음은?';}
  NAMES.forEach(n=>nb.append(btn(SHOW[n]||n,()=>{if(!cur)return;tries++;const ans=scaleOf(cur.k)[cur.n-1],ok=ans===n;chime(ok);if(ok)score++;
    fbk.className='fb '+(ok?'ok':'no');fbk.textContent=(ok?'정답! ':'답은 '+ans+'. ')+NAMES[cur.k]+' '+label+': '+scaleOf(cur.k).join(' ');sc.textContent='맞힘 '+score+' / 시도 '+tries;setTimeout(next,ok?900:1800);})));
  const r=el('div',{class:'row'});r.append(btn('퀴즈 시작',()=>{score=0;tries=0;sc.textContent='';fbk.textContent='';next();},'primary'));
  tool.append(r,pr,nb,fbk,sc);}

/* 구멍 카드 / 손 모양 */
const SHAPE=[[0,0],[0,2],[1,4],[1,5],[1,7],[2,9],[2,11],[2,12]].map(([k,d])=>({k,d}));
const inShape=p=>SHAPE.some(s=>s.k===p.k&&s.d===p.d);
const inMaj=p=>MAJ.includes(p.d);


function startCourse(LESSONS,KEY){
let done={};try{done=JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){done={};}
function saveDone(){try{localStorage.setItem(KEY,JSON.stringify(done));}catch(e){}renderProg();}
function renderProg(){const n=LESSONS.filter(l=>done[l.id]).length;document.getElementById('prog').style.width=(n/LESSONS.length*100)+'%';
  document.getElementById('progt').textContent=n+' / '+LESSONS.length;
  document.querySelectorAll('.tl a').forEach(a=>a.classList.toggle('done',!!done[a.dataset.id]));}

const tl=document.getElementById('tl'),host=document.getElementById('lessons');
let acc=0,timerIv=null;
LESSONS.forEach((L,i)=>{
  const a=el('a',{href:'#'+L.id,'data-id':L.id,style:'--m:'+L.min,class:L.rest?'rest':''},'<b>'+(i+1)+'. '+L.min+'분</b><span>'+L.t+'</span>');
  a.addEventListener('click',e=>{e.preventDefault();document.getElementById(L.id).scrollIntoView({behavior:'smooth',block:'start'});});tl.append(a);
  const start=acc;acc+=L.min;
  const c=el('section',{class:'card',id:L.id,'aria-labelledby':L.id+'-h'});
  const hd=el('div',{class:'head'});hd.append(el('h2',{id:L.id+'-h'},'강의 '+(i+1)+'. '+L.t+' <span class="muted" style="font-size:16px">· '+L.s+'</span>'),
    el('span',{class:'pill'+(L.rest?' rest':'')},L.min+'분 · '+start+'~'+acc+'분'));
  c.append(hd,el('p',{},'<b>목표</b> '+L.goal),el('div',{class:'analogy'},'<b>비유</b> '+L.an));
  if(typeof THEORY!=='undefined'&&THEORY[L.id]){const th=el('details',{class:'theory',open:''},'<summary>📖 이론 — 왜 그럴까?</summary>'+THEORY[L.id]);c.append(th);}
  if(typeof FAQ!=='undefined'&&FAQ[L.id]){const fq=el('details',{class:'faq',open:''},'<summary>🤔 초보자가 가장 헷갈려요</summary>');FAQ[L.id].forEach(x=>fq.append(el('div',{class:'qa'},'<b>Q. '+x[0]+'</b><p>'+x[1]+'</p>')));c.append(fq);}
  if(L.tips){const tp=el('div',{class:'tip'},'<b>꿀팁</b>');const u=el('ul');L.tips.forEach(x=>u.append(el('li',{},x)));tp.append(u);c.append(tp);}
  const ul=el('ul',{class:'todo'});L.todo.forEach(x=>ul.append(el('li',{},x)));c.append(ul);
  if(L.code){const d=el('details',{class:'codebox'},'<summary>코드로 확인 (Python)</summary>');const pre=el('pre',{class:'code'});pre.textContent=L.code;d.append(pre);c.append(d);}
  const tr=el('div',{class:'row'});const tv=el('span',{class:'timer'},L.min+':00');
  tr.append(btn(L.min+'분 타이머 시작',()=>{if(timerIv)clearInterval(timerIv);let s=L.min*60;tv.textContent=L.min+':00';
    timerIv=setInterval(()=>{s--;tv.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(s<=0){clearInterval(timerIv);timerIv=null;tv.textContent='끝!';chime(true);}},1000);}),tv);
  const lb=el('label',{class:'done'});const cb=el('input',{type:'checkbox',id:L.id+'-done'});cb.checked=!!done[L.id];
  cb.addEventListener('change',()=>{done[L.id]=cb.checked;saveDone();});lb.append(cb,document.createTextNode('완료'));tr.append(lb);c.append(tr);
  if(!L.rest){const tool=el('div',{class:'tool'});c.append(tool);L.build(tool);}
  host.append(c);
});
renderProg();
}

const MIN=[0,2,3,5,7,8,10,12];
const MINSHAPE=[[0,0],[0,2],[0,3],[1,5],[1,7],[1,8],[2,10],[2,12]].map(([k,d])=>({k,d}));
const inMinShape=p=>MINSHAPE.some(s=>s.k===p.k&&s.d===p.d);
const minFing=dl=>String(dl+1);
/* 스케일 올라가는 소리 */
function playScale(base,D,gap){D.forEach((d,i)=>playPitch(base+d,i*(gap||.45),.45));}
