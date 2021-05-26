import { BaseMode } from "./base_mode";
import $ from "jquery";

export abstract class BaseTokopuyo extends BaseMode {
	// CLASS FIELD
	protected _undoStack: {field: string, score: number}[];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		this._undoStack = [];

		// event
		$("html").on("keydown", (e) => {
			switch(e.key) {
				// Key[→]
				case "ArrowRight" : {
					if (!this.isOperatable()) break;
					this.moveTsumo(1);
					break;
				}

				// Key[←]
				case "ArrowLeft" : {
					if (!this.isOperatable()) break;
					this.moveTsumo(-1);
					break;
				}

				// Key[↓]
				case "ArrowDown" : {
					if (!this.isOperatable()) break;
					if (!this._puyopuyo.isDroppableTsumo()) break;
					this.drop();
					this.individualDrop();
					break;
				}

				// Key[↑]
				case "ArrowUp" : {
					this.undo();
					this.individualUndo();
					break;
				}

				// Key[z]
				case "z" : { 
					if (!this.isOperatable()) break;
					this.rotateTsumo(false);
					break;
				}

				// Key[x]
				case "x" : {
					if (!this.isOperatable()) break;
					this.rotateTsumo(true);
					break;
				}
			}
		});
	}

	/**
	 * ツモ操作前に、操作可能かどうかをチェックします。
	 * @returns {boolean} true：操作可能 / false：操作不可
	 */
	private isOperatable(): boolean {
		// アニメーション中は操作不可
		if (this._timelineList.isAnimation) return false;
		
		// 死んでいる場合は操作不可
		if (this._puyopuyo.isDead()) return false;

		// 継承クラス個別のチェック
		if (!this.individualOperatableCheck()) return false;
		
		return true;
	}

	/**
	 * 
	 * @param {number} vec 
	 */
	private moveTsumo(vec: number): void {
		this._timelineList = this._puyopuyo.moveTsumo(vec);
		const before = () => { this._puyopuyo.hideGuide(); };
		const after = () => { this._puyopuyo.setGuide(); };
		this._timelineList.play(before, after);
	}

	/**
	 * 
	 * @param {boolean} clockwise 
	 */
	private rotateTsumo(clockwise: boolean): void {
		this._timelineList = this._puyopuyo.rotateTsumo(clockwise);
		const before = () => { this._puyopuyo.hideGuide(); };
		const after = () => { this._puyopuyo.setGuide(); };
		this._timelineList.play(before, after);
	}

	/**
	 * 
	 */
	private drop(): void {
		// UNDO用
		const field = this._puyopuyo.getFieldString();
		const score = this._puyopuyo.getScore();
		this._undoStack.push({field, score});

		const drop = this._puyopuyo.dropTsumoToField();
		const advTsumo = this._puyopuyo.advanceTsumo();
		this._timelineList = drop.add(advTsumo);
		const before = () => { this._puyopuyo.hideGuide(); };
		const after = () => { this._puyopuyo.setGuide(); };
		this._timelineList.play(before, after);
	}

	/**
	 * 
	 * @returns 
	 */
	private undo(): void {
		const undo = this._undoStack.pop();

		if (undo == undefined) return;

		this._puyopuyo.setField(undo.field);
		this._puyopuyo.setScore(undo.score);
		this._puyopuyo.backTsumo(false);
		this._puyopuyo.setGuide();
	}

	protected abstract individualOperatableCheck(): boolean;

	protected abstract individualDrop(): void;

	protected abstract individualUndo(): void;
}