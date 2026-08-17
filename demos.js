/* 动作教学：内置 SVG 动画演示 + 外部视频搜索链接 */

// ---- SVG 构造器（统一画布 200x160，地面 y=130）----
function frame(inner) {
  return `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" class="demo-svg">
    <line x1="10" y1="130" x2="190" y2="130" stroke="var(--text-soft)" stroke-width="1" opacity="0.3"/>
    ${inner}
  </svg>`;
}
const MAT = `fill="#ff7a59"`;
const MAT2 = `fill="#ffb454"`;
const STICK = `stroke="#2a1f1a" stroke-width="4" stroke-linecap="round"`;

// 每个动作的 SVG 动画（纯矢量，离线可用，循环演示正确姿态轨迹）
// 使用 SMIL/CSS 动画，不依赖任何外部资源
const DEMOS = {
  "卷腹": {
    svg: cruncher(),
    tip: "下背贴地，靠腹部卷起，下巴微收，不要拽脖子。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("卷腹 正确做法 教学"),
  },
  "反向卷腹": {
    svg: reverseCrunch(),
    tip: "抬臀卷盆骨，腿不要甩，控制下放感受下腹收缩。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("反向卷腹 教学"),
  },
  "俄罗斯转体": {
    svg: russianTwist(),
    tip: "上半身微后仰，左右触地，脚离地可加难度。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("俄罗斯转体 正确做法"),
  },
  "平板支撑": {
    svg: plank(),
    tip: "肩肘垂直，臀腹收紧成直线，不塌腰不撅屁股。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("平板支撑 标准动作"),
  },
  "登山跑": {
    svg: mountainClimber(),
    tip: "双手撑稳，膝盖快速交替提向胸口，核心不松。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("登山跑 教学"),
  },
  "仰卧抬腿": {
    svg: legRaise(),
    tip: "腿伸直缓慢下放，不借惯性，腰始终贴地。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("仰卧抬腿 下腹 教学"),
  },
  "死虫": {
    svg: deadBug(),
    tip: "腰始终贴地，对侧手脚缓慢伸展，慢就是快。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("死虫 动作 教学"),
  },
  "侧撑": {
    svg: sidePlank(),
    tip: "身体成一条直线，髋部不上塌，每侧 20 秒。",
    video: "https://search.bilibili.com/all?keyword=" + encodeURIComponent("侧支撑 标准动作"),
  },
};

