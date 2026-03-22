# AI音频生成演示

## 示例提示词

### BGM示例
- 像素风格冒险游戏BGM，轻松愉快，可以循环 → `AIAudioGenerator.buildBGMPrompt('像素冒险', '轻松愉快', true)`
- 神秘地牢BGM，紧张压抑 → `AIAudioGenerator.buildBGMPrompt('地牢探险', '紧张压抑', true)`

### 音效示例
- 点击按钮音效 → `AIAudioGenerator.buildEffectPrompt('点击按钮', '清脆')`
- 加分音效 → `AIAudioGenerator.buildEffectPrompt('得分加分', '明亮欢快')`
- 碰撞音效 → `AIAudioGenerator.buildEffectPrompt('物体碰撞', '厚重')`

## 使用方式

```typescript
const generator = new AIAudioGenerator(API_KEY);
const result = await generator.generateFromText({
  prompt: AIAudioGenerator.buildEffectPrompt('点击按钮', '清脆'),
  type: 'effect',
  outputDir: './output',
  fileName: 'click'
});
const cocosPath = generator.copyToCocos(result, './cocos-assets/audio');
```
