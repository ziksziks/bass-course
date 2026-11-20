const LESSONS=[
 {id:'l1',min:10,t:'개방현 이름',s:'E A D G',
  tips:["개방현은 아래부터 E-A-D-G. 줄 번호는 거꾸로라서 \"굵은 줄이 4번\"만 기억하면 안 헷갈려요.", "연습 전에 튜너 앱으로 튜닝부터! 음이 틀리면 귀가 헷갈려요."],
  goal:'4개 줄을 안 보고 바로 말하기',
  an:'줄은 아파트 4개 동이에요. 맨 아래(굵은 줄)가 4번 동 E, 그 위로 A, D, G. 외우는 주문: "Eat A Delicious Grape(맛있는 포도를 먹어요)".',
  todo:['소리 듣기 버튼으로 4줄을 하나씩 들어 보기','실제 베이스로 개방현을 치면서 이름을 소리 내어 말하기 (4→1번줄, 1→4번줄)','퀴즈 10개 연속 정답'],
  build:t=>{const wrap=el('div',{class:'boardwrap'});const b=Board(wrap);
    const r=el('div',{class:'row'});
    r.append(btn('소리 듣기 (4→1번줄)',()=>{b.clear();seq([3,2,1,0].map(si=>()=>{b.dot(si,0,STR[si].n,'root');play(si,0);}),700);},'primary'));
    const pr=el('div',{class:'prompt'}),fbk=el('div',{class:'fb'}),nb=el('div',{class:'names',style:'grid-template-columns:repeat(4,minmax(0,1fr));max-width:320px'});
    let cur=null,streak=0;
    function q(){cur=Math.floor(Math.random()*4);b.clear();b.dot(cur,0,'?','q');play(cur,0);pr.textContent=STR[cur].num+'번줄 개방현의 이름은?';}
    ['E','A','D','G'].forEach(n=>nb.append(btn(n,()=>{if(cur===null)return;const ok=STR[cur].n===n;chime(ok);streak=ok?streak+1:0;
      fbk.className='fb '+(ok?'ok':'no');fbk.textContent=ok?'정답! 연속 '+streak+'개'+(streak>=10?' — 강의 2로 넘어가도 돼요':''):STR[cur].num+'번줄은 '+STR[cur].n+'예요.';b.clear();b.dot(cur,0,STR[cur].n,ok?'good':'bad');setTimeout(q,ok?700:1400);})));
    r.append(btn('퀴즈 시작',()=>{streak=0;fbk.textContent='';q();}));
    t.append(r,wrap,pr,nb,fbk);}},
 {id:'l2',min:20,t:'4번줄 자연음',s:'E F G A B C D E',
  tips:["표시점 3·5·7 = G·A·B 를 먼저 외우면, 나머지는 거기서 한두 칸만 세면 돼요.", "음 이름을 소리 내어 말하면서 치세요. 눈·입·손이 같이 움직이면 훨씬 빨리 외워져요."],
  goal:'4번줄 0·1·3·5·7·8·10·12프렛 음 이름 외우기',
  an:'알파벳 친구들(A~G)이 2칸씩 떨어져 서 있어요. 단, E-F와 B-C는 단짝이라 1칸만 떨어져요. 표시점(3·5·7·9·12)은 동네 큰길 표지판이에요.',
  todo:['애니메이션을 보며 따라 치기 (0→12프렛, 음 이름 말하기)','표시점에 있는 음 먼저: 3=G, 5=A, 7=B, 12=E','찾기 퀴즈 맞힘 15개'],
  build:t=>{const r=el('div',{class:'row'});const aw=el('div',{class:'boardwrap'});const a=Board(aw);
    const fs=[0,1,3,5,7,8,10,12];
    r.append(btn('애니메이션: 4번줄 따라가기',()=>{a.clear();seq(fs.map((f,k)=>()=>{a.dot(3,f,noteAt(3,f),(f===1||f===8)?'warn':(f===0||f===12)?'root':'note');play(3,f);}),650);},'primary'));
    t.append(r,aw,el('p',{class:'muted'},'노란 점(F, C)은 바로 앞 음과 1칸만 떨어진 음이에요. E→F, B→C.'));
    const q=el('div',{class:'tool'});t.append(q);
    findQuiz(q,{strings:[3],pool:['E','F','G','A','B','C','D'],hint:n=>'표시점부터 세어 보세요. 3=G, 5=A, 7=B.'});}},
 {id:'l3',min:20,t:'3번줄 자연음',s:'5프렛 규칙',
  tips:["5프렛 규칙: 4번줄 5프렛 = 3번줄 개방현. 튜너 없이 튜닝할 때도 쓰는 규칙이에요.", "모르는 3번줄 음은 4번줄에서 5칸 왼쪽의 같은 음을 찾으면 돼요."],
  goal:'3번줄 음 이름 외우고, 4번줄과 3번줄을 섞어서 찾기',
  an:'4번줄 5프렛과 3번줄 개방현은 같은 A예요. 아래층 5번째 계단 = 위층 1층. 그래서 3번줄은 4번줄을 5칸 당겨 놓은 것과 같아요.',
  todo:['애니메이션으로 "4번줄 5프렛 = 3번줄 0프렛" 소리 비교','3번줄 따라 치기: A B C D E F G A','4번·3번줄 섞어 찾기 퀴즈 맞힘 15개'],
  build:t=>{const r=el('div',{class:'row'});const aw=el('div',{class:'boardwrap'});const a=Board(aw);
    r.append(btn('같은 A 듣기',()=>{a.clear();seq([()=>{a.dot(3,5,'A','root');play(3,5);},()=>{a.dot(2,0,'A','root');a.link([3,5],[2,0]);play(2,0);},()=>{a.dot(3,10,'D','note');play(3,10);},()=>{a.dot(2,5,'D','note');a.link([3,10],[2,5]);play(2,5);}],900);},'primary'));
    r.append(btn('3번줄 따라가기',()=>{a.clear();seq([0,2,3,5,7,8,10,12].map(f=>()=>{a.dot(2,f,noteAt(2,f),(f===3||f===8)?'warn':(f===0||f===12)?'root':'note');play(2,f);}),650);}));
    t.append(r,aw);const q=el('div',{class:'tool'});t.append(q);
    findQuiz(q,{strings:[3,2],pool:['E','F','G','A','B','C','D'],hint:n=>'3번줄은 4번줄보다 5칸 왼쪽에 같은 음이 있어요.'});}},
 {id:'l4',min:20,t:'옥타브 모양',s:'두 줄 위 +2칸',
  tips:["옥타브 모양은 \"두 줄 위 + 두 칸 오른쪽\" 하나만 기억하세요. 1번·2번줄을 따로 외울 필요가 없어져요.", "옥타브를 번갈아 치면 같은 음 이름인데 높이만 달라서 귀로 확인하기 좋아요."],
  goal:'4번·3번줄 음에서 옥타브로 2번·1번줄 음 찾기',
  an:'옥타브는 같은 이름의 "형 음"이에요. 집에서 두 층 올라가고 오른쪽으로 두 칸 가면 형이 살아요. 이 모양 하나로 2번·1번줄을 따로 외울 필요가 없어져요.',
  todo:['지판의 4번·3번줄 아무 곳이나 눌러 옥타브 위치 보기','검지로 아래 음, 약지나 새끼로 옥타브를 짚고 번갈아 치기','옥타브 찾기 퀴즈 맞힘 15개'],
  build:t=>{const fbk=el('div',{class:'fb muted'},'4번줄이나 3번줄 아무 칸이나 눌러 보세요.');const aw=el('div',{class:'boardwrap'});
    const a=Board(aw,{onPick:(si,f)=>{a.clear();if(si<2||f>10){fbk.textContent='4번·3번줄의 0~10프렛을 눌러 보세요.';return;}
      const n=noteAt(si,f);a.dot(si,f,n,'root');a.dot(si-2,f+2,n,'root');a.link([si,f],[si-2,f+2]);play(si,f,0,.4);play(si-2,f+2,.45,.5);
      fbk.textContent=STR[si].num+'번줄 '+f+'프렛 '+(SHOW[n]||n)+' → '+STR[si-2].num+'번줄 '+(f+2)+'프렛 '+(SHOW[n]||n)+' (두 줄 위, +2칸)';}});
    t.append(aw,fbk);
    const q=el('div',{class:'tool'});const pr=el('div',{class:'prompt'}),f2=el('div',{class:'fb'}),sc=el('div',{class:'score muted'});
    let cur=null,score=0,tries=0;const bw=el('div',{class:'boardwrap'});
    const b=Board(bw,{onPick:(si,f)=>{if(!cur)return;tries++;play(si,f,0,.4);const ok=si===cur[0]-2&&f===cur[1]+2;
      b.clear();b.dot(cur[0],cur[1],noteAt(cur[0],cur[1]),'root');
      if(ok){score++;chime(true);b.dot(si,f,noteAt(si,f),'good');b.link(cur,[si,f]);f2.className='fb ok';f2.textContent='정답!';setTimeout(nq,1100);}
      else{chime(false);b.dot(si,f,noteAt(si,f),'bad');f2.className='fb no';f2.textContent='두 줄 위('+STR[cur[0]-2].num+'번줄), 오른쪽으로 두 칸이에요.';}
      sc.textContent='맞힘 '+score+' / 시도 '+tries;}});
    function nq(){const si=rnd([3,2]),f=rnd([0,1,2,3,4,5,6,7,8,9,10].filter(x=>isNat(noteAt(si,x))));cur=[si,f];b.clear();b.dot(si,f,noteAt(si,f),'root');
      pr.textContent=STR[si].num+'번줄 '+f+'프렛 '+noteAt(si,f)+'의 옥타브를 '+STR[si-2].num+'번줄에서 눌러 보세요';f2.textContent='';}
    const r=el('div',{class:'row'});r.append(btn('옥타브 퀴즈 시작',()=>{score=0;tries=0;sc.textContent='';nq();},'primary'));
    q.append(r,pr,bw,f2,sc);t.append(q);}},
 L('lb1',15,'줄 전체 외우기','12음 사다리','한 줄(0~12프렛) 전체를 "한 줄 노래"처럼 이어서 말하고, 눈 감고도 떠올리기',
  '줄 하나는 12칸짜리 계단이에요. 계단은 한 칸마다 음이 하나씩 올라가고, 12칸을 오르면 같은 이름의 방이 또 나와요. 낱개 칸이 아니라 "계단 전체"를 한 번에 외우는 거예요.',
  ['4번줄 전체를 켜고 소리 쭉 듣기','이름 가리기를 켜고 점을 눌러 확인하며 떠올리기','빈칸 채우기 퀴즈로 3개씩 확인','3번줄, 2번줄, 1번줄도 같은 방법으로'],
  ['한 줄을 "E F F# G G# A A# B C C# D D# E"처럼 노래하듯 말하세요. 리듬이 있으면 기억이 오래가요.','줄이 바뀌어도 순서는 똑같고 시작 음만 달라요. 한 줄을 외우면 네 줄을 외운 거나 같아요.'],
  memo({blocks:stringBlocks()})),
 L('lb2',15,'블록으로 외우기','기둥과 쌍둥이','가로(줄)가 아니라 세로(기둥)와 쌍둥이 블록으로 지판을 묶어서 외우기',
  '건물에는 가로 복도(줄)도 있지만 세로 기둥도 있어요. 같은 프렛을 위아래로 묶은 "기둥"과, 4번줄 5프렛=3번줄 개방현 같은 "쌍둥이 한 쌍"을 한 덩어리로 기억하면 훨씬 빨라요.',
  ['기둥 블록(0·3·5·7·12프렛)의 네 음을 한 번에 말하기','쌍둥이 블록을 눌러 두 음이 같은 음인지 소리로 확인','이름 가리기로 스스로 시험'],
  ['5프렛 기둥은 "A D G C" = 한 줄 위 개방현 + 마지막 줄 C. 외우기 쉬워요.','12프렛 기둥은 개방현과 똑같은 "E A D G"예요. 한 바퀴 돌아왔다는 표시!'],
  both(memo({blocks:pillarBlocks([0,3,5,7,12])}),memo({blocks:pairBlocks([0,2,3,5,7])}))),
 L('lb3',20,'네 줄을 한꺼번에','여러 줄 이어 읽기','한 줄씩이 아니라 두 줄·세 줄·네 줄을 묶어 읽고, 줄을 넘나들며 음 찾기',
  '네 줄은 4층짜리 계단이 이어진 건물이에요. 한 층만 오르내리면 지루하죠? 베이스는 줄을 넘나들며 치는 악기라서, 한 층이 끝나면 위층 계단으로 자연스럽게 넘어가는 눈이 필요해요.',
  ['사슬 애니메이션으로 4번줄 → 1번줄이 이어지는 걸 보기','두 줄 세트(4·3번줄 등)와 네 줄 사각형 블록을 읽기','4줄 전체에서 음 찾기 퀴즈 맞힘 15개'],
  ['한 줄의 끝(5프렛)은 한 줄 위의 처음(개방현)이에요. "5프렛 → 개방현"으로 줄을 넘어가면 음이 끊기지 않고 이어져요.','처음엔 두 줄 세트(4·3번줄)만 완벽하게, 그다음 3·2번줄로 옮겨 가세요.'],
  both(steps(chainSteps(),{gap:3200}),memo({blocks:multiBlocks()}),t=>findQuiz(t,{strings:[3,2,1,0],pool:['E','F','G','A','B','C','D'],hint:n=>'네 줄 중 어디든 괜찮아요. 5프렛 규칙으로 줄을 넘어가 보세요.'}))),
 {id:'l5',min:5,t:'쉬는 시간',s:'손 풀기',rest:true,
  tips:["쉴 때 손가락과 어깨 힘을 빼세요. 손이 아프면 바로 멈추는 게 실력이 느는 지름길이에요."],
  goal:'손목과 손가락 쉬기',
  an:'근육도 외운 걸 정리할 시간이 필요해요. 쉬는 동안 머릿속으로 "4번줄 5프렛은? 3번줄 3프렛은?" 하고 떠올려 보세요.',
  todo:['손가락 쥐었다 펴기 10번, 손목 돌리기','물 마시기','머릿속으로 4번줄 표시점 음 말해 보기: 3=G, 5=A, 7=B, 12=E'],
  build:t=>{}},
 {id:'l6',min:15,t:'샵(#)과 플랫(b)',s:'한 칸 옆 친구',
  tips:["E-F, B-C 사이에는 #이 없어요(단짝). 이것만 알면 샵·플랫의 절반은 끝!", "#은 올라가는 계단(오른쪽), b은 내려가는 계단(왼쪽)이라고 기억하세요."],
  goal:'자연음 옆 칸의 이름 붙이기 (C#, Bb 등)',
  an:'샵(#)은 "한 칸 오른쪽(높게)", 플랫(b)은 "한 칸 왼쪽(낮게)"이에요. A와 B 사이 칸은 A# 이라고도, Bb 이라고도 불러요. 한 집에 별명이 두 개인 거예요.',
  todo:['애니메이션으로 A → A# → B, B → Bb → A 보기','자연음을 짚고 한 칸 오른쪽(#)·왼쪽(b)을 쳐 보기','12개 음 전체 찾기 퀴즈 맞힘 15개'],
  build:t=>{const r=el('div',{class:'row'});const aw=el('div',{class:'boardwrap'});const a=Board(aw);
    r.append(btn('애니메이션: 한 칸 옆',()=>{a.clear();seq([()=>{a.dot(3,5,'A','root');play(3,5);},()=>{a.dot(3,6,'A#','warn');play(3,6);},()=>{a.dot(3,7,'B','root');play(3,7);},
      ()=>{a.clear();a.dot(2,3,'C','root');play(2,3);},()=>{a.dot(2,2,'B','note');play(2,2);},()=>{a.dot(2,4,'C#','warn');play(2,4);}],800);},'primary'));
    t.append(r,aw,el('p',{class:'muted'},'E와 F, B와 C 사이에는 칸이 없어서 E#, B# 같은 음은 거의 쓰지 않아요.'));
    const q=el('div',{class:'tool'});t.append(q);
    findQuiz(q,{strings:[3,2],pool:NAMES,hint:n=>n.indexOf('#')>0?'#은 '+n[0]+'에서 한 칸 오른쪽이에요.':'자연음이에요. 표시점부터 세어 보세요.'});}},
 {id:'l7',min:20,t:'넥 전체 게임',s:'60초 도전',
  tips:["틀린 자리는 모아 두고 5번씩 쳐 주세요. 다음 판에 제일 많이 늘어요.", "하루 1~2판 짧게가 한 번에 오래 하는 것보다 효과적이에요."],
  goal:'0~12프렛 아무 곳이나 보고 3초 안에 이름 말하기',
  an:'이제 동네 전체 지도 시험이에요. 모르면 "4번줄·3번줄에서 찾고 옥타브로 올라가기" 작전을 쓰세요.',
  todo:['60초 게임 3판 (판마다 점수 적기)','자주 틀린 자리 확인하고 실제 베이스로 5번씩 치기','마지막 판은 소리만 듣고 위치와 이름 같이 말하기'],
  build:t=>{const r=el('div',{class:'row'});const tm=el('span',{class:'timer'},'60');const sc=el('span',{class:'score muted'},'점수 0');
    const aw=el('div',{class:'boardwrap'});const a=Board(aw);const nb=el('div',{class:'names'});const fbk=el('div',{class:'fb'});
    let cur=null,score=0,left=0,iv=null,miss={};
    function nq(){const si=Math.floor(Math.random()*4),f=Math.floor(Math.random()*13);cur=[si,f];a.clear();a.dot(si,f,'?','q');play(si,f,0,.4);}
    function end(){clearInterval(iv);iv=null;cur=null;a.clear();const ks=Object.keys(miss);
      ks.forEach(k=>{const [si,f]=k.split(',').map(Number);a.dot(si,f,noteAt(si,f),'bad');});
      fbk.className='fb';fbk.textContent='끝! 점수 '+score+'점. '+(ks.length?'빨간 점이 틀린 자리예요. 베이스로 직접 쳐 보세요.':'틀린 곳이 없어요!');}
    NAMES.forEach(n=>nb.append(btn(SHOW[n]||n,()=>{if(!cur)return;const ans=noteAt(cur[0],cur[1]),ok=ans===n;chime(ok);
      if(ok){score++;fbk.className='fb ok';fbk.textContent='정답';}else{miss[cur.join(',')]=1;fbk.className='fb no';fbk.textContent=STR[cur[0]].num+'번줄 '+cur[1]+'프렛은 '+(SHOW[ans]||ans);}
      sc.textContent='점수 '+score;nq();})));
    r.append(btn('60초 시작',()=>{score=0;miss={};left=60;tm.textContent=left;sc.textContent='점수 0';fbk.textContent='';if(iv)clearInterval(iv);nq();
      iv=setInterval(()=>{left--;tm.textContent=left;if(left<=0)end();},1000);},'primary'),el('span',{class:'muted'},'남은 시간'),tm,sc);
    t.append(r,aw,nb,fbk);}},
 {id:'l8',min:10,t:'정리 + 다음 단계',s:'같은 음 전부 찾기',
  tips:["같은 음이 넥에 여러 곳 있어요. 지금 손에서 가장 가까운 곳을 고르면 이동이 줄어요.", "다음 Chapter 2에서는 음 이름 대신 \"루트에서 몇 번째\"로 읽는 법을 배워요."],
  goal:'한 음을 넥 전체에서 3곳 이상 바로 찾기',
  an:'같은 이름의 음은 넥 곳곳에 살아요. 하나를 찾으면 "5칸 왼쪽 위층"(같은 음)과 "두 층 위 +2칸"(옥타브)으로 나머지를 다 찾을 수 있어요.',
  todo:['아래에서 음을 골라 넥 전체 위치 보기 (C, G, D부터)','오늘 배운 길 3개 말해 보기: 표시점, 5프렛 규칙, 옥타브','다음 시간: 루트 주변 "음정 지도" → 메이저 스케일'],
  build:t=>{const nb=el('div',{class:'names'});const aw=el('div',{class:'boardwrap'});const a=Board(aw);const fbk=el('div',{class:'fb muted'},'음을 골라 보세요.');
    NAMES.forEach(n=>nb.append(btn(SHOW[n]||n,()=>{a.clear();let c=0,k=0;[3,2,1,0].forEach(si=>{for(let f=0;f<=12;f++)if(noteAt(si,f)===n){c++;const kk=k++;setTimeout(()=>{a.dot(si,f,n,si>=2?'root':'note');play(si,f,0,.35);},kk*260);}});
      fbk.textContent=(SHOW[n]||n)+'는 0~12프렛 안에 '+c+'곳 있어요. 진한 점(4·3번줄)을 기준으로 옥타브를 따라가 보세요.';})));
    t.append(nb,aw,fbk);}},
 L('l9',15,'실습실: 자연음 위치 따라 치기','개방현·자연음 놀이터','반주 위에서 루트 음(자연음)을 정확한 줄·프렛에서 치기',
  '이제 배운 지판 지도를 놀이터에서 써 봐요. 코드가 바뀔 때마다 새 반장(루트)의 자리를 눈으로 찾아가요.',
  ['반주 틀고 TAB의 루트 따라 치기','지판 화면에서 어디를 치는지 눈으로 확인','키를 바꿔 같은 방식 반복'],
  ['먼저 TAB 숫자(프렛)를 보고, 그다음 지판에서 위치를 확인하세요. 눈 두 번 확인이 암기를 단단하게 해요.','4번줄·3번줄 음 이름을 말하면서 치면 더 빨리 외워져요.'],
  studio({progs:['maj-1564','maj-1451','min-1b6b3b7'],grooves:['ballad','pop'],prog:'maj-1451',lines:['root4','r5'],line:'root4',bpm:65,hand:true}))

 ,FINAL('z1',{key:0,prog:'maj-1451',groove:'ballad',bpm:65,lines:["root4", "r5"],line:'root4',guide:GSTEPS('root4','r5',"TAB의 프렛 숫자와 지판의 불빛을 눈으로 따라가며 \"이 음 이름은?\"을 마음속으로 말해요.","불빛을 따라 4번·3번줄에서 루트를 같이 쳐요. 음 이름을 소리 내어 말해요.","베이스 소리가 꺼져요. TAB만 보고 루트를 혼자 쳐요.","루트 사이에 5도를 넣어 나만의 버전으로 쳐 보세요.")},[{"q": "4번줄 5프렛과 같은 소리를 내는 곳은?", "o": ["3번줄 개방현", "3번줄 5프렛", "2번줄 개방현"], "a": 0, "why": "5프렛 규칙: 한 줄 위 개방현과 같아요."}, {"q": "E와 F 사이는 몇 프렛?", "o": ["1프렛", "2프렛", "3프렛"], "a": 0, "why": "E-F, B-C는 반음(1프렛)."}, {"q": "12프렛은?", "o": ["개방현의 옥타브", "개방현과 다른 음", "한 칸 낮은 음"], "a": 0, "why": "12프렛은 옥타브."}, {"q": "옥타브 모양은?", "o": ["두 줄 위 +2프렛", "한 줄 위 +2프렛", "같은 줄 +3프렛"], "a": 0, "why": "두 줄 위, 오른쪽 2칸."}])
];
