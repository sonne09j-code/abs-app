/* 腹肌训练营 App */

// ---- 训练动作库（每周递进）----
// 每轮动作列表；节奏统一 40 秒做 / 20 秒休
const WEEKS = [
  {
    title: "第 1 周 · 基础适应", rounds: 3,
    exercises: ["卷腹", "反向卷腹", "俄罗斯转体", "平板支撑"],
    note: "每动作 40 秒，休息 20 秒，做 3 轮。平板支撑撑不住就力竭即停。"
  },
  {
    title: "第 2 周 · 加量", rounds: 3,
    exercises: ["卷腹", "反向卷腹", "俄罗斯转体", "登山跑", "平板支撑"],
    note: "每动作 40 秒，休息 20 秒，做 3 轮。"
  },
  {
    title: "第 3 周 · 强化", rounds: 4,
    exercises: ["卷腹", "仰卧抬腿", "俄罗斯转体", "登山跑", "死虫", "侧撑"],
    note: "每动作 40 秒，休息 20 秒，做 4 轮。侧撑每侧 20 秒。"
  },
  {
    title: "第 4 周 · 冲刺", rounds: 4,
    exercises: ["卷腹", "仰卧抬腿", "俄罗斯转体", "登山跑", "死虫", "侧撑", "平板支撑"],
    note: "每动作 45 秒，休息 15 秒，做 4 轮。"
  },
];

const TRAIN_SEC = 40, REST_SEC = 20;       // 第1-3周
const TRAIN_SEC_H = 45, REST_SEC_H = 15;   // 第4周

// ---- 存档 ----
const SAVE_KEY = "abs-app-v1";
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { return {}; }
}
function saveSave() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
const save = loadSave();
save.checks = save.checks || {};   // { "2026-08-17": {rounds, weeks} }
save.theme = save.theme || "light";

// ---- 视图切换 ----
const views = {
  home: document.getElementById("homeView"),
  train: document.getElementById("trainView"),
  plan: document.getElementById("planView"),
  remind: document.getElementById("remindView"),
  progress: document.getElementById("progressView"),
};
function showView(name) {
  Object.values(views).forEach(v => v.hidden = true);
  views[name].hidden = false;
  if (name === "home") renderHome();
  if (name === "progress") renderProgress();
  if (name === "plan") renderPlan();
}
document.querySelectorAll("[data-go]").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.go));
});

// ---- 主题 ----
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  save.theme = t; saveSave();
  const icon = t === "dark" ? "☀️" : "🌙";
  document.querySelectorAll("#themeBtn").forEach(b => b.textContent = icon);
}
document.getElementById("themeBtn").addEventListener("click", () => {
  applyTheme(save.theme === "dark" ? "light" : "dark");
});

// ---- 训练日计算（每周一三五七）----
function isTrainDay(d) { const w = d.getDay(); return [1,3,5,0].includes(w); } // 0=周日
function todayKey(d = new Date()) {
  return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}
