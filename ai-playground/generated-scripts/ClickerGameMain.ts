import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

import { ScoreManager } from './ScoreManager';

@ccclass('ClickerGameMain')
export class ClickerGameMain extends Component {
    @property
    gameTitle: string = '点击大冒险';

    onLoad() {
        console.log('🎮 点击游戏初始化完成');
    }

    start() {
        // 游戏已通过ScoreManager自动初始化
        if (ScoreManager.instance) {
            console.log('分数管理器就绪');
        }
    }

    restartGame() {
        if (ScoreManager.instance) {
            ScoreManager.instance.resetScore();
        }
    }
}
