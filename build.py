import json,os,sys,re
BASE=os.path.dirname(os.path.abspath(__file__))
CH=json.load(open(os.path.join(BASE,'src','chapters.json'),encoding='utf-8'))
TPL='''<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="베이스 코스">
<meta name="theme-color" content="#2563c9">
<title>{title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=IBM+Plex+Sans+KR:wght@400;500;600&display=swap">
<link rel="stylesheet" href="../shared/bass-style.css">
<link rel="stylesheet" href="../shared/practice.css">
</head><body><main>
<header class="card">
  <div class="head"><h1>{title}</h1><span class="pill">{part}</span></div>
  <p class="muted">{intro}</p>
  <p class="mobilehint muted">📱 지판·TAB은 <b>좌우로 밀어서</b> 볼 수 있어요. 소리가 안 나면 아이폰의 <b>무음(벨) 스위치</b>를 끄고 재생 버튼을 한 번 눌러 주세요.</p>
  <nav class="tl" id="tl" aria-label="강의 순서"></nav>
  <div class="row"><div class="bar" style="flex:1"><span id="prog"></span></div><span class="score muted" id="progt">0 / 0</span></div>
  <p class="lessonlink muted"><a href="../index.html">← 전체 목차·진도 관리</a> · <a href="../Practice/요약노트.html">요약노트</a> · <a href="../Practice/매일연습.html">매일 연습</a> · <a href="../Practice/잼스튜디오.html">잼 스튜디오</a> · <a href="../Practice/주법연습실.html">주법 연습실</a> · <a href="../QnA/README.md">질의응답</a></p>
</header>
<div id="lessons"></div>
</main>
<script src="../shared/bass-lib.js"></script>
<script src="../shared/practice-lib.js"></script>
<script>
{lessons}
startCourse(LESSONS,{key});
</script></body></html>
'''
def lessons_of(path):
    s=open(path,encoding='utf-8').read();out=[]
    for m in re.finditer(r"\bL\('(\w+)',(\d+),'([^']*)'|\{id:'(\w+)',min:(\d+),t:'([^']*)'|\bG\('(\w+)',(\d+),'([^']*)'|REST\('(\w+)'|FINAL\('(\w+)'|\bTECH\('(\w+)',",s):
        g=m.groups()
        if g[0]:out.append((m.start(),g[0],int(g[1]),g[2],False))
        elif g[3]:out.append((m.start(),g[3],int(g[4]),g[5],g[5]=='쉬는 시간'))
        elif g[6]:out.append((m.start(),g[6],int(g[7]),g[8],False))
        elif g[9]:out.append((m.start(),g[9],5,'쉬는 시간',True))
        elif g[10]:out.append((m.start(),g[10],20,'마무리: 음악과 함께 따라 하기',False))
    out.sort()
    return [dict(id=i,min=mn,t=t,rest=r) for _,i,mn,t,r in out]
only=[a for a in sys.argv[1:] if a!='--index']
data=[]
for c in CH:
    sp=os.path.join(BASE,'src',c['src']+'.js')
    if not os.path.exists(sp): continue
    num=c['src'][2:]
    tp=os.path.join(BASE,'src','th'+num+'.js');fp=os.path.join(BASE,'src','q'+num+'.js')
    key=c['key'][3:] if c['key'].startswith('JS:') else "'"+c['key']+"'"
    data.append(dict(dir=c['dir'],file=c['file'],title=c['title'],part=c['part'],key=c['key'],lessons=lessons_of(sp),src=c['src']))
    if only and c['src'] not in only: continue
    body=(open(tp,encoding='utf-8').read()+'\n' if os.path.exists(tp) else '')+(open(fp,encoding='utf-8').read()+'\n' if os.path.exists(fp) else '')+open(sp,encoding='utf-8').read()
    html=TPL.format(title=c['title'],part=c['part'],intro=c['intro'],key=key,lessons=body)
    d=os.path.join(BASE,c['dir']);os.makedirs(d,exist_ok=True)
    open(os.path.join(d,c['file']),'w',encoding='utf-8').write(html)
    print('built',c['dir'],c['file'])
# 목차·진도 관리 페이지
IDX=open(os.path.join(BASE,'src','index_template.html'),encoding='utf-8').read()
open(os.path.join(BASE,'index.html'),'w',encoding='utf-8').write(IDX.replace('/*DATA*/[]',json.dumps(data,ensure_ascii=False)))
print('built index.html')
