package com.dontsutsu.puyoapp.application.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

	@RequestMapping(value="/")
	private String index(){
		return "redirect:/editor";
	}
}