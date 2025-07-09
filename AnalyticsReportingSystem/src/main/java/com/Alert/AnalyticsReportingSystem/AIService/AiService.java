package com.Alert.AnalyticsReportingSystem.AIService;

import java.util.Map;

import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiService {

    private final OpenAiChatModel openAiService;

    public String getAiResponse(String notes, String department, String jobTitle) {
        String promptString = """
                You are an HR evaluator. Based on the following HR notes, evaluate a job candidate and assign a score from 1 to 10.
                Use the notes to assess: Professionalism, Skills, Attitude, Overall suitability for the role.
                Scoring system: 1 to 4 = Poor fit → Respond: Not in my 9 lives.
                5 to 7 = Moderate fit → Respond: Backup.
                8 to 10 = Strong fit → Respond: Approved.
                Notes: {notes}
                Department: {department}
                Job Title: {jobTitle}.
                """;

        PromptTemplate promptTemplate = new PromptTemplate(promptString);
        var prompt = promptTemplate.create(Map.of(
                "notes", notes,
                "department", department,
                "jobTitle", jobTitle));

        return openAiService.call(prompt).getResult().getOutput().getContent();
    }
}
