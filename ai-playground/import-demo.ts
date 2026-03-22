/**
 * 导入已生成的图片到Cocos资源目录
 */

import { AIArtGenerator } from './dist/ai-art-generator';

const API_KEY = process.env.ARK_API_KEY || '';
const OUTPUT_DIR = './output';
const COCOS_TEXTURE_DIR = './cocos-assets/textures';

const generator = new AIArtGenerator(API_KEY, OUTPUT_DIR);
const cocosPath = generator.importExistingImage(
  '/root/.openclaw/workspace/ai-playground/output/player.png',
  'player',
  COCOS_TEXTURE_DIR
);

console.log('\n🎉 导入完成!');
console.log('   原始图: /root/.openclaw/workspace/ai-playground/output/player.png');
console.log('   Cocos路径:', cocosPath);
