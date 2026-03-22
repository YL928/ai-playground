import { _decorator, Component, Button, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickButton')
export class ClickButton extends Component {
    @property(Button)
    button = null;

    @property
    popScale: number = 0.85;
    @property
    animTime: number = 0.12;

    onLoad() {
        this.button.node.on(Button.EventType.CLICK, this.handleClick, this);
    }

    handleClick() {
        ScoreManager.instance.addScore();
        this.playAnimation();
    }

    private playAnimation() {
        const original = this.button.node.getScale();
        tween(this.button.node)
            .to(this.animTime, { scale: new Vec3(original.x * this.popScale, original.y * this.popScale, original.z) })
            .to(this.animTime, { scale: original })
            .start();
    }
}
