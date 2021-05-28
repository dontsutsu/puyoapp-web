package com.dontsutsu.puyoapp.domain.entity;

import lombok.Data;

/**
 * @author f-akamatsu
 */
@Data
public class EarlyDataTsumo {
	Integer playerId;
	String date;
	Integer seq;
	Integer tsumoNo;
	String axisColor;
	String childColor;
	Integer axisX;
	String childPos;
}
