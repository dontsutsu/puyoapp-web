import { Container, Shape } from "@createjs/easeljs";
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

		const container = new Container();
		container.x = 10;
		container.y = 10;
		this._stage.addChild(container);

		this._noticePuyoList = [];
		for (let i = 0; i < NoticeCanvas.SIZE; i++) {
			const noticePuyo = new Shape();
			container.addChild(noticePuyo);

			noticePuyo.x = NoticeCanvas.SHAPE_SIZE * i + 0.5;
			noticePuyo.y = 0.5;
			// NoticeCanvas.DICT[i].graphic(noticePuyo);

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
			.mt(uni * 0.32, uni * 0.09)
			.lt(uni * 0.47, uni * 0.06)
			.lt(uni * 0.57, uni * 0.06)
			.lt(uni * 0.64, uni * 0.12)
			.lt(uni * 0.68, uni * 0.18)
			.lt(uni * 0.84, uni * 0.18)
			.lt(uni * 0.90, uni * 0.23)
			.lt(uni * 0.93, uni * 0.29)
			.lt(uni * 0.96, uni * 0.38)
			.lt(uni * 0.98, uni * 0.45)
			.lt(uni * 0.99, uni * 0.52)
			.lt(uni * 0.99, uni * 0.63)
			.lt(uni * 0.98, uni * 0.70)
			.lt(uni * 0.95, uni * 0.79)
			.lt(uni * 0.89, uni * 0.87)
			.lt(uni * 0.81, uni * 0.93)
			.lt(uni * 0.75, uni * 0.96)
			.lt(uni * 0.67, uni * 0.98)
			.lt(uni * 0.58, uni * 0.99)
			.lt(uni * 0.38, uni * 0.99)
			.lt(uni * 0.28, uni * 0.97)
			.lt(uni * 0.20, uni * 0.94)
			.lt(uni * 0.15, uni * 0.91)
			.lt(uni * 0.10, uni * 0.86)
			.lt(uni * 0.04, uni * 0.77)
			.lt(uni * 0.01, uni * 0.69)
			.lt(uni * 0.00, uni * 0.61)
			.lt(uni * 0.00, uni * 0.51)
			.lt(uni * 0.01, uni * 0.41)
			.lt(uni * 0.03, uni * 0.34)
			.lt(uni * 0.07, uni * 0.29)
			.lt(uni * 0.12, uni * 0.26)
			.lt(uni * 0.18, uni * 0.25)
			.lt(uni * 0.25, uni * 0.16)
			.lt(uni * 0.32, uni * 0.09);
	}

	private static starGraphic(shape: Shape): void {
		const uni = NoticeCanvas.SHAPE_SIZE;
		shape.graphics
			.s("#AD3B00")
			.ss(NoticeCanvas.THICKNESS)
			.f("#EC8800")
			.mt(uni * 0.48, uni * 0.08)
			.lt(uni * 0.51, uni * 0.08)
			.lt(uni * 0.53, uni * 0.09)
			.lt(uni * 0.56, uni * 0.12)
			.lt(uni * 0.60, uni * 0.17)
			.lt(uni * 0.65, uni * 0.23)
			.lt(uni * 0.70, uni * 0.29)
			.lt(uni * 0.80, uni * 0.29)
			.lt(uni * 0.96, uni * 0.29)
			.lt(uni * 0.99, uni * 0.31)
			.lt(uni * 0.99, uni * 0.35)
			.lt(uni * 0.97, uni * 0.40)
			.lt(uni * 0.94, uni * 0.46)
			.lt(uni * 0.91, uni * 0.51)
			.lt(uni * 0.87, uni * 0.57)
			.lt(uni * 0.84, uni * 0.61)
			.lt(uni * 0.84, uni * 0.64)
			.lt(uni * 0.86, uni * 0.68)
			.lt(uni * 0.88, uni * 0.74)
			.lt(uni * 0.90, uni * 0.81)
			.lt(uni * 0.91, uni * 0.86)
			.lt(uni * 0.92, uni * 0.92)
			.lt(uni * 0.92, uni * 0.97)
			.lt(uni * 0.90, uni * 0.99)
			.lt(uni * 0.86, uni * 0.99)
			.lt(uni * 0.80, uni * 0.98)
			.lt(uni * 0.76, uni * 0.97)
			.lt(uni * 0.72, uni * 0.96)
			.lt(uni * 0.66, uni * 0.94)
			.lt(uni * 0.60, uni * 0.92)
			.lt(uni * 0.56, uni * 0.90)
			.lt(uni * 0.51, uni * 0.88)
			.lt(uni * 0.48, uni * 0.88)
			.lt(uni * 0.43, uni * 0.90)
			.lt(uni * 0.39, uni * 0.92)
			.lt(uni * 0.34, uni * 0.94)
			.lt(uni * 0.27, uni * 0.96)
			.lt(uni * 0.23, uni * 0.97)
			.lt(uni * 0.19, uni * 0.98)
			.lt(uni * 0.13, uni * 0.99)
			.lt(uni * 0.09, uni * 0.99)
			.lt(uni * 0.07, uni * 0.97)
			.lt(uni * 0.07, uni * 0.92)
			.lt(uni * 0.08, uni * 0.86)
			.lt(uni * 0.09, uni * 0.81)
			.lt(uni * 0.11, uni * 0.74)
			.lt(uni * 0.13, uni * 0.68)
			.lt(uni * 0.15, uni * 0.64)
			.lt(uni * 0.15, uni * 0.61)
			.lt(uni * 0.12, uni * 0.57)
			.lt(uni * 0.08, uni * 0.51)
			.lt(uni * 0.05, uni * 0.46)
			.lt(uni * 0.02, uni * 0.40)
			.lt(uni * 0.00, uni * 0.35)
			.lt(uni * 0.00, uni * 0.31)
			.lt(uni * 0.03, uni * 0.29)
			.lt(uni * 0.19, uni * 0.29)
			.lt(uni * 0.29, uni * 0.29)
			.lt(uni * 0.34, uni * 0.23)
			.lt(uni * 0.39, uni * 0.17)
			.lt(uni * 0.43, uni * 0.12)
			.lt(uni * 0.46, uni * 0.09)
			.lt(uni * 0.48, uni * 0.08);
	}

	private static moonGraphic(shape: Shape): void {
		const uni = NoticeCanvas.SHAPE_SIZE;
		shape.graphics
			.s("#AD3B00")	
			.ss(NoticeCanvas.THICKNESS, 1, 1)
			.f("#EC8800")
			.arc(uni * 0.49, uni * 0.55, uni * 0.45, 4.690, 2.885, false)
			.arc(uni * 0.17, uni * 0.31, uni * 0.38, 1.849, 5.710, true)
			;
	}

	private static crownGraphic(shape: Shape): void {

	}
}