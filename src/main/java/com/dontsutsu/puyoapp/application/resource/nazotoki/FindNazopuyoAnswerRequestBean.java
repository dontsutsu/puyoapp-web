package com.dontsutsu.puyoapp.application.resource.nazotoki;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class FindNazopuyoAnswerRequestBean {
	private String field;
	private String tsumoList;
	private String nazoType;
	private String nazoRequire;
}
