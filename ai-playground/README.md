# 🎮 AI Playground - AI全链路小游戏开发引擎

基于AI全链路工具链的小游戏快速开发引擎，支持文字描述生成游戏代码、美术资源、音频，并直接导入 Cocos Creator 开发。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ⚠️ Demo项目说明

> 本项目包含多个AI生成的小游戏Demo，演示了AI全链路游戏开发能力。
> 生成的代码可直接用于Cocos Creator 3.x项目开发。

## ✨ 功能特性

| 模块 | 功能描述 |
|------|----------|
| 🎨 AI美术生成 | 文字描述 → AI生成图片 → 预处理 → 导入Cocos |
| 💻 AI逻辑生成 | 自然语言描述 → 生成Cocos TypeScript组件代码 |
| 🔊 AI音频生成 | 文字描述 → AI生成音乐/音效 → 导入Cocos |
| 📦 游戏模板 | 预置点击类、跑酷、三消、塔防等常见游戏模板 |

## 🎯 Demo游戏列表

| 游戏 | 类型 | 说明 |
|------|------|------|
| [点击大冒险](./output/clicker-demo/) | 增量点击 | 点击获得分数，升级增加威力 |
| [三消宝石](./output/match3-demo/) | 经典三消 | 交换消除，30步内达成目标 |

### 快速试玩

无需任何环境，直接用浏览器打开HTML文件即可：

```bash
# 点击大冒险
open output/clicker-demo/index.html

# 三消宝石
open output/match3-demo/index.html
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0
- TypeScript >= 5.0
- Cocos Creator 3.x（用于游戏开发）

### 安装

```bash
cd ai-playground
npm install
npm run build
```

### 配置API Key

本项目使用火山引擎大模型生成游戏代码，需要配置API Key：

```bash
# 设置环境变量
export ARK_API_KEY=your_api_key_here
```

### 生成游戏

#### 生成点击大冒险

```bash
node generate-clicker-demo.js
```

#### 生成三消游戏

```bash
node generate-match3-demo.js
```

生成的代码在 `generated-scripts/` 目录，可直接导入 Cocos Creator。

## 📖 使用指南

### 1. 导入Cocos Creator

1. 打开 Cocos Creator 3.x
2. 新建 2D 项目
3. 将 `cocos-assets/` 整个文件夹拖入资源库
4. 按照对应的 `*_SCENE_SETUP.md` 搭建场景
5. 运行游戏

### 2. 自定义生成

修改生成器脚本中的模板描述，运行：

```bash
node generate-xxx-demo.js
```

### 3. 添加新的游戏模板

在 `src/game-templates.ts` 中添加：

```typescript
const GameTemplates = {
  mygame: {
    name: '我的游戏',
    description: '游戏描述',
    basePrompt: `游戏核心玩法：...`,
    components: ['ComponentA', 'ComponentB']
  }
};
```

## 📁 项目结构

```
ai-playground/
├── src/                      # 源代码
│   ├── ai-art-generator.ts  # AI美术生成模块
│   ├── ai-logic-generator.ts # AI逻辑生成模块
│   ├── ai-audio-generator.ts # AI音频生成模块
│   ├── game-templates.ts     # 游戏模板定义
│   └── index.ts             # 入口文件
├── generated-scripts/       # 生成的TypeScript组件
├── cocos-assets/            # Cocos Creator资源包
│   ├── scripts/             # 游戏脚本
│   ├── textures/            # 图片资源
│   ├── backgrounds/         # 背景资源
│   ├── sprites/            # 精灵图
│   ├── audio/               # 音频资源
│   ├── SCENE_SETUP.md       # 点击游戏场景指南
│   └── MATCH3_SCENE_SETUP.md # 三消游戏场景指南
├── output/                   # 输出目录
│   ├── clicker-demo/        # 点击游戏HTML版本
│   └── match3-demo/         # 三消游戏HTML版本
├── generate-clicker-demo.js # 点击游戏生成器
├── generate-match3-demo.js  # 三消游戏生成器
├── demo-flow.sh             # 流程验证脚本
└── package.json
```

## 📝 依赖

- `axios` - HTTP请求
- `typescript` - TypeScript编译
- `@types/node` - Node.js类型定义

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

_由 AI Playground 生成_
