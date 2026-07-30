> **사용 전 준비**: vault용 폴더 만들고(예: `~/Documents/Obsidian/내-vault/`), 그 폴더에서 터미널 열어 `claude` 실행. 현재 디렉토리가 자동으로 vault root가 됩니다.
>
> **사용법**: Claude Code 새 세션에 **(1) LLM Wiki 원문 → (2) 본 프롬프트** 순서로 통째 붙여넣고 전송. 그대로 보내면 Claude Code가 2문항 인터뷰를 시작합니다.
>
> **수정할 부분 없음** — placeholder 갈아끼우기 X, 그대로 복붙.

---

위 LLM Wiki 패턴을 본인 도메인 vault로 부트스트랩해줘. 사용자가 본인 사업·일에 맞춰 답하면, 그 답변에서 도메인·영역·규칙을 자동 추론한다. **슬래시 커맨드 3종(/ingest, /query, /lint)도 함께 자동 설치한다.**

**Vault root**: 현재 작업 디렉토리(`pwd` 결과)를 vault root로 사용. 시작 전 `pwd`로 확인하고 사용자에게 1줄 보여줄 것.

## Phase 1 — 인터뷰 (2문항)

다음 2개 질문을 사용자에게 던진다. 둘 다 답이 들어와야 Phase 2 진행.

```
A. 본인 사업/활동이 뭐예요? (1~2문장)
B. 그 일에서 어떤 정보·자료를 자주 다뤄요? (3~5개 예시 — 콘텐츠/문서/데이터/대화 등)
```

답이 부분적이거나 빠지면 빠진 항목만 1회 재질문.

## Phase 2 — 자동 추론 + 사용자 컨펌

답변 받은 즉시 다음을 **1차 드래프트로 사용자에게 제시**하고 "OK 또는 수정 의견"을 받는다.

```
1. 도메인명: [Q.A에서 추출]
2. 영역 4개 (각 1줄 정의):
   - {영역1}: ...    (Q.B 묶음 #1)
   - {영역2}: ...    (Q.B 묶음 #2)
   - {영역3}: ...    (Q.B 묶음 #3)
   - {영역4}: shared 또는 운영성 영역 (vault 헌법 보관용)
3. 진입 결정 트리 Q1 키워드: [Q.A에서 추출, 3~5단어]
4. 영역 분류 결정 트리 4분기: [Q.B 묶음을 분기로]
5. 압축 룰: 표준 그대로 (10~20% / 200줄 / 3줄 / 3 cross-link)
6. 슬래시 커맨드 자동 설치 (LLM Wiki Operations 3종):
   - /ingest — raw 자료를 wiki에 정제 박제
   - /query — wiki 큐레이션 (읽기 전용)
   - /lint — wiki 건강 진단
   추가 원하시는 커맨드 있으면 한 줄로 알려주세요. 없으면 "OK".
```

**주의**: 4영역 중 1개는 반드시 운영·시스템·shared 성격 영역 확보 (vault 헌법 + 슬래시 커맨드 매뉴얼 보관용).

사용자 응답:
- "OK" → Phase 3
- 수정 의견 → 1회 반영 후 재컨펌
- 컨펌 받지 못하면 정지 (자의 빌드 금지)

## Phase 3 — 자동 생성

컨펌된 구조로 한 번에 생성.

### 3-1. 폴더 구조

```
{vault-root}/                # 현재 작업 디렉토리
├── raw/                     # 불변 원천 — LLM 절대 수정 X
│   └── assets/              # 이미지·첨부
├── wiki/
│   ├── {확정 영역1}/
│   ├── {확정 영역2}/
│   ├── {확정 영역3}/
│   ├── {확정 영역4}/
│   ├── index.md
│   └── log.md
├── .claude/
│   └── commands/
│       ├── ingest.md
│       ├── query.md
│       └── lint.md
├── CLAUDE.md
└── README.md (1줄)
```

### 3-2. CLAUDE.md (7섹션)

1. **Vault 정체성**: 확정 도메인 + 4영역 + 1줄씩 영역 정의
2. **3레이어**: raw(불변) / wiki(LLM 정제) / CLAUDE.md(스키마)
3. **Operations**: `/ingest` (raw→wiki) / `/query` (큐레이션) / `/lint` (진단) — 각 1줄
4. **raw→wiki 진입 규칙** (요약 + `[[raw-wiki-규칙]]` 링크)
5. **영역 분류 결정 트리** (요약 + 링크)
6. **압축 룰** (요약 + 링크)
7. **Frontmatter 표준**: `area`, `created`, `sources`, `tags`

### 3-3. wiki/{운영영역}/raw-wiki-규칙.md (vault 헌법)

추상 표현 금지. if-else 결정 트리 또는 수치 표만.

**A. 진입 결정 트리** — 4리프(통과/참조/모호/반려)
**B. 영역 분류 결정 트리** — Phase 2 확정 4분기, 마지막은 항상 [모호] (사용자 개입)
**C. 압축 룰**

| 항목 | 룰 |
|---|---|
| 압축률 | raw 1000줄 → wiki 100~200줄 (10~20%) |
| 노트 길이 상한 | 200줄 — 넘으면 분리 |
| 직접 인용 | raw 1자료당 ≤ 3줄 |
| Cross-link 최소 | 3개 — 그중 다른 영역 ≥ 1개 |

**D. 모호 처리** — 옵션 2개로 사용자에게 묻고, 답을 본 파일 하단 "모호 사례 로그"에 append

### 3-4. wiki/index.md / 3-5. wiki/log.md / 3-6. README.md

