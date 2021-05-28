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
	 * @param {TsumoCanvas} tsumoCanvas 
	 * @param {NextCanvas} nextCanvas 
	 */
	constructor(tsumoCanvas: TsumoCanvas, nextCanvas: NextCanvas) {
		this._list = [];
		this._tsumoCanvas = tsumoCanvas;
		this._nextCanvas = nextCanvas;
	}

	/**
	 * ツモを動かします。
	 * @param {number} vec 動かす距離と方向（ex　右に1：+1、左に2：-2）
	 * @returns {TimelineList}
	 */
	public moveCurrentTsumo(vec: number): TimelineList {
		const fromX = this._list[0].axisX;
		this._list[0].move(vec);
		const toX = this._list[0].axisX;

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._tsumoCanvas.getMoveTween(fromX, toX, this._list[0].tsumoChildPosition);
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * ツモを回転します。
	 * @param {boolean} clockwise true：時計周り / false：反時計周り
	 * @returns {TimelineList}
	 */
	public rotateCurrentTsumo(clockwise: boolean): TimelineList {
		const fromX = this._list[0].axisX;
		const beforePosition = this._list[0].tsumoChildPosition;
		this._list[0].rotate(clockwise);
		const toX = this._list[0].axisX;
		const afterPosition = this._list[0].tsumoChildPosition;

		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tweenList = this._tsumoCanvas.getRotateTween(fromX, toX, beforePosition, afterPosition);
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return timelineList;
	}

	/**
	 * 現在のツモを取得します。
	 * @returns {currentTsumo: Tsumo, dropTsumoTimelineList: TimelineList}
	 */
	public getCurrentTsumo(): {currentTsumo: Tsumo, dropTsumoTimelineList: TimelineList} {
		// アニメーション
		const timelineList = new TimelineList();
		const timeline = new Timeline({paused: true});
		const tsumoPosition = this._list[0].tsumoChildPosition;
		const tweenList = this._tsumoCanvas.getDropTween(tsumoPosition);		
		timeline.addTween(...tweenList);
		timelineList.push(timeline);
		return {currentTsumo: this._list[0], dropTsumoTimelineList: timelineList};
	}

	/**
	 * リセットします。
	 */
	public reset(): void {
		this.initList();
		this._tsumoCanvas.init(this._list[0]);
		this._nextCanvas.init(this._list[1], this._list[2]);
	}

	/**
	 * ツモを1つ進めます。
	 * @returns {TimelineList}
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
	 * ツモのリストをセットします。
	 * @param {Tsumo[]} tsumoList
	 */
	public set(tsumoList: Tsumo[]): void {
		this._list.length = 0;
		for (const tsumo of tsumoList) {
			this._list.push(tsumo);
		}
		this._tsumoCanvas.init(this._list[0]);
		this._nextCanvas.init(this._list[1], this._list[2]);
	}

	/**
	 * ツモを1つ戻します。
	 * @param {boolean} isMemorized 戻したツモの位置を記憶しておくかどうか
	 */
	public back(isMemorized: boolean): void {
		// 現在のツモ位置を保持しない場合はリセット
		if (!isMemorized) this._list[0].resetChildPosition();

		const tail = this._list.pop();
		if (tail == undefined) throw Error();
		
		this._list.unshift(tail);

		this._tsumoCanvas.init(this._list[0]);
		this._nextCanvas.init(this._list[1], this._list[2]);
	}

	/**
	 * ツモのリストを初期化します。（とこぷよ用）
	 * 128[手] = 4[色] * 64[ぷよ/色] / 2[ぷよ/手]
	 */
	private initList(): void {
		const colorList = [BasePuyo.GREEN, BasePuyo.RED, BasePuyo.BLUE, BasePuyo.YELLOW, BasePuyo.PURPLE];
		const removeIndex = Util.getRandomNumber(colorList.length);
		let workList: string[] = [];

		// 64*4色の配列作成
		for (let i = 0; i < colorList.length; i++) {
			if (i == removeIndex) continue;

			for (let j = 0; j < 64; j++) {
				workList.push(colorList[i]);
			}
		}

		// シャッフル、初手2ツモ（0～3）が3色以内になるように
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
	 * 最初のツモ2手が4色であるか確認します。
	 * @param {string[]} list
	 * @returns {boolean} true：4色 / false：3色以下
	 */
	private isInitTsumoFourColor(list: string[]) : boolean {
		return list[0] != list[1]
			&& list[0] != list[2]
			&& list[0] != list[3]
			&& list[1] != list[2]
			&& list[1] != list[3]
			&& list[2] != list[3];
	}

	// ACCESSOR
	get current(): Tsumo {
		return this._list[0];
	}
}