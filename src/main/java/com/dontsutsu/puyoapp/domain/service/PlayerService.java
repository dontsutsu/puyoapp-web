package com.dontsutsu.puyoapp.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dontsutsu.puyoapp.domain.entity.Player;
import com.dontsutsu.puyoapp.domain.repository.PlayerRepository;

/**
 * @author f-akamatsu
 */
@Service
public class PlayerService {

	@Autowired
	private PlayerRepository playerRepository;

	public List<Player> findAll() {
		return playerRepository.findAll();
	}

	public Player findOne(Integer playerId) {
		return playerRepository.findOne(playerId);
	}
}
