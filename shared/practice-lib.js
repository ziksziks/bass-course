/* ===================== 실습 라이브러리 (bass-lib.js 다음에 불러오기) =====================
   voice(소리 종류) · JamEngine(드럼+코드+베이스 반주) · LineStudio(반주 + TAB + 지판 + 손 애니메이션)
   StepAnim(단계 애니메이션) · BeatAnim(리듬 애니메이션) · choiceQuiz(개념 퀴즈) */
function AC(){actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended'&&actx.resume)actx.resume();return actx;}
let _nb=null;
function noiseBuf(){const c=AC();if(!_nb){_nb=c.createBuffer(1,Math.floor(c.sampleRate*.5),c.sampleRate);const d=_nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}return _nb;}
function envG(g,t,a,peak,d){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d);}
function noiseHit(t,o){try{const c=AC();const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseBuf();f.type=o.type||'highpass';f.frequency.value=o.f||3000;f.Q.value=o.q||1;envG(g,t,.002,o.peak||.2,o.d||.05);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t);s.stop(t+(o.d||.05)+.05);}catch(e){}}
/* 베이스 소리: kind = finger|pick|T(엄지)|P(팝)|g(고스트)|h(해머)|/(슬라이드)|m(뮤트) ; p = E줄 개방현이 0인 반음 수 */
function voice(kind,p,when,dur,vol){try{const c=AC(),t=c.currentTime+Math.max(0,when||0),f=82.41*2*Math.pow(2,p/12),v=vol||.4;
  if(kind==='g'){noiseHit(t,{f:600,type:'bandpass',peak:.22,d:.07,q:2});return;}
  const o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();fl.type='lowpass';
  let a=.012,type='triangle',fc=1500,d=dur||.4;
  if(kind==='pick'){type='sawtooth';fc=2400;}
  if(kind==='T'){type='sine';fc=1800;a=.003;d=Math.min(d,.25);noiseHit(t,{f:1400,type:'bandpass',peak:.1,d:.03});}
  if(kind==='P'){type='sawtooth';fc=4200;a=.002;d=Math.min(d,.22);}
  if(kind==='h'){a=.05;fc=1100;}
  if(kind==='m'){d=Math.min(d,.12);}
  o.type=type;fl.frequency.value=fc;
  if(kind==='/'){o.frequency.setValueAtTime(f*Math.pow(2,-3/12),t);o.frequency.exponentialRampToValueAtTime(f,t+.09);}else o.frequency.setValueAtTime(f,t);
  envG(g,t,a,v,d);o.connect(fl);fl.connect(g);g.connect(c.destination);o.start(t);o.stop(t+a+d+.05);}catch(e){}}
function kickHit(t,v){try{const c=AC(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);envG(g,t,.003,.9*v,.2);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.3);}catch(e){}}
function snareHit(t,v){noiseHit(t,{f:1800,type:'bandpass',peak:.35*v,d:.14,q:.8});try{const c=AC(),o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=190;envG(g,t,.002,.18*v,.08);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.15);}catch(e){}}
function hatHit(t,v,open){noiseHit(t,{f:7000,type:'highpass',peak:.11*v,d:open?.18:.04});}
function clickHit(t,acc){try{const c=AC(),o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=acc?1600:1100;envG(g,t,.001,.12,.03);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.06);}catch(e){}}
const QI={hdim:[0,3,6,10],maj:[0,4,7],min:[0,3,7],dom7:[0,4,7,10],min7:[0,3,7,10],maj7:[0,4,7,11],dim:[0,3,6]};
const QS={hdim:'m7b5',maj:'',min:'m',dom7:'7',min7:'m7',maj7:'maj7',dim:'dim'};
function stabHit(t,pc,q,dur,vol){try{const base=((pc-4+12)%12)+24;QI[q].forEach(iv=>voice('finger',base+iv,t-AC().currentTime,dur,vol||.06));}catch(e){}}