- index.md: 영역 4개 헤더 + `[[raw-wiki-규칙]]` 링크
- log.md: 포맷 헤더 + `## [{YYYY-MM-DD}] bootstrap | vault 초기화`
- README.md: `{확정 도메인} LLM Wiki. CLAUDE.md 참조.` (1줄)

### 3-7. 슬래시 커맨드 3종 (`.claude/commands/`)

다음 내용 그대로 박제. **도메인 불문 동일** (스키마와 룰북을 런타임에 참조하므로).

#### `.claude/commands/ingest.md`

````markdown
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
````

#### `.claude/commands/query.md`

````markdown
---
description: wiki 큐레이션 (읽기 전용 합성+인용) - LLM Wiki Operations: Query
---

wiki를 읽기 전용으로 큐레이션하여 합성 답변 + 관련 노트 + 다음 액션을 제시한다.

# 입력
$ARGUMENTS  (자유 텍스트 질문)

# 절차
1. **인덱스 먼저** (raw/ 직접 읽기 금지):
   - wiki/index.md
   - `grep "^## \[" wiki/log.md | tail -5`
   - 운영영역의 raw-wiki-규칙.md
2. **모드 자동 분류**: 결정 / 콘텐츠 / 조회 / 진단
3. **영역 필터링** (룰북 §B 결정 트리)
4. **후보 ≤7개로 좁힘** (백링크 밀도·최신성·영역 매칭 기준)
5. **선택적 정독** (후보만, 백링크 1단계 확장 허용)
6. **합성+인용**: 모든 주장에 [[wiki-link]] 인용. 데이터 갭 명시 면책.

# 출력 형식

**A. 답 (Synthesis)**
[3~10문장, 모든 주장 [[wiki-link]] 인용]

**B. 관련 노트 (열 순서)**
1. [[노트A]] — 한 줄 요약 — 왜 먼저
2. ... (최대 7개)

**C. 다음 액션 (Lint)**
- 데이터 갭 / 모순 / 고립 노트 / 추가 탐색 제안

# 제약
- 읽는 wiki 노트 ≤7개 (백링크 1단계 확장 포함)
- raw/ 직접 읽기 금지 (부족 시 명시 후 ≤2개 한정)
- 최소 3개 [[wiki-link]] 인용 (못 채우면 데이터 갭 처리)
- 추측 금지
- 본 커맨드는 wiki에 쓰지 않음 (읽기 전용)
````

#### `.claude/commands/lint.md`

````markdown
---
description: wiki 건강 진단 (모순·고립·갭) - LLM Wiki Operations: Lint
---

wiki 전체 또는 특정 영역의 건강 상태를 점검한다. 자동 수정은 안 한다 — 진단만.

# 입력
$ARGUMENTS  (영역명 또는 "all", 생략 시 all)

# 절차
1. wiki/index.md + 모든 wiki 노트 frontmatter 스캔
2. 다음 항목 점검:
   - **모순**: 노트 간 충돌하는 주장
   - **고립 노트**: 백링크 ≤2개인 노트
   - **데이터 갭**: 언급은 됐는데 자체 페이지 없는 개념
   - **미처리 raw**: raw/에 있지만 wiki 매핑 없는 자료
   - **압축 룰 위반**: ≥200줄 노트, cross-link <3 노트
   - **모호 사례 누적**: 룰북 모호 로그 검토
3. 새 질문·연결 후보 제안

# 출력 형식

**A. 진단 표**

| 항목 | 개수 | 우선순위 |
|---|---|---|
| 모순 | N | 상 |
| 고립 노트 | N | 중 |
| 데이터 갭 | N | 중 |
| 미처리 raw | N | 상 |
| 압축 룰 위반 | N | 하 |

**B. 우선 조치 권고 (top 3)**
1. ...

**C. 추가 탐색 제안**
- ...

# 제약
- 본 커맨드는 진단만 (자동 수정 X)
- 조치는 사용자 승인 후 별도 호출 (/ingest 또는 수동 편집)
- log.md에 lint 엔트리 append (실행 자체는 기록)
````

## Phase 4 — 검증 self-check

- [ ] 폴더 구조 일치
- [ ] CLAUDE.md 7섹션 모두 존재
- [ ] raw-wiki-규칙.md 4블록 모두 (결정 트리 if-else, 수치 표)
- [ ] index.md에 `[[raw-wiki-규칙]]` 링크 존재
- [ ] log.md에 부트스트랩 엔트리 1개
- [ ] **`.claude/commands/`에 `ingest.md`, `query.md`, `lint.md` 모두 존재** (frontmatter `description` 포함)

체크 통과 못 하면 자동 수정 시도. 두 번 실패하면 정지하고 사용자 개입 요청.

## 완료 출력 (이 순서로 그대로 출력)

```
✓ 부트스트랩 완료. 검증 6항목 모두 통과.

[1] 트리 (tree -L 3 결과)
[2] CLAUDE.md 7섹션 1줄 요약
[3] 룰북 4블록 1줄 요약
[4] 설치된 슬래시 커맨드:
   - /ingest — raw 자료를 wiki에 정제 박제
   - /query — wiki 큐레이션 (읽기 전용)
   - /lint — wiki 건강 진단

⚠️ 슬래시 커맨드 인식을 위해 창 다시 로드 필요:
   - Mac: Cmd+Shift+P → "개발자: 창 다시 로드"
   - Windows/Linux: Ctrl+Shift+P → "Developer: Reload Window"

다음 단계:
- 첫 자료 있으면 raw/ 폴더에 넣고 /ingest 호출하세요.
- 정기 점검은 /lint, 질문은 /query 사용.
```

---

**부트스트랩 시작**: 현재 디렉토리(`pwd`)를 1줄 보여주고, Phase 1의 2문항을 일괄 던지면서 시작.
