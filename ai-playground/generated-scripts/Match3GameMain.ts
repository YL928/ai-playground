import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { GridManager } from './GridManager';
import { ScoreSystem } from './ScoreSystem';

@ccclass('Match3GameMain')
export class Match3GameMain extends Component {
    @property
    gameTitle: string = '三消宝石';

    onLoad() {
        console.log('💎 三消游戏初始化');
    }

    start() {
        if (GridManager.instance) {
            console.log('网格系统就绪');
        }
        if (ScoreSystem.instance) {
            console.log('得分系统就绪');
        }
    }

    restartGame() {
        if (ScoreSystem.instance) {
            ScoreSystem.instance.reset();
        }
        if (GridManager.instance) {
            GridManager.instance.initGrid();
        }
    }
}