// 卷腹：上半身上下卷动
function cruncher() {
  return frame(`
    <g>
      <ellipse cx="100" cy="138" rx="46" ry="12" fill="#f6ece7"/>
      <rect x="84" y="96" width="32" height="34" rx="10" ${MAT}/>
      <circle cx="100" cy="80" r="13" ${MAT2}/>
      <line x1="100" y1="112" x2="70" y2="128" ${STICK}/>
      <line x1="100" y1="112" x2="130" y2="128" ${STICK}/>
      <line x1="100" y1="100" x2="100" y2="60" ${STICK}>
        <animate attributeName="y2" values="60;42;60" dur="2s" repeatCount="indefinite"/>
      </line>
      <circle cx="100" cy="50" r="11" ${MAT2}>
        <animate attributeName="cy" values="50;34;50" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>`);
}
// 反向卷腹：双腿向胸抬起
function reverseCrunch() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="44" ry="10" fill="#f6ece7"/>
      <rect x="86" y="104" width="28" height="26" rx="9" ${MAT}/>
      <circle cx="100" cy="90" r="12" ${MAT2}/>
      <line x1="100" y1="116" x2="100" y2="150" ${STICK}/>
      <g>
        <line x1="100" y1="116" x2="84" y2="92" ${STICK}>
          <animate attributeName="x2" values="84;92;84" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="92;70;92" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="100" y1="116" x2="116" y2="92" ${STICK}>
          <animate attributeName="x2" values="116;108;116" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="y2" values="92;70;92" dur="2s" repeatCount="indefinite"/>
        </line>
        <circle cx="84" cy="92" r="6" ${MAT2}>
          <animate attributeName="cy" values="92;70;92" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="84;92;84" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="116" cy="92" r="6" ${MAT2}>
          <animate attributeName="cy" values="92;70;92" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="cx" values="116;108;116" dur="2s" repeatCount="indefinite"/>
        </circle>
      </g>
    </g>`);
}
// 俄罗斯转体：上半身后仰 + 手臂左右摆
function russianTwist() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="48" ry="10" fill="#f6ece7"/>
      <line x1="100" y1="120" x2="100" y2="150" ${STICK}/>
      <line x1="100" y1="120" x2="80" y2="150" ${STICK}/>
      <line x1="100" y1="120" x2="120" y2="150" ${STICK}/>
      <g transform="rotate(0 100 108)">
        <animateTransform attributeName="transform" type="rotate" values="20 100 108;-20 100 108;20 100 108" dur="2s" repeatCount="indefinite"/>
        <rect x="92" y="92" width="16" height="30" rx="7" ${MAT}/>
        <line x1="100" y1="98" x2="78" y2="84" ${STICK}>
          <animate attributeName="x2" values="78;122;78" dur="2s" repeatCount="indefinite"/>
        </line>
        <line x1="100" y1="98" x2="122" y2="84" ${STICK}>
          <animate attributeName="x2" values="122;78;122" dur="2s" repeatCount="indefinite"/>
        </line>
        <circle cx="100" cy="80" r="11" ${MAT2}/>
      </g>
    </g>`);
}
// 平板支撑：静态 + 轻微呼吸
function plank() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="60" ry="9" fill="#f6ece7"/>
      <circle cx="40" cy="120" r="11" ${MAT2}/>
      <line x1="46" y1="124" x2="120" y2="120" ${STICK}/>
      <line x1="120" y1="120" x2="158" y2="138" ${STICK}/>
      <rect x="44" y="116" width="74" height="14" rx="7" ${MAT}>
        <animate attributeName="y" values="116;114;116" dur="3s" repeatCount="indefinite"/>
      </rect>
      <line x1="40" y1="128" x2="34" y2="138" ${STICK}/>
    </g>`);
}
// 登山跑：双腿交替收
function mountainClimber() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="58" ry="9" fill="#f6ece7"/>
      <circle cx="150" cy="118" r="11" ${MAT2}/>
      <line x1="150" y1="126" x2="100" y2="120" ${STICK}/>
      <line x1="100" y1="120" x2="60" y2="138" ${STICK}/>
      <rect x="100" y="110" width="50" height="14" rx="7" ${MAT}/>
      <!-- 左腿收 -->
      <line x1="100" y1="118" x2="118" y2="92" ${STICK}>
        <animate attributeName="x2" values="118;82;118" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="92;120;92" dur="1s" repeatCount="indefinite"/>
      </line>
      <circle cx="118" cy="92" r="6" ${MAT2}>
        <animate attributeName="cx" values="118;82;118" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="92;120;92" dur="1s" repeatCount="indefinite"/>
      </circle>
      <!-- 右腿伸 -->
      <line x1="100" y1="118" x2="80" y2="92" ${STICK}>
        <animate attributeName="x2" values="80;118;80" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="92;120;92" dur="1s" repeatCount="indefinite"/>
      </line>
      <circle cx="80" cy="92" r="6" ${MAT2}>
        <animate attributeName="cx" values="80;118;80" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="92;120;92" dur="1s" repeatCount="indefinite"/>
      </circle>
    </g>`);
}
// 仰卧抬腿：双腿整体上下
function legRaise() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="44" ry="10" fill="#f6ece7"/>
      <rect x="86" y="104" width="28" height="26" rx="9" ${MAT}/>
      <circle cx="100" cy="90" r="12" ${MAT2}/>
      <line x1="100" y1="116" x2="100" y2="128" ${STICK}/>
      <g>
        <line x1="100" y1="128" x2="86" y2="128" ${STICK}>
          <animate attributeName="y2" values="128;80;128" dur="2.2s" repeatCount="indefinite"/>
        </line>
        <line x1="100" y1="128" x2="114" y2="128" ${STICK}>
          <animate attributeName="y2" values="128;80;128" dur="2.2s" repeatCount="indefinite"/>
        </line>
        <circle cx="86" cy="128" r="6" ${MAT2}>
          <animate attributeName="cy" values="128;80;128" dur="2.2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="114" cy="128" r="6" ${MAT2}>
          <animate attributeName="cy" values="128;80;128" dur="2.2s" repeatCount="indefinite"/>
        </circle>
      </g>
    </g>`);
}
// 死虫：对侧手脚伸展
function deadBug() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="44" ry="10" fill="#f6ece7"/>
      <rect x="84" y="104" width="32" height="24" rx="9" ${MAT}/>
      <circle cx="100" cy="90" r="12" ${MAT2}/>
      <!-- 左上臂 + 右下腿 伸出 -->
      <line x1="100" y1="112" x2="70" y2="84" ${STICK}>
        <animate attributeName="x2" values="70;92;70" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="84;100;84" dur="2.4s" repeatCount="indefinite"/>
      </line>
      <circle cx="70" cy="84" r="6" ${MAT2}>
        <animate attributeName="cx" values="70;92;70" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="84;100;70" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <line x1="100" y1="116" x2="130" y2="120" ${STICK}>
        <animate attributeName="x2" values="130;108;130" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="120;140;120" dur="2.4s" repeatCount="indefinite"/>
      </line>
      <circle cx="130" cy="120" r="6" ${MAT2}>
        <animate attributeName="cx" values="130;108;130" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="120;140;120" dur="2.4s" repeatCount="indefinite"/>
      </circle>
    </g>`);
}
// 侧撑：侧身支撑 + 髋部微动
function sidePlank() {
  return frame(`
    <g>
      <ellipse cx="100" cy="140" rx="50" ry="9" fill="#f6ece7"/>
      <line x1="60" y1="60" x2="60" y2="138" ${STICK}/>
      <line x1="60" y1="60" x2="150" y2="70" ${STICK}>
        <animate attributeName="y2" values="70;66;70" dur="2.6s" repeatCount="indefinite"/>
      </line>
      <circle cx="60" cy="52" r="11" ${MAT2}/>
      <rect x="58" y="64" width="86" height="13" rx="6" ${MAT}>
        <animate attributeName="y" values="64;60;64" dur="2.6s" repeatCount="indefinite"/>
      </rect>
      <line x1="60" y1="138" x2="60" y2="138" ${STICK}/>
    </g>`);
}

// ---- 教学弹层控制 ----
function openDemo(name) {
  const d = DEMOS[name];
  if (!d) return;
  document.getElementById("demoTitle").textContent = name + " · 动作教学";
  document.getElementById("demoSvg").innerHTML = d.svg;
  document.getElementById("demoTip").textContent = d.tip;
  document.getElementById("demoVideo").href = d.video;
  document.getElementById("demoModal").hidden = false;
}
function closeDemo() { document.getElementById("demoModal").hidden = true; }
