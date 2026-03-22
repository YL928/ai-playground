
/**
 * 生成完整点击游戏Demo
 * 使用现有管线生成所有必需组件
 */

import { AILogicGenerator } from './dist/ai-logic-generator';
import { GameTemplates, getTemplateDescription, getTemplateComponents } from './dist/game-templates';

const API_KEY = process.env.ARK_API_KEY || '';
const OUTPUT_DIR = './generated-scripts';
const COCOS_SCRIPTS_DIR = './cocos-assets/scripts';

async function generateClickerGame() {
  console.log('='.repeat(70));
  console.log('🎮 AI Playground - 生成完整点击游戏Demo');
  console.log('='.repeat(70));

  if (!API_KEY) {
    console.log('⚠️  ARK_API_KEY 环境变量未设置，使用内置模板代码生成');
    generateStaticTemplate();
    return;
  }

  const generator = new AILogicGenerator(API_KEY);
  const components = getTemplateComponents('clicker');

  for (const componentName of components) {
    const desc = getTemplateDescription('clicker');
    const result = await generator.generateFromDescription({
      description: desc,
      componentName,
      outputDir: OUTPUT_DIR
    });
    generator.copyToCocos(result, COCOS_SCRIPTS_DIR);
    console.log(`✅ 已生成: ${componentName}`);
  }

  // 额外生成主游戏控制器
  const mainResult = await generator.generateFromDescription({
    description: getTemplateDescription('clicker', '主游戏控制器，管理游戏流程，整合分数和点击组件，处理升级逻辑'),
    componentName: 'ClickerGameMain',
    outputDir: OUTPUT_DIR
  });
  generator.copyToCocos(mainResult, COCOS_SCRIPTS_DIR);

  // 生成点击按钮组件
  const buttonResult = await generator.generateFromDescription({
    description: '可点击的游戏按钮，点击时通知ScoreManager加分，播放点击效果动画',
    componentName: 'ClickButton',
    outputDir: OUTPUT_DIR
  });
  generator.copyToCocos(buttonResult, COCOS_SCRIPTS_DIR);

  // 生成升级按钮组件
  const upgradeResult = await generator.generateFromDescription({
    description: '升级按钮，消耗分数增加每次点击收益，显示当前升级等级和下次升级费用',
    componentName: 'UpgradeButton',
    outputDir: OUTPUT_DIR
  });
  generator.copyToCocos(upgradeResult, COCOS_SCRIPTS_DIR);

  console.log('\n🎉 点击游戏Demo代码生成完成!');
  console.log(`所有组件已输出到: ${COCOS_SCRIPTS_DIR}`);
  console.log('直接将 cocos-assets 文件夹拖入 Cocos Creator 即可使用');
}

