package com.dontsutsu.puyoapp.application.controller.dodai;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.puyoapp.application.resource.dodai.FindTsumoRequestBean;
import com.dontsutsu.puyoapp.application.resource.dodai.FindTsumoResponseBean;
import com.dontsutsu.puyoapp.domain.entity.Tsumo;
import com.dontsutsu.puyoapp.domain.service.TsumoService;

/**
 * @author f-akamatsu
 */
@RestController
public class FindTsumoController {

	@Autowired
	private TsumoService tsumoService;

	@Autowired
	private ModelMapper modelMapper;

	@RequestMapping(value = "/findTsumo", method = RequestMethod.POST)
	public List<FindTsumoResponseBean> findTsumo(@RequestBody FindTsumoRequestBean req) {
		List<Tsumo> tsumoList = tsumoService.findByDodaiKey(
				Integer.valueOf(req.getPlayerId()),
				req.getDate(),
				Integer.valueOf(req.getSeq())
				);
		return tsumoList
				.stream()
				.map(tsumo -> modelMapper.map(tsumo, FindTsumoResponseBean.class))
				.collect(Collectors.toList());
	}

}
