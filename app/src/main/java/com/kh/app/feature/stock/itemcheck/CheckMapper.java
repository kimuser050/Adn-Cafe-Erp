package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
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
                C.ITEM_RETURN_NO,
                C.RETURN_NO,
                C.STATUS,
                C.PROCESS_RESULT,
                R.PRODUCT_NAME,
                R.STORE_CODE,
                S.STORE_NAME
            FROM
                ITEM_CHECK C
            INNER JOIN
                RETURN_REQ R ON C.RETURN_NO = R.RETURN_NO
            INNER JOIN
                STORE S ON R.STORE_CODE = S.STORE_CODE
            ORDER BY C.ITEM_RETURN_NO DESC
            OFFSET #{offset} ROWS
            FETCH NEXT #{boardLimit} ROWS ONLY
        """)
    List<CheckVo> selectList(PageVo pvo);

    //상세조회

    @Select("""
            SELECT
            C.ITEM_RETURN_NO,
            C.RETURN_NO,
            C.STATUS,
            C.PROCESS_RESULT,
            R.PRODUCT_NAME,
            R.STORE_CODE,
            S.STORE_NAME,
            R.QUANTITY,
            R.REASON,
            R.CREATED_AT
            FROM
            ITEM_CHECK C
            INNER JOIN
            RETURN_REQ R ON C.RETURN_NO = R.RETURN_NO
            INNER JOIN
            STORE S ON R.STORE_CODE = S.STORE_CODE
            WHERE 
            C.ITEM_RETURN_NO = #{no}
            """)
    CheckVo selectOne(String no);

    @Update("""
           UPDATE ITEM_CHECK
            SET 
            STATUS = #{status}
            WHERE 
            ITEM_RETURN_NO = #{itemReturnNo}
    """)
    int updateByNo(CheckVo vo);
}
