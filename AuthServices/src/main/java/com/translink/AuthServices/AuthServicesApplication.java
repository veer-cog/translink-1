package com.translink.AuthServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AuthServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServicesApplication.class, args);
	}

}