function weekTrainDays() {
  // 本周一 ~ 周日
  const now = new Date(); now.setHours(0,0,0,0);
  const day = (now.getDay() + 6) % 7; // 周一=0
  const monday = new Date(now); monday.setDate(now.getDate() - day);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

// ---- 首页 ----
function renderHome() {
  const days = weekTrainDays();
  const done = days.filter(d => save.checks[todayKey(d)]).length;
  document.getElementById("weekDone").textContent = done;
  const pct = Math.round(done / 4 * 100);
  document.getElementById("weekRing").textContent = pct + "%";
  const todayTrain = isTrainDay(new Date());
  const todayDone = !!save.checks[todayKey()];
  document.getElementById("todayTip").textContent = todayTrain
    ? (todayDone ? "今天已打卡，太棒了 💪" : "今天该练腹啦 💪")
    : "今天休息日，可做轻量版或好好恢复 😴";

  const bar = document.getElementById("weekBar");
  const names = ["一","二","三","四","五","六","日"];
  bar.innerHTML = "";
  days.forEach((d, i) => {
    const el = document.createElement("div");
    const trained = !!save.checks[todayKey(d)];
    const isToday = todayKey(d) === todayKey();
    el.className = "week-day" + (isTrainDay(d) ? " train" : "") + (trained ? " done" : "") + (isToday ? " today" : "");
    el.textContent = names[i] + (isTrainDay(d) ? "·练" : "·休");
    bar.appendChild(el);
  });
}

// ---- 训练计时器 ----
const timer = {
  running: false, paused: false,
  round: 0, exIndex: 0, phase: "work", // work | rest
  remain: TRAIN_SEC, total: TRAIN_SEC,
  intervalId: null, weekIdx: 0,
};

const elExName = document.getElementById("exName");
const elTimerNum = document.getElementById("timerNum");
const elTimerState = document.getElementById("timerState");
const elRoundNo = document.getElementById("roundNo");
const elRoundTotal = document.getElementById("roundTotal");
const elNextEx = document.getElementById("nextEx");
const ringFg = document.getElementById("ringFg");
const RING_LEN = 2 * Math.PI * 90;

function speak(text) {
  try {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "zh-CN"; u.rate = 1.05; u.pitch = 1;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    }
  } catch (e) {}
}
function vibrate(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

function currentWeek() { return WEEKS[timer.weekIdx]; }

function setRing(remain, total) {
  const ratio = remain / total;
  ringFg.style.strokeDasharray = RING_LEN;
  ringFg.style.strokeDashoffset = RING_LEN * (1 - ratio);
}

function startRound() {
  showView("train");
  timer.weekIdx = 0; // 默认第1周；如需选周可扩展
  timer.round = 1;
  timer.exIndex = 0;
  timer.running = true; timer.paused = false;
  document.getElementById("startTrainBtn").hidden = true;
  document.getElementById("pauseTrainBtn").hidden = false;
  elRoundTotal.textContent = currentWeek().rounds;
  beginExercise();
  tick();
  timer.intervalId = setInterval(tick, 1000);
}

function beginExercise() {
  const wk = currentWeek();
  timer.phase = "work";
  const useHard = timer.weekIdx === 3;
  timer.total = useHard ? TRAIN_SEC_H : TRAIN_SEC;
  timer.remain = timer.total;
  elExName.textContent = wk.exercises[timer.exIndex];
  elTimerState.textContent = "训练 · 加油";
  elRoundNo.textContent = timer.round;
  ringFg.style.stroke = "var(--primary)";
  const next = wk.exercises[(timer.exIndex + 1) % wk.exercises.length];
  elNextEx.textContent = next;
  setRing(timer.remain, timer.total);
  speak("开始 " + wk.exercises[timer.exIndex]);
  vibrate(60);
}

function tick() {
  if (timer.paused) return;
  timer.remain--;
  elTimerNum.textContent = timer.remain;
  setRing(Math.max(0, timer.remain), timer.total);
  if (timer.remain <= 0) advance();
}

function advance() {
  const wk = currentWeek();
  if (timer.phase === "work") {
    // 进入休息
    timer.phase = "rest";
    const useHard = timer.weekIdx === 3;
    timer.total = useHard ? REST_SEC_H : REST_SEC;
    timer.remain = timer.total;
    elExName.textContent = "休息";
    elTimerState.textContent = "休息一下";
    ringFg.style.stroke = "var(--accent)";
    speak("休息");
    vibrate([40, 30, 40]);
  } else {
    // 休息结束 -> 下一动作 或 下一轮
    timer.exIndex++;
    if (timer.exIndex >= wk.exercises.length) {
      timer.exIndex = 0;
      timer.round++;
      if (timer.round > wk.rounds) { finishRound(); return; }
      speak("第 " + timer.round + " 轮");
    }
    beginExercise();
  }
}

function finishRound() {
  clearInterval(timer.intervalId);
  timer.running = false;
  document.getElementById("startTrainBtn").hidden = false;
  document.getElementById("pauseTrainBtn").hidden = true;
  elExName.textContent = "完成";
  elTimerNum.textContent = "🎉";
  elTimerState.textContent = "本轮结束";
  // 打卡
  const key = todayKey();
  save.checks[key] = { rounds: currentWeek().rounds, week: timer.weekIdx + 1, at: Date.now() };
  saveSave();
  speak("训练完成，干得漂亮！");
  vibrate([80, 40, 80, 40, 80]);
  document.getElementById("doneSub").textContent = `第${timer.weekIdx+1}周 · ${currentWeek().rounds} 轮已完成，已为你打卡 ✅`;
  document.getElementById("doneModal").hidden = false;
}

document.getElementById("startTrainBtn").addEventListener("click", startRound);
document.getElementById("pauseTrainBtn").addEventListener("click", () => {
  timer.paused = !timer.paused;
  document.getElementById("pauseTrainBtn").textContent = timer.paused ? "▶ 继续" : "⏸ 暂停";
});
document.getElementById("skipBtn").addEventListener("click", () => {
  if (timer.running) { timer.remain = 1; }
});
document.getElementById("doneHomeBtn").addEventListener("click", () => {
  document.getElementById("doneModal").hidden = true;
  showView("home");
});

// ---- 动作教学弹层 ----
document.getElementById("demoClose").addEventListener("click", closeDemo);
document.getElementById("demoModal").addEventListener("click", (e) => {
  if (e.target.id === "demoModal") closeDemo();
});
// 训练页"看示范"：打开当前动作演示
document.getElementById("demoTrainBtn").addEventListener("click", () => {
  const name = elExName.textContent;
  if (name && name !== "准备" && name !== "休息" && name !== "完成") openDemo(name);
  else openDemo(currentWeek().exercises[0]);
});

// ---- 计划页 ----
function renderPlan() {
  const tabs = document.getElementById("planTabs");
  const body = document.getElementById("planBody");
  tabs.innerHTML = ""; body.innerHTML = "";
  WEEKS.forEach((wk, i) => {
    const t = document.createElement("button");
    t.className = "plan-tab" + (i === 0 ? " active" : "");
    t.textContent = "第" + (i+1) + "周";
    t.addEventListener("click", () => {
      tabs.querySelectorAll(".plan-tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      renderPlanBody(i);
    });
    tabs.appendChild(t);
  });
  renderPlanBody(0);
}
function renderPlanBody(i) {
  const wk = WEEKS[i];
  const body = document.getElementById("planBody");
  body.innerHTML = "";
  const title = document.createElement("div");
  title.className = "plan-week-title";
  title.textContent = wk.title + "（" + wk.rounds + " 轮）";
  body.appendChild(title);

  const intro = document.createElement("div");
  intro.className = "plan-card";
  intro.innerHTML = `<span class="tag">节奏</span><span class="tag">40秒做 / 20秒休</span><p style="margin:8px 0 0;font-size:13px;color:var(--text-soft);line-height:1.6">${wk.note}</p>`;
  body.appendChild(intro);

  wk.exercises.forEach((ex, idx) => {
    const c = document.createElement("div");
    c.className = "plan-card";
    const desc = EX_DESC[ex] || "";
    c.innerHTML = `<h4>${idx+1}. ${ex}</h4><ul><li>${desc}</li></ul>
      <button class="ex-demo-btn" data-ex="${ex}">👀 看动作示范</button>`;
    body.appendChild(c);
  });
  body.querySelectorAll(".ex-demo-btn").forEach(b => {
    b.addEventListener("click", () => openDemo(b.dataset.ex));
  });
}
const EX_DESC = {
  "卷腹": "腹直肌上部。下背贴地，靠腹部卷起，下巴微收，不拽脖子。",
  "反向卷腹": "腹直肌下部。抬臀卷盆骨，腿不要甩，控制下放。",
  "俄罗斯转体": "腹斜肌。上半身微后仰，左右触地，脚离地可加难度。",
  "平板支撑": "腹横肌/核心。肩肘垂直，臀腹收紧成直线，不塌腰。",
  "登山跑": "全身+核心。双手撑稳，膝盖快速交替提向胸口。",
  "仰卧抬腿": "腹直肌下部。腿伸直缓慢下放，不借惯性。",
  "死虫": "腹横肌深层。腰始终贴地，对侧手脚缓慢伸展。",
  "侧撑": "腹斜肌。身体成直线，髋部不上塌，每侧 20 秒。",
};

// ---- 打卡页 ----
function renderProgress() {
  const keys = Object.keys(save.checks).sort().reverse();
  document.getElementById("totalDays").textContent = keys.length;
  // 连续天数
  let streak = 0;
  const d = new Date(); d.setHours(0,0,0,0);
  while (save.checks[todayKey(d)]) { streak++; d.setDate(d.getDate()-1); }
  document.getElementById("streakDays").textContent = streak;
  document.getElementById("totalMins").textContent = keys.length * 12; // 估算
  const list = document.getElementById("checkList");
  list.innerHTML = "";
  if (keys.length === 0) {
    list.innerHTML = `<div class="check-empty">还没有打卡记录，去训练一局吧 💪</div>`;
    return;
  }
  keys.slice(0, 30).forEach(k => {
    const c = save.checks[k];
    const el = document.createElement("div");
    el.className = "check-item";
    el.innerHTML = `<span class="ci-date">${k}</span><span class="ci-meta">第${c.week}周 · ${c.rounds}轮</span>`;
    list.appendChild(el);
  });
}
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("确定清空所有打卡记录？")) { save.checks = {}; saveSave(); renderProgress(); }
});
document.getElementById("copyBtn").addEventListener("click", () => {
  const txt = document.getElementById("copyBox").textContent;
  navigator.clipboard.writeText(txt).then(() => {
    document.getElementById("copyBtn").textContent = "已复制 ✓";
    setTimeout(() => document.getElementById("copyBtn").textContent = "复制文案", 1500);
  }).catch(() => alert("复制失败，请手动长按选择"));
});

// ---- 初始化 ----
(function init() {
  applyTheme(save.theme);
  showView("home");
})();
