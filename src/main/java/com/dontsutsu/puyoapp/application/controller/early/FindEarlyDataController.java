package com.dontsutsu.puyoapp.application.controller.early;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.dontsutsu.puyoapp.application.resource.early.FindEarlyDataRequestBean;
import com.dontsutsu.puyoapp.application.resource.early.FindEarlyDataResponseBean;
import com.dontsutsu.puyoapp.domain.entity.EarlyData;
import com.dontsutsu.puyoapp.domain.service.EarlyDataService;

/**
 * @author f-akamatsu
 */
@RestController
public class FindEarlyDataController {

	@Autowired
	private EarlyDataService earlyDataService;

	@Autowired
	private ModelMapper modelMapper;

	@RequestMapping(value = "/findEarlyData", method = RequestMethod.POST)
	public List<FindEarlyDataResponseBean> findEarlyData(@RequestBody FindEarlyDataRequestBean req) {
		List<EarlyData> earlyDataList = earlyDataService.findByPlayerId(Integer.valueOf(req.getPlayerId()));
		return earlyDataList
				.stream()
				.map(earlyData -> modelMapper.map(earlyData, FindEarlyDataResponseBean.class))
				.collect(Collectors.toList());
	}
}
