import { NextCanvas } from "../canvas/next_canvas";
import { TsumoCanvas } from "../canvas/tsumo_canvas";
import { Tsumo } from "./tsumo";

export class Tsumos {
	// CLASS FIELD
	private _list: Tsumo[];
	private _tsumoCanvas: TsumoCanvas;
	private _nextCanvas: NextCanvas; 

	constructor(tsumoCanvas: TsumoCanvas, nextCanvas: NextCanvas) {
		this._list = [];
		this._tsumoCanvas = tsumoCanvas;
		this._nextCanvas = nextCanvas;
	}

	public moveCurrentTsumo(vec: number): void {
		this._list[0].move(vec);
	}

	public rotateCurrentTsumo(clockwise: boolean): void {
		this._list[0].rotate(clockwise);
	}

	public getCurrentTsumo(): Tsumo {
		return this._list[0];
	}
}