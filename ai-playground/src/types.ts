/**
 * 公共类型定义
 */

export interface AIAsset {
  id: string;
  type: 'sprite' | 'background' | 'ui' | 'effect';
  prompt: string;
  originalPath: string;
  processedPath: string;
  createdAt: number;
  metadata: Record<string, any>;
}

export interface PipelineConfig {
  aiImageApiKey: string;
  outputDir: string;
  cocosAssetRoot: string;
}
