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
	private static readonly THICKNESS = NoticeCanvas.SHAPE_SIZE / 20;
	
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

			noticePuyo.x = NoticeCanvas.SHAPE_SIZE * i + 0.5;
			noticePuyo.y = 0.5;
			NoticeCanvas.DICT[i].graphic(noticePuyo);

			this._noticePuyoList.push(noticePuyo);
		}

		this._stage.update();
	}

	private static smallGraphic(shape: Shape): void {
		const r = NoticeCanvas.SHAPE_SIZE / 2 * 0.76;
		const xpad = NoticeCanvas.SHAPE_SIZE / 2 - r;
		const ypad = NoticeCanvas.SHAPE_SIZE - 2 * r;
		shape.x += xpad;
		shape.y += ypad;
		shape.graphics
			.c()
			.s("#69686E")
			.ss(NoticeCanvas.THICKNESS)
			.f("#BBBBBB")
			.dc(r, r, r - NoticeCanvas.THICKNESS);
	}

	private static bigGraphic(shape: Shape): void {
		const r = NoticeCanvas.SHAPE_SIZE / 2;
		shape.graphics
			.c()
			.s("#69686E")
			.ss(NoticeCanvas.THICKNESS)
			.f("#BBBBBB")
			.dc(r, r, r - NoticeCanvas.THICKNESS);
	}

	private static rockGraphic(shape: Shape): void {
		const uni = NoticeCanvas.SHAPE_SIZE;
		shape.graphics
			.s("#960101")
			.ss(NoticeCanvas.THICKNESS)
			.f("#CC0000")
			.mt(uni * 0.32, uni * 0.13)
			.lt(uni * 0.59, uni * 0.11)
			.lt(uni * 0.67, uni * 0.21)
			.lt(uni * 0.84, uni * 0.23)
			.lt(uni * 0.93, uni * 0.33)
			.lt(uni * 0.96, uni * 0.47)
			.lt(uni * 0.96, uni * 0.73)
			.lt(uni * 0.91, uni * 0.84)
			.lt(uni * 0.80, uni * 0.93)
			.lt(uni * 0.64, uni * 0.99)
			.lt(uni * 0.37, uni * 0.99)
			.lt(uni * 0.19, uni * 0.93)
			.lt(uni * 0.10, uni * 0.84)
			.lt(uni * 0.03, uni * 0.70)
			.lt(uni * 0.05, uni * 0.39)
			.lt(uni * 0.13, uni * 0.29)
			.lt(uni * 0.20, uni * 0.27)
			.lt(uni * 0.32, uni * 0.13);
	}

	private static starGraphic(shape: Shape): void {
		const uni = NoticeCanvas.SHAPE_SIZE;
		shape.graphics
			.s("#AD3B00")
			.ss(NoticeCanvas.THICKNESS)
			.f("#EC8800")
			.mt(uni * 0.47, uni * 0.15)
			.lt(uni * 0.52, uni * 0.15)
			.lt(uni * 0.71, uni * 0.33)
			.lt(uni * 0.94, uni * 0.33)
			.lt(uni * 0.97, uni * 0.37)
			.lt(uni * 0.97, uni * 0.42)
			.lt(uni * 0.83, uni * 0.63)
			.lt(uni * 0.83, uni * 0.68)
			.lt(uni * 0.91, uni * 0.96)
			.lt(uni * 0.90, uni * 0.99)
			.lt(uni * 0.83, uni * 0.99)
			.lt(uni * 0.51, uni * 0.90)
			.lt(uni * 0.48, uni * 0.90)
			.lt(uni * 0.16, uni * 0.99)
			.lt(uni * 0.09, uni * 0.99)
			.lt(uni * 0.08, uni * 0.96)
			.lt(uni * 0.16, uni * 0.68)
			.lt(uni * 0.16, uni * 0.63)
			.lt(uni * 0.02, uni * 0.42)
			.lt(uni * 0.02, uni * 0.37)
			.lt(uni * 0.05, uni * 0.33)
			.lt(uni * 0.28, uni * 0.33)
			.lt(uni * 0.47, uni * 0.15);
	}

	private static moonGraphic(shape: Shape): void {

	}

	private static crownGraphic(shape: Shape): void {

	}
}