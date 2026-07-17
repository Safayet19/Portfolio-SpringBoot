package com.safayetportfolio.portfoliospringboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactForm {
    private String name;
    private String email;
    private String subject;
    private String message;
}
