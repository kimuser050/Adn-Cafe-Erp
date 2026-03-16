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
            SELECT COUNT(ITEM_RETURN_NO)
            FROM ITEM_CHECK
            """)
    int selectCount();

    @Select("""
    SELECT
        R.RETURN_NO,
        C.ITEM_RETURN_NO,
        R.STATUS,                --(W, A, R)
        C.PROCESS_RESULT,
        R.PRODUCT_NAME,
        R.STORE_CODE,
        S.STORE_NAME,
        R.CREATED_AT
    FROM
        RETURN_REQ R                                   -- 신청 테이블을 기준으로
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO      -- 검수 내역은 있으면 가져오고 없으면 null
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
    ORDER BY R.RETURN_NO DESC
    OFFSET #{offset} ROWS
    FETCH NEXT #{boardLimit} ROWS ONLY
""")
    List<CheckVo> selectList(PageVo pvo);

    //상세조회
    @Select("""
    SELECT
        C.ITEM_RETURN_NO,
        R.RETURN_NO,
        R.STATUS,
        C.PROCESS_RESULT,
        R.PRODUCT_NAME,
        R.STORE_CODE,
        S.STORE_NAME,
        R.QUANTITY,
        R.REASON,
        R.CREATED_AT
    FROM
        RETURN_REQ R    /* 기준을 신청 테이블(R)로 변경 */
    LEFT OUTER JOIN
        ITEM_CHECK C ON R.RETURN_NO = C.RETURN_NO
    INNER JOIN
        STORE S ON R.STORE_CODE = S.STORE_CODE
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
