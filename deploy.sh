#!/bin/bash
# 강의를 고친 뒤 실행: 빌드 → 커밋 → GitHub Pages에 배포
set -e
cd "$(dirname "$0")"
python3 build.py >/dev/null
git add -A
if git diff --cached --quiet; then echo "변경 없음"; exit 0; fi
git commit -q -m "${1:-강의 업데이트}

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
git push -q origin main
echo "배포 완료 → https://ziksziks.github.io/bass-course/ (1~2분 뒤 반영)"
