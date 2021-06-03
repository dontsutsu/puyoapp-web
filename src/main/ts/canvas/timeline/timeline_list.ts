import { Timeline } from "@createjs/tweenjs";

export class TimelineList {
	// CLASS FIELD
	private _timelineList: Timeline[];
	private _isAnimation: boolean;

	/**
	 * コンストラクタ
	 */
	constructor() {
		this._timelineList = [];
		this._isAnimation = false;
	}

	/**
	 * 
	 * @param {Timeline} timeline 
	 * @returns {number}
	 */
	public push(timeline: Timeline): number {
		return this._timelineList.push(timeline);
	}

	/**
	 * 
	 * @param {TimelineList[]} timelineListArray 
	 * @returns {TimelineList}
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
	 * 
	 * @param before 
	 * @param after 
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

	// ACCESSOR
	get isAnimation(): boolean {
		return this._isAnimation;
	}
}