const GROOVES={
 rock:{n:'록 8비트',k:[0,8,10],s:[4,12],h:[0,2,4,6,8,10,12,14],c:[0,8],sw:0},
 pop:{n:'팝',k:[0,7,10],s:[4,12],h:[0,2,4,6,8,10,12,14],c:[0,6,10],sw:0},
 funk:{n:'펑크 16비트',k:[0,3,10],s:[4,12],gh:[7,9,15],h:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],c:[3,6,10,14],sw:0},
 shuffle:{n:'블루스 셔플',k:[0,8],s:[4,12],h:[0,2,4,6,8,10,12,14],c:[0,8],sw:.5},
 reggae:{n:'레게',k:[8],s:[8],h:[2,6,10,14],c:[4,12],sw:0},
 ballad:{n:'발라드',k:[0,10],s:[8],h:[0,4,8,12],c:[0,8],sw:0},
 jazz:{n:'재즈 스윙',k:[0,4,8,12],s:[4,12],h:[0,4,6,8,12,14],c:[6,14],sw:.5,kv:.25}
};
const PROGS={
 'maj-1564':{n:'I–V–vi–IV (C G Am F)',mode:'maj',c:[[0,'maj'],[7,'maj'],[9,'min'],[5,'maj']]},
 'maj-1451':{n:'I–IV–V–I (C F G C)',mode:'maj',c:[[0,'maj'],[5,'maj'],[7,'maj'],[0,'maj']]},
 'maj-1645':{n:'I–vi–IV–V (C Am F G)',mode:'maj',c:[[0,'maj'],[9,'min'],[5,'maj'],[7,'maj']]},
 'maj-251':{n:'ii–V–I–I (Dm7 G7 Cmaj7)',mode:'maj',c:[[2,'min7'],[7,'dom7'],[0,'maj7'],[0,'maj7']]},
 'min-1b6b3b7':{n:'i–♭VI–♭III–♭VII (Am F C G)',mode:'min',c:[[0,'min'],[8,'maj'],[3,'maj'],[10,'maj']]},
 'min-1b7b6b7':{n:'i–♭VII–♭VI–♭VII (Am G F G)',mode:'min',c:[[0,'min'],[10,'maj'],[8,'maj'],[10,'maj']]},
 'min-145':{n:'i–iv–v–i (Am Dm Em Am)',mode:'min',c:[[0,'min'],[5,'min'],[7,'min'],[0,'min']]},
 'blues12':{n:'12마디 블루스 (C7 F7 G7)',mode:'blues',c:[[0,'dom7'],[0,'dom7'],[0,'dom7'],[0,'dom7'],[5,'dom7'],[5,'dom7'],[0,'dom7'],[0,'dom7'],[7,'dom7'],[5,'dom7'],[0,'dom7'],[7,'dom7']]},
 'dor-vamp':{n:'한 코드 잼 (Am7)',mode:'dor',c:[[0,'min7'],[0,'min7'],[0,'min7'],[0,'min7']]},
 'mix-vamp':{n:'I–♭VII–IV–I (G F C G)',mode:'mix',c:[[0,'maj'],[10,'maj'],[5,'maj'],[0,'maj']]},
 'canon':{n:'파헬벨 캐논형 I–V–vi–iii–IV–I–IV–V (D A Bm F#m G D G A)',mode:'maj',c:[[0,'maj'],[7,'maj'],[9,'min'],[4,'min'],[5,'maj'],[0,'maj'],[5,'maj'],[7,'maj']]},
 'andal':{n:'하행 진행 i–♭VII–♭VI–V (Am G F E)',mode:'min',c:[[0,'min'],[10,'maj'],[8,'maj'],[7,'dom7']]},
 'circle5':{n:'5도 순환 I–V–ii–vi–iii (C G D A E)',mode:'maj',c:[[0,'maj'],[7,'maj'],[2,'maj'],[9,'maj'],[4,'maj']]},
 'hotelc':{n:'i–V–♭VII–IV–♭VI–♭III–iv–V (Bm F# A E G D Em F#)',mode:'min',c:[[0,'min'],[7,'maj'],[10,'maj'],[5,'maj'],[8,'maj'],[3,'maj'],[5,'min'],[7,'maj']]},
 'dorian2':{n:'도리안 두 코드 i7–ii7 (Am7 Bm7)',mode:'dor',c:[[0,'min7'],[2,'min7'],[0,'min7'],[2,'min7']]},
 'oyecomova':{n:'도리안 바이브 i7–IV7 (Am7 D7)',mode:'dor',c:[[0,'min7'],[5,'dom7'],[0,'min7'],[5,'dom7']]},
 'autumn':{n:'가을 낙엽형 ii–V–I–IV–viiø–III7–vi (Cm7 F7 Bbmaj7 Ebmaj7 Am7b5 D7 Gm)',mode:'min',c:[[5,'min7'],[10,'dom7'],[3,'maj7'],[8,'maj7'],[2,'hdim'],[7,'dom7'],[0,'min'],[0,'min']]},
 'flyme':{n:'5도 순환 재즈형 (Am7 Dm7 G7 Cmaj7 Fmaj7 Bm7b5 E7 Am7)',mode:'min',c:[[0,'min7'],[5,'min7'],[10,'dom7'],[3,'maj7'],[8,'maj7'],[2,'hdim'],[7,'dom7'],[0,'min7']]},
 'minvamp':{n:'마이너 한 코드 (Em)',mode:'min',c:[[0,'min'],[0,'min'],[0,'min'],[0,'min']]},
 'maj-sub':{n:'변형 I–V–I(대리)–IV (C G Am→C F)',mode:'maj',c:[[0,'maj'],[7,'maj'],[9,'min'],[5,'maj'],[0,'maj'],[7,'maj'],[0,'maj'],[5,'maj']]}
};
const MODES={loc:[0,1,3,5,6,8,10,12],lyd:[0,2,4,6,7,9,11,12],phr:[0,1,3,5,7,8,10,12],maj:[0,2,4,5,7,9,11,12],min:[0,2,3,5,7,8,10,12],dor:[0,2,3,5,7,9,10,12],mix:[0,2,4,5,7,9,10,12],blues:[0,3,5,6,7,10,12],majpent:[0,2,4,7,9,12],minpent:[0,3,5,7,10,12]};
const third=q=>(q==='min'||q==='min7'||q==='dim')?3:4;
/* 베이스 라인 모음: f(코드종류, 다음코드까지 반음) -> [{s:시작스텝(0~15), l:길이, p:루트 대비 반음, t:주법}] */
const DEGN={0:'1',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',7:'5',8:'b6',9:'6',10:'b7',11:'7'};
const E8=[0,2,4,6,8,10,12,14];
const LINES={
 root4:{n:'루트 4분음표',d:'한 박에 한 번. 가장 단단한 기본이에요.',f:q=>[0,4,8,12].map(s=>({s,l:4,p:0}))},
 root8:{n:'루트 8분음표 (록)',d:'쉬지 않고 8분음표로 밀어 주는 록 베이스.',f:q=>E8.map(s=>({s,l:2,p:0}))},
 r5:{n:'루트-5도',d:'1박에 루트, 3박에 5도. 가장 쉬운 "내 라인".',f:q=>[{s:0,l:8,p:0},{s:8,l:8,p:7}]},
 r5o:{n:'루트-5도-옥타브 (팝)',d:'루트→5도→옥타브→5도, 올라갔다 내려와요.',f:q=>[{s:0,l:4,p:0},{s:4,l:4,p:7},{s:8,l:4,p:12},{s:12,l:4,p:7}]},
 oct:{n:'옥타브 디스코',d:'낮은 음, 높은 음 번갈아. 몸이 저절로 들썩.',f:q=>E8.map((s,i)=>({s,l:2,p:i%2?12:0}))},
 arp:{n:'코드톤 1-3-5-3',d:'코드의 재료(1·3·5)를 차례로. 3이 코드 분위기를 정해요.',f:q=>[0,third(q),7,third(q)].map((p,i)=>({s:i*4,l:4,p}))},
 walk:{n:'워킹 베이스 (재즈)',d:'4분음표로 걸어가듯 1-3-5-6.',f:(q,nx)=>[0,third(q),7,appr(nx)].map((p,i)=>({s:i*4,l:4,p}))},
 appr:{n:'접근음으로 다음 코드 예고',d:'마지막 박에서 다음 코드의 반음 아래를 쳐서 부드럽게 연결.',f:(q,nx)=>[{s:0,l:6,p:0},{s:6,l:2,p:0},{s:8,l:4,p:7},{s:12,l:4,p:appr(nx)}]},
 funk:{n:'펑크 + 고스트노트',d:'루트 사이사이에 "툭툭" 고스트노트(✕)로 리듬을 채워요.',f:q=>[{s:0,l:2,p:0},{s:2,l:1,p:0,t:'g'},{s:3,l:1,p:0,t:'g'},{s:6,l:2,p:12},{s:8,l:2,p:0},{s:10,l:1,p:0,t:'g'},{s:12,l:2,p:7},{s:14,l:1,p:10},{s:15,l:1,p:0,t:'g'}]},
 slap:{n:'슬랩 (엄지 T · 팝 P)',d:'엄지로 낮은 음을 "탁", 검지로 높은 음을 "팝!"',f:q=>[{s:0,l:2,p:0,t:'T'},{s:3,l:1,p:0,t:'g'},{s:6,l:2,p:12,t:'P'},{s:8,l:2,p:0,t:'T'},{s:10,l:1,p:0,t:'g'},{s:12,l:2,p:7,t:'T'},{s:14,l:2,p:12,t:'P'}]},
 hammer:{n:'해머온 · 슬라이드',d:'왼손으로만 음을 이어요: 해머온(h), 슬라이드(/).',f:q=>[{s:0,l:2,p:0},{s:2,l:2,p:third(q),t:'h'},{s:4,l:2,p:7},{s:6,l:2,p:5,t:'h'},{s:8,l:4,p:0},{s:12,l:2,p:7,t:'/'},{s:14,l:2,p:10,t:'/'}]},
 reggae:{n:'레게 (쉬는 게 반)',d:'1박은 쉬고 3박에 묵직하게. 쉼표가 리듬이에요.',f:q=>[{s:6,l:2,p:0},{s:8,l:6,p:0},{s:14,l:2,p:7}]},
 blues:{n:'블루스 1-3-5-6-♭7-6-5-3',d:'블루스 셔플의 정석 걸음.',f:q=>[0,4,7,9,10,9,7,4].map((p,i)=>({s:i*2,l:2,p}))},
 run:{n:'스케일 오르내리기 (여러 줄)',d:'한 마디에 스케일 8음을 올라갔다 내려와요. 줄 3개를 넘나들어요.',f:q=>{const D=(q==='min'||q==='min7')?[0,2,3,5,7,8,10,12]:(q==='dom7'?[0,2,4,5,7,9,10,12]:[0,2,4,5,7,9,11,12]);return D.map((p,i)=>({s:i*2,l:2,p})).slice(0,8);}},
 pentrun:{n:'펜타 오르내리기 (여러 줄)',d:'펜타토닉 음을 올라갔다 내려와요. 두세 줄을 지나가요.',f:q=>{const m=(q==='min'||q==='min7');const D=m?[0,3,5,7,10,12,10,7]:[0,2,4,7,9,12,9,7];return D.map((p,i)=>({s:i*2,l:2,p}));}},
 cross:{n:'줄 넘나들기 (루트-옥타브-5도-3도)',d:'낮은 줄 루트에서 높은 줄 옥타브까지 크게 오가며 3~4줄을 써요.',f:q=>[{s:0,l:4,p:0},{s:4,l:2,p:12},{s:6,l:2,p:7},{s:8,l:4,p:third(q)},{s:12,l:2,p:12},{s:14,l:2,p:7}]},
 apprUp:{n:'위에서 접근 (다음 루트 반음 위)',d:'마지막 박에서 다음 루트의 반음 위에서 내려와 도착해요.',f:(q,nx)=>[{s:0,l:6,p:0},{s:6,l:2,p:0},{s:8,l:4,p:7},{s:12,l:4,p:tgt(nx)+1}]},
 apprDbl:{n:'이중 접근 (온음-반음 아래)',d:'마지막 박에 두 음: 목표의 2칸 아래 → 1칸 아래 → 도착.',f:(q,nx)=>[{s:0,l:4,p:0},{s:4,l:4,p:third(q)},{s:8,l:4,p:7},{s:12,l:2,p:tgt(nx)-2},{s:14,l:2,p:tgt(nx)-1}]},
 enclose:{n:'둘러싸기 (위 → 아래 → 도착)',d:'목표 음의 반음 위, 반음 아래를 차례로 거쳐 도착해요.',f:(q,nx)=>[{s:0,l:4,p:0},{s:4,l:4,p:third(q)},{s:8,l:4,p:7},{s:12,l:2,p:tgt(nx)+1},{s:14,l:2,p:tgt(nx)-1}]},
 apprDia:{n:'스케일 음 접근 (온음 아래)',d:'크로매틱이 아니라 스케일 안의 한 음 아래에서 접근해요.',f:(q,nx)=>[{s:0,l:4,p:0},{s:4,l:4,p:third(q)},{s:8,l:4,p:7},{s:12,l:4,p:tgt(nx)-2}]},
 ctpass:{n:'코드톤(강박) + 경과음(약박)',d:'박 위에는 코드톤, 박 사이에는 스케일 음. 가장 쓸모 있는 즉흥 뼈대예요.',f:q=>[0,2,third(q),5,7,(q==='min'||q==='min7'||q==='hdim')?8:9,12,7].map((p,i)=>({s:i*2,l:2,p}))},
 guide:{n:'가이드톤 (3도 → 7도)',d:'코드의 색깔을 정하는 3도와 7도만 길게 연주해요.',f:q=>[{s:0,l:8,p:third(q)},{s:8,l:8,p:sev(q)}]},
 arp7:{n:'1-3-5-7 코드톤 4분음표',d:'코드톤 네 개를 한 박씩 올라가요.',f:q=>[0,third(q),7,sev(q)].map((p,i)=>({s:i*4,l:4,p}))},
 sync:{n:'싱코페이션 (엇박)',d:'박 사이에 들어가서 몸을 흔들게 해요.',f:q=>[{s:0,l:3,p:0},{s:3,l:3,p:0},{s:6,l:2,p:7},{s:8,l:3,p:0},{s:11,l:3,p:7},{s:14,l:2,p:10}]}
};
const tgt=nx=>(nx==null?0:(nx>6?nx-12:nx));
const sev=q=>q==='maj7'?11:(q==='dom7'||q==='min7'||q==='hdim'||q==='min')?10:9;
function appr(nx){let p=(((nx==null?0:nx)-1)%12+12)%12;if(p>6)p-=12;return nx===0||nx==null?7:p;}
function toPitch(pc,p){let P=((pc-4+12)%12)+p;while(P<0)P+=12;while(P>29)P-=12;return P;}
function posOf(P,pref){const c=[];for(let si=3;si>=0;si--){const f=P-STR[si].s;if(f>=0&&f<=NF)c.push({si,f});}c.sort((a,b)=>a.f-b.f);return c.length?c[Math.min(pref||0,c.length-1)]:{si:0,f:12};}
const TAGNAME={T:'엄지',P:'팝',g:'고스트',h:'해머온','/':'슬라이드',m:'뮤트'};

/* ===== 반주 엔진 ===== */
function JamEngine(){
  let timer=null,raf=0,vis=[],S=null,last=null;
  function sd(){return 60/S.cfg.bpm/4;}
  function sched(step,t){const cfg=S.cfg,g=GROOVES[cfg.groove],c=AC();const d=sd();
    if(step<0){if(step%4===0){clickHit(t,step===-16);vis.push({t,fn:()=>cfg.onCount&&cfg.onCount(Math.floor((step+16)/4)+1)});}return;}
    if(step===0){S.loop=(S.loop==null)?0:S.loop+1;if(cfg.onLoopStart){cfg.onLoopStart(S.loop,t);api.rebuild();}}
    const bar=Math.floor(step/16),s=step%16,ch=cfg.chords[bar],pc=(cfg.key+ch.r)%12;
    const tt=(g.sw&&s%4===2)?t+g.sw*(4/3)*d:t;
    if(cfg.drums){if(g.k.includes(s))kickHit(tt,g.kv||1);if(g.s.includes(s))snareHit(tt,g.kv?.5:1);if(g.gh&&g.gh.includes(s))snareHit(tt,.18);if(g.h.includes(s))hatHit(tt,s%4===0?1:.6,false);}
    if(cfg.comp&&g.c.includes(s))stabHit(tt,pc,ch.q,d*2.4,.055);
    (S.cache[bar]||[]).forEach(n=>{if(n.s!==s)return;const P=toPitch(pc,n.p),nt=(g.sw&&n.s%4===2)?t+g.sw*(4/3)*d:t;
      if(cfg.bass)voice(n.t||cfg.style||'finger',P,nt-c.currentTime,n.l*d*.92,.42);
      vis.push({t:nt,fn:()=>cfg.onNote&&cfg.onNote(bar,n,P,pc)});});
    vis.push({t,fn:()=>{last={step,t,d};cfg.onStep&&cfg.onStep(bar,s,step);}});
  }
  function frame(){if(!S)return;const now=AC().currentTime;while(vis.length&&vis[0].t<=now)vis.shift().fn();
    if(last&&S.cfg.onFrame)S.cfg.onFrame(last.step+Math.min(1,Math.max(0,(now-last.t)/last.d)));raf=requestAnimationFrame(frame);}
  const api={
    start(cfg){this.stop();const c=AC();S={cfg,cache:[],step:cfg.countIn?-16:0,next:c.currentTime+.1};this.rebuild();last=null;vis=[];
      const total=cfg.chords.length*16;
      timer=setInterval(()=>{while(S&&S.next<c.currentTime+.15){sched(S.step,S.next);S.next+=sd();S.step++;if(S.step>=total)S.step=0;}},25);
      raf=requestAnimationFrame(frame);},
    rebuild(){if(!S)return;const cfg=S.cfg,n=cfg.chords.length;S.cache=cfg.chords.map((ch,i)=>{const nx=cfg.chords[(i+1)%n];return cfg.line.f(ch.q,((nx.r-ch.r)%12+12)%12);});},
    stop(){if(timer)clearInterval(timer);timer=null;cancelAnimationFrame(raf);vis=[];S=null;last=null;},
    get on(){return !!S;}};
  return api;
}

/* ===== 손 애니메이션 ===== */
function HandPanel(host){
  const svg=mk('svg',{viewBox:'0 0 420 150',role:'img','aria-label':'오른손 움직임 애니메이션'});
  const ys=[26,56,86,116];['G','D','A','E'].forEach((n,i)=>{mk('line',{x1:60,y1:ys[i],x2:400,y2:ys[i],stroke:'var(--string)','stroke-width':1.2+i*.8},svg);const t=mk('text',{x:8,y:ys[i]+4,class:'lab'},svg);t.textContent=(i+1)+'번 '+n;});
  const g=mk('g',{},svg),dot=mk('circle',{cx:230,cy:86,r:16,fill:'var(--accent)',opacity:0},g),lab=mk('text',{x:230,y:86,class:'dl inv'},g);
  host.append(svg);const cap=el('div',{class:'fb muted'},'재생하면 오른손이 어느 줄을 어떻게 치는지 보여 줘요.');host.append(cap);let n=0;
  return{hit(si,tag,style){n++;let txt,color='var(--accent)';
    if(tag==='g'){txt='✕';color='var(--warn)';cap.textContent='고스트노트: 왼손으로 줄을 살짝 눌러 소리를 죽이고 오른손으로 "툭".';}
    else if(tag==='T'){txt='엄지';cap.textContent='슬랩: 엄지 옆면으로 줄을 "탁" 때려요.';}
    else if(tag==='P'){txt='팝';color='var(--good)';cap.textContent='팝: 검지로 줄을 위로 당겼다 놓아 "팝!" 소리.';}
    else if(tag==='h'){txt='H';cap.textContent='해머온: 오른손은 쉬고 왼손 손가락으로 "탁" 눌러서 소리내요.';}
    else if(tag==='/'){txt='↗';cap.textContent='슬라이드: 줄을 누른 채로 프렛을 미끄러져 올라가요.';}
    else if(style==='pick'){txt=n%2?'↓':'↑';cap.textContent='피크: 아래(↓)·위(↑)로 번갈아 쳐요.';}
    else{txt=n%2?'검':'중';cap.textContent='핑거: 검지와 중지를 번갈아 써요 (같은 손가락 연속 금지).';}
    dot.setAttribute('cy',ys[si]);lab.setAttribute('y',ys[si]);lab.textContent=txt;dot.setAttribute('fill',color);dot.setAttribute('opacity',1);
    dot.classList.remove('hit');void dot.getBoundingClientRect();dot.classList.add('hit');}};
}

/* ===== 라인 스튜디오: 반주 + TAB + 지판 + 손 ===== */
function sel(label,opts,val,fn){const l=el('label',{class:'sel'},'<span class="muted">'+label+'</span> ');const s=el('select');opts.forEach(([v,t])=>{const o=el('option',{value:v},t);if(v==val)o.selected=true;s.append(o);});s.addEventListener('change',()=>fn(s.value));l.append(s);return l;}
function chk(label,val,fn){const l=el('label',{class:'sel'});const c=el('input',{type:'checkbox'});c.checked=val;c.addEventListener('change',()=>fn(c.checked));l.append(c,document.createTextNode(' '+label));return l;}
function LineStudio(tool,cfg){
  cfg=Object.assign({key:0,prog:'maj-1564',groove:'rock',line:'root8',bpm:90,progs:['maj-1564'],grooves:['rock'],lines:['root8'],hand:false,builder:false},cfg);
  const st={pos:0,sc:0,key:cfg.key,prog:cfg.prog,groove:cfg.groove,line:cfg.line,bpm:cfg.bpm,drums:true,comp:true,bass:true,count:true};
  const eng=JamEngine();const guide=cfg.guide||null;let gcum=[];if(guide){let acc=0;gcum=guide.map(g=>acc+=(g.loops||2));}
  const gbar=el('div',{class:'prompt guidebar'});
  const gOverview=()=>{if(guide)gbar.innerHTML='<b>이 실습은 '+guide.length+'단계예요</b> (총 '+gcum[gcum.length-1]+'바퀴)<ol style="margin:6px 0 0;padding-left:20px;font-weight:400">'+guide.map(g=>'<li><b>'+g.t+'</b> — '+g.say+'</li>').join('')+'</ol><span class="muted" style="font-weight:400">▶ 재생을 누르면 1마디 카운트 후 시작해요.</span>';};
  gOverview();const LL=Object.assign({},LINES);
  let grid={},rows=cfg.builderRows||[['옥타브',12],['b7',10],['5도',7],['3도','3'],['루트',0],['아래 5도',-5],['고스트 ✕',0,'g']];
  if(cfg.builder)LL.mine={n:'내 라인 (아래 칸에서 만들기)',d:'칸을 눌러 직접 만든 라인이에요.',f:q=>{const out=[];rows.forEach((r,ri)=>{for(let s=0;s<16;s++)if(grid[ri+','+s])out.push({s,l:2,p:r[1]==='3'?third(q):(r[1]==='7'?sev(q):r[1]),t:r[2]});});return out.sort((a,b)=>a.s-b.s);}};
  const posAt=P=>posOf(P,st.pos);let modOn={};let baseId=(cfg.bases||['root8'])[0];
  if(cfg.mods)LL.mod={n:'수정한 라인 (체크로 바꾸기)',d:'체크한 수정이 적용된 라인이에요. 하나씩 켜고 끄며 소리 차이를 비교하세요.',f:(q,nx)=>{let ns=LINES[baseId].f(q,nx).map(n=>Object.assign({},n));cfg.mods.forEach(m=>{if(modOn[m.id])ns=m.fn(ns,q,nx);});return ns.sort((x,y)=>x.s-y.s);}};
  const prog=()=>PROGS[st.prog];const chords=()=>prog().c.map(([r,q])=>({r,q}));
  const cname=(c)=>NAMES[(st.key+c.r)%12]+QS[c.q];
  const top=el('div',{class:'row'}),mid=el('div',{class:'row'}),chips=el('div',{class:'chips'}),info=el('div',{class:'prompt'},'▶ 재생을 눌러 보세요'),desc=el('p',{class:'muted'});
  const tabw=el('div',{class:'boardwrap tabwrap'}),bw=el('div',{class:'boardwrap'}),hw=el('div',{class:'handwrap'});
  const b=Board(bw,{frets:NF});const hand=cfg.hand?HandPanel(hw):null;
  const keySel=sel('키',NAMES.map((n,i)=>[i,SHOW[n]||n]),st.key,v=>{st.key=+v;redraw(true);});
  const progSel=sel('코드 진행',cfg.progs.map(id=>[id,PROGS[id].n]),st.prog,v=>{st.prog=v;redraw(true);});
  const grvSel=sel('리듬',cfg.grooves.map(id=>[id,GROOVES[id].n]),st.groove,v=>{st.groove=v;if(eng.on)start();});
  const lnSel=sel('베이스 라인',cfg.lines.concat(cfg.builder?['mine']:[]).concat(cfg.mods?['mod']:[]).map(id=>[id,LL[id].n]),st.line,v=>{st.line=v;redraw(false);});
  const lnSelEl=lnSel.querySelector('select');
  const bpm=el('input',{type:'range',min:50,max:160,value:st.bpm,'aria-label':'빠르기'}),bl=el('span',{class:'score'},st.bpm+' BPM');
  bpm.addEventListener('input',()=>{st.bpm=+bpm.value;bl.textContent=st.bpm+' BPM';if(ecfg)ecfg.bpm=st.bpm;});
  const play=btn('▶ 재생',()=>{if(eng.on){stopAll();}else start();},'primary');
  top.append(keySel,progSel,grvSel,lnSel,sel('연주 자리',[[0,'낮은 프렛 자리'],[1,'한 줄 위 자리'],[2,'두 줄 위 자리']],0,v=>{st.pos=+v;redraw(false);}));if(cfg.scales)top.append(sel('보여줄 스케일',cfg.scales.map((x,i)=>[i,x[0]]),0,v=>{st.sc=+v;drawBoard();}));mid.append(play,el('span',{class:'muted'},'빠르기'),bpm,bl,chk('드럼',true,v=>{st.drums=v;sync();}),chk('코드',true,v=>{st.comp=v;sync();}),chk('베이스 소리 (끄고 내가 치기)',true,v=>{st.bass=v;sync();}),chk('카운트(1마디)',true,v=>{st.count=v;}));
  const mode=()=>cfg.scales?cfg.scales[st.sc][1]:(MODES[prog().mode]||MODES.maj);
  let svg=null,noteEls={},ph=null,curNote=null;
  function drawTab(){tabw.innerHTML='';const ch=chords(),n=ch.length,rowsN=Math.ceil(n/4),barW=240,stepW=barW/16,M=34,H=rowsN*110+10;
    svg=mk('svg',{viewBox:'0 0 1000 '+H,role:'img','aria-label':'베이스 TAB'});noteEls={};
    const lines=eng._lines||[];
    for(let r=0;r<rowsN;r++){const y0=r*110+26;['G','D','A','E'].forEach((nm,i)=>{mk('line',{x1:M,y1:y0+i*16,x2:M+4*barW,y2:y0+i*16,stroke:'var(--board-line)','stroke-width':1},svg);const t=mk('text',{x:8,y:y0+i*16+4,class:'lab'},svg);t.textContent=nm;});
      for(let k=0;k<=4;k++)mk('line',{x1:M+k*barW,y1:y0,x2:M+k*barW,y2:y0+48,stroke:'var(--board-line)','stroke-width':k%4?1:2},svg);}
    ph=mk('rect',{x:M,y:26,width:2.5,height:48,fill:'var(--accent)',opacity:0},svg);
    ch.forEach((c,bar)=>{const r=Math.floor(bar/4),bi=bar%4,y0=r*110+26;const t=mk('text',{x:M+bi*barW+6,y:y0-8,class:'lab',style:'font-weight:700'},svg);t.textContent=cname(c);
      const nx=ch[(bar+1)%n];(LL[st.line].f(c.q,((nx.r-c.r)%12+12)%12)).forEach(nt=>{const P=toPitch((st.key+c.r)%12,nt.p),pos=posAt(P),x=M+bi*barW+nt.s*stepW+stepW/2,y=y0+pos.si*16;
        const g=mk('g',{},svg);mk('rect',{x:x-7,y:y-7,width:14,height:14,rx:3,fill:'var(--surface)',stroke:'transparent','stroke-width':2,class:'tn'},g);
        const tx=mk('text',{x,y:y+.5,class:'dl'+(nt.t==='g'?' gh':'')},g);tx.textContent=nt.t==='g'?'✕':pos.f;
        if(nt.t&&nt.t!=='g'){const tg=mk('text',{x,y:y0-2-(nt.t==='P'?8:0),class:'lab',style:'text-anchor:middle;fill:var(--warn);font-weight:700'},svg);tg.textContent=nt.t;}
        mk('line',{x1:x,y1:y0+54,x2:x,y2:y0+54+Math.min(14,4+nt.l*2),stroke:'var(--muted)','stroke-width':1.2},svg);
        noteEls[bar+':'+nt.s]=g;});});
    tabw.append(svg);}
  function drawBoard(note){b.clear();const D=mode(),k=st.key;
    for(let si=0;si<4;si++)for(let f=0;f<=12;f++){const d=((NAMES.indexOf(noteAt(si,f))-k)%12+12)%12;if(D.includes(d)||(d===0&&D.includes(12)))b.dot(si,f,INT[d],d===0?'dim':'dim');}
    if(note){const pos=posAt(note.P);b.dot(pos.si,pos.f,noteAt(pos.si,pos.f),note.root?'root':'warn');}}
  function drawChips(cur){chips.innerHTML='';chords().forEach((c,i)=>chips.append(el('span',{class:'chip'+(i===cur?' on':'')},(i+1)+'. '+cname(c)+' · '+(DEGN[c.r]||'?'))));}
  function redraw(restart){drawTab();drawBoard();drawChips(-1);desc.textContent=LL[st.line].d;if(eng.on){if(restart)start();else{ecfg.line=LL[st.line];eng.rebuild();}}
    if(cfg.builder)gridWrap.style.display=st.line==='mine'?'':'none';}
  let gridWrap=el('div',{class:'tool gridb'});
  if(cfg.builder){gridWrap.append(el('p',{class:'muted'},'칸을 눌러 음을 켜고 끄세요. 가로 = 한 마디의 16칸(1 e & a 2 e & a …), 세로 = 칠 음. 어떤 코드든 자동으로 그 코드에 맞춰져요.'));
    const gt=el('div',{class:'gridrows'});rows.forEach((r,ri)=>{const row=el('div',{class:'grow'});row.append(el('span',{class:'gl'},r[0]));for(let s=0;s<16;s++){const c=el('button',{class:'gc'+(s%4===0?' beat':''),type:'button','aria-label':r[0]+' '+(s+1)+'번째 칸'});c.addEventListener('click',()=>{const k=ri+','+s;grid[k]=!grid[k];c.classList.toggle('on',!!grid[k]);drawTab();if(eng.on)eng.rebuild();if(!eng.on)voice(r[2]||'finger',toPitch(st.key,typeof r[1]==='number'?r[1]:4),0,.3);});row.append(c);}gt.append(row);});gridWrap.append(gt);
    const pre=el('div',{class:'row'},'<span class="muted">예제 불러오기</span>');
    [['록 기본',{'4,0':1,'4,4':1,'4,8':1,'4,10':1,'4,12':1}],['팝 5도',{'4,0':1,'4,6':1,'2,8':1,'4,10':1,'2,12':1}],['펑크',{'4,0':1,'6,3':1,'4,6':1,'6,7':1,'4,8':1,'1,12':1,'6,14':1}]].forEach(([n,g])=>pre.append(btn(n,()=>{grid=Object.assign({},g);gt.querySelectorAll('.gc').forEach((c,i)=>{const ri=Math.floor(i/16),s=i%16;c.classList.toggle('on',!!grid[ri+','+s]);});drawTab();if(eng.on)eng.rebuild();})));
    pre.append(btn('모두 지우기',()=>{grid={};gt.querySelectorAll('.gc').forEach(c=>c.classList.remove('on'));drawTab();if(eng.on)eng.rebuild();}));gridWrap.append(pre);gridWrap.style.display='none';}
  let ecfg=null;
  function sync(){if(ecfg){ecfg.drums=st.drums;ecfg.comp=st.comp;ecfg.bass=st.bass;}}
  function start(){const ch=chords();ecfg={key:st.key,chords:ch,groove:st.groove,bpm:st.bpm,drums:st.drums,comp:st.comp,bass:st.bass,countIn:st.count,style:cfg.style,line:LL[st.line],
      onCount:n=>{info.textContent='카운트 '+n+' … 준비!';ph.setAttribute('opacity',0);},
      onStep:(bar,s)=>{drawChips(bar);},
      onNote:(bar,n,P,pc)=>{const pos=posAt(P);info.textContent=cname(chords()[bar])+' 마디 · '+STR[pos.si].num+'번줄 '+pos.f+'프렛 '+noteAt(pos.si,pos.f)+(n.t?' ('+(TAGNAME[n.t]||n.t)+')':'');
        drawBoard({P,root:n.p===0});if(curNote)curNote.querySelector('.tn').setAttribute('stroke','transparent');curNote=noteEls[bar+':'+n.s]||null;if(curNote)curNote.querySelector('.tn').setAttribute('stroke','var(--accent)');
        if(hand)hand.hit(pos.si,n.t,st.line==='slap'?'slap':cfg.handStyle);},
      onFrame:pos=>{const bar=Math.floor(pos/16),r=Math.floor(bar/4),x=34+((pos%64)/16)*240;ph.setAttribute('x',x);ph.setAttribute('y',r*110+26);ph.setAttribute('opacity',.9);}};
    if(guide)ecfg.onLoopStart=(loop,t)=>{const tot=gcum[gcum.length-1],d=Math.max(0,(t-AC().currentTime)*1000);
      if(loop>=tot){setTimeout(()=>{stopAll();gbar.innerHTML='<b>🎉 모든 단계를 마쳤어요!</b> 잘했어요. 한 번 더 하려면 ▶ 재생을 누르세요.';},d);return;}
      const gi=gcum.findIndex(c=>loop<c),g=guide[gi];ecfg.line=LL[g.line]||LL[st.line];ecfg.bass=(g.bass!==false)&&st.bass;ecfg.bpm=g.bpm||st.bpm;if(g.groove)ecfg.groove=g.groove;
      const n=loop-(gi?gcum[gi-1]:0)+1,tt=g.loops||2;
      setTimeout(()=>{st.line=g.line;if(g.groove){st.groove=g.groove;grvSel.querySelector('select').value=g.groove;}if(lnSelEl)lnSelEl.value=g.line;redraw(false);gbar.innerHTML='<b>STEP '+(gi+1)+' / '+guide.length+' · '+g.t+'</b>  <span class="chip on">바퀴 '+n+' / '+tt+'</span><br><span style="font-weight:400">'+g.say+'</span>'+(g.bass===false?'<br><span class="muted" style="font-weight:400">🔇 이번엔 베이스 소리가 꺼져요. 내가 직접 치세요!</span>':'');},d);};
    eng.start(ecfg);play.textContent='■ 정지';}
  function stopAll(){eng.stop();play.textContent='▶ 재생';info.textContent='멈췄어요. 다시 ▶ 를 눌러 보세요.';if(ph)ph.setAttribute('opacity',0);drawChips(-1);}
  const modWrap=el('div',{class:'tool modlab'});
  if(cfg.mods){modWrap.append(el('p',{class:'muted'},'① 원래 라인을 고르고 ② 수정 레시피를 하나씩 켜며 ▶ 재생하세요. 켤 때마다 TAB이 바뀌고 소리도 바뀌어요.'));
    modWrap.append(sel('원래 라인',(cfg.bases||['root8']).map(id=>[id,LINES[id].n]),baseId,v=>{baseId=v;modChanged();}));
    cfg.mods.forEach(m=>{modWrap.append(chk(m.n,false,v=>{modOn[m.id]=v;modChanged();}));});}
  function modChanged(){if(st.line!=='mod'){st.line='mod';lnSelEl.value='mod';}redraw(false);}
  tool.append(top,mid);if(guide)tool.append(gbar);tool.append(chips,info,tabw,bw);if(hand)tool.append(hw);if(cfg.mods)tool.append(modWrap);if(cfg.builder)tool.append(gridWrap);tool.append(desc);redraw(false);
  return{stop:stopAll,set(o){if(o.key!=null){st.key=+o.key;keySel.querySelector('select').value=st.key;}if(o.prog){st.prog=o.prog;progSel.querySelector('select').value=o.prog;}if(o.groove){st.groove=o.groove;grvSel.querySelector('select').value=o.groove;}if(o.line){st.line=o.line;lnSelEl.value=o.line;}if(o.bpm){st.bpm=+o.bpm;bpm.value=o.bpm;bl.textContent=st.bpm+' BPM';}redraw(true);}};
}

/* ===== 단계 애니메이션 ===== */
function StepAnim(tool,steps,cfg){cfg=cfg||{};const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});const cap=el('div',{class:'prompt'}),cnt=el('span',{class:'muted'});let i=0,ids=[];
  const stop=()=>{ids.forEach(clearTimeout);ids=[];};
  function show(k,snd){i=Math.max(0,Math.min(steps.length-1,k));const s=steps[i];b.clear();
    (s.maps||(s.map?[s.map]:[])).forEach((m,mi)=>{const rs=m.rs==null?2:m.rs,rf=m.rf==null?3:m.rf;drawMap(b,rs,rf,{keep:mi>0,pick:m.D?(p=>m.D.includes(p.d)):m.pick,showDim:m.showDim!==false,alt:m.alt,mode:m.mode,ks:m.ks,fingFn:m.fingFn});});
    if(s.neck)neckDraw(b,s.neck);
    (s.dots||[]).forEach(d=>b.dot(d[0],d[1],d[2],d[3]));(s.links||[]).forEach(l=>b.link(l[0],l[1]));
    cap.textContent=s.cap;cnt.textContent=(i+1)+' / '+steps.length;
    if(snd!==false&&s.play)s.play.forEach((P,j)=>playPitch(P,j*.4,.5));}
  const r=el('div',{class:'row'});
  r.append(btn('◀ 이전',()=>{stop();show(i-1);}),btn('다음 ▶',()=>{stop();show(i+1);},'primary'),btn('자동 재생',()=>{stop();steps.forEach((s,k)=>ids.push(setTimeout(()=>show(k),k*(cfg.gap||2800))));}),cnt);
  tool.append(r,cap,aw);show(0,false);}

