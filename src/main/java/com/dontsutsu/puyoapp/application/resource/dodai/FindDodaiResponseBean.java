package com.dontsutsu.puyoapp.application.resource.dodai;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class FindDodaiResponseBean {
	private String playerId;
	private String date;
	private Integer seq;
	private String remarks;
}
