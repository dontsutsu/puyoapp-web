package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dontsutsu.puyoapp.domain.entity.Dodai;
import com.dontsutsu.puyoapp.domain.repository.DodaiRepository;

/**
 * @author f-akamatsu
 */
@Service
public class DodaiService {

	@Autowired
	private DodaiRepository dodaiRepository;

	public List<Dodai> findByPlayerId(Integer playerId) {
		return dodaiRepository.findByPlayerId(playerId);
	}
}
