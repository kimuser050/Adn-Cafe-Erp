package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface OderReqMapper {

    @Select("""
            SELECT COUNT(ORDER_NO)
            FROM ORDER_REQ
            """)
    int selectCount();


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

    @Insert("""
    INSERT INTO ORDER_REQ (ORDER_NO, ITEM_NO, STORE_CODE, QUANTITY, STATUS)
    VALUES (SEQ_ORDER_NO.NEXTVAL, #{itemNo}, #{storeCode}, #{quantity}, 'W')
    """)
    int insertOrder(OderReqVo vo);

    @Update("""
            UPDATE ITEM
            SET STOCK = STOCK - #{quantity}
            WHERE ITEM_NO = #{itemNo}
            AND STOCK >= #{quantity} -- 재고가 주문량보다 많을 때만 수행
            """)
    int decreaseStock(OderReqVo vo);
}
