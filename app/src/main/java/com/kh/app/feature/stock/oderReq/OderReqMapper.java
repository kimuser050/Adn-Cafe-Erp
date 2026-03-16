package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface OderReqMapper {

    @Select("""
            SELECT COUNT(ORDER_NO)
            FROM ORDER_REQ
            """)
    int selectCount();


    //발주상태확인
    @Select("""
    SELECT
        O.ORDER_NO,
        O.ITEM_NO,
        I.ITEM_NAME,
        O.QUANTITY,
        O.REQUEST_DATE,
        O.STORE_CODE,
        O.STATUS
    FROM ORDER_REQ O
    JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
    ORDER BY O.ORDER_NO DESC
    OFFSET #{offset} ROWS FETCH NEXT #{boardLimit} ROWS ONLY
""")
    List<OderReqVo> selectList(PageVo pvo);


    //품목 차감


    //상세보기
    @Select("""
    SELECT
        O.ORDER_NO,
        O.ITEM_NO,
        I.ITEM_NAME,
        O.QUANTITY,
        O.REQUEST_DATE,
        O.STORE_CODE,
        O.STATUS
    FROM ORDER_REQ O
    JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
    WHERE
        O.ORDER_NO = #{orderNo}
""")
    OderReqVo selectOne(String orderNo);

    //발주 상태 변경
    @Update("""
             UPDATE ORDER_REQ
                SET
                STATUS = #{status}
                WHERE
                ORDER_NO = #{orderNo}
          
            """)
    int updateByNo(OderReqVo vo);

    //발주 완료시 재고 차감
    @Update("""
    UPDATE ITEM
    SET STOCK = STOCK - (
        SELECT QUANTITY
        FROM ORDER_REQ
        WHERE ORDER_NO = #{orderNo}
    )
    WHERE ITEM_NO = (
        SELECT ITEM_NO
        FROM ORDER_REQ
        WHERE ORDER_NO = #{orderNo}
    )
    """)
    int decreaseStock(String orderNo);

    //발주요청
    @Insert("""
    INSERT INTO ORDER_REQ
    (ORDER_NO, ITEM_NO, STORE_CODE, QUANTITY, STATUS)
    VALUES
    (SEQ_ORDER_REQ.NEXTVAL, #{itemNo}, #{storeCode}, #{quantity}, 'W')
""")
    int orderReq(Map<String,Object> map);
}
