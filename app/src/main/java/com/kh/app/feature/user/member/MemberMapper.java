package com.kh.app.feature.user.member;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface MemberMapper {


        @Insert("""
        INSERT INTO MEMBER 
        (
        EMP_NO
        ,EMP_PW
        ,EMP_NAME
        ,POS_CODE
        ,DEPT_CODE
        ,RESD_NO
        ,EMP_PHONE
        ,EMP_EMAIL
        ,EMP_ADDRESS
        ,PROFILE_CHANGE_NAME
        ,PROFILE_ORIGIN_NAME
        )
        VALUES 
        (
        #{empNo}
        ,#{empPw}
        ,#{empName}
        ,#{posCode}
        ,#{deptCode}
        ,#{resdNo}
        ,#{empPhone}
        ,#{empEmail}
        ,#{empAddress}
        ,#{profileChangeName}
        ,#{profileOriginName}
        )
    """)
        int join(MemberVo vo);


        @Select("""
        SELECT
            EMP_NO
            ,EMP_PW
            ,EMP_NAME
            ,POS_CODE
            ,DEPT_CODE
            ,RESD_NO
            ,EMP_PHONE
            ,EMP_EMAIL
            ,EMP_ADDRESS
            ,PROFILE_CHANGE_NAME
            ,PROFILE_ORIGIN_NAME
            ,CREATED_AT
            ,UPDATED_AT
            ,QUIT_YN
            ,EMP_STATUS_NO
        FROM MEMBER
        WHERE EMP_NO = #{empNo}
        AND QUIT_YN = 'N'
        """)
        MemberVo selectByEmpNo(String empNo);



        @Update("""
                    UPDATE MEMBER
                        SET 
                        QUIT_YN = 'Y'
                    , UPDATED_AT = SYSDATE
                    , RESIGN_DATE = SYSDATE
                    WHERE EMP_NO = #{empNo}
                    AND QUIT_YN = 'N'
                """)
        int quit(String empNo);
}
