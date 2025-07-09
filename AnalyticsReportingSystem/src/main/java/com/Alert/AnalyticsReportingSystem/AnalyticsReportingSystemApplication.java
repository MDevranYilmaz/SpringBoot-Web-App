package com.Alert.AnalyticsReportingSystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {
		org.springframework.ai.autoconfigure.openai.OpenAiAutoConfiguration.class
})
public class AnalyticsReportingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(AnalyticsReportingSystemApplication.class, args);
	}

}
