// js/techData.js

const TECH_DATA = {
  "fire": {
    "name": "火",
    "unlocked": true,
    "cost": { "ideas": 0 },
    "requirements": [],
    "effects": {
      "unlock": ["tools"],
      "description": "开启人类文明的起点，解锁基础工具研究。"
    }
  },
  "tools": {
    "name": "工具",
    "unlocked": false,
    "cost": { "ideas": 20 },
    "requirements": ["fire"],
    "effects": {
      "unlock": ["agriculture", "writing"],
      "description": "解锁农业和书写基础，为进一步发展铺路。"
    }
  },
  "agriculture": {
    "name": "农业",
    "unlocked": false,
    "cost": { "ideas": 50 },
    "requirements": ["tools"],
    "effects": {
      "populationGrowth": 0.1,
      "unlock": ["housing", "copperSmelting"],
      "description": "解锁基本粮食生产，不断增加人口。"
    }
  },
  "housing": {
    "name": "住房",
    "unlocked": false,
    "cost": { "ideas": 100, "wood": 50 },
    "requirements": ["agriculture"],
    "effects": {
      "maxPopulation": 20,
      "description": "为更多人口提供安居之所。"
    }
  },
  "writing": {
    "name": "书写",
    "unlocked": false,
    "cost": { "ideas": 80 },
    "requirements": ["tools"],
    "effects": {
      "unlock": ["printingPress", "library"],
      "description": "文字的出现使知识得以记录和传承。"
    }
  },
  "printingPress": {
    "name": "印刷机",
    "unlocked": false,
    "cost": { "ideas": 200, "wood": 100 },
    "requirements": ["writing"],
    "effects": {
      "educationRateMultiplier": 2,
      "description": "印刷机让知识传播速度倍增。"
    }
  },
  "library": {
    "name": "图书馆",
    "unlocked": false,
    "cost": { "ideas": 300, "wood": 200 },
    "requirements": ["writing", "printingPress"],
    "effects": {
      "educationRateMultiplier": 2,
      "inspirationRateMultiplier": 1.5,
      "description": "图书馆提高受教育人口的培养速度与灵感产出。"
    }
  },
  "copperSmelting": {
    "name": "铜冶炼",
    "unlocked": false,
    "cost": { "ideas": 120, "metal": 50 },
    "requirements": ["agriculture"],
    "effects": {
      "unlock": ["ironSmelting"],
      "description": "铜的冶炼为更高级的工具和工业化奠定基础。"
    }
  },
  "ironSmelting": {
    "name": "铁冶炼",
    "unlocked": false,
    "cost": { "ideas": 200, "metal": 100 },
    "requirements": ["copperSmelting"],
    "effects": {
      "unlock": ["industrial"],
      "description": "铁器时代到来，更坚固的工具提升生产力。"
    }
  },
  "industrial": {
    "name": "工业",
    "unlocked": false,
    "cost": { "ideas": 500, "metal": 100 },
    "requirements": ["ironSmelting"],
    "effects": {
      "unlock": ["steamEngine"],
      "description": "工业时代开启，资源产出与工具品质飞升。"
    }
  },
  "steamEngine": {
    "name": "蒸汽机",
    "unlocked": false,
    "cost": { "ideas": 800, "metal": 200 },
    "requirements": ["industrial"],
    "effects": {
      "productionRateMultiplier": 2,
      "unlock": ["factory", "electricity"],
      "description": "蒸汽机的发明大幅提高生产效率，引领工业革命。"
    }
  },
  "factory": {
    "name": "工厂",
    "unlocked": false,
    "cost": { "ideas": 1200, "metal": 300 },
    "requirements": ["steamEngine"],
    "effects": {
      "productionRateMultiplier": 1.5,
      "description": "工厂让批量生产成为可能，加速工业革命进程。"
    }
  },
  "electricity": {
    "name": "电力",
    "unlocked": false,
    "cost": { "ideas": 2000, "metal": 500 },
    "requirements": ["steamEngine", "printingPress"],
    "effects": {
      "unlock": ["internet"],
      "description": "电力的出现，为信息时代奠定基础。"
    }
  },
  "internet": {
    "name": "互联网",
    "unlocked": false,
    "cost": { "ideas": 5000, "metal": 1000 },
    "requirements": ["electricity", "library"],
    "effects": {
      "educationRateMultiplier": 10,
      "inspirationRateMultiplier": 2,
      "unlock": ["artificialIntelligence"],
      "description": "互联网让全球信息互联，知识传播和灵感激增。"
    }
  },
  "artificialIntelligence": {
    "name": "人工智能",
    "unlocked": false,
    "cost": { "ideas": 10000, "metal": 2000 },
    "requirements": ["internet", "writing"],
    "effects": {
      "aiAssistantUpgrade": true,
      "description": "人工智能让自动化与灵感生产进入新高度，智能革命到来。"
    }
  }
};

if (typeof module !== 'undefined') {
  module.exports = TECH_DATA;
}