/* ===== 리듬 애니메이션 ===== */
function BeatAnim(tool,cfg){const N=cfg.steps||16;let bpm=cfg.bpm||80,tm=null,vis=[],raf=0,step=0,next=0,pat=cfg.rows.map(r=>r.pat.split('').map(ch=>ch!=='.'&&ch!==' '));
  const grid=el('div',{class:'beatgrid'});const cells=[];
  cfg.rows.forEach((r,ri)=>{const row=el('div',{class:'brow'});row.append(el('span',{class:'gl'},r.n));cells[ri]=[];for(let s=0;s<N;s++){const c=el('button',{type:'button',class:'bc'+(pat[ri][s]?' on':'')+(s%4===0?' beat':'')+(cfg.edit?'':' ro'),'aria-label':r.n+' '+(s+1)});
      if(cfg.edit)c.addEventListener('click',()=>{pat[ri][s]=!pat[ri][s];c.classList.toggle('on',pat[ri][s]);});row.append(c);cells[ri][s]=c;}grid.append(row);});
  const counts=el('div',{class:'brow'});counts.append(el('span',{class:'gl'},'박'));for(let s=0;s<N;s++)counts.append(el('span',{class:'bn'},s%4===0?String(s/4+1):(s%4===2?'&':(cfg.sixteenth?(s%4===1?'e':'a'):''))));grid.append(counts);
  const play=btn('▶ 재생',()=>{if(tm)halt();else go();},'primary'),sl=el('input',{type:'range',min:50,max:150,value:bpm,'aria-label':'빠르기'}),bl=el('span',{class:'score'},bpm+' BPM');
  sl.addEventListener('input',()=>{bpm=+sl.value;bl.textContent=bpm+' BPM';});
  function go(){const c=AC();step=0;next=c.currentTime+.1;vis=[];tm=setInterval(()=>{while(next<c.currentTime+.15){const t=next,s=step;
      cfg.rows.forEach((r,ri)=>{if(!pat[ri][s])return;const k=r.snd||'hat',off=r.p||0;if(k==='kick')kickHit(t,1);else if(k==='snare')snareHit(t,1);else if(k==='hat')hatHit(t,1);else if(k==='ghost')voice('g',0,t-c.currentTime);else if(k==='click')clickHit(t,s%4===0);else voice(k==='bass'?'finger':k,off,t-c.currentTime,.3);});
      vis.push({t,fn:()=>{cells.forEach(rw=>rw.forEach((x,i)=>x.classList.toggle('cur',i===s)));}});next+=60/bpm/4;step=(step+1)%N;}},25);
    const fr=()=>{const now=AC().currentTime;while(vis.length&&vis[0].t<=now)vis.shift().fn();raf=requestAnimationFrame(fr);};raf=requestAnimationFrame(fr);play.textContent='■ 정지';}
  function halt(){clearInterval(tm);tm=null;cancelAnimationFrame(raf);cells.forEach(rw=>rw.forEach(x=>x.classList.remove('cur')));play.textContent='▶ 재생';}
  const r=el('div',{class:'row'});r.append(play,el('span',{class:'muted'},'빠르기'),sl,bl);tool.append(r,grid);if(cfg.note)tool.append(el('p',{class:'muted'},cfg.note));}

