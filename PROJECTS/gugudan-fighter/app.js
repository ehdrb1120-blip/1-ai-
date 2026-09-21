/**
 * 🥊 초등 구구단 격파왕 | 브롤 몬스터 배틀 (Gugudan Fighter) V4.0
 * Developer: 대부호 마케팅실장 x @cheer.papa
 */

// === 0. 구버전 캐시 감지 시 브라우저 자동 즉시 강제 갱신 ===
(function ensureFreshVersion() {
    const checkAndPurge = () => {
        const isOldDom = !document.querySelector('.home-layout-row') || (document.body && document.body.innerText && document.body.innerText.includes('호돌이'));
        if (isOldDom) {
            console.warn('구버전 캐시 감지: 캐시 및 서비스워커 전면 삭제 후 새로고침합니다.');
            if ('caches' in window) {
                caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => {
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(regs => {
                            for (let r of regs) r.unregister();
                            window.location.reload(true);
                        });
                    } else {
                        window.location.reload(true);
                    }
                });
            } else {
                window.location.reload(true);
            }
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndPurge);
    } else {
        checkAndPurge();
    }
})();

// === 1. Web Audio API 신디사이저 사운드 엔진 (무설치 즉각 반응) ===
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // 마스코트 콕 찔렀을 때 귀여운 뿅/보잉 효과음
    playBoing() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
    }

    // 기본 펀치 타격음
    playPunch() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.14);
        
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
    }

    // 크리티컬 대미지 폭발음
    playCritical() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(70, now + 0.25);
        osc2.frequency.setValueAtTime(780, now);
        osc2.frequency.exponentialRampToValueAtTime(90, now + 0.25);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.25);
        osc2.stop(now + 0.25);
    }

    // 레트로 코인 획득음 (아케이드 딩동)
    playCoin() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    // 오답 버저음
    playWrong() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.setValueAtTime(130, now + 0.1);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    // 피버 모드 발동음 (상승 아르페지오)
    playFever() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.06;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        });
    }

    // 승리 팡파레
    playVictory() {
        if (!this.enabled) return;
        this.init();
        const melody = [
            { f: 523.25, d: 0.12 }, // C5
            { f: 659.25, d: 0.12 }, // E5
            { f: 783.99, d: 0.12 }, // G5
            { f: 1046.50, d: 0.35 } // C6
        ];
        let offset = 0;
        melody.forEach(item => {
            const now = this.ctx.currentTime + offset;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(item.f, now);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + item.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + item.d);
            offset += item.d * 0.9;
        });
    }

    // 마법 에너지 발사음 (피융-!)
    playEnergyShoot(isCrit) {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isCrit ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(isCrit ? 600 : 450, now);
        osc.frequency.exponentialRampToValueAtTime(isCrit ? 2200 : 1600, now + 0.16);
        osc.frequency.exponentialRampToValueAtTime(isCrit ? 1000 : 800, now + 0.28);

        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
    }
}

// === 2. 몬스터 및 스테이지 데이터베이스 ===
const STAGES_DATA = [
    {
        dan: 2,
        name: "말랑 젤리 슬라임",
        emoji: "🟢",
        level: 2,
        maxHp: 100,
        desc: "2단 도장의 통통 튀는 아기 슬라임",
        color: "#2ed573"
    },
    {
        dan: 3,
        name: "장난꾸러기 고블린",
        emoji: "👺",
        level: 3,
        maxHp: 120,
        desc: "3단 도장의 재빠른 꼬마 고블린",
        color: "#ffa502"
    },
    {
        dan: 4,
        name: "박치기 멧돼지 팡팡",
        emoji: "🐗",
        level: 4,
        maxHp: 140,
        desc: "4단 도장의 돌격 대장 멧돼지",
        color: "#8d6e63"
    },
    {
        dan: 5,
        name: "알록달록 버섯요정",
        emoji: "🍄",
        level: 5,
        maxHp: 160,
        desc: "5단 도장의 춤추는 버섯친구",
        color: "#ff4757"
    },
    {
        dan: 6,
        name: "스파크 번개 늑대",
        emoji: "⚡🐺",
        level: 6,
        maxHp: 180,
        desc: "6단 도장의 날렵한 썬더 울프",
        color: "#1e90ff"
    },
    {
        dan: 7,
        name: "해골 기사 본본",
        emoji: "💀",
        level: 7,
        maxHp: 200,
        desc: "7단 도장의 덜컹덜컹 뼈다귀 무사",
        color: "#ced6e0"
    },
    {
        dan: 8,
        name: "화염 바위 골렘",
        emoji: "🔥🗿",
        level: 8,
        maxHp: 220,
        desc: "8단 도장의 든든한 용암 골렘",
        color: "#ff6b81"
    },
    {
        dan: 9,
        name: "말랑 딸기 슈크림 드래곤",
        emoji: "🐉🍓",
        image: "boss_dragon.jpg?v=7.0",
        level: 9,
        maxHp: 250,
        desc: "9단 도장의 달콤한 슈크림 아기 드래곤!",
        color: "#f472b6",
        isBoss: true
    },
    {
        dan: 19,
        name: "천상계 19단 무지개 스타 신룡",
        emoji: "👑🐉",
        image: "boss_dragon.jpg?v=7.0",
        level: 99,
        maxHp: 350,
        desc: "전설의 구구단 마스터 무지개 챌린지!",
        color: "#fbcfe8",
        isSpecial: true
    }
];

