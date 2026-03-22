import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MatchDetector')
export class MatchDetector extends Component {
    @property
    minMatchLength: number = 3;

    /**
     * 检测水平匹配
     */
    checkHorizontal(grid: number[][], x: number, y: number): number[] {
        const type = grid[y][x];
        if (type === -1) return [];

        const matches: number[] = [x];
        for (let i = x + 1; i < grid[0].length; i++) {
            if (grid[y][i] === type) {
                matches.push(i);
            } else {
                break;
            }
        }
        return matches.length >= this.minMatchLength ? matches : [];
    }

    /**
     * 检测垂直匹配
     */
    checkVertical(grid: number[][], x: number, y: number): number[] {
        const type = grid[y][x];
        if (type === -1) return [];

        const matches: number[] = [y];
        for (let i = y + 1; i < grid.length; i++) {
            if (grid[i][x] === type) {
                matches.push(i);
            } else {
                break;
            }
        }
        return matches.length >= this.minMatchLength ? matches : [];
    }

    /**
     * 检测L型或T型匹配
     */
    checkSpecialMatch(grid: number[][], match1: number[], match2: number[]): boolean {
        if (match1.length < 3 || match2.length < 3) return false;

        // 简单的L型检测
        const x1 = match1[0], y1 = match1[match1.length - 1];
        const x2 = match2[0], y2 = match2[match2.length - 1];

        return (Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1);
    }
}
