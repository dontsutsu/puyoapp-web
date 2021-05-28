package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dontsutsu.puyoapp.domain.entity.EarlyData;
import com.dontsutsu.puyoapp.domain.repository.EarlyDataRepository;

/**
 * @author f-akamatsu
 */
@Service
public class EarlyDataService {

	@Autowired
	private EarlyDataRepository earlyDataRepository;

	public List<EarlyData> findByPlayerId(Integer playerId) {
		return earlyDataRepository.findByPlayerId(playerId);
	}
}