/* ===== 개념 퀴즈 ===== */
function choiceQuiz(tool,qs){const pr=el('div',{class:'prompt'}),ob=el('div',{class:'row'}),fb=el('div',{class:'fb'}),sc=el('div',{class:'score muted'});let order=[],qi=0,score=0,tries=0,cur=null;
  function next(){if(!order.length)order=qs.map((_,i)=>i).sort(()=>Math.random()-.5);cur=qs[order.pop()];pr.textContent=cur.q;ob.innerHTML='';fb.textContent='';fb.className='fb';
    cur.o.map((t,i)=>i).sort(()=>Math.random()-.5).forEach(i=>ob.append(btn(cur.o[i],()=>{if(cur.done)return;tries++;const ok=i===cur.a;chime(ok);if(ok){score++;cur.done=true;}fb.className='fb '+(ok?'ok':'no');fb.textContent=(ok?'정답! ':'다시 생각해 봐요. ')+cur.why;sc.textContent='맞힘 '+score+' / 시도 '+tries;if(ok)setTimeout(()=>{cur.done=false;next();},2200);})));}
  tool.append(btn('퀴즈 시작',()=>{score=0;tries=0;order=[];sc.textContent='';next();},'primary'),pr,ob,fb,sc);}

/* 레슨 도우미 */
const studio=cfg=>t=>LineStudio(t,cfg);
const steps=(arr,cfg)=>t=>StepAnim(t,arr,cfg);
const beats=cfg=>t=>BeatAnim(t,cfg);
const quiz=qs=>t=>choiceQuiz(t,qs);
const both=(...fns)=>t=>fns.forEach(f=>{const d=el('div',{class:'tool'});t.append(d);f(d);});
const mapOf=(D,o)=>Object.assign({D,showDim:true},o||{});

