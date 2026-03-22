import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreSystem')
export class ScoreSystem extends Component {
    @property(Label)
    scoreLabel: Label = null!;
    @property(Label)
    targetLabel: Label = null!;
    @property
    targetScore: number = 1000;
    @property
    movesLimit: number = 30;
    @property(Label)
    movesLabel: Label = null!;

    private score: number = 0;
    private moves: number = 0;

    static instance: ScoreSystem = null!;

    onLoad() {
        ScoreSystem.instance = this;
        this.updateUI();
    }

    addScore(points: number) {
        this.score += points;
        this.updateUI();
        this.checkWin();
    }

    useMove() {
        this.moves++;
        this.updateUI();
        if (this.moves >= this.movesLimit) {
            this.checkGameOver();
        }
    }

    getScore(): number {
        return this.score;
    }

    getMovesLeft(): number {
        return this.movesLimit - this.moves;
    }

    isWin(): boolean {
        return this.score >= this.targetScore;
    }

    private checkWin() {
        if (this.isWin()) {
            console.log('🎉 恭喜通关！');
        }
    }

    private checkGameOver() {
        if (!this.isWin()) {
            console.log('💔 游戏结束');
        }
    }

    private updateUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = '分数: ' + this.score;
        }
        if (this.targetLabel) {
            this.targetLabel.string = '目标: ' + this.targetScore;
        }
        if (this.movesLabel) {
            this.movesLabel.string = '步数: ' + this.getMovesLeft();
        }
    }

    reset() {
        this.score = 0;
        this.moves = 0;
        this.updateUI();
    }
}
