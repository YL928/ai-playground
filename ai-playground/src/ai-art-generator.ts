/**
 * AI美术生成管线
 * 流程：文字描述 → AI生成图像 → 预处理 → 导出Cocos可用格式
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

export interface AIGenerateConfig {
  prompt: string;
  width?: number;
  height?: number;
  outputDir: string;
  fileName: string;
}

export interface GeneratedArt {
  originalPath: string;
  cocosPath: string;
  prompt: string;
  width: number;
  height: number;
}

export class AIArtGenerator {
  private apiKey: string;
  private outputBaseDir: string;

  constructor(apiKey: string, outputBaseDir: string) {
    this.apiKey = apiKey;
    this.outputBaseDir = outputBaseDir;
  }

  /**
   * 根据文字描述生成游戏美术
   */
  async generateFromText(config: AIGenerateConfig): Promise<GeneratedArt> {
    const { prompt, width = 512, height = 512, outputDir, fileName } = config;

    // 1. 调用AI图像生成API
    console.log(`[AI生成] 正在生成: ${prompt}`);
    const imageBuffer = await this.callAIImageAPI(prompt, width, height);

    // 2. 保存原始图像
    const originalPath = path.join(outputDir, `${fileName}_original.png`);
    fs.writeFileSync(originalPath, imageBuffer);
    console.log(`[AI生成] 原始图像保存到: ${originalPath}`);

    // 3. 预处理（转为Cocos可用格式，可扩展九宫格切割等）
    const cocosPath = path.join(outputDir, `${fileName}.png`);
    await this.preprocessImage(originalPath, cocosPath);

    console.log(`[AI生成] 处理完成: ${cocosPath}`);
    return {
      originalPath,
      cocosPath,
      prompt,
      width,
      height
    };
  }

  /**
   * 调用AI图像生成API
   * 支持：
   * 1. 火山引擎豆包图像生成
   * 2. OpenAI DALL-E
   * 3. 也可以配合内置 image-generate 技能手动生成后导入
   */
  private async callAIImageAPI(prompt: string, width: number, height: number): Promise<Buffer> {
    // 如果使用火山引擎图像生成API
    if (process.env.ARK_API_KEY && process.env.ARK_IMAGE_ENDPOINT) {
      const response = await axios.post(
        process.env.ARK_IMAGE_ENDPOINT,
        { prompt, size: `${width}x${height}` },
        { 
          headers: { Authorization: `Bearer ${this.apiKey}` },
          responseType: 'arraybuffer'
        }
      );
      return Buffer.from(response.data);
    }
    
    // 占位：手动生成模式，使用内置image-generate技能生成后放到output目录
    console.log(`[提示] 使用手动模式：请用内置 image-generate 技能生成图片后放到: ${this.outputBaseDir}`);
    throw new Error('请配置AI图像API Key或手动生成后导入');
  }

  /**
   * 图像预处理：转为Cocos可用格式
   * 简化版：直接复制，扩展时可在这里加九宫格切割、纹理压缩等
   */
  private async preprocessImage(
    inputPath: string, 
    outputPath: string
  ): Promise<void> {
    // 简单预处理，直接复制即可
    fs.copyFileSync(inputPath, outputPath);
  }

  /**
   * 将生成好的图片复制到Cocos项目资源目录
   */
  copyToCocos(generatedArt: GeneratedArt, cocosTextureDir: string): string {
    if (!fs.existsSync(cocosTextureDir)) {
      fs.mkdirSync(cocosTextureDir, { recursive: true });
    }
    const targetPath = path.join(cocosTextureDir, path.basename(generatedArt.cocosPath));
    fs.copyFileSync(generatedArt.cocosPath, targetPath);
    console.log(`[导入Cocos] 已复制到: ${targetPath}`);
    return targetPath;
  }

  /**
   * 从已生成的本地图片导入到Cocos
   * 用于配合 image-generate 技能手动生成
   */
  importExistingImage(localPath: string, fileName: string, cocosTextureDir: string): string {
    const targetPath = path.join(cocosTextureDir, `${fileName}.png`);
    fs.copyFileSync(localPath, targetPath);
    console.log(`[导入Cocos] 已导入现有图片到: ${targetPath}`);
    return targetPath;
  }
}
