package com.dontsutsu.puyoapp.application.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class NazotokiController {

	@RequestMapping(value="/nazotoki")
	private String nazotoki(Model m) {
		m.addAttribute("mode", "nazotoki");
		return "app";
	}

}
