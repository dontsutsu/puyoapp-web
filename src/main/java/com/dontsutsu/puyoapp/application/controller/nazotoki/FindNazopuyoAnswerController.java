package com.dontsutsu.puyoapp.application.controller.nazotoki;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.puyoapp.application.resource.nazotoki.FindNazopuyoAnswerRequestBean;
import com.dontsutsu.puyoapp.application.resource.nazotoki.FindNazopuyoAnswerResponseBean;
import com.dontsutsu.puyoapp.domain.service.NazopuyoService;
import com.dontsutsu.puyopuyo.Tsumo;

/**
 * @author f-akamatsu
 */
@RestController
public class FindNazopuyoAnswerController {

	@Autowired
	private NazopuyoService nazopuyoService;

	@RequestMapping(value = "/findNazopuyoAnswer", method = RequestMethod.POST)
	public List<List<FindNazopuyoAnswerResponseBean>> findNazopuyoAnswer(@RequestBody FindNazopuyoAnswerRequestBean req) {
		System.out.println("field     : " + req.getField());
		System.out.println("tsumoList : " + req.getTsumoList());
		System.out.println("type      : " + req.getNazoType());
		System.out.println("require   : " + req.getNazoRequire());

		// リクエストの情報からなぞぷよの回答を検索
		List<List<Tsumo>> answerList = nazopuyoService.findNazopuyoAnswer(req.getField(), req.getTsumoList(), req.getNazoType(), req.getNazoRequire());

		// 検索結果からレスポンスを作成
		List<List<FindNazopuyoAnswerResponseBean>> res = createResponse(answerList);

		return res;
	}

	private List<List<FindNazopuyoAnswerResponseBean>> createResponse(List<List<Tsumo>> answerList) {
		List<List<FindNazopuyoAnswerResponseBean>> beanListList = new ArrayList<>();

		for (int i = 0; i < answerList.size(); i++) {

			List<Tsumo> tsumoList = answerList.get(i);
			List<FindNazopuyoAnswerResponseBean> beanList = new ArrayList<>();

			for (int j = 0; j < tsumoList.size(); j++) {
				FindNazopuyoAnswerResponseBean bean = new FindNazopuyoAnswerResponseBean();
				Tsumo t = tsumoList.get(j);
				bean.setAxisColor(t.getAxisPuyo().getColor());
				bean.setChildColor(t.getChildPuyo().getColor());
				bean.setAxisX(t.getAxisX());
				bean.setTsumoPosition(t.getChildPosition().getName());
				beanList.add(bean);
			}
			beanListList.add(beanList);
		}

		return beanListList;
	}
}
