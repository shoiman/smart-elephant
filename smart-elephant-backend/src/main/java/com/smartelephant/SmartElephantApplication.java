package com.smartelephant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Smart Elephant Backend Application
 * AI-powered speech development game for children
 */
@SpringBootApplication
@EnableTransactionManagement
public class SmartElephantApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartElephantApplication.class, args);
    }
}
