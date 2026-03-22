import { _decorator, Component, Button, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickHandler')
export class ClickHandler extends Component {
    @property(Button)
    clickButton = null;

    @property
    clickScale: number = 0.9;

    @property
    animationDuration: number = 0.1;

    onLoad() {
        this.clickButton.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    onClick() {
        // 加分
        if (ScoreManager.instance) {
            ScoreManager.instance.addScore();
        }

        // 点击动画
        this.playClickAnimation();
    }

    private playClickAnimation() {
        const originalScale = this.clickButton.node.getScale();
        tween(this.clickButton.node)
            .to(this.animationDuration, { scale: new Vec3(this.clickScale * originalScale.x, this.clickScale * originalScale.y, originalScale.z) })
            .to(this.animationDuration, { scale: originalScale })
            .start();
    }
}
