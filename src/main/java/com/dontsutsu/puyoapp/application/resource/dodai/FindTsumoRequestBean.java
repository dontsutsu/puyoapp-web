package com.dontsutsu.puyoapp.application.resource.dodai;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class FindTsumoRequestBean {
	private String playerId;
	private String date;
	private String seq;
}
