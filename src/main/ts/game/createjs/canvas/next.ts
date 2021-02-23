import { NextCellShape } from "../shape/next_cell_shape";
import { NextPuyoShape } from "../shape/next_puyo_shape";
import { PuyoTimelineList } from "../timeline/puyo_timeline_list";

import { Container, Stage, Shape, Ticker } from "@createjs/easeljs";
import { Timeline } from "@createjs/tweenjs";


/**
 * Nextクラス
 */
export class Next {
	// クラス定数
	private static readonly CANVAS_ID = "next";

	// インスタンス変数
	private _stage: Stage;
	private _container: Container;

	private _nextAxisPuyoShape: NextPuyoShape;
	private _nextChildPuyoShape: NextPuyoShape;
	private _dNextAxisPuyoShape: NextPuyoShape;
	private _dNextChildPuyoShape: NextPuyoShape;

	/**
	 * コンストラクタ
	 * @param game ゲーム
	 */
	constructor() {
		// stage
		this._stage = new Stage(Next.CANVAS_ID);
		Ticker.addEventListener("tick", this._stage);

		// 傾けた分の計算
		const deg = 5;
		const cos = Math.cos(deg * (Math.PI / 180));
		const sin = Math.sin(deg * (Math.PI / 180));
		const yy = 70 * sin;

		// frame
		const frame1_1 = new Shape();
		frame1_1.graphics
			.f("#E0E0E0")
			.rr(0.5, 0.5, 70 / cos, 100 + 70 * sin, 12.5);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame1_1.skewY = deg;

		const frame1_2 = new Shape();
		frame1_2.graphics
			.f("#E0E0E0")
			.rr(30.5, 70.5, 70 / cos, 100 + 70 * sin, 12.5);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame1_2.skewY = deg;
		this._stage.addChild(frame1_1, frame1_2);

		const frame2_1 = new Shape();
		frame2_1.graphics
			.f("#EE808D")
			.rr(5.5, 5.5, 60 / cos, 90 + 60 * sin, 10);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame2_1.skewY = deg;

		const frame2_2 = new Shape();
		frame2_2.graphics
			.f("#EE808D")
			.rr(35.5, 75.5, 60 / cos, 90 + 60 * sin, 10);	//x: 20(pad)+30+20(pad), y: 20(pad)+60+20(pad)
		frame2_2.skewY = deg;
		this._stage.addChild(frame2_1, frame2_2);

		this._container = new Container();
		this._container.x = 20;
		this._container.y = 20 + yy;

		// CellShape
		for (let n = 0; n < 2; n++) {	// next: n=0, double next: n=1
			for (let t = 0; t < 2; t++) {	// child: t=0, axis: t=1
				const cellShape = new NextCellShape(n, t);
				this._container.addChild(cellShape);
			}
		}

		// puyoShape
		this._nextAxisPuyoShape = new NextPuyoShape("0", 0, 1);
		this._nextChildPuyoShape = new NextPuyoShape("0", 0, 0);
		this._dNextAxisPuyoShape = new NextPuyoShape("0", 1, 0);
		this._dNextChildPuyoShape = new NextPuyoShape("0", 1, 1);
		this._container.addChild(this._nextAxisPuyoShape, this._nextChildPuyoShape, this._dNextAxisPuyoShape, this._dNextChildPuyoShape);

		this._stage.addChild(this._container);
	}

	/**
	 * 最初のネクスト、ダブネクを設定します。
	 * ダブネクがない場合は、第3,4引数を "0" で渡すか、第3,4引数を指定しません。
	 * @naColor ネクスト軸ぷよの色
	 * @ncColor ネクスト子ぷよの色
	 * @daColor ダブネク軸ぷよの色
	 * @dcColor ダブネク子ぷよの色
	 */
	public setInitialNext(naColor: string, ncColor: string, daColor: string = "0", dcColor: string = "0"): void {
		this._nextAxisPuyoShape = new NextPuyoShape(naColor, 0, 1);
		this._nextChildPuyoShape = new NextPuyoShape(ncColor, 0, 0);
		this._container.addChild(this._nextAxisPuyoShape, this._nextChildPuyoShape);

		this._dNextAxisPuyoShape = new NextPuyoShape(daColor, 1, 0);
		this._dNextChildPuyoShape = new NextPuyoShape(dcColor, 1, 1);
		this._container.addChild(this._dNextAxisPuyoShape, this._dNextChildPuyoShape);
	}

	/**
	 * 新しいダブネクをセットし、現在のネクストの色を取得します。
	 * また、アニメーションも設定します。
	 * @param aColor 新しくセットする軸ぷよ
	 * @param cColor 新しくセットする子ぷよ
	 * @param puyoTlList PuyoTimeLineのリスト
	 */
	public pushAndPop (aColor: string, cColor: string, puyoTlList: PuyoTimelineList): { aColor: string; cColor: string; } {
		const timeline = new Timeline({paused:true});

		const newDnaPuyoShape = new NextPuyoShape(aColor, 1, 1);
		const newDncPuyoShape = new NextPuyoShape(cColor, 1, 0);

		const newDnaTween = newDnaPuyoShape.getMoveToDoubleNextTween(this._container);
		const newDncTween = newDncPuyoShape.getMoveToDoubleNextTween(this._container);

		const dnaTween = this._dNextAxisPuyoShape.getMoveFromDNextToNextTween();
		const dncTween = this._dNextChildPuyoShape.getMoveFromDNextToNextTween();

		const naTween = this._nextAxisPuyoShape.getMoveFromNextToTsumoTween(this._container);
		const ncTween = this._nextChildPuyoShape.getMoveFromNextToTsumoTween(this._container);

		timeline.addTween(newDnaTween);
		timeline.addTween(newDncTween);
		timeline.addTween(dnaTween);
		timeline.addTween(dncTween);
		timeline.addTween(naTween);
		timeline.addTween(ncTween);

		let naColor = this._nextAxisPuyoShape.color;
		let ncColor = this._nextChildPuyoShape.color;

		this._nextAxisPuyoShape = this._dNextAxisPuyoShape;
		this._nextChildPuyoShape = this._dNextChildPuyoShape;
		this._dNextAxisPuyoShape = newDnaPuyoShape;
		this._dNextChildPuyoShape = newDncPuyoShape;

		puyoTlList.push(timeline);

		return {aColor: naColor, cColor: ncColor};
	}

}
