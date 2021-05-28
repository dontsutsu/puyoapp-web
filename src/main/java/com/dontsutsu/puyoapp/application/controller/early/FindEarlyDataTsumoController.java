package com.dontsutsu.puyoapp.application.controller.early;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.puyoapp.application.resource.early.FindEarlyDataTsumoRequestBean;
import com.dontsutsu.puyoapp.application.resource.early.FindEarlyDataTsumoResponseBean;
import com.dontsutsu.puyoapp.domain.entity.EarlyDataTsumo;
import com.dontsutsu.puyoapp.domain.service.EarlyDataTsumoService;

/**
 * @author f-akamatsu
 */
@RestController
public class FindEarlyDataTsumoController {

	@Autowired
	private EarlyDataTsumoService earlyDataTsumoService;

	@Autowired
	private ModelMapper modelMapper;

	@RequestMapping(value = "/findEarlyDataTsumo", method = RequestMethod.POST)
	public List<FindEarlyDataTsumoResponseBean> findEarlyDataTsumo(@RequestBody FindEarlyDataTsumoRequestBean req) {
		List<EarlyDataTsumo> earlyDataTsumoList = earlyDataTsumoService.findByEarlyDataKey(
				Integer.valueOf(req.getPlayerId()),
				req.getDate(),
				Integer.valueOf(req.getSeq())
				);
		return earlyDataTsumoList
				.stream()
				.map(earlyDataTsumo -> modelMapper.map(earlyDataTsumo, FindEarlyDataTsumoResponseBean.class))
				.collect(Collectors.toList());
	}

}