/* 넥 전체 스케일 지도 */
function neckDraw(b,o){const k=o.key||0;for(let si=0;si<4;si++)for(let f=0;f<=12;f++){const d=(((NAMES.indexOf(noteAt(si,f))-k)%12)+12)%12;if(o.D.includes(d)||(d===0&&o.D.includes(12)))b.dot(si,f,o.mode==='name'?noteAt(si,f):INT[d],d===0?'root':(o.alt&&o.alt.includes(d))?'warn':'note');}}
const shapeOf=list=>{const S=list.map(([k,d])=>({k,d}));return p=>S.some(x=>x.k===p.k&&x.d===p.d);};
const SH={majpent:shapeOf([[0,0],[0,2],[1,4],[1,7],[2,9],[2,12]]),minpent:shapeOf([[0,0],[0,3],[1,5],[1,7],[2,10],[2,12]]),blues:shapeOf([[0,0],[0,3],[1,5],[1,6],[1,7],[2,10],[2,12]])};
/* 탐색기: 루트 고르기 + 모양 보기 + 올라가며 소리 */
function Explorer(t,o){o=o||{};const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let mode=o.mode||'num',ids=[];
  const pick=o.pick||(p=>o.D.includes(p.d));const stp=()=>{ids.forEach(clearTimeout);ids=[];};
  const lab=(p,st)=>mode==='name'?noteAt(p.si,p.f):mode==='finger'?(o.fingFn?o.fingFn(p.f-st.rf):(FING[p.f-st.rf]||'0')):INT[p.d];
  const kind=d=>d===0||d===12?'root':(o.alt&&o.alt.includes(d))?'warn':'note';
  const draw=st=>{stp();drawMap(b,st.rs,st.rf,{pick,showDim:o.showDim!==false,alt:o.alt,mode,fingFn:o.fingFn});};
  const st=rootPicker(t,draw,o.init||[2,3]);
  modeBar(t,m=>{mode=m;draw(st);},o.modes||NUMNAME);
  const run=D=>{stp();b.clear();const ps=positions(st.rs,st.rf).filter(pick),base=pitch(st.rs,st.rf);
    D.forEach((d,i)=>ids.push(setTimeout(()=>{ps.filter(p=>p.d===d).forEach(p=>b.dot(p.si,p.f,lab(p,st),kind(d)));playPitch(base+d,0,.5);},i*600)));};
  const r=el('div',{class:'row'});const asc=o.D.filter((d,i,a)=>a.indexOf(d)===i);
  r.append(btn('올라가며 소리',()=>run(asc),'primary'),btn('내려오며 소리',()=>run(asc.slice().reverse())),btn('모양 전체 보기',()=>draw(st)));
  t.append(r,aw);if(o.note)t.append(el('p',{class:'muted'},o.note));draw(st);}
