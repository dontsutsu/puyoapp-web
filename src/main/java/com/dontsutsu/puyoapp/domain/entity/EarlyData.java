package com.dontsutsu.puyoapp.domain.entity;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class EarlyData {
	private Integer playerId;
	private String date;
	private Integer seq;
	private String remarks;
}
