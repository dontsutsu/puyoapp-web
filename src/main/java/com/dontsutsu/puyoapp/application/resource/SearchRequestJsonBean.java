package com.dontsutsu.puyoapp.application.resource;

import java.io.Serializable;

public class SearchRequestJsonBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private String field;

	private String tsumoList;

	private String nazoType;

	private String nazoRequire;

	public String getField() {
		return field;
	}

	public void setField(String fieldStr) {
		this.field = fieldStr;
	}

	public String getTsumoList() {
		return tsumoList;
	}

	public void setTsumoList(String tsumoListStr) {
		this.tsumoList = tsumoListStr;
	}

	public String getNazoType() {
		return nazoType;
	}

	public void setNazoType(String nazoType) {
		this.nazoType = nazoType;
	}

	public String getNazoRequire() {
		return nazoRequire;
	}

	public void setNazoRequire(String nazoRequire) {
		this.nazoRequire = nazoRequire;
	}
}
