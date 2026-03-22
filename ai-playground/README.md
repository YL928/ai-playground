# 🎮 AI Playground - AI全链路小游戏开发引擎

基于AI全链路工具链的小游戏快速开发引擎，支持文字描述生成游戏代码、美术资源、音频，并直接导入 Cocos Creator 开发。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 功能特性

| 模块 | 功能描述 |
|------|----------|
| 🎨 AI美术生成 | 文字描述 → AI生成图片 → 预处理 → 导入Cocos |
| 💻 AI逻辑生成 | 自然语言描述 → 生成Cocos TypeScript组件代码 |
| 🔊 AI音频生成 | 文字描述 → AI生成音乐/音效 → 导入Cocos |
| 📦 游戏模板 | 预置点击类、跑酷、三消、塔防等常见游戏模板 |

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

### 生成第一个游戏

#### 方式一：使用模板生成

```bash
# 运行内置模板生成器
node generate-clicker-demo.js
```

生成的代码在 `generated-scripts/` 目录，可直接导入 Cocos Creator。

#### 方式二：自定义生成

修改 `src/index.ts` 中的描述文本，运行：

```bash
node dist/index.js
```

## 📖 使用指南

### 1. AI逻辑生成

在 `src/game-templates.ts` 中选择游戏模板：

```typescript
// 可选模板
- clicker     // 点击类游戏
- runner      // 跑酷游戏
- match3      // 三消游戏
- platformer  // 平台跳跃
- towerDefense // 塔防游戏
```

### 2. 导入Cocos Creator

生成的脚本在 `cocos-assets/scripts/` 目录：

1. 打开 Cocos Creator 3.x
2. 新建 2D 项目
3. 将 `cocos-assets/` 整个文件夹拖入资源库
4. 按照 `cocos-assets/SCENE_SETUP.md` 搭建场景
5. 运行游戏

### 3. 可直接预览的HTML版本

游戏也生成了纯HTML版本，无需Cocos即可预览：

```
output/clicker-demo/index.html
```

直接用浏览器打开即可游玩。

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
│   ├── sprites/             # 精灵图
│   ├── audio/               # 音频资源
│   └── SCENE_SETUP.md       # 场景搭建指南
├── output/                   # 输出目录
│   └── clicker-demo/        # HTML可预览版本
├── demo-flow.sh             # 流程验证脚本
└── package.json
```

## 🎯 生成的游戏Demo

### 点击大冒险

一个经典的点击类增量游戏：

- 点击按钮获得分数
- 消耗分数升级点击威力
- 无限挑战更高分数

**预览方式：**

1. **HTML版本**（无需任何环境）：
   ```bash
   # 直接打开
   open output/clicker-demo/index.html
   ```

2. **Cocos Creator版本**：
   - 将 `cocos-assets/` 导入 Cocos Creator
   - 按 `SCENE_SETUP.md` 搭建场景

## 🔧 自定义开发

### 添加新的游戏模板

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

### 添加新的AI生成模块

参考现有的生成器实现：

```typescript
// src/ai-xxx-generator.ts
export class AIXXXGenerator {
  async generate(prompt: string): Promise<any> {
    // 调用大模型API生成内容
  }
}
```

## 📝 依赖

- `axios` - HTTP请求
- `typescript` - TypeScript编译
- `@types/node` - Node.js类型定义

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件

---

_由 AI Playground 生成_
