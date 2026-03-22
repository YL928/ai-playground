/**
 * AI Playground - 入口文件
 * AI全链路小游戏开发引擎
 * 
 * 模块：
 * 1. AI美术生成 → 文字描述生成图片导入Cocos
 * 2. AI逻辑生成 → 自然描述生成游戏组件代码
 * 3. AI音频生成 → 文字描述生成音乐音效导入Cocos
 * 4. 预设游戏模板 → 快速生成常见游戏类型
 */

import { AIArtGenerator } from './ai-art-generator';
import { AILogicGenerator } from './ai-logic-generator';
import { AIAudioGenerator } from './ai-audio-generator';
import { GameTemplates, getTemplateDescription, getTemplateComponents } from './game-templates';

// 示例：根据模板生成游戏代码
async function runTemplateDemo() {
  console.log('='.repeat(60));
  console.log('AI Playground - 玩法逻辑生成演示');
  console.log('流程：选择模板 → AI生成组件代码 → 导入Cocos');
  console.log('='.repeat(60));

  const API_KEY = process.env.ARK_API_KEY || '';
  const OUTPUT_DIR = './generated-scripts';
  const COCOS_SCRIPTS_DIR = './cocos-assets/scripts';

  if (!API_KEY) {
    console.log('⚠️  请先设置 ARK_API_KEY 环境变量');
    return;
  }

  const generator = new AILogicGenerator(API_KEY);
  
  // 示例：生成点击游戏得分组件
  const result = await generator.generateFromDescription({
    description: getTemplateDescription('clicker') + '\n管理游戏分数，显示分数，支持加分和重置',
    componentName: 'ScoreManager',
    outputDir: OUTPUT_DIR
  });

  const cocosPath = generator.copyToCocos(result, COCOS_SCRIPTS_DIR);
  console.log(`\n✅ 生成完成! 代码已导入到: ${cocosPath}`);
}

// 如果直接运行则执行demo
if (require.main === module) {
  runTemplateDemo().catch(console.error);
}

export { AIArtGenerator } from './ai-art-generator';
export { AILogicGenerator } from './ai-logic-generator';
export { AIAudioGenerator } from './ai-audio-generator';
export { GameTemplates, getTemplateDescription, getTemplateComponents } from './game-templates';
export * from './types';