/* 내 mp3 따라 치기: 파일 불러오기 + 속도 조절 + 구간 반복 */
function Mp3Player(t){const au=el('audio',{controls:'',style:'width:100%'}),fi=el('input',{type:'file',accept:'audio/*','aria-label':'mp3 파일 고르기'});
  const rate=el('input',{type:'range',min:50,max:120,value:100}),rl=el('span',{class:'score'},'속도 100%');let A=null,B=null;const msg=el('div',{class:'fb muted'},'내 폰·컴퓨터에 있는 mp3를 고르세요. 파일은 이 화면 밖으로 나가지 않아요.');
  fi.addEventListener('change',()=>{const f=fi.files[0];if(f){au.src=URL.createObjectURL(f);msg.textContent='불러왔어요: '+f.name;}});
  rate.addEventListener('input',()=>{au.playbackRate=rate.value/100;rl.textContent='속도 '+rate.value+'%';});
  au.addEventListener('timeupdate',()=>{if(A!=null&&B!=null&&au.currentTime>=B)au.currentTime=A;});
  const r=el('div',{class:'row'});r.append(btn('A 지점',()=>{A=au.currentTime;msg.textContent='A = '+A.toFixed(1)+'초';}),btn('B 지점 (반복 시작)',()=>{B=au.currentTime;msg.textContent='A~B '+A.toFixed(1)+'~'+B.toFixed(1)+'초 반복';}),btn('반복 해제',()=>{A=null;B=null;msg.textContent='반복 해제';}),el('span',{class:'muted'},'속도'),rate,rl);
  t.append(fi,au,r,msg);}
const L=(id,min,t,s,goal,an,todo,tips,build,code)=>({id,min,t,s,goal,an,todo,tips,build,code});
const REST=(id,tip)=>({id,min:5,t:'쉬는 시간',s:'손 풀기',rest:true,goal:'손목과 손가락, 머리 쉬기',an:'배운 건 쉬는 동안 머릿속에서 정리돼요.',todo:['손가락 쥐었다 펴기 10번, 손목 돌리기','물 마시기','방금 배운 것을 한 문장으로 말해 보기'],tips:[tip||'아프면 바로 멈추세요. 쉬는 것도 연습이에요.'],build:t=>{}});
const ALLG=['rock','pop','funk','shuffle','reggae','ballad','jazz'];
const ALLP=Object.keys(PROGS);

/* ===== 줄 전체 · 블록 단위로 외우기 ===== */
function stringBlocks(){return [3,2,1,0].map(si=>({name:STR[si].num+'번줄 전체 ('+STR[si].n+'줄)',dots:Array.from({length:13},(_,f)=>[si,f,noteAt(si,f),null,f===0?'root':null])}));}
function pillarBlocks(fs){return fs.map(f=>({name:f+'프렛 기둥',dots:[3,2,1,0].map(si=>[si,f,noteAt(si,f),null,null])}));}
function pairBlocks(ks){return ks.map(k=>({name:noteAt(2,k)+' 쌍둥이 (4번줄 '+(k+5)+' = 3번줄 '+k+')',dots:[[3,k+5,noteAt(3,k+5),null,null],[2,k,noteAt(2,k),null,'root']]}));}
function mapBlocks(rs,rf,D,names){const ps=positions(rs,rf).filter(p=>D.includes(p.d));return [0,1,2].map(k=>({name:names[k],dots:ps.filter(p=>p.k===k).map(p=>[p.si,p.f,noteAt(p.si,p.f),INT[p.d],p.d===0||p.d===12?'root':null])}));}
function windowBlocks(D,key,len){const set=D.map(d=>(key+d)%12);const starts=[];for(let f=0;f<12;f++)if(set.includes(NAMES.indexOf(noteAt(3,f))))starts.push(f);
  return starts.map((s,i)=>{const dots=[];for(let si=3;si>=0;si--)for(let f=s;f<s+len&&f<=NF;f++){const pc=NAMES.indexOf(noteAt(si,f));if(set.includes(pc))dots.push([si,f,NAMES[pc],INT[((pc-key)%12+12)%12],pc===key?'root':null]);}
    return{name:'블록 '+(i+1)+' (4번줄 '+s+'프렛~, '+noteAt(3,s)+' 시작)',dots};});}
