# 베이스 코스 저장소 안내 (Claude Code용)

베이스 입문 → 즉흥·잼까지의 29개 챕터 + 실습실(Practice). 사이트: https://ziksziks.github.io/bass-course/

## 구조
- `src/chN.js` 챕터 원본(레슨 목록·이론 THEORY·FAQ), `src/thN.js`·`src/qN.js` 이론/FAQ, `src/daily.js` 매일 연습, `src/summary.html` 요약노트, `src/index_template.html` 목차(진도 관리), `src/chapters.json` 챕터 등록.
- `shared/bass-lib.js`, `shared/practice-lib.js`, `shared/*.css` 공통 코드(지판, 반주 엔진, TAB, 퀴즈, 위젯).
- `build.py` : src → `Part*/Chapter*.html`, `Practice/매일연습.html`, `index.html` 생성. **HTML을 직접 고치지 말고 src를 고친다.**
- `Practice/잼스튜디오.html`, `Practice/주법연습실.html`, `Practice/요약노트.html`은 직접 편집하는 정적 페이지(요약노트는 `src/summary.html`과 같은 내용으로 동기화).
- `.github/workflows/pages.yml` : main에 push되면 서버가 `python3 build.py`를 돌려 GitHub Pages에 배포한다.

## 규칙
- 모든 레슨: 10살 눈높이 설명, 시각 애니메이션, 꿀팁, 이론(📖), 초보자 FAQ(🤔), 각 챕터 마지막은 `FINAL()` 종합 실습+퀴즈.
- 지판·스케일은 한 줄만이 아니라 여러 줄·블록 단위로도 다룬다.
- 대중음악 사례는 확인된 사실(키·진행·베이스 역할)만 적고, 불확실한 음·TAB·가사는 쓰지 않는다.
- 모바일(아이폰·아이패드) 대응 유지: 반응형, 터치 44px, 입력창 16px.
- 수정 후 `python3 build.py`로 빌드가 통과하는지 확인하고 main에 push한다(배포 자동).
- 개인 정보·학습 기록(`HANDOFF.md`, `QnA/질의응답_로그.md`)은 저장소에 올리지 않는다(.gitignore).
