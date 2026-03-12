package com.kh.app.feature.hr.dept;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DeptMapper {

    @Select("""
            SELECT
            DEPT_CODE
            , DEPT_NAME
            , DEPT_ADDRESS
            , USE_YN
            , CREATED_AT
            , UPDATED_AT
            FROM DEPT
            WHERE USE_YN = 'Y'
            ORDER BY DEPT_CODE ASC
    """)
    List<DeptVo> selectList();


    @Select("""
            SELECT
            DEPT_CODE
            , DEPT_NAME
            , DEPT_ADDRESS
            , USE_YN
            , CREATED_AT
            , UPDATED_AT
            FROM DEPT
            WHERE USE_YN = 'Y'
            AND DEPT_CODE = #{deptCode}
            """)
    DeptVo selectOne(String deptCode);
}