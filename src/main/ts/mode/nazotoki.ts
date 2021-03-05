import { EditableMode } from "./editable_mode";
import $ from "jquery";
import { TsumoListCanvas } from "../canvas/tsumo_list_canvas";

$(() => {
	new Nazotoki();
});

export class Nazotoki extends EditableMode {
	// CLASS FIELD
	private _tsumoListCanvas: TsumoListCanvas;

	constructor() {
		super();
		this._tsumoListCanvas = new TsumoListCanvas(); 
	}
}