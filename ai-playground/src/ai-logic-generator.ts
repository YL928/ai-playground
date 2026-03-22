/**
 * AI玩法逻辑生成模块
 * 功能：自然语言描述 → 生成Cocos Creator TypeScript游戏组件代码
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';

export interface LogicGenerateConfig {
  description: string;        // 自然语言玩法描述
  componentName: string;      // 生成的组件名称
  outputDir: string;          // 输出目录
  gameType?: '2d' | '3d';     // 游戏类型
}

export interface GeneratedLogic {
  componentName: string;
  filePath: string;
  code: string;
  description: string;
}

export class AILogicGenerator {
  private apiKey: string;
  private modelEndpoint: string;

  constructor(apiKey: string, modelEndpoint?: string) {
    this.apiKey = apiKey;
    this.modelEndpoint = modelEndpoint || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
  }

  /**
   * 根据自然语言描述生成游戏组件代码
   */
  async generateFromDescription(config: LogicGenerateConfig): Promise<GeneratedLogic> {
    const { description, componentName, outputDir, gameType = '2d' } = config;

    console.log(`[AI逻辑生成] 正在生成: ${componentName}`);
    console.log(`[AI逻辑生成] 描述: ${description}`);

    // 1. 构建prompt
    const prompt = this.buildPrompt(description, componentName, gameType);

    // 2. 调用大模型生成代码
    const code = await this.callLLM(prompt);

    // 3. 清理输出，提取代码块
    const cleanedCode = this.extractCode(code);

    // 4. 保存文件
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const filePath = path.join(outputDir, `${componentName}.ts`);
    fs.writeFileSync(filePath, cleanedCode);

    console.log(`[AI逻辑生成] 已保存到: ${filePath}`);
    return {
      componentName,
      filePath,
      code: cleanedCode,
      description
    };
  }

  /**
   * 构建提示词，告诉AI需要生成什么样的Cocos代码
   */
  private buildPrompt(description: string, componentName: string, gameType: '2d' | '3d'): string {
    return `你是一个专业的 Cocos Creator 游戏开发工程师。
请根据以下需求，生成完整可运行的 TypeScript 组件代码。

需求描述: ${description}

生成要求:
1. 组件类名必须是 ${componentName}
2. 继承 cc.Component ，使用 Cocos Creator 3.x API
3. 包含完整的属性定义，可以在编辑器中挂载
4. 代码要简洁可运行，不要多余注释
5. 使用 ES6 模块化语法
6. 只输出完整代码，放在一个\`\`\`typescript 代码块中
7. 考虑游戏运行时的生命周期(onLoad, start, update)

游戏类型: ${gameType}

请直接输出代码：`;
  }

  /**
   * 调用大模型API
   */
  private async callLLM(prompt: string): Promise<string> {
    const response = await axios.post(
      this.modelEndpoint,
      {
        model: 'doubao-lite-128k',
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * 从LLM输出中提取代码块
   */
  private extractCode(content: string): string {
    const codeBlockMatch = content.match(/```typescript([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    // 如果没有代码块，直接返回原内容
    return content.trim();
  }

  /**
   * 将生成的组件复制到Cocos项目的scripts目录
   */
  copyToCocos(generated: GeneratedLogic, cocosScriptsDir: string): string {
    if (!fs.existsSync(cocosScriptsDir)) {
      fs.mkdirSync(cocosScriptsDir, { recursive: true });
    }
    const targetPath = path.join(cocosScriptsDir, path.basename(generated.filePath));
    fs.copyFileSync(generated.filePath, targetPath);
    console.log(`[导入Cocos] 组件已复制到: ${targetPath}`);
    return targetPath;
  }
}