function BlockMemo(tool,cfg){cfg=cfg||{};let mode=cfg.mode||'name',sel=-1,hide=false,ids=[],key=cfg.key||0,blocks=cfg.make?cfg.make(key):cfg.blocks,rev={},qz=null;
  const aw=el('div',{class:'boardwrap'}),info=el('div',{class:'prompt'}),strip=el('div',{class:'chips'}),fb=el('div',{class:'fb'}),sc=el('div',{class:'score muted'}),ans=el('div',{class:'names'});
  const hasNum=blocks.some(bl=>bl.dots.some(d=>d[3]!=null));
  const L2=d=>(mode==='num'&&d[3]!=null)?d[3]:d[2];
  const b=Board(aw,{frets:NF,onPick:(si,f)=>{blocks.forEach((bl,i)=>{if(sel>=0&&i!==sel)return;bl.dots.forEach(d=>{if(d[0]===si&&d[1]===f){rev[i+':'+si+':'+f]=true;play(si,f,0,.4);}});});if(!qz)draw();}});
  const pitchOf=d=>pitch(d[0],d[1]);
  const cur=()=>(sel>=0?[blocks[sel]]:blocks).map((bl)=>bl).map(bl=>({bl,i:blocks.indexOf(bl)}));
  function draw(){ids.forEach(clearTimeout);ids=[];b.clear();
    blocks.forEach((bl,i)=>{if(sel>=0&&i!==sel){bl.dots.forEach(d=>b.dot(d[0],d[1],'','dim'));return;}
      bl.dots.forEach(d=>{const hid=hide&&!rev[i+':'+d[0]+':'+d[1]];b.dot(d[0],d[1],hid?'?':L2(d),hid?'q':(d[4]==='root'?'root':(i%2?'warn':'note')));});});
    strip.innerHTML='';const all=[];cur().forEach(({bl,i})=>bl.dots.forEach(d=>all.push([d,i])));all.sort((a,c)=>pitchOf(a[0])-pitchOf(c[0])||a[0][0]-c[0][0]);
    all.forEach(([d,i])=>{const hid=hide&&!rev[i+':'+d[0]+':'+d[1]];strip.append(el('span',{class:'chip'},hid?'?':L2(d)));});
    info.textContent=sel<0?'블록 전체 ('+blocks.length+'개). 블록 이름을 눌러 하나씩 보세요.':blocks[sel].name;}
  const bar=el('div',{class:'row'});
  function mkBar(){bar.innerHTML='';bar.append(btn('전체',()=>{sel=-1;qz=null;draw();},sel<0?'on':''));blocks.forEach((bl,i)=>bar.append(btn(bl.name.split(' (')[0],()=>{sel=i;qz=null;draw();mkBar();},sel===i?'on':'')));}
  const ctl=el('div',{class:'row'});
  const hb=chk('이름 가리고 떠올리기 (점을 누르면 이름이 나와요)',false,v=>{hide=v;rev={};draw();});
  ctl.append(btn('▶ 순서대로 소리+불빛',()=>{qz=null;ids.forEach(clearTimeout);ids=[];b.clear();const all=[];cur().forEach(({bl,i})=>bl.dots.forEach(d=>all.push([d,i])));all.sort((a,c)=>pitchOf(a[0])-pitchOf(c[0]));
      all.forEach(([d,i],k)=>ids.push(setTimeout(()=>{b.dot(d[0],d[1],L2(d),d[4]==='root'?'root':(i%2?'warn':'note'));play(d[0],d[1],0,.4);},k*420)));},'primary'),hb);
  if(hasNum)ctl.append(btn('번호 ↔ 음 이름',()=>{mode=mode==='num'?'name':'num';draw();}));
  if(cfg.make){const ks=sel_('키',NAMES.map((n,i)=>[i,SHOW[n]||n]),key,v=>{key=+v;blocks=cfg.make(key);sel=-1;rev={};qz=null;mkBar();draw();});ctl.append(ks);}
  function sel_(a,o,v,f){return sel2(a,o,v,f);}
  /* 빈칸 채우기 퀴즈 */
  function quizStart(){const pool=[];cur().forEach(({bl,i})=>bl.dots.forEach(d=>pool.push([d,i])));const t=pool.sort(()=>Math.random()-.5).slice(0,Math.min(3,pool.length));qz={t,k:0,score:0,tries:0};hide=false;qshow();}
  function qshow(){b.clear();const target=qz.t[qz.k];blocks.forEach((bl,i)=>{if(sel>=0&&i!==sel)return;bl.dots.forEach(d=>{const isT=qz.t.some(x=>x[0]===d),done=qz.t.slice(0,qz.k).some(x=>x[0]===d);
      b.dot(d[0],d[1],(isT&&!done)?(target[0]===d?'?':'·'):L2(d),(isT&&!done)?(target[0]===d?'q':'dim'):'note');});});
    info.textContent='? 에 들어갈 '+(mode==='num'?'음정 번호':'음 이름')+'은? ('+(qz.k+1)+'/'+qz.t.length+')';}
  const choices=()=>mode==='num'?['R','b2','2','b3','3','4','b5','5','b6','6','b7','7','8']:NAMES;
  function mkAns(){ans.innerHTML='';choices().forEach(c=>ans.append(btn(mode==='num'?c:(SHOW[c]||c),()=>{if(!qz)return;const t=qz.t[qz.k];qz.tries++;const ok=L2(t[0])===c;chime(ok);
      if(ok){qz.score++;fb.className='fb ok';fb.textContent='정답!';qz.k++;if(qz.k>=qz.t.length){fb.textContent='한 라운드 끝! '+qz.score+'/'+qz.tries+' (시도) — 다시 누르면 새 빈칸이 나와요.';qz=null;draw();}else qshow();}
      else{fb.className='fb no';fb.textContent='아쉬워요. 이름 가리기를 끄고 블록을 다시 보고 오세요.';}})));}
  ctl.append(btn('✏ 빈칸 채우기 퀴즈',()=>{mkAns();quizStart();}));
  tool.append(bar,ctl,info,strip,aw,ans,fb);mkBar();draw();}
function sel2(label,opts,val,fn){const l=el('label',{class:'sel'},'<span class="muted">'+label+'</span> ');const s=el('select');opts.forEach(([v,t])=>{const o=el('option',{value:v},t);if(v==val)o.selected=true;s.append(o);});s.addEventListener('change',()=>fn(s.value));l.append(s);return l;}
const memo=cfg=>t=>BlockMemo(t,cfg);

function rectBlock(name,strs,fa,fb,naturalsOnly){const dots=[];strs.forEach(si=>{for(let f=fa;f<=fb;f++){const n=noteAt(si,f);if(naturalsOnly&&!isNat(n))continue;dots.push([si,f,n,null,null]);}});return{name,dots};}
function multiBlocks(){return[rectBlock('4·3번줄 두 줄 세트 (0~5프렛)',[3,2],0,5,true),rectBlock('3·2번줄 두 줄 세트 (0~5프렛)',[2,1],0,5,true),rectBlock('2·1번줄 두 줄 세트 (0~5프렛)',[1,0],0,5,true),rectBlock('네 줄 사각형 1 (0~5프렛)',[3,2,1,0],0,5,true),rectBlock('네 줄 사각형 2 (5~10프렛)',[3,2,1,0],5,10,true),rectBlock('네 줄 사각형 3 (7~12프렛)',[3,2,1,0],7,12,true)];}
function chainSteps(){const mk=(si,upto)=>Array.from({length:upto+1},(_,f)=>[si,f,noteAt(si,f),'note']).filter(d=>isNat(d[2]));
  return[{cap:'① 4번줄 개방~5프렛: E F G A (5프렛이 A)',dots:mk(3,5),play:[0,1,3,5]},
   {cap:'② 5프렛 끝에서 한 줄 위로! 3번줄 개방이 바로 A (같은 음) → A B C D',dots:mk(3,5).concat(mk(2,5)),links:[[[3,5],[2,0]]],play:[5,7,8,10]},
   {cap:'③ 같은 방식으로 2번줄 → D E F G',dots:mk(3,5).concat(mk(2,5),mk(1,5)),links:[[[3,5],[2,0]],[[2,5],[1,0]]],play:[10,12,13,15]},
   {cap:'④ 1번줄 → G A B C. 네 줄이 한 줄처럼 이어졌어요!',dots:mk(3,5).concat(mk(2,5),mk(1,5),mk(0,5)),links:[[[3,5],[2,0]],[[2,5],[1,0]],[[1,5],[0,0]]],play:[15,17,19,20]}];}

/* 챕터 마무리: 음악과 함께 따라 하는 종합 실습 + 종합 퀴즈 */
const FINAL=(id,cfg,qs)=>L(id,20,'마무리: 음악과 함께 따라 하기','종합 실습 + 종합 퀴즈','이 챕터에서 배운 것을 반주 음악에 맞춰 단계별로 따라 하고, 종합 퀴즈로 점검하기',
  '합창 연습처럼 선생님(반주)이 박자를 주면 한 단계씩 따라 해요. 먼저 보고 듣고, 같이 치고, 마지막엔 혼자 쳐 봐요.',
  ['▶를 눌러 STEP 1부터 차례로 따라 하기 (TAB의 빨간 선과 지판의 불빛을 따라가요)','STEP 3·4에서는 베이스 소리가 꺼져요 — 내가 직접 치는 시간','끝나면 아래 종합 퀴즈 풀기'],
  ['처음엔 STEP 1~2만 몇 번 반복해도 좋아요. 몸에 익으면 다음 단계로 넘어가세요.','틀려도 멈추지 말고 다음 마디에서 다시 들어오세요. 합주의 기본이에요.'],
  both(studio(Object.assign({hand:true,progs:ALLP,grooves:ALLG},cfg)),quiz(qs)));
const GSTEPS=(A,B,s1,s2,s3,s4)=>[{t:'눈으로 보고 듣기',say:s1,line:A,loops:2},{t:'같이 따라 치기',say:s2,line:A,loops:2},{t:'혼자 치기',say:s3,line:A,loops:2,bass:false},{t:'내 버전으로',say:s4,line:B,loops:2,bass:false}];

