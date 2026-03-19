package com.kh.app.feature.hr.att;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttMapper {

    // 1. 월별 상단 요약
    AttSummaryVo selectMonthSummary(String month);

    // 2. 월별 전체 리스트
    List<AttListVo> selectMonthList(String month);

    // 3. 사원 기본정보
    AttListVo selectMemberInfo(String empNo);

    // 4. 사원 월별 요약
    AttSummaryVo selectEmpMonthSummary(@Param("empNo") String empNo, @Param("month") String month);

    // 5. 사원 월별 상세이력
    List<AttDetailVo> selectEmpMonthHistory(@Param("empNo") String empNo, @Param("month") String month);




}