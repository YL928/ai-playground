/**
 * AI音乐音效生成管线
 * 流程：文字描述 → AI生成音频 → 转格式 → 导入Cocos
 */

import axios from 'axios';
import fs from 'fs';
import path from 'path';

export interface AudioGenerateConfig {
  prompt: string;
  type: 'bgm' | 'effect';
  duration?: number;        // BGM时长，单位秒
  outputDir: string;
  fileName: string;
}

export interface GeneratedAudio {
  originalPath: string;
  cocosPath: string;
  prompt: string;
  type: 'bgm' | 'effect';
  duration: number;
}

export class AIAudioGenerator {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string, apiEndpoint?: string) {
    this.apiKey = apiKey;
    // 使用火山引擎语音生成API，或可配置为其他AI音频服务
    this.apiEndpoint = apiEndpoint || 'https://openspeech.bytedance.com/api/v1/tts';
  }

  /**
   * 根据文字描述生成游戏音频
   */
  async generateFromText(config: AudioGenerateConfig): Promise<GeneratedAudio> {
    const { prompt, type, duration = 30, outputDir, fileName } = config;

    console.log(`[AI音频生成] 正在生成${type}: ${prompt}`);

    // 1. 调用AI音频生成API
    const audioBuffer = await this.callAIAudioAPI(prompt, type, duration);

    // 2. 保存原始音频
    const originalExt = this.getExtensionForFormat('mp3');
    const originalPath = path.join(outputDir, `${fileName}_original.${originalExt}`);
    fs.writeFileSync(originalPath, audioBuffer);
    console.log(`[AI音频生成] 原始音频保存到: ${originalPath}`);

    // 3. 转格式为Cocos可用格式（这里就是mp3，直接复制）
    const cocosPath = path.join(outputDir, `${fileName}.mp3`);
    await this.preprocessAudio(originalPath, cocosPath);

    console.log(`[AI音频生成] 处理完成: ${cocosPath}`);
    return {
      originalPath,
      cocosPath,
      prompt,
      type,
      duration
    };
  }

  /**
   * 获取文件扩展名
   */
  private getExtensionForFormat(format: string): string {
    return format;
  }

  /**
   * 调用AI音频生成API
   * 支持：
   * 1. 火山引擎语音生成
   * 2. 可以接入Suno等音乐生成服务
   * 3. 也可以配合手动生成后导入
   */
  private async callAIAudioAPI(prompt: string, type: 'bgm' | 'effect', duration: number): Promise<Buffer> {
    // 如果使用火山引擎语音音效（音效可以用TTS生成）
    // BGM建议接入专门的音乐生成API如Suno
    if (process.env.AUDIO_API_ENDPOINT) {
      const response = await axios.post(
        process.env.AUDIO_API_ENDPOINT,
        { prompt, duration },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
          responseType: 'arraybuffer'
        }
      );
      return Buffer.from(response.data);
    }

    // 如果没有配置API，提示手动生成后导入
    console.log(`[提示] 使用手动模式：用AI音乐工具生成后放到output目录`);
    throw new Error('请配置AI音频API或手动生成后导入');
  }

  /**
   * 音频预处理：转格式、压缩
   */
  private async preprocessAudio(inputPath: string, outputPath: string): Promise<void> {
    // 简单处理：直接复制
    // 实际项目可在这里加ffmpeg转码、压缩比特率等处理
    fs.copyFileSync(inputPath, outputPath);
  }

  /**
   * 将生成好的音频复制到Cocos项目音频目录
   */
  copyToCocos(generated: GeneratedAudio, cocosAudioDir: string): string {
    if (!fs.existsSync(cocosAudioDir)) {
      fs.mkdirSync(cocosAudioDir, { recursive: true });
    }
    const targetPath = path.join(cocosAudioDir, path.basename(generated.cocosPath));
    fs.copyFileSync(generated.cocosPath, targetPath);
    console.log(`[导入Cocos] 音频已复制到: ${targetPath}`);
    return targetPath;
  }

  /**
   * 从已生成的本地音频文件导入到Cocos
   */
  importExistingAudio(
    localPath: string,
    fileName: string,
    cocosAudioDir: string,
    format: string = 'mp3'
  ): string {
    const targetPath = path.join(cocosAudioDir, `${fileName}.${format}`);
    if (!fs.existsSync(cocosAudioDir)) {
      fs.mkdirSync(cocosAudioDir, { recursive: true });
    }
    fs.copyFileSync(localPath, targetPath);
    console.log(`[导入Cocos] 已导入现有音频到: ${targetPath}`);
    return targetPath;
  }

  /**
   * 根据游戏风格生成BGM提示词
   */
  static buildBGMPrompt(style: string, mood: string, loop: boolean = true): string {
    let prompt = `${style}风格游戏背景音乐，${mood}氛围`;
    if (loop) {
      prompt += '，适合循环播放';
    }
    return prompt;
  }

  /**
   * 生成音效提示词
   */
  static buildEffectPrompt(effectName: string, tone: string = ''): string {
    let prompt = `${effectName} 游戏音效`;
    if (tone) {
      prompt += `，${tone}`;
    }
    return prompt;
  }
}
