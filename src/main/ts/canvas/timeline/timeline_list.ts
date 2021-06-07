import { Timeline } from "@createjs/tweenjs";

export class TimelineList {
	// property
	private _timelineList: Timeline[];
	private _isAnimation: boolean;

	/**
	 * constructor
	 */
	constructor() {
		this._timelineList = [];
		this._isAnimation = false;
	}

	// method
	/**
	 * Timelineを追加
	 * @param {Timeline} timeline Timeline
	 * @returns {number} 要素数
	 */
	public push(timeline: Timeline): number {
		return this._timelineList.push(timeline);
	}

	/**
	 * TimelineListを足し合わせる
	 * @param {TimelineList[]} timelineListArray TimelineListの配列
	 * @returns {TimelineList} 足し合わせた後のTimelineList
	 */
	public add(...timelineListArray: TimelineList[]): TimelineList {
		for (let i = 0; i < timelineListArray.length; i++) {
			const timelineList = timelineListArray[i];
			for (let j = 0; j < timelineList._timelineList.length; j++) {
				this.push(timelineList._timelineList[j]);
			}
		}

		return this;
	}

	/**
	 * TimelineListを再生
	 * @param {() => void} [before] 再生前の処理（コールバック関数）
	 * @param {() => void} [after] 再生後の処理（コールバック関数）
	 */
	public play(before?: () => void, after?: () => void): void {
		if (this._timelineList.length == 0) return;

		this._isAnimation = true;

		for (let i = 0; i < this._timelineList.length; i++) {
			let afterComplete;
			if (i < this._timelineList.length - 1) {
				afterComplete = () => this._timelineList[i + 1].gotoAndPlay(0);
			} else {
				afterComplete = () => {
					this._isAnimation = false;
					// callback
					if (after != undefined) after();
				}
			}
			this._timelineList[i].addEventListener("complete", afterComplete);
		}

		// callback
		if (before != undefined) before();
		
		this._timelineList[0].gotoAndPlay(0);
	}

	/**
	 * アニメーションを終了時点までスキップします。
	 */
	public skipToEnd(): void {
		// 再生中でない場合は処理しない
		if (!this._isAnimation) return;

		for (let i = 0; i < this._timelineList.length; i++) {
			const timeline = this._timelineList[i];

			// 一時停止
			timeline.paused = true;

			// completeのリスナー削除　※最後のtimelineについては後処理があるのでremoveしない
			if (i < this._timelineList.length - 1) timeline.removeAllEventListeners("complete");
			
			// アニメーション時間取得
			timeline.updateDuration();
			const d = timeline.duration;

			// 終了時点から再生
			timeline.gotoAndPlay(d);
		}
	}

	// accessor
	get isAnimation(): boolean {
		return this._isAnimation;
	}
}