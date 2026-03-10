package com.kh.app.feature.user.member;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

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
}
