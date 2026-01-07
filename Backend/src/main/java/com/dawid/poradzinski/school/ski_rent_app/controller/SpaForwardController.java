package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    // Forward all non-file requests (no dot in segment) to index.html.
    // API controllers (e.g. /v1/api/...) are more specific and will take precedence.
    @RequestMapping(value = {"/{path:[^.]*}", "/**/{path:[^.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}
