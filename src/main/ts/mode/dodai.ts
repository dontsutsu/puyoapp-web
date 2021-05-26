import { BaseTokopuyo } from "./base_tokopuyo";
import $ from "jquery";
import { FieldCanvas } from "../canvas/field_canvas";
import { Util } from "../util/util";
import { Tsumo } from "../game/tsumo";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { Puyopuyo } from "../game/puyopuyo";
import { TimelineList } from "../canvas/timeline/timeline_list";

$(() => {
	new Dodai();
});

export class Dodai extends BaseTokopuyo {
	// CLASS FIELD
	private _modelFieldCanvas: FieldCanvas;
	private _modelTsumoCanvas: TsumoCanvas;
	private _modelNextCanvas: NextCanvas;
	private _modelPuyopuyo: Puyopuyo;

	private _modelUndoStack: {field: string, score: number}[];
	private _modelTimeLineList: TimelineList;

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		this._modelFieldCanvas = new FieldCanvas("modelField", true);
		this._modelTsumoCanvas = new TsumoCanvas("modelTsumo");
		this._modelNextCanvas = new NextCanvas("modelNext", true);
		this._modelPuyopuyo = new Puyopuyo(this._modelFieldCanvas, this._modelTsumoCanvas, this._modelNextCanvas);

		this._modelUndoStack = [];
		this._modelTimeLineList = new TimelineList();

		// event
		$("#player").on("change", (e) => {
			const playerId = (e.currentTarget as HTMLInputElement).value;
			this.findDodai(playerId);
		});
	}

	protected individualOperatableCheck(): boolean {
		if (this._modelTimeLineList.isAnimation) return false;
		//
		if (this._undoStack.length >= 10) return false;

		return true;
	}

	protected individualDrop(): void {
		// UNDO用
		const field = this._modelPuyopuyo.getFieldString();
		const score = this._modelPuyopuyo.getScore();
		this._modelUndoStack.push({field, score});

		const drop = this._modelPuyopuyo.dropTsumoToField();
		const advTsumo = this._modelPuyopuyo.advanceTsumo();
		this._modelTimeLineList = drop.add(advTsumo);
		this._modelTimeLineList.play();
	}

	protected individualUndo(): void {
		const undo = this._modelUndoStack.pop();

		if (undo == undefined) return;

		this._modelPuyopuyo.setField(undo.field);
		this._modelPuyopuyo.setScore(undo.score);
		this._modelPuyopuyo.backTsumo(true);
	}

	/**
	 * 
	 * @param playerId 
	 */
	private findDodai(playerId: string): void {
		const $tbody = $("table#dodaiList tbody");
		// tbodyの要素全削除
		$tbody.empty();

		if (playerId == "" || playerId == null) {
			return;
		}

		// ロード画面
		Util.dispLoading("検索中です...");

		$.ajax({
			type: "POST",
			url: "/findDodai",
			data: JSON.stringify( { playerId: playerId } ),
			contentType: "application/json",
			dataType: "json"
		})
		.done((dataList: FindDodaiInterface[]) => {
			for (const data of dataList) {
				// 1列目
				const $td1 = $("<td></td>");
				const $btn = $("<button></button>").text("選択");
				$td1.append($btn);

				$btn.on("click", (e) => {
					const $row = $(e.currentTarget).parent();
					const playerId = $row.siblings(".playerId").val() as string;
					const date = $row.siblings(".date").val() as string;
					const seq = $row.siblings(".seq").val() as string;
					this.findTsumo(playerId, date, seq);
				});

				// 2列目 日付+連番
				const $td2 = $("<td></td>");
				const txt = data.date.substr(0, 4) + "/" + data.date.substr(4, 2) + "/" + data.date.substr(6, 2) + " - " + data.seq;
				$td2.text(txt);

				// 3列目 TODO 備考をツールチップで
				const $td3 = $("<td></td>").text(data.remarks);
				const $tr = $("<tr></tr>");

				const $playerId = $("<input></input>", { type: "hidden", class: "playerId", value: data.playerId });
				const $date = $("<input></input>", { type: "hidden", class: "date", value: data.date });
				const $seq = $("<input></input>", { type: "hidden", class: "seq", value: data.seq });

				$tr.append($td1, $td2, $td3, $playerId, $date, $seq);
				$tbody.append($tr);
			}
		})
		.fail(() => {
			Util.dispMsg("サーバーとの通信に失敗しました。", "2");
		})
		.always(() => {
			Util.removeLoading();
		});
	}

	/**
	 * 
	 * @param playerId 
	 * @param date 
	 * @param seq 
	 */
	private findTsumo(playerId: string, date: string, seq: string): void {
		// ロード画面
		Util.dispLoading("検索中です...");

		$.ajax({
			type: "POST",
			url: "/findTsumo",
			data: JSON.stringify( { playerId: playerId, date: date, seq: seq } ),
			contentType: "application/json",
			dataType: "json"
		})
		.done((dataList: FindTsumoInterface[]) => {
			// ツモリストを生成
			const playerTsumoList = this.createTsumoListFromAjaxData(dataList, false);
			const modelTsumoList = this.createTsumoListFromAjaxData(dataList, true);

			this._puyopuyo.initTokopuyo(playerTsumoList);
			this._modelPuyopuyo.initTokopuyo(modelTsumoList);
			
			this._undoStack.length = 0;
			this._modelUndoStack.length = 0;
		}).fail(() => {
			Util.dispMsg("サーバーとの通信に失敗しました。", "2");
		})
		.always(() => {
			Util.removeLoading();
		});
	}

	/**
	 * 
	 * @param dataList 
	 * @param isModel 
	 * @returns 
	 */
	private createTsumoListFromAjaxData(dataList: FindTsumoInterface[], isModel: boolean): Tsumo[] {
		const tsumoList: Tsumo[] = [];
		for (const data of dataList) {
			const tsumo = new Tsumo(data.axisColor, data.childColor);
			if (isModel) {
				tsumo.axisX = Number(data.axisX);
				tsumo.setTsumoPositionByEnumValue(data.childPos);
			}
			tsumoList.push(tsumo);
		}
		return tsumoList;
	}
}

interface FindDodaiInterface {
	playerId: string;
	date: string;
	seq: string;
	remarks: string;
}

interface FindTsumoInterface {
	tsumoNo: string;
	axisColor: string;
	childColor: string;
	axisX: string;
	childPos: string;
}