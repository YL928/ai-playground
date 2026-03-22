import { _decorator, Component, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('UpgradeButton')
export class UpgradeButton extends Component {
    @property(Button)
    button = null;
    @property(Label)
    upgradeLabel = null;

    @property
    private upgradeLevel: number = 0;
    @property
    private baseCost: number = 10;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.upgradeClickPower, this);
        this.updateLabel();
    }

    upgradeClickPower() {
        const cost = this.getUpgradeCost();
        if (ScoreManager.instance.spendScore(cost)) {
            this.upgradeLevel++;
            ScoreManager.instance.upgradeClickPower();
            this.updateLabel();
        }
    }

    getUpgradeCost(): number {
        return Math.floor(this.baseCost * Math.pow(1.5, this.upgradeLevel));
    }

    updateLabel() {
        const nextCost = this.getUpgradeCost();
        const power = ScoreManager.instance ? ScoreManager.instance.getClickPower() + 1 : 1;
        this.upgradeLabel.string = "升级 (+" + power + ")\n价格: " + nextCost;
    }
}