/* ===== 라인 수정 레시피 ===== */
const setAt=(ns,s,p,l,t)=>{ns=ns.filter(n=>n.s!==s);ns.push({s,l:l||2,p,t});return ns;};
const MODS=[
 {id:'appr',n:'마디 끝에 접근음 (다음 루트의 반음 아래)',fn:(ns,q,nx)=>setAt(ns.filter(n=>n.s<14),14,tgt(nx)-1,2)},
 {id:'five',n:'3박(9번째 칸)을 5도로 바꾸기',fn:(ns,q)=>setAt(ns,8,7,4)},
 {id:'third',n:'2박(5번째 칸)에 3도 넣기',fn:(ns,q)=>setAt(ns,4,third(q),4)},
 {id:'oct',n:'7번째 칸에 옥타브 점프',fn:(ns,q)=>setAt(ns,6,12,2)},
 {id:'seven',n:'4박(13번째 칸)에 7도(또는 b7)',fn:(ns,q)=>setAt(ns,12,sev(q),2)},
 {id:'ghost',n:'빈 16분 자리에 고스트노트',fn:ns=>{[3,7,11,15].forEach(s=>{if(!ns.some(n=>n.s<=s&&n.s+n.l>s))ns.push({s,l:1,p:0,t:'g'});});return ns;}},
 {id:'rest',n:'숨 쉬기: 3번째·11번째 칸 쉬기',fn:ns=>ns.filter(n=>n.s!==2&&n.s!==10)},
 {id:'sync',n:'당김음: 3박 음을 한 칸 앞당기기',fn:ns=>ns.map(n=>n.s===8?Object.assign({},n,{s:7,l:n.l+1}):n)}
];

/* ===== 대중음악 사례집 ===== */
function SongLab(tool,songs,cfg){cfg=cfg||{};const progs=[...new Set(songs.map(x=>x.prog))];const holder=el('div',{class:'tool'});
  const api=LineStudio(holder,{progs,prog:songs[0].prog,key:songs[0].key||0,groove:songs[0].groove||'rock',grooves:ALLG,lines:Object.keys(LINES),line:songs[0].line||'root8',bpm:songs[0].bpm||80,hand:true,mods:cfg.mods,bases:cfg.bases,
    scales:[['메이저',MODES.maj],['마이너',MODES.min],['메이저 펜타',MODES.majpent],['마이너 펜타',MODES.minpent],['블루스',MODES.blues],['도리안',MODES.dor],['믹솔리디안',MODES.mix]]});
  tool.append(el('p',{class:'muted'},'⚠ 이 사례집은 곡의 키·코드 진행·베이스의 역할을 정리한 것이에요. 정확한 음과 리듬은 원곡 음원과 공식 악보/TAB으로 꼭 확인하세요. 아래 반주는 같은 코드 진행으로 만든 연습용 합성 반주예요(원곡 음원이 아니에요).'),holder);
  songs.forEach(sg=>{const d=el('details',{class:'song'});d.append(el('summary',null,'<b>'+sg.t+'</b> <span class="chip">'+sg.tag+'</span>'));
    const body=el('div',{class:'songbody'});
    body.innerHTML='<table class="tt"><tr><th>키</th><td>'+sg.keyName+'</td><th>진행</th><td>'+sg.progText+'</td></tr></table>'+
      '<p><b>사용된 도구</b> '+sg.tools.map(x=>'<span class="chip on">'+x+'</span>').join(' ')+'</p>'+
      (sg.facts?'<p><b>곡에서 확인된 사실</b></p><ul>'+sg.facts.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+'<p><b>이 진행 위에서 이렇게 써 보세요</b></p><ul>'+sg.apply.map(x=>'<li>'+x+'</li>').join('')+'</ul>'+
      (sg.notes?'<p><b>눌러 볼 음</b></p><ul>'+sg.notes.map(x=>'<li>'+x+'</li>').join('')+'</ul>':'')+
      (sg.try?'<p><b>내 연습 과제</b> '+sg.try+'</p>':'');
    body.append(btn('▶ 이 진행으로 연습하기',()=>{api.set({key:sg.key,prog:sg.prog,groove:sg.groove,line:sg.line,bpm:sg.bpm});holder.scrollIntoView({behavior:'smooth',block:'center'});},'primary'));
    d.append(body);tool.append(d);});}
/* ===== 음정 귀 훈련 ===== */
function EarTrainer(tool,cfg){cfg=cfg||{};const IV=cfg.ivs||[[3,'단3도'],[4,'장3도'],[5,'완전4도'],[7,'완전5도'],[9,'장6도'],[10,'단7도'],[12,'옥타브']];
  const pr=el('div',{class:'prompt'},'▶ 소리 듣기를 누르고 두 음 사이의 음정을 골라요'),fb=el('div',{class:'fb'}),sc=el('div',{class:'score muted'}),ob=el('div',{class:'row'});let cur=null,score=0,tries=0,mode='up';
  const play2=()=>{if(!cur)return;const base=cur.b;if(mode==='both'){playPitch(base,0,.9);playPitch(base+cur.d,0,.9);}else{playPitch(base,0,.5);playPitch(base+(mode==='down'?-cur.d:cur.d),.6,.7);}};
  const next=()=>{const d=rnd(IV)[0];cur={d,b:12+Math.floor(Math.random()*10)};fb.textContent='';fb.className='fb';play2();};
  IV.forEach(([d,n])=>ob.append(btn(n,()=>{if(!cur)return;tries++;const ok=cur.d===d;chime(ok);if(ok)score++;fb.className='fb '+(ok?'ok':'no');fb.textContent=ok?'정답! '+n+' ('+d+'칸)':'아쉬워요. 정답은 '+IV.find(x=>x[0]===cur.d)[1]+' ('+cur.d+'칸)';sc.textContent='맞힘 '+score+' / 시도 '+tries;setTimeout(next,1400);})));
  const r=el('div',{class:'row'});r.append(btn('▶ 소리 듣기 / 다시 듣기',()=>{if(!cur)next();else play2();},'primary'),sel2('방향',[['up','올라가며'],['down','내려가며'],['both','동시에']],'up',v=>{mode=v;}));
  tool.append(r,pr,ob,fb,sc);}
/* ===== EQ 랩: 톤 만들기 ===== */
function EqLab(tool){const bands=[['저음 (80Hz)',80,'lowshelf'],['중저음 (250Hz)',250,'peaking'],['중음 (900Hz)',900,'peaking'],['고음 (3.5kHz)',3500,'highshelf']];let vals=[0,0,0,0],nodes=[],osc=null,ti=null,playing=false;
  const bars=el('div',{class:'eqbars'});const sl=bands.map((b,i)=>{const w=el('label',{class:'sel'},'<span class="muted" style="min-width:110px">'+b[0]+'</span>');const r=el('input',{type:'range',min:-12,max:12,value:0});const v=el('span',{class:'score'},'0 dB');
    r.addEventListener('input',()=>{vals[i]=+r.value;v.textContent=(vals[i]>0?'+':'')+vals[i]+' dB';try{if(nodes[i])nodes[i].gain.value=vals[i];}catch(e){}draw();});w.append(r,v);bars.append(w);return r;});
  const cv=mk('svg',{viewBox:'0 0 360 90',role:'img','aria-label':'EQ 모양'});const wrap=el('div',{class:'handwrap'});wrap.append(cv);
  function draw(){cv.innerHTML='';mk('line',{x1:10,y1:45,x2:350,y2:45,stroke:'var(--board-line)'},cv);vals.forEach((v,i)=>{const x=50+i*85,h=v*3;mk('rect',{x:x-18,y:v>=0?45-h:45,width:36,height:Math.abs(h)||1,fill:v>=0?'var(--accent)':'var(--warn)',rx:4},cv);const t=mk('text',{x,y:86,class:'lab','text-anchor':'middle'},cv);t.textContent=['저','중저','중','고'][i];});}
  function startSnd(){try{const c=AC();osc=c.createOscillator();osc.type='sawtooth';const g=c.createGain();g.gain.value=.25;let prev=g;nodes=bands.map((b,i)=>{const f=c.createBiquadFilter();f.type=b[2];f.frequency.value=b[1];f.gain.value=vals[i];prev.connect(f);prev=f;return f;});const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=5000;prev.connect(lp);lp.connect(c.destination);osc.connect(g);osc.start();
    const pat=[0,0,7,5,0,0,10,7];let k=0;ti=setInterval(()=>{try{osc.frequency.setValueAtTime(82.41*2*Math.pow(2,(pat[k++%8]+5)/12),c.currentTime);}catch(e){}},260);playing=true;pb.textContent='■ 정지';}catch(e){}}
  function stopSnd(){try{osc&&osc.stop();}catch(e){}clearInterval(ti);playing=false;pb.textContent='▶ 소리 듣기 (톱니파 베이스 + EQ)';}
  const pb=btn('▶ 소리 듣기 (톱니파 베이스 + EQ)',()=>{playing?stopSnd():startSnd();},'primary');
  const pre=el('div',{class:'row'},'<span class="muted">프리셋</span>');
  [['따뜻한 핑거',[3,2,-2,-3]],['록 피크',[2,0,2,3]],['슬랩 스쿱',[6,-4,-6,6]],['믹스에서 또렷하게',[-2,0,4,2]],['평평(0)',[0,0,0,0]]].forEach(([n,v])=>pre.append(btn(n,()=>{vals=v.slice();sl.forEach((r,i)=>{r.value=vals[i];r.dispatchEvent(new Event('input'));});})));
  tool.append(pb,pre,bars,wrap);draw();}
