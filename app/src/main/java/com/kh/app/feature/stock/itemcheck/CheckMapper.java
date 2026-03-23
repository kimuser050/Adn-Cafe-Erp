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
    @Select("""
            SELECT COUNT(RETURN_NO)
            FROM RETURN_REQ
            """)
    int selectCount();

    @Select("""
    SELECT
        R.RETURN_NO,
        C.ITEM_RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT,
        I.ITEM_NAME AS itemName,   -- 상품명 가져오기
        R.STORE_CODE,
        S.STORE_NAME,
        R.CREATED_AT
    FROM
        RETURN_REQ R
    INNER JOIN
        ITEM I ON R.PRODUCTS_NO = I.ITEM_NO -- [수정] PRODUCTS_NO로 직접 조인 (숫자 vs 숫자)
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    ORDER BY R.RETURN_NO DESC
    OFFSET #{offset} ROWS              
    FETCH NEXT #{boardLimit} ROWS ONLY 
""")
    List<CheckVo> selectList(PageVo pvo);

    // 상세조회
    @Select("""
    SELECT
        C.ITEM_RETURN_NO,
        R.RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT,
        I.ITEM_NAME AS itemName,
        R.STORE_CODE,
        S.STORE_NAME,
        R.QUANTITY,
        R.REASON,
        R.CREATED_AT
    FROM
        RETURN_REQ R
    INNER JOIN
        ITEM I ON R.PRODUCTS_NO = I.ITEM_NO -- [수정] PRODUCTS_NO로 직접 조인
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    WHERE
        R.RETURN_NO = #{no}
""")
    CheckVo selectOne(String no);

    @Update("""
    UPDATE RETURN_REQ
    SET 
        STATUS = #{status}
    WHERE 
        RETURN_NO = #{returnNo}
""")
    int updateByNo(CheckVo vo);
}