function generateStaticTemplate() {
  // 内置静态模板，在没有API Key时直接生成基础代码
  const templates: Record<string, string> = {
    'ScoreManager.ts': `import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property
    private score: number = 0;
    private clickPower: number = 1;

    static instance: ScoreManager = null!;

    onLoad() {
        ScoreManager.instance = this;
    }

    start() {
        this.updateScoreDisplay();
    }

    addScore(amount: number = 1) {
        this.score += amount * this.clickPower;
        this.updateScoreDisplay();
    }

    getScore(): number {
        return this.score;
    }

    spendScore(cost: number): boolean {
        if (this.score >= cost) {
            this.score -= cost;
            this.updateScoreDisplay();
            return true;
        }
        return false;
    }

    upgradeClickPower() {
        this.clickPower += 1;
    }

    getClickPower(): number {
        return this.clickPower;
    }

    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `分数: ${Math.floor(this.score)}`;
        }
    }
}
`,

    'ClickHandler.ts': `import { _decorator, Component, Node, Button, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickHandler')
export class ClickHandler extends Component {
    @property(Button)
    clickButton: Button = null!;

    @property
    clickScale: number = 0.9;

    @property
    animationDuration: number = 0.1;

    onLoad() {
        this.clickButton.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    onClick() {
        // 加分
        if (ScoreManager.instance) {
            ScoreManager.instance.addScore();
        }

        // 点击动画
        this.playClickAnimation();
    }

    private playClickAnimation() {
        const originalScale = this.clickButton.node.getScale();
        tween(this.clickButton.node)
            .to(this.animationDuration, { scale: new Vec3(this.clickScale * originalScale.x, this.clickScale * originalScale.y, originalScale.z) })
            .to(this.animationDuration, { scale: originalScale })
            .start();
    }
}
`,

    'ClickButton.ts': `import { _decorator, Component, Node, Button, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickButton')
export class ClickButton extends Component {
    @property(Button)
    button: Button = null!;

    @property
    popScale: number = 0.85;
    @property
    animTime: number = 0.12;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.handleClick, this);
    }

    handleClick() {
        ScoreManager.instance.addScore();
        this.playAnimation();
    }

    private playAnimation() {
        const original = this.button.node.getScale();
        tween(this.button.node)
            .to(this.animTime, { scale: new Vec3(original.x * this.popScale, original.y * this.popScale, original.z) })
            .to(this.animTime, { scale: original })
            .start();
    }
}
`,

    'UpgradeButton.ts': `import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('UpgradeButton')
export class UpgradeButton extends Component {
    @property(Button)
    button: Button = null!;
    @property(Label)
    upgradeLabel: Label = null!;

    @property
    private upgradeLevel: number = 0;
    @property
    private baseCost: number = 10;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.upgradeClickPower, this);
        this.updateLabel();
    }

    upgradeClickPower() {
        const cost = this.getUpgradeCost();
        if (ScoreManager.instance.spendScore(cost)) {
            this.upgradeLevel++;
            ScoreManager.instance.upgradeClickPower();
            this.updateLabel();
        }
    }

    getUpgradeCost(): number {
        return Math.floor(this.baseCost * Math.pow(1.5, this.upgradeLevel));
    }

    updateLabel() {
        const nextCost = this.getUpgradeCost();
        const power = ScoreManager.instance ? ScoreManager.instance.getClickPower() + 1 : 1;
        this.upgradeLabel.string = \\`升级 (+\\${power})\\n价格: \\${nextCost}\\`;
    }
}
`,

    'ClickerGameMain.ts': `import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickerGameMain')
export class ClickerGameMain extends Component {
    @property
    gameTitle: string = '点击大冒险';

    onLoad() {
        console.log('🎮 点击游戏初始化完成');
    }

    start() {
        // 游戏已通过ScoreManager自动初始化
        if (ScoreManager.instance) {
            console.log('分数管理器就绪');
        }
    }

    restartGame() {
        if (ScoreManager.instance) {
            ScoreManager.instance.resetScore();
        }
    }
}
`
  };

  // 创建目录
  const fs = require('fs');
  const path = require('path');

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

  console.log('\n🎉 点击游戏Demo代码生成完成!');
  console.log(`输出目录: ${OUTPUT_DIR}`);
  console.log(`Cocos导入目录: ${COCOS_SCRIPTS_DIR}`);
  console.log('\n📋 生成的组件:');
  Object.keys(templates).forEach(name => console.log(`   • ${name}`));
  console.log('\n🚀 使用方法:');
  console.log('1. 打开 Cocos Creator 新建 2D 项目');
  console.log('2. 将 cocos-assets 整个文件夹拖入项目资源库');
  console.log('3. 在场景中:');
  console.log('   - 创建 ScoreManager 节点并挂载 ScoreManager 组件');
  console.log('   - 添加分数 Label 绑定到 ScoreManager');
  console.log('   - 创建点击按钮，挂载 ClickButton 组件');
  console.log('   - 添加升级按钮，挂载 UpgradeButton 组件');
  console.log('   - 添加 ClickerGameMain 到场景');
  console.log('4. 运行游戏即可开始点击!');
}

generateClickerGame().catch(console.error);
