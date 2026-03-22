#!/bin/bash
# AI Playground - 流程验证脚本
# 文字描述 → AI生成美术 → 导入Cocos

set -e

echo "=================================================="
echo "🎮 AI Playground 流程验证"
echo "📋 步骤: 文字描述 → AI生成 → 预处理 → 导入Cocos"
echo "=================================================="

# 1. 创建目录结构
mkdir -p output
mkdir -p cocos-assets/textures
mkdir -p cocos-assets/sprites
mkdir -p cocos-assets/backgrounds

echo "✅ 目录结构创建完成"
echo "   output/          - AI原始输出"
echo "   cocos-assets/    - Cocos资源目录"

# 2. 这里提示用户填写AI API Key后即可生成
if [ -z "$AI_IMAGE_API_KEY" ]; then
  echo ""
  echo "⚠️  请先配置AI图像API Key:"
  echo "   export AI_IMAGE_API_KEY=your_api_key_here"
  echo ""
  echo "📝 示例提示词(pixel game character):"
  echo "   pixel art main character, cute adventurer, game sprite, 32x32 pixels, transparent background"
  echo ""
fi

# 3. 编译TypeScript
echo "🔧 编译TypeScript..."
npx tsc
echo "✅ 编译完成"

# 4. 输出最终目录结构
echo ""
echo "📁 最终项目结构:"
tree -L 3 -I 'node_modules' .

echo ""
echo "✅ 流程骨架已跑通!"
echo "下一步:"
echo "  1. 配置 AI_IMAGE_API_KEY"
echo "  2. 运行 node dist/index.js 执行生成"
echo "  3. 生成后的图片自动导入到 cocos-assets/textures/"
echo "  4. 直接将 cocos-assets 拖入你的 Cocos Creator 工程即可使用"
echo ""
