package com.dontsutsu.puyoapp.application.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class EditorController {

	@RequestMapping(value="/editor")
	private String editor(Model m) {
		m.addAttribute("mode", "editor");
		return "app";
	}

}
