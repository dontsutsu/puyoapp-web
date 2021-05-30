package com.dontsutsu.puyoapp.application.controller.editor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * @author f-akamatsu
 */
@Controller
public class EditorController {

	@RequestMapping(value="/editor")
	private String editor(@RequestParam(name="field", required=false) String field, Model m) {
		String lastField = field == null ? "" : field;
		m.addAttribute("lastField", lastField);
		m.addAttribute("mode", "editor");
		return "app";
	}

}
