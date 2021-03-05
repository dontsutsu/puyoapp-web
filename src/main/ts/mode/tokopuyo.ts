import { BaseMode } from "./base_mode";
import $ from "jquery";

$(() => {
	new Tokopuyo();
});

export class Tokopuyo extends BaseMode {
	constructor() {
		super();
	}
}