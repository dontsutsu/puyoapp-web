package com.dontsutsu.puyoapp.application.resource.early;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class FindEarlyDataResponseBean {
	private String playerId;
	private String date;
	private Integer seq;
	private String remarks;
}