// 귀여운 응원단 멘트 목록
const CHEER_QUOTES = [
    "토토 나이스 펀치! 최고야! 👏",
    "와아아! 마카롱처럼 몬스터가 쏙 깨졌어! 🐰✨",
    "구구단 천재 탄생! 짱 귀여워! 🐶💖",
    "콤보 폭발! 별빛 솜사탕 파이터! 🐱⭐",
    "토토 힘내라! 달콤 드래곤 잡으러 가자! 🐻🍓"
];

// 모찌 토토 대화록 목록 (클릭 시 반응)
const MASCOT_TALKS = [
    "안녕! 나 귀염둥이 모찌 토토야! 🐰💖",
    "솜사탕 펀치로 구구단 몬스터 깨러 가자! 얍! 🥊✨",
    "귀를 콕 만졌냥? 간지러워요! 히히 🐰💕",
    "구구단 마스터가 되면 달콤한 딸기 마카롱 줄게요! 🍓",
    "대표님 최고! 오늘 토토랑 만점 도전해 볼까요? ⭐"
];

// === 3. 메인 게임 애플리케이션 싱글톤 ===
const App = {
    audio: new SoundEngine(),
    state: {
        currentScreen: 'viewHome',
        currentMode: 'stage', // 'stage' or 'survival'
        currentStageIdx: 0,
        
        // 배틀 진행 변수
        currentDan: 2,
        currentNumB: 1,
        correctAnswer: 2,
        
        monsterHp: 100,
        monsterMaxHp: 100,
        
        score: 0,
        combo: 0,
        maxCombo: 0,
        isFever: false,
        
        // 서바이벌 모드 변수
        survivalTimer: 60,
        survivalTimerInterval: null,
        survivalKills: 0,
        survivalTotalTries: 0,
        survivalCorrects: 0,

        // 가상 키패드 입력값
        keypadBuffer: '',

        // 수련장 상태
        trainDan: 2,
        trainMultiplier: 4,

        // 마스코트 대화 인덱스
        mascotTalkIdx: 0,

        // 저장 데이터 (로컬 스토리지)
        coins: parseInt(localStorage.getItem('gugu_coins') || '0', 10),
        stars: parseInt(localStorage.getItem('gugu_stars') || '0', 10),
        clearedStages: JSON.parse(localStorage.getItem('gugu_cleared') || '[]'),
        kidName: localStorage.getItem('gugu_kid_name') || '김민준'
    },

    // 초기화
    init() {
        this.updateHeaderStats();
        this.renderStageMap();
        this.renderTrainingTabs();
        this.renderTrainingContent();
        this.setupEventListeners();
        this.updateCertName();

        // 구버전 브라우저 캐시 전면 정리 (호돌이 등 구에셋 캐시 방지)
        if ('caches' in window) {
            caches.keys().then((names) => {
                for (let name of names) {
                    if (name !== 'gugudan-fighter-v7') {
                        caches.delete(name);
                    }
                }
            });
        }

        // 서비스 워커 갱신 등록
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (let reg of registrations) {
                    reg.update();
                }
            });
            navigator.serviceWorker.register('./sw.js?v=7.0').catch(() => {});
        }
    },

    // 이벤트 리스너 세팅
    setupEventListeners() {
        document.getElementById('btnHome').addEventListener('click', () => {
            this.endSurvival();
            this.showScreen('viewHome');
        });

        document.getElementById('btnAudioToggle').addEventListener('click', (e) => {
            const isOn = this.audio.toggle();
            e.currentTarget.innerHTML = isOn ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
        });

        document.getElementById('btnCertModal').addEventListener('click', () => {
            this.openCertModal();
        });

        document.getElementById('btnVoiceRead').addEventListener('click', () => {
            this.speakFormula(this.state.currentDan, this.state.currentNumB, this.state.correctAnswer);
        });

        document.getElementById('btnTrainVoice').addEventListener('click', () => {
            this.speakFormula(this.state.trainDan, this.state.trainMultiplier, this.state.trainDan * this.state.trainMultiplier);
        });

        document.getElementById('btnToggleKeypad').addEventListener('click', () => {
            this.toggleInputMode();
        });
    },

    // 마스코트 콕 찔렀을 때 이스터 에그 (애니메이션 & 말풍선 변경)
    pokeMascot() {
        this.audio.playBoing();
        confetti({ particleCount: 25, spread: 40, origin: { y: 0.4 } });

        const avatar = document.getElementById('mainMascotImg');
        avatar.classList.remove('hero-wiggle');
        void avatar.offsetWidth;
        avatar.classList.add('hero-wiggle');

        this.state.mascotTalkIdx = (this.state.mascotTalkIdx + 1) % MASCOT_TALKS.length;
        document.getElementById('heroSpeechBubble').innerText = MASCOT_TALKS[this.state.mascotTalkIdx];
    },

    // 상단 재화 업데이트
    updateHeaderStats() {
        document.getElementById('headerCoins').innerText = this.state.coins;
        document.getElementById('headerStars').innerText = this.state.stars;
    },

    addReward(coins, stars) {
        this.state.coins += coins;
        this.state.stars += stars;
        localStorage.setItem('gugu_coins', this.state.coins);
        localStorage.setItem('gugu_stars', this.state.stars);
        this.updateHeaderStats();
    },

    // 화면 전환
    showScreen(screenId) {
        if (screenId !== 'viewBattle') {
            this.stopAR();
        }
        document.querySelectorAll('.screen-view').forEach(view => {
            view.classList.remove('active');
        });
        const target = document.getElementById(screenId);
        if (target) target.classList.add('active');
        this.state.currentScreen = screenId;
    },

    // 배틀에서 도장 선택(또는 홈)으로 빠져나가기
    exitBattle() {
        this.endSurvival();
        this.stopAR();
        this.closeAllModals();
        if (this.state.currentMode === 'survival') {
            this.showScreen('viewHome');
        } else {
            this.startStageSelect();
        }
        this.audio.playBoing();
    },

    // 포켓몬고 스타일 실시간 AR 카메라 토글
    async toggleAR() {
        if (this.state.isArActive) {
            this.stopAR();
        } else {
            await this.startAR();
        }
    },

    async startAR() {
        const video = document.getElementById('arVideoFeed');
        const arena = document.getElementById('battleArena');
        const btnText = document.getElementById('arBtnText');
        const toggleBtn = document.getElementById('btnToggleAR');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('현재 브라우저 환경에서는 카메라를 지원하지 않습니다. 3D 필드 모드로 진행합니다! 🌿');
            return;
        }

        try {
            // 태블릿/스마트폰 후면 카메라 우선 요청
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.state.arStream = stream;
            this.state.isArActive = true;

            if (video) {
                video.srcObject = stream;
                await video.play();
            }

            if (arena) arena.classList.add('ar-active');
            if (btnText) btnText.innerText = 'AR 끄기';
            if (toggleBtn) toggleBtn.classList.add('active');

            this.audio.playBoing();
        } catch (err) {
            console.warn('AR Camera access error:', err);
            alert('카메라 접근 권한이 허용되지 않았거나 카메라를 찾을 수 없습니다. 카메라 권한을 확인해주세요! 🌿');
            this.stopAR();
        }
    },

    stopAR() {
        const video = document.getElementById('arVideoFeed');
        const arena = document.getElementById('battleArena');
        const btnText = document.getElementById('arBtnText');
        const toggleBtn = document.getElementById('btnToggleAR');

        if (this.state.arStream) {
            this.state.arStream.getTracks().forEach(track => track.stop());
            this.state.arStream = null;
        }
        if (video) {
            video.srcObject = null;
        }
        this.state.isArActive = false;

        if (arena) arena.classList.remove('ar-active');
        if (btnText) btnText.innerText = 'AR 모드';
        if (toggleBtn) toggleBtn.classList.remove('active');
    },

    // 좌측 포켓몬고 스타일 메뉴 액션
    focusPunch() {
        this.audio.playBoing();
        const ring = document.getElementById('pogoTargetRing');
        if (ring) {
            ring.classList.add('ring-focused');
            setTimeout(() => ring.classList.remove('ring-focused'), 1000);
        }
        const quote = "타겟 링을 노려 정답을 날려봐! 얍! 🥊✨";
        document.getElementById('cheerText').innerText = quote;
    },

    playVoiceHint() {
        this.audio.playBoing();
        this.speakFormula();
    },

    // 1. 도장 맵 화면 진입
    startStageSelect() {
        this.renderStageMap();
        this.showScreen('viewStageSelect');
        this.audio.playPunch();
    },

    renderStageMap() {
        const grid = document.getElementById('stageGrid');
        grid.innerHTML = '';

        STAGES_DATA.forEach((stage, idx) => {
            const isCleared = this.state.clearedStages.includes(stage.dan);
            const card = document.createElement('div');
            card.className = `stage-card ${stage.isBoss ? 'boss-stage' : ''} ${isCleared ? 'cleared' : ''}`;
            card.onclick = () => this.startStage(idx);

            card.innerHTML = `
                <div class="stage-cleared-badge">⭐ 클리어</div>
                <div class="stage-monster-emoji">${stage.emoji}</div>
                <div class="stage-dan-label">${stage.dan}단</div>
                <div class="stage-monster-name">${stage.name}</div>
                <div class="stage-stars">${isCleared ? '⭐⭐⭐' : '도전하기 ➔'}</div>
            `;
            grid.appendChild(card);
        });
    },

    // 2. 특정 도장(스테이지) 시작
    startStage(stageIdx) {
        this.state.currentMode = 'stage';
        this.state.currentStageIdx = stageIdx;
        const stage = STAGES_DATA[stageIdx];

        this.state.currentDan = stage.dan;
        this.state.monsterMaxHp = stage.maxHp;
        this.state.monsterHp = stage.maxHp;
        this.state.score = 0;
        this.state.combo = 0;
        this.state.maxCombo = 0;
        this.state.isFever = false;

        document.getElementById('battleModeBadge').innerText = '도장 깨기';
        document.getElementById('battleModeBadge').style.background = 'var(--brawl-red)';
        document.getElementById('battleStageTitle').innerText = `${stage.dan}단 ${stage.name} 도장`;
        document.getElementById('survivalTimerBox').style.display = 'none';

        this.renderMonsterDisplay(stage);
        this.showScreen('viewBattle');
        this.nextQuestion();
        this.audio.playPunch();
    },

    renderMonsterDisplay(stage) {
        document.getElementById('monsterName').innerText = stage.name;
        document.getElementById('monsterLevel').innerText = `Lv.${stage.level}`;
        document.getElementById('monsterMaxHpText').innerText = stage.maxHp;
        this.updateMonsterHpUi();

        const wrapper = document.getElementById('monsterGraphic');
        if (stage.image) {
            wrapper.innerHTML = `<img src="${stage.image}" alt="${stage.name}" class="monster-img-avatar">`;
        } else {
            wrapper.innerHTML = stage.emoji;
        }
    },

    updateMonsterHpUi() {
        const hpPercent = Math.max(0, (this.state.monsterHp / this.state.monsterMaxHp) * 100);
        document.getElementById('monsterHpBar').style.width = `${hpPercent}%`;
        document.getElementById('monsterHpText').innerText = Math.max(0, this.state.monsterHp);

        const bar = document.getElementById('monsterHpBar');
        if (hpPercent < 30) {
            bar.style.background = 'linear-gradient(90deg, #ff4757, #ff3838)';
        } else {
            bar.style.background = 'linear-gradient(90deg, #ff9f0a, #2ed573)';
        }
    },

    // 3. 서바이벌 모드 시작 (60초 타임어택)
    startSurvivalMode() {
        this.closeAllModals();
        this.state.currentMode = 'survival';
        this.state.survivalTimer = 60;
        this.state.survivalKills = 0;
        this.state.survivalTotalTries = 0;
        this.state.survivalCorrects = 0;
        this.state.score = 0;
        this.state.combo = 0;
        this.state.maxCombo = 0;
        this.state.isFever = false;

        document.getElementById('battleModeBadge').innerText = '스피드 서바이벌';
        document.getElementById('battleModeBadge').style.background = 'var(--brawl-orange)';
        document.getElementById('battleStageTitle').innerText = '60초 몬스터 웨이브';
        document.getElementById('survivalTimerBox').style.display = 'flex';
        document.getElementById('survivalTimerSec').innerText = '60';

        this.spawnSurvivalMonster();
        this.showScreen('viewBattle');
        this.nextQuestion();
        this.audio.playFever();

        this.endSurvival();
        this.state.survivalTimerInterval = setInterval(() => {
            this.state.survivalTimer--;
            document.getElementById('survivalTimerSec').innerText = this.state.survivalTimer;
            if (this.state.survivalTimer <= 10) {
                document.getElementById('survivalTimerBox').style.color = '#ff2d55';
            }
            if (this.state.survivalTimer <= 0) {
                this.endSurvival();
                this.finishSurvivalGame();
            }
        }, 1000);
    },

    spawnSurvivalMonster() {
        const randomStage = STAGES_DATA[Math.floor(Math.random() * 8)];
        this.state.currentDan = randomStage.dan;
        this.state.monsterMaxHp = 100;
        this.state.monsterHp = 100;
        this.renderMonsterDisplay(randomStage);
    },

    endSurvival() {
        if (this.state.survivalTimerInterval) {
            clearInterval(this.state.survivalTimerInterval);
            this.state.survivalTimerInterval = null;
        }
    },

    finishSurvivalGame() {
        this.audio.playVictory();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

        const accuracy = this.state.survivalTotalTries > 0 
            ? Math.round((this.state.survivalCorrects / this.state.survivalTotalTries) * 100) 
            : 100;

        let rankTitle = "수습 격파원 🥉";
        if (this.state.score >= 2000) rankTitle = "전설의 구구단 격파왕 👑";
        else if (this.state.score >= 1200) rankTitle = "특급 번개 파이터 ⚡";
        else if (this.state.score >= 600) rankTitle = "열혈 구구단 마스터 🔥";

        document.getElementById('finalSurvivalScore').innerText = this.state.score.toLocaleString();
        document.getElementById('finalMonsterKills').innerText = `${this.state.survivalKills}마리`;
        document.getElementById('finalMaxCombo').innerText = `${this.state.maxCombo}회`;
        document.getElementById('finalAccuracy').innerText = `${accuracy}%`;
        document.getElementById('finalRankTitle').innerText = rankTitle;

        this.addReward(Math.floor(this.state.score / 10), 3);
        document.getElementById('modalResult').classList.add('active');
    },

    // 4. 다음 문제 출제
    nextQuestion() {
        if (this.state.currentMode === 'stage') {
            this.state.currentNumB = Math.floor(Math.random() * 9) + 1;
        } else {
            this.state.currentDan = Math.floor(Math.random() * 8) + 2;
            this.state.currentNumB = Math.floor(Math.random() * 9) + 1;
        }

        this.state.correctAnswer = this.state.currentDan * this.state.currentNumB;

        document.getElementById('quizNumA').innerText = this.state.currentDan;
        document.getElementById('quizNumB').innerText = this.state.currentNumB;
        document.getElementById('quizAnsBlank').innerText = '?';

        this.generateChoices();
        this.clearKey();
    },

    // 4지선다 보기 생성 (귀여운 과일/보석 아이콘 태그 추가)
    generateChoices() {
        const correct = this.state.correctAnswer;
        const dan = this.state.currentDan;
        const choices = new Set([correct]);

        const candidates = [
            correct + dan,
            correct - dan,
            correct + (Math.random() > 0.5 ? 2 : -2),
            correct + (Math.random() > 0.5 ? 1 : -1),
            dan * (this.state.currentNumB + 2),
            (dan + 1) * this.state.currentNumB
        ].filter(v => v > 0 && v !== correct);

        candidates.sort(() => Math.random() - 0.5);
        for (let cand of candidates) {
            choices.add(cand);
            if (choices.size === 4) break;
        }

        while (choices.size < 4) {
            const randomVal = correct + Math.floor(Math.random() * 16) - 8;
            if (randomVal > 0 && randomVal !== correct) choices.add(randomVal);
        }

        const choiceArr = Array.from(choices).sort(() => Math.random() - 0.5);
        const container = document.getElementById('choiceButtonsGrid');
        container.innerHTML = '';

        const iconTags = ['🍓', '⭐', '🍬', '🎀'];

        choiceArr.forEach((val, i) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `<span class="choice-icon-tag">${iconTags[i % iconTags.length]}</span> ${val}`;
            btn.onclick = () => this.handleAnswer(val, btn);
            container.appendChild(btn);
        });
    },

    // 정답 판정 및 타격 로직
    handleAnswer(selectedVal, targetBtn) {
        const isCorrect = (selectedVal === this.state.correctAnswer);
        if (this.state.currentMode === 'survival') {
            this.state.survivalTotalTries++;
        }

        if (isCorrect) {
            if (this.state.currentMode === 'survival') this.state.survivalCorrects++;
            this.processCorrect(targetBtn);
        } else {
            this.processWrong(targetBtn);
        }
    },

    processCorrect(targetBtn) {
        if (targetBtn) {
            targetBtn.classList.add('correct-burst');
        }

        this.state.combo++;
        if (this.state.combo > this.state.maxCombo) {
            this.state.maxCombo = this.state.combo;
        }

        const isCrit = (this.state.combo >= 3);
        this.state.isFever = isCrit;

        const damage = isCrit ? 40 : 25;
        const addScore = isCrit ? 200 : 100;
        this.state.score += addScore;
        document.getElementById('battleScore').innerText = this.state.score.toLocaleString();

        // 콤보 UI 표시
        const comboBox = document.getElementById('comboCounterBox');
        document.getElementById('comboCount').innerText = this.state.combo;
        comboBox.classList.add('show');

        // 피버 오버레이
        const feverEl = document.getElementById('feverOverlay');
        if (isCrit) {
            feverEl.style.display = 'block';
        } else {
            feverEl.style.display = 'none';
        }

        // 응원단 멘트 업데이트
        const quote = CHEER_QUOTES[Math.floor(Math.random() * CHEER_QUOTES.length)];
        document.getElementById('cheerText').innerText = quote;

        // 답안란 정답 표시
        document.getElementById('quizAnsBlank').innerText = this.state.correctAnswer;

        // ★ 모찌 토토의 적을 향한 에너지 파동탄 발사 & 타격 시퀀스 전격 실행!
        this.launchEnergyAttack(damage, isCrit);
    },

    // ★ 정답 시 모찌 토토가 적에게 번개/스타 에너지를 발사하는 액션 시퀀스
    launchEnergyAttack(damage, isCrit) {
        const arena = document.getElementById('battleArena');
        const heroBox = document.getElementById('playerHeroBox');
        const monsterZone = document.getElementById('monsterZone');
        const monsterGraphic = document.getElementById('monsterGraphic');

        if (!arena || !heroBox || !monsterZone) {
            // 폴백 처리
            this.state.monsterHp -= damage;
            this.updateMonsterHpUi();
            this.showDamageFx(damage, isCrit);
            if (this.state.monsterHp <= 0) setTimeout(() => this.monsterDefeated(), 300);
            else setTimeout(() => this.nextQuestion(), 500);
            return;
        }

        // 1. 모찌 토토 기합 펀치 반동 & 에너지 발사 사운드
        heroBox.classList.remove('hero-attack');
        void heroBox.offsetWidth;
        heroBox.classList.add('hero-attack');
        this.audio.playEnergyShoot(isCrit);

        // 2. 아레나 기준 토토 시작 좌표 & 몬스터 목표 좌표 계산
        const arenaRect = arena.getBoundingClientRect();
        const heroRect = heroBox.getBoundingClientRect();
        const monsterRect = monsterZone.getBoundingClientRect();

        const startX = (heroRect.left + heroRect.width / 2) - arenaRect.left;
        const startY = (heroRect.top + heroRect.height * 0.25) - arenaRect.top;

        const endX = (monsterRect.left + monsterRect.width / 2) - arenaRect.left;
        const endY = (monsterRect.top + monsterRect.height * 0.35) - arenaRect.top;

        // 3. 에너지 발사체 DOM 생성 (글로우 구체 + 별빛 코어)
        const projectile = document.createElement('div');
        projectile.className = `energy-projectile ${isCrit ? 'crit-blast' : ''}`;
        projectile.innerHTML = `
            <div class="projectile-glow"></div>
            <div class="projectile-core">${isCrit ? '🔥' : '⭐'}</div>
            <div class="projectile-ring"></div>
        `;
        projectile.style.left = `${startX}px`;
        projectile.style.top = `${startY}px`;
        arena.appendChild(projectile);

        // 4. 비행 궤적 꼬리 반짝이 파티클 생성
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const trailInterval = setInterval(() => {
            const pRect = projectile.getBoundingClientRect();
            const trailX = (pRect.left + pRect.width / 2) - arenaRect.left;
            const trailY = (pRect.top + pRect.height / 2) - arenaRect.top;
            const spark = document.createElement('div');
            spark.className = 'energy-trail-spark';
            spark.innerText = isCrit ? '✨' : '💖';
            spark.style.left = `${trailX}px`;
            spark.style.top = `${trailY}px`;
            arena.appendChild(spark);
            setTimeout(() => spark.remove(), 350);
        }, 50);

        // 5. 대각선 비행 애니메이션 (곡선 궤적으로 발사)
        const flyDuration = 320; // 0.32초 번개 비행
        const anim = projectile.animate([
            { transform: 'translate(0, 0) scale(0.6)', opacity: 0.85 },
            { transform: `translate(${deltaX * 0.45}px, ${deltaY * 0.45 - 24}px) scale(1.25)`, opacity: 1 },
            { transform: `translate(${deltaX}px, ${deltaY}px) scale(1.4)`, opacity: 1 }
        ], {
            duration: flyDuration,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        });

        anim.onfinish = () => {
            clearInterval(trailInterval);
            projectile.remove();

            // 6. 몬스터 적중 시 쾅! 폭발 임팩트
            this.triggerImpactBurst(endX, endY, isCrit);

            // 타겟 링 스트라이크 플래시
            const targetRing = document.getElementById('pogoTargetRing');
            if (targetRing) {
                targetRing.classList.remove('ring-strike');
                void targetRing.offsetWidth;
                targetRing.classList.add('ring-strike');
            }

            // 몬스터 피격 흔들림
            if (monsterGraphic) {
                monsterGraphic.classList.remove('monster-hit');
                void monsterGraphic.offsetWidth;
                monsterGraphic.classList.add('monster-hit');
            }

            // 타격 폭발음 & 대미지 팝업
            if (isCrit) {
                this.audio.playCritical();
            } else {
                this.audio.playPunch();
            }
            this.showDamageFx(damage, isCrit);

            // HP 차감
            this.state.monsterHp -= damage;
            this.updateMonsterHpUi();

            // 몬스터 격파 여부 판정
            if (this.state.monsterHp <= 0) {
                setTimeout(() => this.monsterDefeated(), 300);
            } else {
                setTimeout(() => this.nextQuestion(), 500);
            }
        };
    },

    // 몬스터 적중 시 화려한 폭발 버스트 이펙트
    triggerImpactBurst(x, y, isCrit) {
        const arena = document.getElementById('battleArena');
        if (!arena) return;

        const burst = document.createElement('div');
        burst.className = `energy-impact-burst ${isCrit ? 'crit' : ''}`;
        burst.style.left = `${x}px`;
        burst.style.top = `${y}px`;
        burst.innerHTML = `
            <div class="impact-ring-wave"></div>
            <div class="impact-flash">${isCrit ? '💥' : '⚡'}</div>
            <span class="impact-star s1">✨</span>
            <span class="impact-star s2">⭐</span>
            <span class="impact-star s3">🌟</span>
        `;
        arena.appendChild(burst);
        setTimeout(() => burst.remove(), 600);
    },

    processWrong(targetBtn) {
        if (targetBtn) {
            targetBtn.classList.add('wrong-burst');
            setTimeout(() => targetBtn.classList.remove('wrong-burst'), 400);
        }

        this.audio.playWrong();
        this.state.combo = 0;
        this.state.isFever = false;
        document.getElementById('comboCounterBox').classList.remove('show');
        document.getElementById('feverOverlay').style.display = 'none';
        document.getElementById('cheerText').innerText = "아쉽다! 다시 한번 펀치! 🥊";
    },

    showDamageFx(damage, isCrit) {
        const container = document.getElementById('damageFxContainer');
        const pop = document.createElement('div');
        pop.className = `damage-pop ${isCrit ? 'critical' : ''}`;
        pop.innerText = isCrit ? `🔥 -${damage} CRITICAL!` : `-${damage}`;
        pop.style.left = `${Math.random() * 40 + 30}%`;
        pop.style.top = `${Math.random() * 30 + 20}%`;
        container.appendChild(pop);
        setTimeout(() => pop.remove(), 700);
    },

    // 몬스터 격파 시
    monsterDefeated() {
        this.audio.playVictory();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });

        if (this.state.currentMode === 'survival') {
            this.state.survivalKills++;
            this.addReward(20, 0);
            this.spawnSurvivalMonster();
            this.nextQuestion();
        } else {
            const stage = STAGES_DATA[this.state.currentStageIdx];
            if (!this.state.clearedStages.includes(stage.dan)) {
                this.state.clearedStages.push(stage.dan);
                localStorage.setItem('gugu_cleared', JSON.stringify(this.state.clearedStages));
            }

            this.addReward(50, 1);
            document.getElementById('victoryTitle').innerText = `${stage.dan}단 ${stage.name} 격파 성공! 🐾`;
            document.getElementById('winCoins').innerText = '50';
            document.getElementById('winStars').innerText = '1';
            document.getElementById('winMaxCombo').innerText = this.state.maxCombo;
            document.getElementById('modalVictory').classList.add('active');
        }
    },

    retryStage() {
        this.closeAllModals();
        this.startStage(this.state.currentStageIdx);
    },

    nextStage() {
        this.closeAllModals();
        if (this.state.currentStageIdx < STAGES_DATA.length - 1) {
            this.startStage(this.state.currentStageIdx + 1);
        } else {
            this.openCertModal();
        }
    },

    // 가상 키패드 제어
    toggleInputMode() {
        const keypad = document.getElementById('virtualKeypad');
        const choices = document.getElementById('choiceButtonsGrid');
        if (keypad.style.display === 'none') {
            keypad.style.display = 'block';
            choices.style.display = 'none';
        } else {
            keypad.style.display = 'none';
            choices.style.display = 'grid';
        }
    },

    pressKey(numStr) {
        this.audio.playPunch();
        if (this.state.keypadBuffer.length < 3) {
            this.state.keypadBuffer += numStr;
            document.getElementById('keypadValue').innerText = this.state.keypadBuffer;
        }
    },

    clearKey() {
        this.state.keypadBuffer = '';
        document.getElementById('keypadValue').innerText = '';
    },

    submitKeypad() {
        if (!this.state.keypadBuffer) return;
        const val = parseInt(this.state.keypadBuffer, 10);
        this.handleAnswer(val, null);
    },

    // 5. 구구단 원리 수련장 제어
    startTrainingMode() {
        this.showScreen('viewTraining');
        this.renderTrainingTabs();
        this.renderTrainingContent();
    },

    renderTrainingTabs() {
        const container = document.getElementById('trainingDanTabs');
        container.innerHTML = '';
        [2, 3, 4, 5, 6, 7, 8, 9, 19].forEach(dan => {
            const btn = document.createElement('button');
            btn.className = `training-tab-btn ${dan === this.state.trainDan ? 'active' : ''}`;
            btn.innerText = `${dan}단`;
            btn.onclick = () => {
                this.state.trainDan = dan;
                this.renderTrainingTabs();
                this.renderTrainingContent();
                this.audio.playPunch();
            };
            container.appendChild(btn);
        });

        // 배수 버튼(1~9)
        const multContainer = document.getElementById('multiplierBtns');
        multContainer.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const btn = document.createElement('button');
            btn.className = `mult-btn ${i === this.state.trainMultiplier ? 'active' : ''}`;
            btn.innerText = `×${i}`;
            btn.onclick = () => {
                this.state.trainMultiplier = i;
                this.renderTrainingTabs();
                this.renderTrainingContent();
                this.audio.playPunch();
            };
            multContainer.appendChild(btn);
        }
    },

    renderTrainingContent() {
        const dan = this.state.trainDan;
        const mult = this.state.trainMultiplier;
        const result = dan * mult;

        document.getElementById('trainingTitle').innerText = `${dan}단 원리 탐구 🍎`;
        document.getElementById('trainA').innerText = dan;
        document.getElementById('trainB').innerText = mult;
        document.getElementById('trainResult').innerText = result;

        document.getElementById('trainExplanation').innerText = 
            `"${dan}개씩 ${mult}묶음이 모여서 모두 ${result}개가 되었어요!"`;

        // 도트 묶음셈 시각화
        const dotsContainer = document.getElementById('dotsContainer');
        dotsContainer.innerHTML = '';

        for (let group = 1; group <= mult; group++) {
            const groupCard = document.createElement('div');
            groupCard.className = 'dot-group-card';
            
            const label = document.createElement('span');
            label.className = 'group-header-label';
            label.innerText = `${group}번째 묶음 (${dan}개)`;
            groupCard.appendChild(label);

            const row = document.createElement('div');
            row.className = 'group-dots-row';

            for (let d = 1; d <= dan; d++) {
                const dot = document.createElement('div');
                dot.className = 'count-dot';
                dot.innerText = (group - 1) * dan + d;
                row.appendChild(dot);
            }

            groupCard.appendChild(row);
            dotsContainer.appendChild(groupCard);
        }
    },

    // 6. 음성 TTS (한국어 리듬 낭독)
    speakFormula(dan, mult, result) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const korNums = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
        let danStr = (dan <= 9) ? korNums[dan] : `${dan}`;
        let multStr = (mult <= 9) ? korNums[mult] : `${mult}`;

        const text = `${danStr} ${multStr} ${result}!`;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ko-KR';
        utter.rate = 1.05;
        utter.pitch = 1.25;
        window.speechSynthesis.speak(utter);
    },

    // 7. 격파왕 공인 인증서 모달 제어
    openCertModal() {
        this.closeAllModals();
        document.getElementById('certKidName').value = this.state.kidName;
        document.getElementById('certDisplayName').innerText = this.state.kidName;
        document.getElementById('certRandomNo').innerText = Math.floor(Math.random() * 900 + 100);

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        document.getElementById('certDateDisplay').innerText = `${year}년 ${month}월 ${day}일`;

        document.getElementById('modalCert').classList.add('active');
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
        this.audio.playVictory();
    },

    updateCertName() {
        const val = document.getElementById('certKidName').value.trim() || '김민준';
        this.state.kidName = val;
        localStorage.setItem('gugu_kid_name', val);
        document.getElementById('certDisplayName').innerText = val;
    },

    closeCertModal() {
        document.getElementById('modalCert').classList.remove('active');
    },

    shareCert() {
        const shareText = `[초등 구구단 격파왕 공인 인증서]\n우리 아이(${this.state.kidName})가 구구단 몬스터를 모두 격파하고 구구단 격파왕에 등극했습니다! 🥊🔥\n인스타 @cheer.papa`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert("🎉 자랑하기 문구가 클립보드에 복사되었습니다! 인스타 스토리나 카톡에 공유해보세요!");
            });
        } else {
            alert(shareText);
        }
    },

    closeAllModals() {
        document.querySelectorAll('.game-modal').forEach(m => m.classList.remove('active'));
    }
};

// 페이지 로드 시 앱 기동
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
