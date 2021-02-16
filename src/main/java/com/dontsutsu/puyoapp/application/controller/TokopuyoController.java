package com.dontsutsu.puyoapp.application.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TokopuyoController {

	@RequestMapping(value="/tokopuyo")
	private String tokopuyo(Model m) {
		m.addAttribute("mode", "tokopuyo");
		return "app";
	}

}
