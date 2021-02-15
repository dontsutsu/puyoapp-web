package com.dontsutsu.puyoapp.application.controller;

import java.util.List;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.nazopuyo.Calc;
import com.dontsutsu.puyoapp.application.resource.SearchRequestJsonBean;
import com.dontsutsu.puyoapp.application.resource.SearchResponseJsonBean;
import com.dontsutsu.puyopuyo.Field;
import com.dontsutsu.puyopuyo.Tsumo;

/**
 * @author akamternity
 */
@RestController
public class SearchController {

	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public SearchResponseJsonBean execute(@RequestBody SearchRequestJsonBean bean) {
		List<List<Tsumo>> result = null;
		System.out.println("field    : " + bean.getField());
		System.out.println("tsumoList: " + bean.getTsumoList());
		System.out.println("type     : " + bean.getNazoType());
		System.out.println("require  : " + bean.getNazoRequire());

		// なぞぷよ計算インスタンス生成
		Calc calc = Calc.getInstance(bean.getNazoType(), bean.getNazoRequire(), 10);

		// フィールド、ツモリストを文字列から生成
		Field field = new Field(bean.getField());
		List<Tsumo> tsumoList = Tsumo.getTsumoList(bean.getTsumoList());

		// 計算
		result = calc.calc(field, tsumoList);

		// Responseに結果を詰める
		SearchResponseJsonBean res = new SearchResponseJsonBean(result);

		return res;
	}
}
