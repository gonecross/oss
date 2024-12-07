// js/main.js

let ideas = 0;
let population = 10; // 初始普通人口
let educatedPopulation = 0;
let maxPopulation = 10;
let inspirationIndex = 0;
let wood = 0;
let metal = 0;
let communicationMultiplier = 1;
let educationRate = 1;
let productionRate = 1;
let inspirationMultiplier = 1;
let aiClickSpeed = 0; // AI助理点击速率
let currentTechKey = null;

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
  renderUI();
  loadGame();

  // 主循环
  setInterval(gameLoop, 1000);
});

function gameLoop() {
  produceResources();
  growPopulation();
  educatePopulation();
  calculateInspiration();
  autoClick();
  updateUI();
}

// 资源生产逻辑
function produceResources() {
  // 每秒生产资源 = 人口 * 生产率 * (特定资源系数)
  // 木材产量
  let woodGain = (population * productionRate * 0.1);
  // 金属产量
  let metalGain = (population * productionRate * 0.05);

  wood += woodGain;
  wood = parseFloat(wood.toFixed(2));
  metal += metalGain;
  metal = parseFloat(metal.toFixed(2));
  console.log("wood gain: ", woodGain, "metal gain: ", metalGain);
  console.log("wood: ", wood, "metal: ", metal);
}

// 人口增长逻辑
function growPopulation() {
  // 如果已解锁农业，则人口每秒增长直到上限
  if (TECH_DATA["agriculture"] && TECH_DATA["agriculture"].unlocked) {
    let growthRate = 0.1;
    population = Math.min(population + growthRate, maxPopulation);
  }
}

// 教育逻辑
function educatePopulation() {
  // 根据教育速率，每秒将部分普通人口转化为受教育人口
  // 简化为每秒转化1个（*教育倍率）
  let canConvert = Math.min(1 * educationRate, population - educatedPopulation);
  educatedPopulation += canConvert;
}

// 灵感计算
function calculateInspiration() {
  // 灵感 = 受教育人口 * communicationMultiplier * inspirationMultiplier
  inspirationIndex += educatedPopulation * communicationMultiplier * inspirationMultiplier;
}

// 自动点击（AI助理）
function autoClick() {
  if (aiClickSpeed > 0) {
    ideas += aiClickSpeed;
  }
}

// 解锁科技尝试
function attemptUnlock() {
  if (!currentTechKey) return;
  const res = unlockTechnology(currentTechKey);
  const errorElem = document.getElementById('unlock-error');
  if (!res.success) {
    errorElem.innerText = res.message;
    errorElem.style.display = 'block';
  } else {
    errorElem.style.display = 'none';
    showTechDetails(currentTechKey); // 刷新详情
  }
}

// 解锁科技逻辑
function unlockTechnology(techKey) {
  const tech = TECH_DATA[techKey];
  if (!tech) return { success: false, message: "无此科技" };

  if (tech.unlocked) {
    return { success: false, message: "该科技已解锁" };
  }

  // 检查前置科技
  for (let req of tech.requirements) {
    if (!TECH_DATA[req] || !TECH_DATA[req].unlocked) {
      return { success: false, message: "前置科技未解锁" };
    }
  }

  // 检查资源
  if ((tech.cost.ideas && tech.cost.ideas > ideas) ||
    (tech.cost.wood && tech.cost.wood > wood) ||
    (tech.cost.metal && tech.cost.metal > metal)) {
    return { success: false, message: "资源不足" };
  }

  // 扣资源
  if (tech.cost.ideas) ideas -= tech.cost.ideas;
  if (tech.cost.wood) wood -= tech.cost.wood;
  if (tech.cost.metal) metal -= tech.cost.metal;

  tech.unlocked = true;

  // 应用效果
  const eff = tech.effects;
  if (eff.maxPopulation) maxPopulation += eff.maxPopulation;
  if (eff.productionRateMultiplier) productionRate *= eff.productionRateMultiplier;
  if (eff.educationRateMultiplier) educationRate *= eff.educationRateMultiplier;
  if (eff.inspirationRateMultiplier) inspirationMultiplier *= eff.inspirationRateMultiplier;
  if (eff.aiAssistantUpgrade) aiClickSpeed += 1;

  // 特定科技对communicationMultiplier影响
  if (techKey === "printingPress") communicationMultiplier *= 2;
  if (techKey === "internet") communicationMultiplier *= 2;

  saveGame();
  updateUI();
  return { success: true };
}

// 点击获取想法
function clickToGetIdea() {
  ideas++;
  updateUI();
}

