/**
 * 生成完整三消游戏Demo
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './generated-scripts';
const COCOS_SCRIPTS_DIR = './cocos-assets/scripts';

function generateMatch3Game() {
  console.log('='.repeat(70));
  console.log('🎮 AI Playground - 生成完整三消游戏Demo');
  console.log('='.repeat(70));

  // 三消游戏组件模板
  const templates = {
    'GridManager.ts': `import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
    @property
    gridWidth: number = 8;
    @property
    gridHeight: number = 8;
    @property
    tileSize: number = 50;
    @property([SpriteFrame])
    tileSprites: SpriteFrame[] = [];

    private grid: number[][] = [];
    private selectedTile: { x: number, y: number } | null = null;

    static instance: GridManager = null;

    onLoad() {
        GridManager.instance = this;
        this.initGrid();
    }

    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = this.getRandomTile();
            }
        }
        // 消除初始匹配
        this.eliminateMatches();
    }

    getRandomTile(): number {
        return Math.floor(Math.random() * this.tileSprites.length);
    }

    getTile(x: number, y: number): number {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return -1;
        return this.grid[y][x];
    }

    setTile(x: number, y: number, type: number) {
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            this.grid[y][x] = type;
        }
    }

    swapTiles(x1: number, y1: number, x2: number, y2: number) {
        const temp = this.grid[y1][x1];
        this.grid[y1][x1] = this.grid[y2][x2];
        this.grid[y2][x2] = temp;
    }

    selectTile(x: number, y: number) {
        if (!this.selectedTile) {
            this.selectedTile = { x, y };
        } else {
            const dx = Math.abs(this.selectedTile.x - x);
            const dy = Math.abs(this.selectedTile.y - y);
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                this.swapTiles(this.selectedTile.x, this.selectedTile.y, x, y);
                if (!this.checkMatches()) {
                    // 交换后无匹配，换回来
                    setTimeout(() => {
                        this.swapTiles(this.selectedTile!.x, this.selectedTile!.y, x, y);
                    }, 200);
                }
            }
            this.selectedTile = null;
        }
    }

    checkMatches(): boolean {
        return this.findMatches().length > 0;
    }

    findMatches(): { x: number, y: number }[] {
        const matches: { x: number, y: number }[] = [];

        // 检查水平匹配
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth - 2; x++) {
                const type = this.grid[y][x];
                if (type === -1) continue;
                if (this.grid[y][x + 1] === type && this.grid[y][x + 2] === type) {
                    matches.push({ x, y }, { x: x + 1, y }, { x: x + 2, y });
                }
            }
        }

        // 检查垂直匹配
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight - 2; y++) {
                const type = this.grid[y][x];
                if (type === -1) continue;
                if (this.grid[y + 1][x] === type && this.grid[y + 2][x] === type) {
                    matches.push({ x, y }, { x, y: y + 1 }, { x, y: y + 2 });
                }
            }
        }

        return matches;
    }

    eliminateMatches() {
        const matches = this.findMatches();
        if (matches.length === 0) return false;

        // 标记为-1表示已消除
        for (const match of matches) {
            this.grid[match.y][match.x] = -1;
        }

        // 通知得分系统
        if (ScoreSystem.instance) {
            ScoreSystem.instance.addScore(matches.length * 10);
        }

        // 下落填充
        setTimeout(() => this.dropTiles(), 300);
        return true;
    }

    dropTiles() {
        for (let x = 0; x < this.gridWidth; x++) {
            let emptySpaces = 0;
            for (let y = this.gridHeight - 1; y >= 0; y--) {
                if (this.grid[y][x] === -1) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    this.grid[y + emptySpaces][x] = this.grid[y][x];
                    this.grid[y][x] = -1;
                }
            }
            // 填充新方块
            for (let y = 0; y < emptySpaces; y++) {
                this.grid[y][x] = this.getRandomTile();
            }
        }

        // 递归检查是否有新的匹配
        setTimeout(() => {
            if (this.eliminateMatches()) {
                // 继续消除
            }
        }, 300);
    }
}

import { ScoreSystem } from './ScoreSystem';
`,

    'MatchDetector.ts': `import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MatchDetector')
export class MatchDetector extends Component {
    @property
    minMatchLength: number = 3;

    /**
     * 检测水平匹配
     */
    checkHorizontal(grid: number[][], x: number, y: number): number[] {
        const type = grid[y][x];
        if (type === -1) return [];

        const matches: number[] = [x];
        for (let i = x + 1; i < grid[0].length; i++) {
            if (grid[y][i] === type) {
                matches.push(i);
            } else {
                break;
            }
        }
        return matches.length >= this.minMatchLength ? matches : [];
    }

    /**
     * 检测垂直匹配
     */
    checkVertical(grid: number[][], x: number, y: number): number[] {
        const type = grid[y][x];
        if (type === -1) return [];

        const matches: number[] = [y];
        for (let i = y + 1; i < grid.length; i++) {
            if (grid[i][x] === type) {
                matches.push(i);
            } else {
                break;
            }
        }
        return matches.length >= this.minMatchLength ? matches : [];
    }

    /**
     * 检测L型或T型匹配
     */
    checkSpecialMatch(grid: number[][], match1: number[], match2: number[]): boolean {
        if (match1.length < 3 || match2.length < 3) return false;

        // 简单的L型检测
        const x1 = match1[0], y1 = match1[match1.length - 1];
        const x2 = match2[0], y2 = match2[match2.length - 1];

        return (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1);
    }
}
`,

    'ScoreSystem.ts': `import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreSystem')
