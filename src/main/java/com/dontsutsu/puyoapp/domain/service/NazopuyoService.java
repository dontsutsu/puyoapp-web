package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dontsutsu.nazopuyo.Calc;
import com.dontsutsu.puyopuyo.Field;
import com.dontsutsu.puyopuyo.Tsumo;

/**
 * @author f-akamatsu
 */
@Service
public class NazopuyoService {
	/**
	 *
	 * @param fieldStr
	 * @param tsumoListStr
	 * @param nazoType
	 * @param nazoRequire
	 * @return
	 */
	public List<List<Tsumo>> findNazopuyoAnswer(String fieldStr, String tsumoListStr, String nazoType, String nazoRequire) {
		// なぞぷよ計算インスタンス生成
		Calc calc = Calc.getInstance(nazoType, nazoRequire, 10);

		// フィールド、ツモリストを文字列から生成
		Field field = new Field(fieldStr);
		List<Tsumo> tsumoList = Tsumo.getTsumoList(tsumoListStr);

		// 計算
		return calc.calc(field, tsumoList);
	}
}
