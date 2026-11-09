package com.booknest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Entry Point
 * SE1020 Object Oriented Programming Coursework Backend
 * BookNest Online Bookstore Management System
 */
@SpringBootApplication
public class BookNestApplication {

    public static void main(String[] args) {
        SpringApplication.run(BookNestApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" BookNest Backend Server is Running!            ");
        System.out.println(" Server URL : http://localhost:8080             ");
        System.out.println(" Storage    : Plain Text Files (./data/*.txt)   ");
        System.out.println(" Architecture: Controller -> Service -> FileDAO ");
        System.out.println("=================================================");
    }
}
