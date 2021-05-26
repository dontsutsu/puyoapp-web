package com.dontsutsu.puyoapp.application.controller.dodai;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.puyoapp.application.resource.dodai.FindDodaiRequestBean;
import com.dontsutsu.puyoapp.application.resource.dodai.FindDodaiResponseBean;
import com.dontsutsu.puyoapp.domain.entity.Dodai;
import com.dontsutsu.puyoapp.domain.service.DodaiService;

/**
 * @author f-akamatsu
 */
@RestController
public class FindDodaiController {

	@Autowired
	private DodaiService dodaiService;

	@Autowired
	private ModelMapper modelMapper;

	@RequestMapping(value = "/findDodai", method = RequestMethod.POST)
	public List<FindDodaiResponseBean> findDodai(@RequestBody FindDodaiRequestBean req) {
		List<Dodai> dodaiList = dodaiService.findByPlayerId(Integer.valueOf(req.getPlayerId()));
		return dodaiList
				.stream()
				.map(dodai -> modelMapper.map(dodai, FindDodaiResponseBean.class))
				.collect(Collectors.toList());
	}
}
