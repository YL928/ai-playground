import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    scoreLabel = null;

    @property
    private score: number = 0;
    private clickPower: number = 1;

    static instance: ScoreManager = null;

    onLoad() {
        ScoreManager.instance = this;
    }

    start() {
        this.updateScoreDisplay();
    }

    addScore(amount: number = 1) {
        this.score += amount * this.clickPower;
        this.updateScoreDisplay();
    }

    getScore(): number {
        return this.score;
    }

    spendScore(cost: number): boolean {
        if (this.score >= cost) {
            this.score -= cost;
            this.updateScoreDisplay();
            return true;
        }
        return false;
    }

    upgradeClickPower() {
        this.clickPower += 1;
    }

    getClickPower(): number {
        return this.clickPower;
    }

    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    private updateScoreDisplay() {
        if (this.scoreLabel) {
            this.scoreLabel.string = "分数: " + Math.floor(this.score);
        }
    }
}
