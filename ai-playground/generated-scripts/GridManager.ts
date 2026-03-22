import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
    @property
    gridWidth: number = 8;
    @property
    gridHeight: number = 8;
    @property
    tileSize: number = 50;
    @property([SpriteFrame])
    tileSprites: SpriteFrame[] = [];

    private grid: number[][] = [];
    private selectedTile: { x: number, y: number } | null = null;

    static instance: GridManager = null;

    onLoad() {
        GridManager.instance = this;
        this.initGrid();
    }

    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = this.getRandomTile();
            }
        }
        // 消除初始匹配
        this.eliminateMatches();
    }

    getRandomTile(): number {
        return Math.floor(Math.random() * this.tileSprites.length);
    }

    getTile(x: number, y: number): number {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) return -1;
        return this.grid[y][x];
    }

    setTile(x: number, y: number, type: number) {
        if (x >= 0 && x < this.gridWidth && y >= 0 && y < this.gridHeight) {
            this.grid[y][x] = type;
        }
    }

    swapTiles(x1: number, y1: number, x2: number, y2: number) {
        const temp = this.grid[y1][x1];
        this.grid[y1][x1] = this.grid[y2][x2];
        this.grid[y2][x2] = temp;
    }

    selectTile(x: number, y: number) {
        if (!this.selectedTile) {
            this.selectedTile = { x, y };
        } else {
            const dx = Math.abs(this.selectedTile.x - x);
            const dy = Math.abs(this.selectedTile.y - y);
            if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                this.swapTiles(this.selectedTile.x, this.selectedTile.y, x, y);
                if (!this.checkMatches()) {
                    // 交换后无匹配，换回来
                    setTimeout(() => {
                        this.swapTiles(this.selectedTile!.x, this.selectedTile!.y, x, y);
                    }, 200);
                }
            }
            this.selectedTile = null;
        }
    }

    checkMatches(): boolean {
        return this.findMatches().length > 0;
    }

    findMatches(): { x: number, y: number }[] {
        const matches: { x: number, y: number }[] = [];

        // 检查水平匹配
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth - 2; x++) {
                const type = this.grid[y][x];
                if (type === -1) continue;
                if (this.grid[y][x + 1] === type && this.grid[y][x + 2] === type) {
                    matches.push({ x, y }, { x: x + 1, y }, { x: x + 2, y });
                }
            }
        }

        // 检查垂直匹配
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight - 2; y++) {
                const type = this.grid[y][x];
                if (type === -1) continue;
                if (this.grid[y + 1][x] === type && this.grid[y + 2][x] === type) {
                    matches.push({ x, y }, { x, y: y + 1 }, { x, y: y + 2 });
                }
            }
        }

        return matches;
    }

    eliminateMatches() {
        const matches = this.findMatches();
        if (matches.length === 0) return false;

        // 标记为-1表示已消除
        for (const match of matches) {
            this.grid[match.y][match.x] = -1;
        }

        // 通知得分系统
        if (ScoreSystem.instance) {
            ScoreSystem.instance.addScore(matches.length * 10);
        }

        // 下落填充
        setTimeout(() => this.dropTiles(), 300);
        return true;
    }

    dropTiles() {
        for (let x = 0; x < this.gridWidth; x++) {
            let emptySpaces = 0;
            for (let y = this.gridHeight - 1; y >= 0; y--) {
                if (this.grid[y][x] === -1) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    this.grid[y + emptySpaces][x] = this.grid[y][x];
                    this.grid[y][x] = -1;
                }
            }
            // 填充新方块
            for (let y = 0; y < emptySpaces; y++) {
                this.grid[y][x] = this.getRandomTile();
            }
        }

        // 递归检查是否有新的匹配
        setTimeout(() => {
            if (this.eliminateMatches()) {
                // 继续消除
            }
        }, 300);
    }
}

import { ScoreSystem } from './ScoreSystem';
