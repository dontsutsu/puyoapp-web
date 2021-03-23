import { Shape } from "@createjs/easeljs";
import { BaseCanvas } from "./base_canvas";

export class NoticeCanvas extends BaseCanvas {
	// CONSTANT
	private static readonly DICT = [
		  { name: "small", qty:   1, graphic: NoticeCanvas.smallGraphic }
		, { name: "big"  , qty:   6, graphic: NoticeCanvas.bigGraphic   }
		, { name: "rock" , qty:  30, graphic: NoticeCanvas.rockGraphic  }
		, { name: "star" , qty: 180, graphic: NoticeCanvas.starGraphic  }
		, { name: "moon" , qty: 360, graphic: NoticeCanvas.moonGraphic  }
		, { name: "crown", qty: 720, graphic: NoticeCanvas.crownGraphic }
	];
	private static readonly SIZE = 6;
	private static readonly SHAPE_SIZE = 35;
	
	// CLASS FIELD
	private _noticePuyoList: Shape[];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super("notice", false);
		this._noticePuyoList = [];
		for (let i = 0; i < NoticeCanvas.SIZE; i++) {
			const noticePuyo = new Shape();
			this._stage.addChild(noticePuyo);

			noticePuyo.x = NoticeCanvas.SHAPE_SIZE * i;
			NoticeCanvas.smallGraphic(noticePuyo);

			this._noticePuyoList.push(noticePuyo);
		}

		this._stage.update();
	}

	private static smallGraphic(shape: Shape): void {
		shape.graphics
			.c()
			.s("#FF00FF")
			.ss(NoticeCanvas.SHAPE_SIZE / 20)
			.f("#FF0000")
			.dc(NoticeCanvas.SHAPE_SIZE / 2 + 0.5, NoticeCanvas.SHAPE_SIZE / 2 + 0.5, (NoticeCanvas.SHAPE_SIZE - 2) / 2);
	}

	private static bigGraphic(shape: Shape): void {

	}

	private static rockGraphic(shape: Shape): void {

	}

	private static starGraphic(shape: Shape): void {

	}

	private static moonGraphic(shape: Shape): void {

	}

	private static crownGraphic(shape: Shape): void {

	}
}