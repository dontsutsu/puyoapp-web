package com.dontsutsu.puyoapp.application.controller.dodai;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.dontsutsu.puyoapp.domain.entity.Player;
import com.dontsutsu.puyoapp.domain.service.PlayerService;

/**
 * @author f-akamatsu
 */
@Controller
public class DodaiController {

	@Autowired
	private PlayerService playerService;

	@RequestMapping(value="/dodai")
	private String dodai(Model m) {
		List<Player> players = playerService.findAll();
		m.addAttribute("players", players);
		m.addAttribute("mode", "dodai");
		return "app";
	}
}
