/**
 * 导入音频演示
 */

import { AIAudioGenerator } from './dist/ai-audio-generator';

const API_KEY = process.env.AUDIO_API_KEY || process.env.ARK_API_KEY || '';
const OUTPUT_DIR = './output/audio';
const COCOS_AUDIO_DIR = './cocos-assets/audio';

// 这里我们演示导入已有音频
const generator = new AIAudioGenerator(API_KEY);

// 实际使用时：
// const result = await generator.generateFromText({
//   prompt: AIAudioGenerator.buildEffectPrompt('点击按钮', '清脆'),
//   type: 'effect',
//   outputDir: OUTPUT_DIR,
//   fileName: 'click'
// });
// const cocosPath = generator.copyToCocos(result, COCOS_AUDIO_DIR);

// 演示导入已有文件
console.log('🎵 AI音频生成流程演示');
console.log('提示词: 点击按钮游戏音效，清脆短促');
console.log('输出目录: ' + OUTPUT_DIR);

// 创建示例占位
const cocosPath = generator.importExistingAudio(
  __dirname + '/output/audio/click.md',
  'click',
  COCOS_AUDIO_DIR,
  'md'
);

console.log('\n✅ 导入完成!');
console.log('   Cocos路径: ' + cocosPath);
