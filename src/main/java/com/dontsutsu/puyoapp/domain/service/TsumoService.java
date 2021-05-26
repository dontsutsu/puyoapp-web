package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dontsutsu.puyoapp.domain.entity.Tsumo;
import com.dontsutsu.puyoapp.domain.repository.TsumoRepository;

/**
 * @author f-akamatsu
 */
@Service
public class TsumoService {

	@Autowired
	private TsumoRepository tsumoRepository;

	public List<Tsumo> findByDodaiKey(Integer playerId, String date, Integer seq) {
		return tsumoRepository.findByDodaiKey(playerId, date, seq);
	}
}
