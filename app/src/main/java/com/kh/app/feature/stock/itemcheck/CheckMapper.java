package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CheckMapper {

    // 1. 전체 카운트 조회 (검색어 + 권한 필터링)
    @Select("""
    <script>
    SELECT COUNT(R.RETURN_NO)
    FROM RETURN_REQ R
    INNER JOIN ITEM I ON R.PRODUCTS_NO = I.ITEM_NO
    INNER JOIN STORE S ON R.STORE_CODE = S.STORE_CODE
    <where>
        <if test="deptCode == '310104'">
            AND R.STORE_CODE = (SELECT STORE_CODE FROM STORE WHERE OWNER_EMP_NO = #{empNo})
        </if>
        <if test="keyword != null and keyword != ''">
            AND I.ITEM_NAME LIKE '%' || #{keyword} || '%'
        </if>
    </where>
    </script>
    """)
    int selectCount(@Param("keyword") String keyword,
                    @Param("deptCode") String deptCode,
                    @Param("empNo") String empNo);

    // 2. 검수 리스트 조회 (JOIN 방식으로 매장명 매칭)
    @Select("""
    <script>
    SELECT 
        R.RETURN_NO, 
        I.ITEM_NAME AS itemName, 
        S.STORE_NAME AS storeName,      -- JOIN으로 각 행에 맞는 매장명 출력
        R.STATUS,
        C.PROCESS_RESULT AS processResult,
        R.CREATED_AT AS createdAt
    FROM RETURN_REQ R
    INNER JOIN ITEM I ON R.PRODUCTS_NO = I.ITEM_NO
    INNER JOIN STORE S ON R.STORE_CODE = S.STORE_CODE  -- 매장 정보 조인
    LEFT OUTER JOIN ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    <where>
        <if test="deptCode == '310104'">
            AND R.STORE_CODE = (SELECT STORE_CODE FROM STORE WHERE OWNER_EMP_NO = #{empNo})
        </if>
        <if test="keyword != null and keyword != ''">
            AND I.ITEM_NAME LIKE '%' || #{keyword} || '%'
        </if>
    </where>
    ORDER BY TO_NUMBER(R.RETURN_NO) DESC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    </script>
    """)
    List<CheckVo> selectList(@Param("pvo") PageVo pvo,
                             @Param("keyword") String keyword,
                             @Param("deptCode") String deptCode,
                             @Param("empNo") String empNo);

    // 3. 상세조회 (변수명 및 조인 유지)
    @Select("""
    SELECT
        C.ITEM_RETURN_NO,
        R.RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT AS processResult,
        I.ITEM_NAME AS itemName,
        R.STORE_CODE,
        S.STORE_NAME AS storeName,
        R.QUANTITY,
        R.REASON,
        R.CREATED_AT AS createdAt
    FROM
        RETURN_REQ R
    INNER JOIN
        ITEM I ON R.PRODUCTS_NO = I.ITEM_NO
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    WHERE
        R.RETURN_NO = #{no}
    """)
    CheckVo selectOne(@Param("no") String no);

    // 4. 상태 업데이트
    @Update("""
    UPDATE RETURN_REQ
    SET 
        STATUS = #{status}
    WHERE 
        RETURN_NO = #{returnNo}
    """)
    int updateByNo(CheckVo vo);
}