// 显示科技详情
function showTechDetails(techKey) {
  currentTechKey = techKey;
  const tech = TECH_DATA[techKey];

  document.getElementById('detail-tech-name').innerText = tech.name;
  document.getElementById('detail-requirements').innerText = tech.requirements.length
    ? tech.requirements.map(r => TECH_DATA[r].name).join(", ")
    : "无";

  const costArr = [];
  for (let c in tech.cost) {
    costArr.push(`${c}:${tech.cost[c]}`);
  }
  document.getElementById('detail-cost').innerText = costArr.length > 0 ? costArr.join(", ") : "无";

  const eff = tech.effects;
  let effDesc = [];
  if (eff.populationGrowth) effDesc.push("人口增长率+" + eff.populationGrowth);
  if (eff.maxPopulation) effDesc.push("人口上限+" + eff.maxPopulation);
  if (eff.productionRateMultiplier) effDesc.push("生产速率x" + eff.productionRateMultiplier);
  if (eff.educationRateMultiplier) effDesc.push("教育速率x" + eff.educationRateMultiplier);
  if (eff.inspirationRateMultiplier) effDesc.push("灵感速率x" + eff.inspirationRateMultiplier);
  if (eff.aiAssistantUpgrade) effDesc.push("AI助理升级");
  if (eff.unlock) effDesc.push("解锁科技: " + eff.unlock.map(u => TECH_DATA[u].name).join(", "));
  document.getElementById('detail-effects').innerText = effDesc.join("; ");

  document.getElementById('detail-description').innerText = eff.description || "";

  const techLocked = !tech.unlocked;
  document.getElementById('unlock-tech-btn').disabled = !techLocked;
  document.getElementById('unlock-error').style.display = 'none';
}

// 更新UI
function updateUI() {
  document.getElementById('idea-count').innerText = Math.floor(ideas);
  document.getElementById('inspiration-count').innerText = Math.floor(inspirationIndex);
  document.getElementById('population-count').innerText = Math.floor(population);
  document.getElementById('educated-population-count').innerText = Math.floor(educatedPopulation);
  document.getElementById('wood-count').innerText = wood;
  document.getElementById('metal-count').innerText = metal;

  document.getElementById('max-population-count').innerText = maxPopulation;
  document.getElementById('wood-rate').innerText = (population * productionRate * 0.1).toFixed(2);
  document.getElementById('metal-rate').innerText = (population * productionRate * 0.05).toFixed(2);

  renderTechGraph();
}

// 初始化UI
function renderUI() {
  updateUI();
}

// 保存游戏进度
function saveGame() {
  const gameState = {
    ideas,
    population,
    educatedPopulation,
    maxPopulation,
    inspirationIndex,
    wood,
    metal,
    communicationMultiplier,
    educationRate,
    productionRate,
    inspirationMultiplier,
    aiClickSpeed,
    TECH_DATA
  };
  localStorage.setItem('gameState', JSON.stringify(gameState));
}

// 加载游戏进度
function loadGame() {
  const data = localStorage.getItem('gameState');
  if (data) {
    const state = JSON.parse(data);
    ideas = state.ideas;
    population = state.population;
    educatedPopulation = state.educatedPopulation;
    maxPopulation = state.maxPopulation;
    inspirationIndex = state.inspirationIndex;
    wood = state.wood;
    metal = state.metal;
    communicationMultiplier = state.communicationMultiplier;
    educationRate = state.educationRate;
    productionRate = state.productionRate;
    inspirationMultiplier = state.inspirationMultiplier;
    aiClickSpeed = state.aiClickSpeed;

    for (let k in state.TECH_DATA) {
      TECH_DATA[k] = state.TECH_DATA[k];
    }
  }
  updateUI();
}

// 渲染科技树SVG
function renderTechGraph() {
  const svg = document.getElementById('tech-graph');
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // 定义箭头标记
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrowhead");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "10");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "5");
  marker.setAttribute("markerHeight", "5");
  marker.setAttribute("orient", "auto");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  path.setAttribute("fill", "#555");
  marker.appendChild(path);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // 简易布局示例（可根据需要调整坐标）
  const layout = {
    fire: { x: 100, y: 100 },
    tools: { x: 200, y: 100 },
    agriculture: { x: 300, y: 100 },
    housing: { x: 400, y: 100 },
    writing: { x: 200, y: 200 },
    printingPress: { x: 300, y: 200 },
    library: { x: 400, y: 200 },
    industrial: { x: 100, y: 300 },
    steamEngine: { x: 200, y: 300 },
    factory: { x: 300, y: 300 },
    electricity: { x: 400, y: 300 },
    internet: { x: 500, y: 300 },
    artificialIntelligence: { x: 600, y: 300 },
    copperSmelting: { x: 300, y: 50 },
    ironSmelting: { x: 300, y: 400 }
    // 可根据techData扩展更多节点并为其指定坐标
  };

  // 绘制连线
  for (let techKey in TECH_DATA) {
    const tech = TECH_DATA[techKey];
    const targetPos = layout[techKey];
    if (!targetPos) continue;

    for (let req of tech.requirements) {
      if (layout[req]) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", layout[req].x + 40);
        line.setAttribute("y1", layout[req].y + 20);
        line.setAttribute("x2", targetPos.x + 40);
        line.setAttribute("y2", targetPos.y + 20);
        line.setAttribute("class", "edge");
        line.setAttribute("marker-end", "url(#arrowhead)");
        svg.appendChild(line);
      }
    }
  }

  // 绘制节点
  for (let techKey in TECH_DATA) {
    const tech = TECH_DATA[techKey];
    const pos = layout[techKey];
    if (!pos) continue; // 没有定义坐标的不显示

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
    g.setAttribute("class", "node " + (tech.unlocked ? "unlocked" : "locked"));
    g.addEventListener('click', () => showTechDetails(techKey));

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", "80");
    rect.setAttribute("height", "40");
    rect.setAttribute("rx", "5");
    rect.setAttribute("ry", "5");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "40");
    text.setAttribute("y", "25");
    text.setAttribute("text-anchor", "middle");
    text.textContent = tech.name;

    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  }
}