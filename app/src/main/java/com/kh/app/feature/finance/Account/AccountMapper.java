package com.kh.app.feature.finance.Account;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface AccountMapper {

    @Insert("""
            INSERT INTO
            ACCOUNT
            (
                MAIN_ACCOUNT_NO
                , SUB_ACCOUNT_NO
                , ACCOUNT_NO
                , ACCOUNT_NAME
            )
                VALUES
            (
                #{mainAccountNo}
                , #{subAccountNo}
                , #{accountNo}
                , #{accountName}
            )
            """)
    int insertAccount(AccountVo vo);


    @Update("""
            UPDATE ACCOUNT
            SET
            USE_YN = 'N'
            WHERE ACCOUNT_NO = #{accountNo}
            """)
    int deleteAccount(String accountNo);


    @Select("""
            SELECT
            ACCOUNT_NO
            , MAIN_ACCOUNT_NO
            , SUB_ACCOUNT_NO
            , ACCOUNT_NAME
            , USE_YN
            , CREATED_AT
            FROM ACCOUNT
            WHERE MAIN_ACCOUNT_NO = #{mainAccountNo}
            AND USE_YN = 'Y'
            """)
    List<AccountVo> accountList(String mainAccountNo);
}
