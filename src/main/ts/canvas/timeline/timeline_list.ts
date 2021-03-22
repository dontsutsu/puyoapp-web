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
	 */
	// TODO 
	// public play(before?: () => void, after?: () => void) 
	// に変更して、コールバック関数で再生前、再生後に処理を差し込みたい
	public play(): void {
		if (this._timelineList.length == 0) return;

		this._isAnimation = true;

		for (let i = 0; i < this._timelineList.length; i++) {
			let afterComplete;
			if (i < this._timelineList.length - 1) {
				afterComplete = () => this._timelineList[i + 1].gotoAndPlay(0);
			} else {
				afterComplete = () => this._isAnimation = false;
			}
			this._timelineList[i].addEventListener("complete", afterComplete);
		}

		this._timelineList[0].gotoAndPlay(0);
	}

	// ACCESSOR
	get isAnimation(): boolean {
		return this._isAnimation;
	}
}