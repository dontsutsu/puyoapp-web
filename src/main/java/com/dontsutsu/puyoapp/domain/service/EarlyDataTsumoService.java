package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dontsutsu.puyoapp.domain.entity.EarlyDataTsumo;
import com.dontsutsu.puyoapp.domain.repository.EarlyDataTsumoRepository;

/**
 * @author f-akamatsu
 */
@Service
public class EarlyDataTsumoService {

	@Autowired
	private EarlyDataTsumoRepository earlyDataTsumoRepository;

	public List<EarlyDataTsumo> findByEarlyDataKey(Integer playerId, String date, Integer seq) {
		return earlyDataTsumoRepository.findByEarlyDataKey(playerId, date, seq);
	}
}
