/**
 * 生成三消游戏HTML预览
 * 将TypeScript组件逻辑转换为纯HTML+JS版本
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = './output/match3-demo';

// HTML模板
const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>💎 三消宝石 - AI生成小游戏Demo</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .game-container {
            width: 100%;
            max-width: 420px;
            background: linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 100%);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            overflow: hidden;
        }
        .game-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .game-header h1 { font-size: 24px; margin-bottom: 5px; }
        .game-header p { opacity: 0.9; font-size: 14px; }
        .game-stats {
            display: flex;
            justify-content: space-around;
            padding: 15px 20px;
            background: rgba(255, 255, 255, 0.1);
        }
        .stat-item { text-align: center; color: white; }
        .stat-label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
        .stat-value { font-size: 24px; font-weight: bold; }
        .stat-value.score { color: #ffd700; }
        .stat-value.target { color: #4facfe; }
        .stat-value.moves { color: #fa709a; }
        .game-board { padding: 20px; display: flex; justify-content: center; }
        .grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 4px;
            background: rgba(0, 0, 0, 0.3);
            padding: 8px;
            border-radius: 12px;
        }
        .tile {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            transition: transform 0.15s;
            user-select: none;
        }
        .tile:hover { transform: scale(1.05); }
        .tile.selected { transform: scale(1.1); box-shadow: 0 0 15px rgba(255,255,255,0.6); z-index: 10; }
        .tile.matched { animation: matchPop 0.3s ease-out forwards; }
        @keyframes matchPop {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
        }
        .tile.falling { animation: fallBounce 0.4s ease-out; }
        @keyframes fallBounce {
            0% { transform: translateY(-20px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        .tile-0 { background: linear-gradient(135deg, #ff6b6b, #ee5a5a); }
        .tile-1 { background: linear-gradient(135deg, #4ecdc4, #44a08d); }
        .tile-2 { background: linear-gradient(135deg, #ffe66d, #ffd700); }
        .tile-3 { background: linear-gradient(135deg, #a29bfe, #6c5ce7); }
        .tile-4 { background: linear-gradient(135deg, #fd79a8, #e84393); }
        .tile-5 { background: linear-gradient(135deg, #74b9ff, #0984e3); }
        .tile-0::after { content: '🔴'; }
        .tile-1::after { content: '🟢'; }
        .tile-2::after { content: '🟡'; }
        .tile-3::after { content: '🟣'; }
        .tile-4::after { content: '🔵'; }
        .tile-5::after { content: '🟠'; }
        .game-footer {
            padding: 15px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 28px;
            font-weight: bold;
            z-index: 100;
            display: none;
        }
        .message.show { display: block; animation: popIn 0.3s ease-out; }
        .message.win { color: #ffd700; }
        .message.lose { color: #ff6b6b; }
        @keyframes popIn {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="game-container">
        <div class="game-header">
            <h1>💎 三消宝石</h1>
            <p>AI 全链路生成小游戏 Demo</p>
        </div>
        <div class="game-stats">
            <div class="stat-item">
                <div class="stat-label">分数</div>
                <div class="stat-value score" id="score">0</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">目标</div>
                <div class="stat-value target" id="target">1000</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">步数</div>
                <div class="stat-value moves" id="moves">30</div>
            </div>
        </div>
        <div class="game-board">
            <div class="grid" id="grid"></div>
        </div>
        <div class="game-footer">点击交换相邻宝石，三个或更多相同宝石连线消除</div>
    </div>
    <div class="message" id="message"></div>
    <script>
        // 三消游戏逻辑
        class Match3Game {
            constructor() {
                this.width = 8;
                this.height = 8;
                this.tileTypes = 6;
                this.grid = [];
                this.score = 0;
                this.moves = 30;
                this.targetScore = 1000;
                this.selectedTile = null;
                this.isAnimating = false;
                this.gridEl = document.getElementById('grid');
                this.scoreEl = document.getElementById('score');
                this.movesEl = document.getElementById('moves');
                this.messageEl = document.getElementById('message');
                this.init();
            }

            init() {
                this.initGrid();
                this.render();
                this.updateUI();
                setTimeout(() => this.eliminateMatches(), 500);
            }

            initGrid() {
                this.grid = [];
                for (let y = 0; y < this.height; y++) {
                    this.grid[y] = [];
                    for (let x = 0; x < this.width; x++) {
                        this.grid[y][x] = this.getRandomTile(x, y);
                    }
                }
            }

            getRandomTile(x, y) {
                let tile;
                do {
                    tile = Math.floor(Math.random() * this.tileTypes);
                } while (this.wouldMatch(x, y, tile));
                return tile;
            }

            wouldMatch(x, y, type) {
                if (x >= 2 && this.grid[y][x-1] === type && this.grid[y][x-2] === type) return true;
                if (y >= 2 && this.grid[y-1] && this.grid[y-1][x] === type && 
                    this.grid[y-2] && this.grid[y-2][x] === type) return true;
                return false;
            }

            render() {
                this.gridEl.innerHTML = '';
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width; x++) {
                        const tile = document.createElement('div');
                        tile.className = 'tile tile-' + this.grid[y][x];
                        tile.dataset.x = x;
                        tile.dataset.y = y;
                        tile.addEventListener('click', () => this.onTileClick(x, y));
                        this.gridEl.appendChild(tile);
                    }
                }
            }

            onTileClick(x, y) {
                if (this.isAnimating) return;
                if (!this.selectedTile) {
                    this.selectedTile = { x, y };
                    this.updateSelection();
                } else {
                    const dx = Math.abs(this.selectedTile.x - x);
                    const dy = Math.abs(this.selectedTile.y - y);
                    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                        this.swapTiles(this.selectedTile.x, this.selectedTile.y, x, y);
                    }
                    this.selectedTile = null;
                    this.updateSelection();
                }
            }

            updateSelection() {
                this.gridEl.querySelectorAll('.tile').forEach(t => t.classList.remove('selected'));
                if (this.selectedTile) {
                    const index = this.selectedTile.y * this.width + this.selectedTile.x;
                    this.gridEl.children[index].classList.add('selected');
                }
            }

            async swapTiles(x1, y1, x2, y2) {
                this.isAnimating = true;
                const temp = this.grid[y1][x1];
                this.grid[y1][x1] = this.grid[y2][x2];
                this.grid[y2][x2] = temp;
                this.render();
                const matches = this.findMatches();
                if (matches.length > 0) {
                    this.moves--;
                    this.updateUI();
                    await this.eliminateMatches();
                } else {
                    await new Promise(r => setTimeout(r, 200));
                    const temp2 = this.grid[y1][x1];
                    this.grid[y1][x1] = this.grid[y2][x2];
                    this.grid[y2][x2] = temp2;
                    this.render();
                }
                this.isAnimating = false;
                this.checkGameState();
            }

            findMatches() {
                const matches = new Set();
                for (let y = 0; y < this.height; y++) {
                    for (let x = 0; x < this.width - 2; x++) {
                        const type = this.grid[y][x];
                        if (type === -1) continue;
                        if (this.grid[y][x+1] === type && this.grid[y][x+2] === type) {
                            matches.add(x+','+y); matches.add((x+1)+','+y); matches.add((x+2)+','+y);
                        }
                    }
                }
                for (let x = 0; x < this.width; x++) {
                    for (let y = 0; y < this.height - 2; y++) {
                        const type = this.grid[y][x];
                        if (type === -1) continue;
                        if (this.grid[y+1][x] === type && this.grid[y+2][x] === type) {
                            matches.add(x+','+y); matches.add(x+','+(y+1)); matches.add(x+','+(y+2));
                        }
                    }
                }
                return Array.from(matches).map(s => { const [x,y] = s.split(',').map(Number); return {x,y}; });
            }

            async eliminateMatches() {
                const matches = this.findMatches();
                if (matches.length === 0) return;
                matches.forEach(m => {
                    const index = m.y * this.width + m.x;
                    if (this.gridEl.children[index]) this.gridEl.children[index].classList.add('matched');
                });
                this.score += matches.length * 10;
                this.updateUI();
                await new Promise(r => setTimeout(r, 300));
                matches.forEach(m => { this.grid[m.y][m.x] = -1; });
                await this.dropTiles();
                setTimeout(() => this.eliminateMatches(), 200);
            }

            async dropTiles() {
                for (let x = 0; x < this.width; x++) {
                    let emptyCount = 0;
                    for (let y = this.height - 1; y >= 0; y--) {
                        if (this.grid[y][x] === -1) emptyCount++;
                        else if (emptyCount > 0) {
                            this.grid[y + emptyCount][x] = this.grid[y][x];
                            this.grid[y][x] = -1;
                        }
                    }
                    for (let y = 0; y < emptyCount; y++) {
                        this.grid[y][x] = Math.floor(Math.random() * this.tileTypes);
                    }
                }
                this.render();
                await new Promise(r => setTimeout(r, 400));
            }

            updateUI() {
                this.scoreEl.textContent = this.score;
                this.movesEl.textContent = this.moves;
            }

            checkGameState() {
                if (this.score >= this.targetScore) {
                    this.showMessage('🎉 恭喜通关！', 'win');
                } else if (this.moves <= 0) {
                    this.showMessage('💔 游戏结束', 'lose');
                }
            }

            showMessage(text, type) {
                this.messageEl.textContent = text;
                this.messageEl.className = 'message show ' + type;
                setTimeout(() => { this.messageEl.className = 'message'; }, 2000);
            }
        }

        document.addEventListener('DOMContentLoaded', () => { new Match3Game(); });
    </script>
</body>
</html>`;

function generate() {
    // 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // 写入HTML文件
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlTemplate);
    console.log('✅ HTML预览已生成: ' + OUTPUT_DIR + '/index.html');
}

generate();
