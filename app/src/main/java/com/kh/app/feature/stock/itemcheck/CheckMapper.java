package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface CheckMapper {

    /**
     * 전체 개수 조회 (권한 필터링 포함)
     * - 310104(매장)는 본인 매장 건수만 계산
     */
    @Select("""
            <script>
            SELECT COUNT(R.RETURN_NO)
            FROM RETURN_REQ R
            <where>
                <if test="deptCode == '310104'">
                    AND R.STORE_CODE = #{storeCode}
                </if>
            </where>
            </script>
            """)
    int selectCount(PageVo pvo);

    /**
     * 반품 검수 목록 조회 (JOIN 3종 세트: ITEM, STORE, EMP)
     * - 사원명(empName)을 가져오기 위해 EMP 테이블을 조인합니다.
     */
    @Select("""
    <script>
    SELECT
        R.RETURN_NO,
        C.ITEM_RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT,
        I.ITEM_NAME AS itemName,   -- 상품명 조인
        R.STORE_CODE,
        S.STORE_NAME,             -- 매장명 조인
        E.EMP_NAME AS empName,    -- 사원명 조인 (EMP_NO 기준)
        R.CREATED_AT AS regDate
    FROM
        RETURN_REQ R
    INNER JOIN
        ITEM I ON R.PRODUCTS_NO = I.ITEM_NO
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    LEFT OUTER JOIN
        EMP E ON R.EMP_NO = E.EMP_NO -- 사원 번호로 담당자 확인
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    <where>
        <if test="deptCode == '310104'">
            AND R.STORE_CODE = #{storeCode}
        </if>
    </where>
    ORDER BY R.RETURN_NO DESC
    OFFSET #{offset} ROWS              
    FETCH NEXT #{boardLimit} ROWS ONLY 
    </script>
    """)
    List<CheckVo> selectList(PageVo pvo);

    /**
     * 상세 조회 (JOIN 포함)
     */
    @Select("""
    SELECT
        C.ITEM_RETURN_NO,
        R.RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT,
        I.ITEM_NAME AS itemName,
        R.STORE_CODE,
        S.STORE_NAME,
        E.EMP_NAME AS empName,    -- 담당자 이름 추가
        R.QUANTITY,
        R.REASON,
        R.CREATED_AT AS regDate
    FROM
        RETURN_REQ R
    INNER JOIN
        ITEM I ON R.PRODUCTS_NO = I.ITEM_NO
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    LEFT OUTER JOIN
        EMP E ON R.EMP_NO = E.EMP_NO
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    WHERE
        R.RETURN_NO = #{no}
    """)
    CheckVo selectOne(String no);

    /**
     * 검수 상태 업데이트
     */
    @Update("""
    UPDATE RETURN_REQ
    SET 
        STATUS = #{status}
    WHERE 
        RETURN_NO = #{returnNo}
    """)
    int updateByNo(CheckVo vo);
}