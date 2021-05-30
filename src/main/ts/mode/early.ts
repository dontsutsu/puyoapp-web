import { BaseTokopuyo } from "./base_tokopuyo";
import $ from "jquery";
import { FieldCanvas } from "../canvas/field_canvas";
import { Util } from "../util/util";
import { Tsumo } from "../game/tsumo";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { NextCanvas } from "../canvas/next_canvas";
import { Puyopuyo } from "../game/puyopuyo";
import { TimelineList } from "../canvas/timeline/timeline_list";
import { Constant } from "../util/constant";

$(() => {
	new Early();
});

export class Early extends BaseTokopuyo {
	// CLASS FIELD
	private _modelFieldCanvas: FieldCanvas;
	private _modelTsumoCanvas: TsumoCanvas;
	private _modelNextCanvas: NextCanvas;
	private _modelPuyopuyo: Puyopuyo;

	private _modelUndoStack: {field: string, score: number}[];
	private _modelTimeLineList: TimelineList;

	private _limit: number;

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

		this._limit = -1;

		// event
		$("#player").on("change", (e) => {
			const playerId = (e.currentTarget as HTMLInputElement).value;
			this.findEarlyData(playerId);
		});
	}

	/**
	 * @inheritdoc
	 */
	protected individualOperatableCheck(): boolean {
		// limit=-1のときはデータが選択されていない状態なのでfalse
		if (this._limit == -1) return false;

		if (this._modelTimeLineList.isAnimation) return false;
		// 手数上限の場合false
		if (this._undoStack.length >= this._limit) return false;

		return true;
	}

	/**
	 * @inheritdoc
	 */
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

	/**
	 * @inheritdoc
	 */
	protected individualUndo(): void {
		const undo = this._modelUndoStack.pop();

		if (undo == undefined) return;

		this._modelPuyopuyo.setField(undo.field);
		this._modelPuyopuyo.setScore(undo.score);
		this._modelPuyopuyo.backTsumo(true);
	}

	/**
	 * player_idからearly_dataを検索し、テーブルを表示します。
	 * @param playerId player.player_id
	 */
	private findEarlyData(playerId: string): void {
		const $tbody = $("table#earlyDataList tbody");
		// tbodyの要素全削除
		$tbody.empty();

		if (playerId == "" || playerId == null) {
			return;
		}

		// ロード画面
		Util.dispLoading(Constant.AJAX_CONNECTING_MSG);

		$.ajax({
			type: "POST",
			url: "/findEarlyData",
			data: JSON.stringify( { playerId: playerId } ),
			contentType: "application/json",
			dataType: "json"
		})
		.done((dataList: FindEarlyDataInterface[]) => {
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
					this.findEarlyDataTsumo(playerId, date, seq);
				});

				// 2列目 日付+連番
				const $td2 = $("<td></td>");
				const txt = data.date.substr(0, 4) + "/" + data.date.substr(4, 2) + "/" + data.date.substr(6, 2) + " - " + data.seq;
				$td2.text(txt);

				// 3列目
				const $td3 = $("<td></td>");
				const $span = $("<sapn></sapn>", { "class": "remarks" }).text("?");
				$span.on("mouseover", (e) => {
					$(e.currentTarget).siblings(".tooltip").fadeIn("fast");
				});
				$span.on("mouseout", (e) => {
					$(e.currentTarget).siblings(".tooltip").fadeOut("fast");
				});
				const $p = $("<p></p>", { "class": "tooltip" }).text(data.remarks).hide();
				$td3.append($span, $p);

				// hidden
				const $playerId = $("<input></input>", { type: "hidden", class: "playerId", value: data.playerId });
				const $date = $("<input></input>", { type: "hidden", class: "date", value: data.date });
				const $seq = $("<input></input>", { type: "hidden", class: "seq", value: data.seq });

				const $tr = $("<tr></tr>");
				$tr.append($td1, $td2, $td3, $playerId, $date, $seq);
				$tbody.append($tr);
			}
		})
		.fail(() => {
			Util.dispMsg(Constant.AJAX_ERROR_MSG, "2");
		})
		.always(() => {
			Util.removeLoading();
		});
	}

	/**
	 * player_id、date、seqからearly_data_tsumoを検索し、取得したツモデータを画面にセットします。
	 * @param playerId early_data.player_id（PK1）
	 * @param date early_data.date（PK2）
	 * @param seq early_data.seq（PK3）
	 */
	private findEarlyDataTsumo(playerId: string, date: string, seq: string): void {
		// ロード画面
		Util.dispLoading(Constant.AJAX_CONNECTING_MSG);

		$.ajax({
			type: "POST",
			url: "/findEarlyDataTsumo",
			data: JSON.stringify( { playerId: playerId, date: date, seq: seq } ),
			contentType: "application/json",
			dataType: "json"
		})
		.done((dataList: FindEarlyDataTsumoInterface[]) => {
			// 取得したデータ-3を上限にする（ツモ、ネクスト、ダブネクが見える状態で終わるように）
			// 12手（4段分）を想定しているので、DBには15手分登録しておく
			this._limit = dataList.length - 3;

			// ツモリストを生成
			const playerTsumoList = this.createTsumoListFromAjaxData(dataList, false);
			const modelTsumoList = this.createTsumoListFromAjaxData(dataList, true);

			this._puyopuyo.initTokopuyo(playerTsumoList);
			this._modelPuyopuyo.initTokopuyo(modelTsumoList);
			
			this._undoStack.length = 0;
			this._modelUndoStack.length = 0;
		}).fail(() => {
			Util.dispMsg(Constant.AJAX_ERROR_MSG, "2");
		})
		.always(() => {
			Util.removeLoading();
		});
	}

	/**
	 * findEarlyDataTsumoのAjaxで取得したデータをツモリストに変換します。
	 * @param {FindEarlyDataTsumoInterface[]} dataList findEarlyDataTsumoで取得したデータ
	 * @param {boolean} isModel 作成するツモリストがモデル（2p）用か
	 * @returns {Tsumo[]} ツモリスト
	 */
	private createTsumoListFromAjaxData(dataList: FindEarlyDataTsumoInterface[], isModel: boolean): Tsumo[] {
		const tsumoList: Tsumo[] = [];
		for (const data of dataList) {
			const tsumo = new Tsumo(data.axisColor, data.childColor);
			if (isModel) {
				tsumo.axisX = Number(data.axisX);
				tsumo.setChildPositionByEnumValue(data.childPos);
			}
			tsumoList.push(tsumo);
		}
		return tsumoList;
	}
}

/**
 * Ajax（findindEarlyData）の取得データInterface
 */
interface FindEarlyDataInterface {
	playerId: string;
	date: string;
	seq: string;
	remarks: string;
}

/**
 * Ajax（findTsumo）の取得データInterface
 */
interface FindEarlyDataTsumoInterface {
	tsumoNo: string;
	axisColor: string;
	childColor: string;
	axisX: string;
	childPos: string;
}