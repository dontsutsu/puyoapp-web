import { TsumoCanvas } from "../../tsumo_canvas";
import { TsumoCellShape } from "../cell_shape/tsumo_cell_shape";
import { BasePuyoShape } from "./base_puyo_shape";

export class TsumoPuyoShape extends BasePuyoShape {

    constructor(ax: number, ay: number, color: string) {
        const x = TsumoCellShape.CELLSIZE * ax;
        const y = TsumoCellShape.CELLSIZE * TsumoCanvas.convertY(ay);
        super(x, y, color, TsumoCellShape.CELLSIZE);
    }
}