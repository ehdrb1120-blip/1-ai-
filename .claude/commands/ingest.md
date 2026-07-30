---
description: raw 자료를 wiki에 정제 박제 (LLM Wiki Operations: Ingest)
---

raw 자료를 LLM Wiki 패턴으로 정제하여 wiki에 박제한다.

# 입력
$ARGUMENTS  (raw 파일 경로 또는 raw 자료 내용)

# 절차
1. **읽기**: raw 자료 + CLAUDE.md + 운영영역의 raw-wiki-규칙.md
2. **진입 판정** (룰북 §A): 통과 / 참조 / 모호 / 반려
3. **영역 분류** (룰북 §B, 통과·참조 시): 4분기 결정 트리
4. **압축** (룰북 §C): 10~20% 압축률, ≤200줄, 직접 인용 ≤3줄, cross-link ≥3개
5. **frontmatter** 의무: `area`, `created`, `sources`, `tags`
6. **노트 생성**: `wiki/{영역}/{제목}.md`
7. **index 갱신**: `wiki/index.md` 해당 영역에 1줄 추가
8. **log append**: `## [YYYY-MM-DD] ingest | {제목}`

# 모호 처리
[모호] 시 룰북 §D 따름:
- 후보 자료 1~3문장 발췌 + 분기 옵션 2개를 사용자에게 제시
- 사용자 선택 → 룰북 "모호 사례 로그"에 append

# 제약
- raw/ 절대 수정 X
- frontmatter 누락 금지
- 인용 없는 주장 금지
- 결정 트리 임의 분기 추가 금지

# 출력
- 처리 결과 (통과/참조/모호/반려)
- 생성된 노트 경로
- 갱신된 index 항목
- log 엔트리