export class ScoreSystem extends Component {
    @property(Label)
    scoreLabel: Label = null!;
    @property(Label)
    targetLabel: Label = null!;
    @property
    targetScore: number = 1000;
    @property
    movesLimit: number = 30;
    @property(Label)
    movesLabel: Label = null!;

    private score: number = 0;
    private moves: number = 0;

    static instance: ScoreSystem = null!;

    onLoad() {
        ScoreSystem.instance = this;
        this.updateUI();
    }

    addScore(points: number) {
        this.score += points;
        this.updateUI();
        this.checkWin();
    }

    useMove() {
        this.moves++;
        this.updateUI();
        if (this.moves >= this.movesLimit) {
            this.checkGameOver();
        }
    }

    getScore(): number {
        return this.score;
    }

    getMovesLeft(): number {
        return this.movesLimit - this.moves;
    }

    isWin(): boolean {
        return this.score >= this.targetScore;
    }

    private checkWin() {
        if (this.isWin()) {
            console.log('🎉 恭喜通关！');
        }
    }

    private checkGameOver() {
        if (!this.isWin()) {
            console.log('💔 游戏结束');
        }
    }

    private updateUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = '分数: ' + this.score;
        }
        if (this.targetLabel) {
            this.targetLabel.string = '目标: ' + this.targetScore;
        }
        if (this.movesLabel) {
            this.movesLabel.string = '步数: ' + this.getMovesLeft();
        }
    }

    reset() {
        this.score = 0;
        this.moves = 0;
        this.updateUI();
    }
}
`,

    'TileView.ts': `import { _decorator, Component, Node, Sprite, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TileView')
export class TileView extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    private gridX: number = 0;
    private gridY: number = 0;
    private tileType: number = 0;

    init(x: number, y: number, type: number) {
        this.gridX = x;
        this.gridY = y;
        this.tileType = type;
        this.updatePosition();
    }

    private updatePosition() {
        const posX = this.gridX * 50;
        const posY = -this.gridY * 50;
        this.node.setPosition(posX, posY, 0);
    }

    async swapTo(x: number, y: number, animated: boolean = true) {
        this.gridX = x;
        this.gridY = y;

        if (animated) {
            return new Promise(resolve => {
                const posX = x * 50;
                const posY = -y * 50;
                tween(this.node)
                    .to(0.2, { position: new Vec3(posX, posY, 0) })
                    .call(resolve)
                    .start();
            });
        } else {
            this.updatePosition();
        }
    }

    playEliminateAnimation() {
        return new Promise(resolve => {
            tween(this.node)
                .to(0.15, { scale: new Vec3(0, 0, 0) })
                .call(resolve)
                .start();
        });
    }

    playFallAnimation(fromY: number) {
        const targetY = this.gridY;
        const startPos = -fromY * 50;
        const targetPos = -targetY * 50;
        
        this.node.setPosition(this.gridX * 50, startPos, 0);
        
        return new Promise(resolve => {
            tween(this.node)
                .to(0.3, { position: new Vec3(this.gridX * 50, targetPos, 0) }, { easing: 'bounceOut' })
                .call(resolve)
                .start();
        });
    }
}
`,

    'Match3GameMain.ts': `import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { GridManager } from './GridManager';
