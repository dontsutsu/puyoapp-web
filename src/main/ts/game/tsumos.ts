import { Timeline } from "@createjs/tweenjs";
import { NextCanvas } from "../canvas/next_canvas";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Util } from "../util/util";
import { BasePuyo } from "./puyo/base_puyo";
import { Tsumo } from "./tsumo";

export class Tsumos {
	// CLASS FIELD
	private _list: Tsumo[];
	private _tsumoCanvas: TsumoCanvas;
	private _nextCanvas: NextCanvas; 

	/**
	 * コンストラクタ
	 * @param tsumoCanvas 
	 * @param nextCanvas 
	 */
	constructor(tsumoCanvas: TsumoCanvas, nextCanvas: NextCanvas) {
		this._list = [];
		this._tsumoCanvas = tsumoCanvas;
		this._nextCanvas = nextCanvas;
	}

	/**
	 * 
	 * @param vec 
	 */
	public moveCurrentTsumo(vec: number): TimelineList {
		const fromX = this._list[0].axisX;
		this._list[0].move(vec);
		const toX = this._list[0].axisX;

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._tsumoCanvas.getMoveTween(fromX, toX, this._list[0].tsumoPosition);
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * 
	 * @param clockwise 
	 */
	public rotateCurrentTsumo(clockwise: boolean): TimelineList {
		const fromX = this._list[0].axisX;
		const beforePosition = this._list[0].tsumoPosition;
		this._list[0].rotate(clockwise);
		const toX = this._list[0].axisX;
		const afterPosition = this._list[0].tsumoPosition;

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._tsumoCanvas.getRotateTween(fromX, toX, beforePosition, afterPosition);
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * 
	 * @return 
	 */
	public getCurrentTsumo(): {currentTsumo: Tsumo, dropTsumoTimelineList: TimelineList} {
		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tsumoPosition = this._list[0].tsumoPosition;
		const tweenList = this._tsumoCanvas.getDropTween(tsumoPosition);		
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return {currentTsumo: this._list[0], dropTsumoTimelineList: timelineList};
	}

	/**
	 * 
	 */
	public reset(): void {
		this.initList();
		this._tsumoCanvas.init(this._list[0]);
		this._nextCanvas.init(this._list[1], this._list[2]);
	}

	/**
	 * 
	 */
	public advance(): TimelineList {
		const head = this._list.shift();
		if (head == undefined) throw Error();

		this._list.push(head);

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tsumoTweenList = this._tsumoCanvas.advance(this._list[0]);
		const nextTweenList = this._nextCanvas.advance(this._list[2]);
		timeline.addTween(...tsumoTweenList, ...nextTweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * 
	 */
	public set(tsumoList: Tsumo[]): void {
		this._list.length = 0;
		for (let i = 0; i < tsumoList.length; i++) {
			const tsumo = tsumoList[i];
			this._list.push(new Tsumo(tsumo.axisColor, tsumo.childColor));
		}
		this._tsumoCanvas.init(this._list[0]);
		this._nextCanvas.init(this._list[1], this._list[2]);
	}

	/**
	 * 
	 */
	private initList(): void {
		const colorList = [BasePuyo.GREEN, BasePuyo.RED, BasePuyo.BLUE, BasePuyo.YELLOW, BasePuyo.PURPLE];
		const removeIndex = Math.random() * colorList.length | 0;
		let workList: string[] = [];

		// 64*4色の配列作成
		for (let i = 0; i < colorList.length; i++) {
			if (i == removeIndex) continue;

			for (let j = 0; j < 64; j++) {
				workList.push(colorList[i]);
			}
		}

		// シャッフル、初手3ツモ（0～5）が3色以内になるように
		do {
			workList = Util.shuffle(workList);
		} while (this.isInitTsumoFourColor(workList));

		// ツモのリストに追加
		this._list.length = 0;
		for (let i = 0; i < workList.length; i += 2) {
			const tsumo = new Tsumo(workList[i], workList[i + 1]);
			this._list.push(tsumo);
		}
	}

	/**
	 * 
	 * @param list
	 */
	private isInitTsumoFourColor(list: string[]) : boolean {
		return list[0] != list[1]
			&& list[0] != list[2]
			&& list[0] != list[3]
			&& list[1] != list[2]
			&& list[1] != list[3]
			&& list[2] != list[3];
	}
}