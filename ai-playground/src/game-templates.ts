/**
 * 常见游戏类型模板
 * 为AI生成提供基础框架
 */

export interface GameTemplate {
  name: string;
  description: string;
  basePrompt: string;
  components: string[];
}

// 预定义常见小游戏模板
export const GameTemplates: Record<string, GameTemplate> = {
  clicker: {
    name: '点击类游戏',
    description: '点击得分，升级类点击游戏',
    basePrompt: `这是一个点击类小游戏，核心玩法：
- 点击主角/物体获得分数
- 可以升级增加点击收益
- 显示当前分数
需要生成分数管理组件和点击处理组件`,
    components: ['ScoreManager', 'ClickHandler']
  },
  runner: {
    name: '跑酷游戏',
    description: '自动奔跑，躲避障碍物',
    basePrompt: `这是一个竖版跑酷游戏，核心玩法：
- 角色自动向前奔跑
- 左右滑动或点击切换轨道躲避障碍物
- 计算奔跑距离作为得分
需要生成角色移动控制器、障碍物生成器、得分计算组件`,
    components: ['PlayerMovement', 'ObstacleSpawner', 'ScoreSystem']
  },
  match3: {
    name: '三消游戏',
    description: '交换消除，关卡制',
    basePrompt: `这是一个三消游戏，核心玩法：
- 交换相邻元素，三个相同连成一线即可消除
- 消除后上面元素下落填充
- 计算得分和目标
需要生成格子地图、交换逻辑、消除检测、得分系统`,
    components: ['GridManager', 'MatchDetector', 'ScoreSystem']
  },
  platformer: {
    name: '平台跳跃',
    description: '横版平台跳跃',
    basePrompt: `这是一个横版平台跳跃游戏，核心玩法：
- 左右移动控制角色
- 跳跃踩怪
- 物理碰撞
需要生成角色控制器、相机跟随、碰撞处理组件`,
    components: ['PlayerController', 'CameraFollow', 'EnemyAI']
  },
  towerDefense: {
    name: '塔防游戏',
    description: '建造炮塔防御怪物进攻',
    basePrompt: `这是一个塔防游戏，核心玩法：
- 放置炮塔攻击路径上的怪物
- 怪物沿固定路径行进
- 击杀怪物获得金币，建造升级炮塔
需要生成塔、怪物、路径点、金币系统组件`,
    components: ['Tower', 'Enemy', 'WaveManager', 'GoldSystem']
  }
};

/**
 * 获取模板，生成完整描述
 */
export function getTemplateDescription(templateName: string, customDesc?: string): string {
  const template = GameTemplates[templateName];
  if (!template) {
    return customDesc || '';
  }
  if (customDesc) {
    return `${template.basePrompt}\n\n额外需求：${customDesc}`;
  }
  return template.basePrompt;
}

/**
 * 获取模板需要生成的组件列表
 */
export function getTemplateComponents(templateName: string): string[] {
  const template = GameTemplates[templateName];
  if (!template) {
    return ['GameMain'];
  }
  return template.components;
}
