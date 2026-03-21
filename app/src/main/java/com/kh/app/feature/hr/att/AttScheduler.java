package com.kh.app.feature.hr.att;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class AttScheduler {

    private final AttService attService;

    // 매일 12시 정각 실행 (0초 0분 12시 매일 매월 매요일)
    @Scheduled(cron = "0 0 12 * * *")
    public void initTodayAttendance() {
        LocalDate today = LocalDate.now();

        // 주말이면 실행 안 함
        if (today.getDayOfWeek() == DayOfWeek.SATURDAY
                || today.getDayOfWeek() == DayOfWeek.SUNDAY) {
            log.info("주말이므로 근태 기본 row 생성 생략 : {}", today);
            return;
        }

        String workDate = today.toString();
        int count = attService.initDailyAttendance(workDate);

        log.info("근태 스케줄러 실행 완료 / 날짜 = {}, 생성건수 = {}", workDate, count);
    }
}