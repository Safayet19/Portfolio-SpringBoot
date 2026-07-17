package com.safayetportfolio.portfoliospringboot.controller;

import com.safayetportfolio.portfoliospringboot.dto.ContactForm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Slf4j
@Controller
public class PortfolioController {

    @GetMapping("/")
    public String showPortfolio() {
        return "index";
    }

    @PostMapping("/contact")
    @ResponseBody
    public Map<String, String> submitContact(@ModelAttribute ContactForm contactForm) {
        log.info("Contact form received: {}", contactForm);
        return Map.of("message", "Message sent successfully!");
    }
}
