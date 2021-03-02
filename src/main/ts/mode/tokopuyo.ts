import $ from "jquery";
import { Util } from "../util/util";
import { Mode } from "./mode";

$(function() {
	new Tokopuyo();
});

export class Tokopuyo extends Mode {
	private static readonly ALL_TSUMO_PUYO_LIST = [
		  "1111111111111111111111111111111111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222233333333333333333333333333333333333333333333333333333333333333334444444444444444444444444444444444444444444444444444444444444444"
		, "1111111111111111111111111111111111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222233333333333333333333333333333333333333333333333333333333333333335555555555555555555555555555555555555555555555555555555555555555"
		, "1111111111111111111111111111111111111111111111111111111111111111222222222222222222222222222222222222222222222222222222222222222244444444444444444444444444444444444444444444444444444444444444445555555555555555555555555555555555555555555555555555555555555555"
		, "1111111111111111111111111111111111111111111111111111111111111111333333333333333333333333333333333333333333333333333333333333333344444444444444444444444444444444444444444444444444444444444444445555555555555555555555555555555555555555555555555555555555555555"
		, "2222222222222222222222222222222222222222222222222222222222222222333333333333333333333333333333333333333333333333333333333333333344444444444444444444444444444444444444444444444444444444444444445555555555555555555555555555555555555555555555555555555555555555"
	];

	private _allTsumo: string[][];

	/**
	 * コンストラクタ
	 */
	constructor() {
		super();
		
		this._allTsumo = this.createAllTsumo();

		const current = this.advanceTsumo();
		const next = this.advanceTsumo();
		const dNext = this.advanceTsumo();
		this._game.initTokopuyo(current, next, dNext);

		// event
		$("html").on("keydown", (e) => {
			if (!this._game.isAnimation) {
				switch(e.key) {
					case "ArrowRight" : // Key[→]
						this._game.right();
					break;

					case "ArrowLeft" : // Key[←]
						this._game.left();
					break;

					case "ArrowDown" : // Key[↓]
						if (!this._game.dropCheck()) return;
						const dNext = this.advanceTsumo();
						this._game.dropTsumoAndSetDoubleNext(dNext);
					break;

					case "ArrowUp" : // Key[↑]
						//this.undo();
						console.log(this._game.field);
					break;

					case "z" : // Key[z]
						this._game.rotateLeft();
					break;

					case "x" : // Key[x]
						this._game.rotateRight();
					break;
				}
			}
		});
	}

	/**
	 * @override
	 */
	public undo(): void {
		super.undo();
	}

	/**
	 * @inheritdoc
	 */
	protected getState(): string {
		return this._game.getFieldString();
	}

	/**
	 * @inheritdoc
	 */
	protected setState(state: string): void {
		this._game.field.setField(state);
	}

	/**
	 * 
	 */
	private createAllTsumo(): string[][] {
		const random = Math.floor(Math.random() * Tokopuyo.ALL_TSUMO_PUYO_LIST.length);
		const allTsumoPuyoString = Tokopuyo.ALL_TSUMO_PUYO_LIST[random];
		let allTsumoPuyo = allTsumoPuyoString.split("");
		const allTsumo: string[][] = [];
		do {
			allTsumoPuyo = Util.shuffle(allTsumoPuyo);
		} while (this.isInitTsumoFourColor(allTsumoPuyo));

		for (let i = 0; i < allTsumoPuyo.length; i += 2) {
			allTsumo.push([allTsumoPuyo[i], allTsumoPuyo[i + 1]]);
		}

		return allTsumo;
	}

	/**
	 * 
	 * @param allTsumoPuyo 
	 * @return 
	 */
	private isInitTsumoFourColor(allTsumoPuyo: string[]): boolean {
		return allTsumoPuyo[0] != allTsumoPuyo[1]
		    && allTsumoPuyo[0] != allTsumoPuyo[2]
			&& allTsumoPuyo[0] != allTsumoPuyo[3]
			&& allTsumoPuyo[1] != allTsumoPuyo[2]
			&& allTsumoPuyo[1] != allTsumoPuyo[3]
			&& allTsumoPuyo[2] != allTsumoPuyo[3]
	}

	private advanceTsumo(): string[] {
		const tsumo = this._allTsumo.shift() as string[];
		this._allTsumo.push(tsumo);

		return tsumo;
	}

	private backTsumo(): string[] {
		const tsumo = this._allTsumo.pop() as string[];
		this._allTsumo.unshift(tsumo);

		return tsumo;
	}
}