import { ScoreSystem } from './ScoreSystem';

@ccclass('Match3GameMain')
export class Match3GameMain extends Component {
    @property
    gameTitle: string = '三消宝石';

    onLoad() {
        console.log('💎 三消游戏初始化');
    }

    start() {
        if (GridManager.instance) {
            console.log('网格系统就绪');
        }
        if (ScoreSystem.instance) {
            console.log('得分系统就绪');
        }
    }

    restartGame() {
        if (ScoreSystem.instance) {
            ScoreSystem.instance.reset();
        }
        if (GridManager.instance) {
            GridManager.instance.initGrid();
        }
    }
}
`,

    'LevelConfig.ts': `import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelConfig')
export class LevelConfig extends Component {
    @property
    level: number = 1;
    @property
    targetScore: number = 1000;
    @property
    movesLimit: number = 30;
    @property
    gridWidth: number = 8;
    @property
    gridHeight: number = 8;

    static readonly LEVELS = [
        { targetScore: 1000, moves: 30 },
        { targetScore: 2000, moves: 28 },
        { targetScore: 3000, moves: 25 },
        { targetScore: 5000, moves: 22 },
        { targetScore: 8000, moves: 20 },
    ];

    static getLevelConfig(level: number): { targetScore: number, moves: number } {
        const index = Math.min(level - 1, this.LEVELS.length - 1);
        return this.LEVELS[index];
    }
}
`
  };

  // 创建目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(COCOS_SCRIPTS_DIR)) {
    fs.mkdirSync(COCOS_SCRIPTS_DIR, { recursive: true });
  }

  // 写入所有模板文件
  for (const [filename, code] of Object.entries(templates)) {
    const outputPath = path.join(OUTPUT_DIR, filename);
    const cocosPath = path.join(COCOS_SCRIPTS_DIR, filename);
    fs.writeFileSync(outputPath, code);
    fs.writeFileSync(cocosPath, code);
    console.log(`✅ 已生成: ${filename}`);
  }

  // 生成场景说明文件
  const sceneReadme = `# 三消宝石 - Cocos Creator 场景搭建指南

## 场景层级结构

\`\`\`
Canvas/
├── Background (颜色节点)
├── GameUI/
│   ├── ScoreLabel (Label - 分数显示)
│   ├── TargetLabel (Label - 目标分数)
│   └── MovesLabel (Label - 剩余步数)
├── Grid/
│   ├── Tile_0_0 ~ Tile_7_7 (精灵节点)
│   └── ...
├── GridManager (空节点)
├── ScoreSystem (空节点)
└── GameMain (空节点)
\`\`\`

## 组件挂载

1. **GridManager 节点** - 挂载 \`GridManager\` 组件
   - 设置 gridWidth: 8
   - 设置 gridHeight: 8
   - 设置 tileSize: 50
   - 拖入 tileSprites 图片

2. **ScoreSystem 节点** - 挂载 \`ScoreSystem\` 组件
   - 拖入 ScoreLabel、TargetLabel、MovesLabel
   - 设置 targetScore: 1000
   - 设置 movesLimit: 30

3. **GameMain** - 挂载 \`Match3GameMain\` 组件

## 运行

直接运行即可开始三消游戏！
`;

  fs.writeFileSync(path.join(COCOS_SCRIPTS_DIR, '../MATCH3_SCENE_SETUP.md'), sceneReadme);

  console.log('\n🎉 三消游戏Demo代码生成完成!');
  console.log('输出目录: ' + OUTPUT_DIR);
  console.log('Cocos导入目录: ' + COCOS_SCRIPTS_DIR);
  console.log('\n📋 生成的组件:');
  Object.keys(templates).forEach(name => console.log('   • ' + name));
  console.log('\n🚀 使用方法:');
  console.log('1. 打开 Cocos Creator 新建 2D 项目');
  console.log('2. 将 cocos-assets 整个文件夹拖入项目资源库');
  console.log('3. 按照 MATCH3_SCENE_SETUP.md 指引搭建场景');
  console.log('4. 运行游戏即可开始三消!');
}

generateMatch3Game();
