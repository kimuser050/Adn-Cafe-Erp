package com.kh.app.feature.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // application.properties에 작성한 경로들을 가져옵니다.
    @Value("${file.upload.path.notice}")
    private String noticePath;

    @Value("${file.upload.path.question}")
    private String questionPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 1. 공지사항 이미지 매핑
        // 브라우저가 /upload/notice/** 로 요청하면 -> 실제 D:/dev/uploads/notice/ 에서 찾음
        registry.addResourceHandler("/upload/notice/**")
                .addResourceLocations("file:///" + noticePath);

        // 2. 문의게시판 이미지 매핑
        registry.addResourceHandler("/upload/question/**")
                .addResourceLocations("file:///" + questionPath);

        // 필요한 다른 경로(member, answer 등)도 똑같이 추가 가능합니다.
    }
}

