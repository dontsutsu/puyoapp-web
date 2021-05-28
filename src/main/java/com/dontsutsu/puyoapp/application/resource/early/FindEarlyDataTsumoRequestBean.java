package com.dontsutsu.puyoapp.application.resource.early;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class FindEarlyDataTsumoRequestBean {
	private String playerId;
	private String date;
	private String seq;
}
