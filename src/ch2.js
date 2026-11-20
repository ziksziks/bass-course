const LESSONS=[
 {id:'m1',min:10,t:'루트에서 5도·옥타브',s:'복습 + 기준점',
  tips:["5도는 \"한 줄 위, 두 칸 오른쪽\", 옥타브는 \"두 줄 위, 두 칸 오른쪽\"이에요.", "루트→5도→옥타브는 밴드 베이스의 기본 무기예요. 거의 모든 곡에서 써요."],
  goal:'루트를 정하면 5도(한 줄 위 +2)와 옥타브(두 줄 위 +2)를 바로 짚기',
  an:'루트는 "반장"이에요. 반장 자리를 정하면 5도는 "한 층 위, 두 칸 오른쪽 짝꿍", 옥타브는 "두 층 위, 두 칸 오른쪽 형"이에요. 앞으로 모든 번호는 반장 자리에서 시작해요.',
  todo:['루트 줄과 프렛을 바꿔 가며 5도·옥타브 위치 보기','실제 베이스로 루트→5도→옥타브를 천천히 치기','퀴즈 맞힘 10개'],
  code:`# 5도 = 루트에서 7칸(반음), 옥타브 = 12칸
NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
root = NOTES.index('C')
print('5도:', NOTES[(root + 7) % 12])      # G
print('옥타브:', NOTES[(root + 12) % 12])  # C (같은 이름)`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});
    const draw=st=>{drawMap(b,st.rs,st.rf,{pick:p=>[0,7,12].includes(p.d)});b.link([st.rs,st.rf],[st.rs-1,st.rf+2]);b.link([st.rs,st.rf],[st.rs-2,st.rf+2]);};
    const st=rootPicker(t,draw);
    const r=el('div',{class:'row'});r.append(btn('소리 듣기: 루트 → 5도 → 옥타브',()=>{const p=pitch(st.rs,st.rf);[0,7,12].forEach((d,i)=>playPitch(p+d,i*.6));},'primary'));
    t.append(r,aw,el('p',{class:'muted'},'점선이 "5도로 가는 길"과 "옥타브로 가는 길"이에요. 두 길 모두 오른쪽으로 두 칸!'));draw(st);
    const q=el('div',{class:'tool'});t.append(q);mapQuiz(q,{pool:[7,12]});}},
 {id:'m2',min:20,t:'음정 지도 (투명 번호판)',s:'루트 주변 13칸',
  tips:["처음엔 3(장3도) 하나만 외우세요: 한 줄 위, 한 칸 왼쪽. 곡이 밝은지 어두운지를 이 음이 정해요.", "3과 b3은 한 칸 차이예요. 번갈아 쳐서 밝고 어두운 소리를 귀로 비교해 보세요."],
  goal:'루트 주변 13칸의 번호(R b2 2 b3 3 4 b5 5 b6 6 b7 7 8) 위치 익히기',
  an:'루트 위에 투명한 번호판을 올려 놓았어요. 판은 세 줄짜리예요: 같은 줄(R~b3), 한 줄 위(b3~b6), 두 줄 위(b6~8). 번호판은 루트가 어디든 똑같고, 루트가 움직이면 판이 통째로 따라와요.',
  todo:['①②③ 버튼으로 세 줄을 하나씩 켜 보기','4번줄 루트와 3번줄 루트로 바꿔도 모양이 같은지 확인','3(장3도)·5·b7·8 네 개는 눈 감고 말해 보기','퀴즈 맞힘 15개'],
  code:`# 음정 이름표: 루트에서 몇 칸(반음) 떨어졌나
NAMES = {0:'R',1:'b2',2:'2',3:'b3',4:'3',5:'4',6:'b5',
         7:'5',8:'b6',9:'6',10:'b7',11:'7',12:'8'}
# 한 줄 위는 줄이 5칸 높으니까 프렛은 (칸 수 - 5)
def fret(semitones, strings_up):
    return semitones - 5 * strings_up
print(NAMES[4], fret(4, 1))   # 3  -1 (한 줄 위, 한 칸 왼쪽)`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let ks=[0],mode='num';
    const draw=st=>drawMap(b,st.rs,st.rf,{ks,mode});
    const st=rootPicker(t,draw);
    const getMode=modeBar(t,m=>{mode=m;draw(st);},NUMNAME);
    const r=el('div',{class:'row'});
    [['① 같은 줄',[0]],['② 한 줄 위까지',[0,1]],['③ 두 줄 위까지(전체)',[0,1,2]]].forEach(([tx,k])=>r.append(btn(tx,()=>{ks=k;draw(st);})));
    r.append(btn('소리: 번호판 훑기',()=>{const p=pitch(st.rs,st.rf);for(let d=0;d<=12;d++)playPitch(p+d,d*.35,.4);},'primary'));
    t.append(r,aw,el('p',{class:'muted'},'3은 장3도(한 줄 위, 한 칸 왼쪽), b3은 단3도(같은 줄 +3 또는 한 줄 위 두 칸 왼쪽)예요. 같은 번호가 두 자리에 있을 수 있어요.'));draw(st);
    const q=el('div',{class:'tool'});t.append(q);mapQuiz(q,{pool:[3,4,5,7,9,10,11,12]});}},
 {id:'m3',min:20,t:'메이저 스케일 = 구멍 카드',s:'온온반온온온반',
  tips:["메이저 간격은 \"온온반 온온온반\". 반음은 3→4, 7→8 두 군데뿐이에요.", "도레미파솔라시도로 노래하면서 치면 귀도 같이 훈련돼요."],
  goal:'번호판 위에 "메이저 구멍 카드"를 씌우고 1 2 3 4 5 6 7 8을 소리 내며 올라가기',
  an:'번호판에는 13개 번호가 다 있어요. 구멍 카드는 그중 8개(R 2 3 4 5 6 7 8)만 뚫려 있어요. 스케일은 "구멍으로 보이는 번호들"이고, 간격은 온·온·반·온·온·온·반(반음은 3→4, 7→8 두 군데뿐)이에요.',
  todo:['"구멍 카드 씌우기" 애니메이션 보기','번호를 말하며 한 칸씩 따라 치기 (1 2 3 4 5 6 7 8)','반음 구간(3→4, 7→8)에서 손가락이 붙는 걸 느껴 보기','"번호판 vs 구멍 카드" 차이를 내 말로 설명해 보기'],
  code:`NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
STEPS = [2, 2, 1, 2, 2, 2, 1]   # 온 온 반 온 온 온 반
def major(root):
    pos, out = NOTES.index(root), [root]
    for s in STEPS:
        pos += s
        out.append(NOTES[pos % 12])
    return out
print(major('C'))  # ['C','D','E','F','G','A','B','C']`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let ids=[],mode='num';
    const labels=['온','온','반','온','온','온','반'];const chips=el('div',{class:'chips'});
    const cs=labels.map(x=>{const c=el('span',{class:'chip'+(x==='반'?' half':'')},x==='반'?'반':'온');chips.append(c);return c;});
    const st=rootPicker(t,()=>show(),[2,3]);
    modeBar(t,m=>{mode=m;show();},NUMNAME);
    function stop(){ids.forEach(clearTimeout);ids=[];cs.forEach(c=>c.classList.remove('on'));}
    function show(){stop();drawMap(b,st.rs,st.rf,{showDim:true,mode});}
    function run(){stop();const ps=positions(st.rs,st.rf);b.clear();ps.forEach(p=>b.dot(p.si,p.f,mode==='name'?noteAt(p.si,p.f):INT[p.d],'dim'));
      const base=pitch(st.rs,st.rf);
      MAJ.forEach((d,i)=>ids.push(setTimeout(()=>{ps.filter(p=>p.d===d).forEach(p=>b.dot(p.si,p.f,mode==='name'?noteAt(p.si,p.f):INT[p.d],(d===0||d===12)?'root':'note'));
        playPitch(base+d,0,.5);cs.forEach((c,j)=>c.classList.toggle('on',j===i-1));},1200+i*750)));}
    const r=el('div',{class:'row'});
    r.append(btn('① 번호판만 보기',show),btn('② 구멍 카드 씌우고 올라가기',run,'primary'));
    t.append(r,aw,el('div',{class:'row'},'<span class="muted">간격</span>'),chips);
    t.append(el('p',{class:'muted'},'회색 점선 = 카드에 가려진 번호(b2 b3 b5 b6 b7). 파란 점 = 구멍으로 보이는 스케일 음. 기본 루트는 3번줄 3프렛(C) → C 메이저예요.'));show();}},
 {id:'m4',min:20,t:'이동형 메이저 모양',s:'루트 중지, 8개 음',
  tips:["루트에 중지를 올리면 검지는 한 칸 왼쪽, 약지·새끼는 오른쪽. \"중지가 루트\"만 기억하세요.", "메트로놈 60에서 시작하세요. 빠르게는 나중에, 정확한 소리가 먼저예요."],
  goal:'루트 중지 기준 손 모양 하나로 메이저 스케일을 올라가고 내려오기',
  an:'구멍 카드를 손가락에 끼운 셈이에요. 루트에 중지를 올리면 검지는 한 칸 왼쪽, 약지는 한 칸 오른쪽, 새끼는 두 칸 오른쪽. 이 손 모양은 책가방처럼 어디든 들고 다녀요.',
  todo:['손가락 번호(1검지·2중지·3약지·4새끼) 보며 천천히 올라가기','루트 프렛을 바꿔 같은 모양을 옮겨 보기','메트로놈 60에서 한 음당 한 박, 올라갈 때 번호 말하기 (1 2 3 4 5 6 7 8)'],
  code:`# 이동형 모양: (몇 줄 위, 루트 대비 프렛 차이)
SHAPE = [(0,0),(0,2),(1,-1),(1,0),(1,2),(2,-1),(2,1),(2,2)]
def where(root_fret):
    return [(k, root_fret + d) for k, d in SHAPE]
print(where(3))  # 루트가 3프렛이면: 3번줄 3프렛 출발 = C 메이저`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let ids=[],mode='finger';
    const stop=()=>{ids.forEach(clearTimeout);ids=[];};
    const draw=st=>{stop();drawMap(b,st.rs,st.rf,{pick:inShape,mode});};
    const st=rootPicker(t,draw,[2,3]);
    modeBar(t,m=>{mode=m;draw(st);},[['finger','손가락 번호'],['num','음정 번호'],['name','음 이름']]);
    const r=el('div',{class:'row'});
    r.append(btn('올라가며 소리',()=>{stop();b.clear();const ps=positions(st.rs,st.rf).filter(inShape),base=pitch(st.rs,st.rf);
      MAJ.forEach((d,i)=>ids.push(setTimeout(()=>{const p=ps.find(q=>q.d===d);b.dot(p.si,p.f,mode==='name'?noteAt(p.si,p.f):mode==='finger'?(FING[p.f-st.rf]||'0'):INT[p.d],d===0||d===12?'root':'note');playPitch(base+d,0,.5);},i*600)));},'primary'),
      btn('내려오며 소리',()=>{stop();b.clear();const ps=positions(st.rs,st.rf).filter(inShape),base=pitch(st.rs,st.rf);
      MAJ.slice().reverse().forEach((d,i)=>ids.push(setTimeout(()=>{const p=ps.find(q=>q.d===d);b.dot(p.si,p.f,mode==='name'?noteAt(p.si,p.f):mode==='finger'?(FING[p.f-st.rf]||'0'):INT[p.d],d===0||d===12?'root':'note');playPitch(base+d,0,.5);},i*600)));}),
      btn('모양 전체 보기',()=>draw(st)));
    t.append(r,aw,el('p',{class:'muted'},'2번줄 루트(3번줄 3프렛 등)와 1번줄 루트 모양이 같다는 것도 확인해 보세요. 루트 줄을 바꿔도 모양은 그대로예요. 점 안의 0은 개방현(손가락 없음)이에요.'));draw(st);}},
 L('mb1',15,'번호판을 블록 3개로','한 덩어리로 읽기','루트 주변 13칸 번호판을 "같은 줄·한 줄 위·두 줄 위" 세 블록으로 묶어 외우기',
  '번호판은 13칸이지만 낱개로 외우면 어려워요. 3층짜리 집으로 생각해요. 1층(같은 줄)은 R b2 2 b3, 2층(한 줄 위)은 b3 3 4 b5 5 b6, 3층(두 줄 위)은 b6 6 b7 7 8. 층 단위로 외우면 한 번에 3~6칸씩 머리에 들어가요.',
  ['블록(층)을 하나씩 켜서 번호 읽기','소리 순서대로 재생하며 불빛 따라가기','이름 가리고 떠올리기 → 빈칸 채우기 퀴즈'],
  ['1층 3개, 2층 6개, 3층 5개로 기억하세요. 가운데 층이 가장 크고 가장 자주 써요.','한 번에 한 층씩 완벽하게 → 두 층 → 세 층 순서로 늘리세요.'],
  memo({mode:'num',blocks:mapBlocks(2,3,[0,1,2,3,4,5,6,7,8,9,10,11,12],['1층: 같은 줄 (R b2 2 b3)','2층: 한 줄 위 (b3 3 4 b5 5 b6)','3층: 두 줄 위 (b6 6 b7 7 8)'])})),
 {id:'m5',min:5,t:'쉬는 시간',s:'손 풀기',rest:true,
  tips:["쉬는 동안 메트로놈만 켜 놓고 머릿속으로 1 2 3 4 5 6 7 8을 세어 보세요."],
  goal:'손목과 손가락 쉬기',
  an:'머릿속 번호판도 쉬면서 정리돼요. 쉬는 동안 "루트에서 5도는 한 줄 위 +2칸" 같은 규칙을 한 번만 되뇌어 보세요.',
  todo:['손가락 쥐었다 펴기 10번, 손목 돌리기','물 마시기','머릿속으로 번호판 그려 보기: 3은 한 줄 위 왼쪽 한 칸'],build:t=>{}},
 {id:'m6',min:15,t:'키 바꾸기 = 판 밀기',s:'12개 키',
  tips:["곡에 자주 나오는 G·D·A·E·C 키부터 외우면 효율적이에요.", "루트 프렛 찾는 법은 그냥 4번줄(또는 3번줄)에서 그 음 이름을 찾는 거예요."],
  goal:'어떤 키가 나와도 루트 위치를 찾고 같은 모양으로 메이저 스케일 치기',
  an:'번호판은 그대로고 반장 자리만 옮겨요. 반장이 C에서 D로 가면 판이 오른쪽으로 두 칸 밀려요. 모양은 하나, 키는 열두 개.',
  todo:['"한 칸씩 밀기"로 C부터 B까지 12키 구경하기','4번줄 루트 / 3번줄 루트 두 자리 모두 찾아 보기','G, D, A, F 키 메이저 스케일을 내 손으로 치기'],
  code:`NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
E, A = 4, 9   # 개방현 음 번호 (C=0)
def root_fret(key, open_string):
    return (NOTES.index(key) - open_string) % 12
print(root_fret('G', E), root_fret('G', A))  # 3 10`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let key=0,rs=3,mode='num',iv=null;
    const info=el('div',{class:'prompt'}),kb=el('div',{class:'names'});
    const scaleOf=k=>MAJ.slice(0,7).map(d=>NAMES[(k+d)%12]);
    const rf=()=>{let f=(key-STR[rs].o+12)%12;if(f<1)f+=12;return f;};
    function draw(){const f=rf();drawMap(b,rs,f,{pick:inMaj,showDim:true,mode});
      info.textContent=NAMES[key]+' 메이저 — 루트: '+STR[rs].num+'번줄 '+f+'프렛 · '+scaleOf(key).join(' ');
      kbs.forEach((x,i)=>x.classList.toggle('on',i===key));}
    const kbs=NAMES.map((n,i)=>{const x=btn(SHOW[n]||n,()=>{stopSlide();key=i;draw();playPitch(pitch(rs,rf()),0,.6);});kb.append(x);return x;});
    function stopSlide(){if(iv){clearInterval(iv);iv=null;}}
    const r=el('div',{class:'row'});
    const sb=[3,2].map(si=>btn(STR[si].num+'번줄 루트',()=>{rs=si;sb.forEach((x,i)=>x.classList.toggle('on',[3,2][i]===rs));draw();}));sb[0].classList.add('on');
    r.append(...sb,btn('한 칸씩 밀기 (C→B)',()=>{stopSlide();key=0;draw();playPitch(pitch(rs,rf()),0,.5);iv=setInterval(()=>{key++;if(key>=12){stopSlide();key=11;}draw();playPitch(pitch(rs,rf()),0,.5);},1100);},'primary'),
      btn('스케일 소리',()=>{const base=pitch(rs,rf());MAJ.forEach((d,i)=>playPitch(base+d,i*.45,.45));}));
    t.append(kb,r);modeBar(t,m=>{mode=m;draw();},NUMNAME);t.append(info,aw,el('p',{class:'muted'},'3번줄 루트와 4번줄 루트는 같은 음 다른 자리예요. 두 자리를 다 알면 어디서 시작하든 편한 위치를 고를 수 있어요.'));draw();}},
 {id:'m7',min:20,t:'번호 게임',s:'60초 + 음 이름 퀴즈',
  tips:["틀리면 \"한 줄 위인지 두 줄 위인지\"부터 다시 생각하세요.", "키별 1·3·5번 음이 코드(도미솔)의 재료예요. 나중에 아르페지오로 연결돼요."],
  goal:'루트가 어디든 3초 안에 원하는 번호를 짚고, 키별 n번 음의 이름을 바로 말하기',
  an:'이제 번호판 시험이에요. 모르면 "루트로 돌아가서 한 줄 위·두 줄 위를 센다"는 작전을 쓰세요. 번호 → 위치(지도), 번호 → 이름(스케일) 두 가지 모두 연습해요.',
  todo:['60초 게임 3판 (판마다 점수와 자주 놓친 음정 적기)','음 이름 퀴즈 맞힘 15개','틀린 음정은 번호판에서 다시 찾아 베이스로 5번씩 치기'],
  code:`DEGREE = {1:0, 2:2, 3:4, 4:5, 5:7, 6:9, 7:11}   # 번호 → 반음
def degree_note(key, n):
    return NOTES[(NOTES.index(key) + DEGREE[n]) % 12]
print(degree_note('G', 3))  # B`,
  build:t=>{const a=el('div',{class:'tool'}),c=el('div',{class:'tool'});
    t.append(el('h3',{style:'margin:0;font-size:17px'},'A. 60초 번호 찾기 게임'),a,el('h3',{style:'margin:0;font-size:17px'},'B. 키별 번호 → 음 이름'),c);
    mapQuiz(a,{timed:true,pool:[3,4,5,7,9,10,11,12]});degreeQuiz(c);}},
 {id:'m8',min:10,t:'정리 + 키 안의 코드',s:'1 5 6 4',
  tips:["곡의 키만 알면 코드 이름 대신 번호(1-5-6-4)로 생각하세요. 키가 바뀌어도 그대로 써요.", "처음에는 코드마다 루트만 쳐도 충분히 좋은 베이스 라인이에요."],
  goal:'키 안의 7개 코드를 번호로 말하고, 코드 진행의 루트 위치 찾기',
  an:'스케일 7친구가 곧 그 키의 코드 7개예요. 1번은 반장 C, 5번은 G, 6번은 Am, 4번은 F. 곡이 키만 바뀌면 번호는 그대로예요 — 그래서 번호로 생각하면 키가 바뀌어도 걱정 없어요.',
  todo:['키를 골라 7개 코드 이름 확인하기 (1·4·5는 메이저, 2·3·6은 마이너)','"1-5-6-4"를 4번줄 루트로 쳐 보기','같은 가족 바꿔 보기: 1↔6, 4↔2, 5↔3','다음 시간: 마이너 스케일 (3·6·7을 내린다)'],
  code:`QUAL = ['', 'm', 'm', '', '', 'm', 'dim']
scale = major('C')[:7]          # 앞에서 만든 major()
print([n + q for n, q in zip(scale, QUAL)])
# ['C','Dm','Em','F','G','Am','Bdim']`,
  build:t=>{const aw=el('div',{class:'boardwrap'});const b=Board(aw,{frets:NF});let key=0,ids=[];
    const QUAL=['','m','m','','','m','dim'];const kb=el('div',{class:'names'});
    const chord=(k,i)=>NAMES[(k+MAJ[i])%12]+QUAL[i];
    const tbl=el('table',{class:'ch'});const info=el('div',{class:'prompt'});
    const rootF=pc=>(pc-4+12)%12; // 4번줄 프렛
    function showRoot(i,snd){b.clear();const pc=(key+MAJ[i])%12;[3,2].forEach(si=>{for(let f=0;f<=NF;f++)if(noteAt(si,f)===NAMES[pc])b.dot(si,f,NAMES[pc],si===3?'root':'note');});
      if(snd)playPitch(pitch(3,rootF(pc)),0,.6);}
    function render(){tbl.innerHTML='';const h=el('tr'),r1=el('tr'),r2=el('tr');
      for(let i=0;i<7;i++){h.append(el('th',{},String(i+1)));const td=el('td');td.append(btn(chord(key,i),()=>showRoot(i,true)));r1.append(td);r2.append(el('td',{class:'muted'},[0,3,4].includes(i)?'메이저':i===6?'감소':'마이너'));}
      tbl.append(h,r1,r2);kbs.forEach((x,i)=>x.classList.toggle('on',i===key));info.textContent=NAMES[key]+' 키: '+Array.from({length:7},(_,i)=>chord(key,i)).join(' · ');}
    const kbs=NAMES.map((n,i)=>{const x=btn(SHOW[n]||n,()=>{key=i;render();b.clear();});kb.append(x);return x;});
    const stop=()=>{ids.forEach(clearTimeout);ids=[];};
    const prog=el('div',{class:'row'},'<span class="muted">진행 듣기 (4번줄 루트)</span>');
    [[1,5,6,4],[1,4,5,1],[6,4,1,5]].forEach(p=>prog.append(btn(p.join('-'),()=>{stop();p.forEach((n,i)=>ids.push(setTimeout(()=>{const pc=(key+MAJ[n-1])%12;b.clear();b.dot(3,rootF(pc),NAMES[pc],'root');playPitch(pitch(3,rootF(pc)),0,.9);
      info.textContent=p.join('-')+'  →  '+p.map(x=>chord(key,x-1)).join(' – ')+'   (지금: '+chord(key,n-1)+')';},i*1100)));})));
    t.append(kb,info,tbl,prog,aw,el('p',{class:'muted'},'코드 칸을 누르면 그 루트의 위치가 4번줄(진한 점)·3번줄(연한 점)에 표시돼요. 곡을 받으면 번호로 바꿔서 같은 방법으로 정리할 수 있어요.'));render();}},
 L('m9',20,'실습실: C 메이저 잼','C 키로 놀기','C 메이저 코드 진행(C G Am F) 반주 위에서 스케일과 라인 따라 치기',
  '지금까지 배운 번호판과 구멍 카드를 놀이터에서 써 봐요. 반주가 흐르는 동안 TAB의 빨간 선을 따라가요.',
  ['반주 재생: C 키, I-V-vi-IV','TAB의 라인(루트·5도·옥타브)을 따라 치기','지판 위 파란 점(메이저 스케일)만 골라 즉흥으로 쳐 보기','키를 G, F로 바꿔 반복'],
  ['먼저 루트(1박)만 맞추고, 익숙해지면 5도·옥타브를 더하세요.','베이스 소리를 꺼 보면 내가 치는 소리만 들려요.'],
  studio({progs:['maj-1564','maj-1451','maj-1645'],grooves:['rock','pop','ballad'],prog:'maj-1564',lines:['root4','r5','r5o','arp','run','cross'],line:'r5',bpm:80,hand:true,builder:true,scales:[['메이저 7음',MODES.maj],['메이저 펜타',MODES.majpent]]}))

 ,FINAL('z2',{key:0,prog:'maj-1564',groove:'pop',bpm:80,lines:["r5o", "run"],line:'r5o',guide:GSTEPS('r5o','run',"번호판 위에서 지금 치는 음이 몇 번(R,5,8…)인지 눈으로 확인해요.","TAB을 따라 같이 치며 번호(1·5·8)를 소리 내어 말해요.","베이스 소리가 꺼져요. 번호를 말하며 혼자 쳐요.","스케일 오르내리기 라인으로 번호판 전체를 훑어요.")},[{"q": "메이저 스케일의 간격 공식은?", "o": ["온온반온온온반", "온반온온반온온", "온온온반온온반"], "a": 0, "why": "2-2-1-2-2-2-1"}, {"q": "한 줄 위, 한 칸 왼쪽은?", "o": ["3", "5", "b3"], "a": 0, "why": "메이저 3도."}, {"q": "5도는 어디?", "o": ["한 줄 위 +2프렛", "같은 줄 +5프렛", "두 줄 위 -2프렛"], "a": 0, "why": "한 줄 위 +2."}, {"q": "C 키에서 6번 코드는?", "o": ["Am", "Dm", "Em"], "a": 0, "why": "A 마이너."}])
];
