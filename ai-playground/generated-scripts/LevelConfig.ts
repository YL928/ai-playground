import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelConfig')
export class LevelConfig extends Component {
    @property
    level: number = 1;
    @property
    targetScore: number = 1000;
    @property
    movesLimit: number = 30;
    @property
    gridWidth: number = 8;
    @property
    gridHeight: number = 8;

    static readonly LEVELS = [
        { targetScore: 1000, moves: 30 },
        { targetScore: 2000, moves: 28 },
        { targetScore: 3000, moves: 25 },
        { targetScore: 5000, moves: 22 },
        { targetScore: 8000, moves: 20 },
    ];

    static getLevelConfig(level: number): { targetScore: number, moves: number } {
        const index = Math.min(level - 1, this.LEVELS.length - 1);
        return this.LEVELS[index];
    }
}
