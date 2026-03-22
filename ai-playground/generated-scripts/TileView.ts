import { _decorator, Component, Node, Sprite, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TileView')
export class TileView extends Component {
    @property(Sprite)
    sprite: Sprite = null!;

    private gridX: number = 0;
    private gridY: number = 0;
    private tileType: number = 0;

    init(x: number, y: number, type: number) {
        this.gridX = x;
        this.gridY = y;
        this.tileType = type;
        this.updatePosition();
    }

    private updatePosition() {
        const posX = this.gridX * 50;
        const posY = -this.gridY * 50;
        this.node.setPosition(posX, posY, 0);
    }

    async swapTo(x: number, y: number, animated: boolean = true) {
        this.gridX = x;
        this.gridY = y;

        if (animated) {
            return new Promise(resolve => {
                const posX = x * 50;
                const posY = -y * 50;
                tween(this.node)
                    .to(0.2, { position: new Vec3(posX, posY, 0) })
                    .call(resolve)
                    .start();
            });
        } else {
            this.updatePosition();
        }
    }

    playEliminateAnimation() {
        return new Promise(resolve => {
            tween(this.node)
                .to(0.15, { scale: new Vec3(0, 0, 0) })
                .call(resolve)
                .start();
        });
    }

    playFallAnimation(fromY: number) {
        const targetY = this.gridY;
        const startPos = -fromY * 50;
        const targetPos = -targetY * 50;
        
        this.node.setPosition(this.gridX * 50, startPos, 0);
        
        return new Promise(resolve => {
            tween(this.node)
                .to(0.3, { position: new Vec3(this.gridX * 50, targetPos, 0) }, { easing: 'bounceOut' })
                .call(resolve)
                .start();
        });
    }
}
