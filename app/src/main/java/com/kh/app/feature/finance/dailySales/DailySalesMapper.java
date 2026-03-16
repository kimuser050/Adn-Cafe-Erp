package com.kh.app.feature.finance.dailySales;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DailySalesMapper {


    @Insert("""
            INSERT INTO
            ${tableName}
                (
                SALES_NO
                ,STORE_NO
                ,PRODUCT_NO
                ,UNIT_PRICE
                ,QUANTITY
                ,PAYMENT_CD
                ,SALES_DATE
                )
            VALUES
                (
                #{vo.salesNo}
                ,#{vo.storeNo}
                ,#{vo.productNo}
                ,#{vo.unitPrice}
                ,#{vo.quantity}
                ,#{vo.paymentCd}
                ,#{vo.salesDate}
                )
            """)
    int insertDaily(@Param("vo") DailySalesVo vo, @Param("tableName") String tableName);

    @Select("""
            SELECT STORE_NAME
            FROM STORE
            WHERE STORE_CODE = #{storeNo}
            """)
    String getkoreanStoreName(String storeNo);

    @Update("""
            UPDATE
            ${tableName}
            SET
                PRODUCT_NO = #{vo.productNo}
                ,UNIT_PRICE = #{vo.unitPrice}
                ,QUANTITY = #{vo.quantity}
                ,PAYMENT_CD = #{vo.paymentCd}
            WHERE STORE_NO = #{vo.storeNo}
            AND SALES_NO = #{vo.salesNo}
            AND SALES_DATE = #{vo.salesDate}
            """)
    int editDaily(@Param("vo") DailySalesVo vo, @Param("tableName") String tableName);

    @Delete("""
            DELETE ${tableName}
            WHERE SALES_NO = #{vo.salesNo}
            """)
    int delDaily(@Param("vo") DailySalesVo vo, @Param("tableName") String tableName);


    @Select("""
            SELECT
            STORE_NAME
            ,TO_CHAR(SALES_DATE,'YYYY-MM-DD') as salesDate
            ,SUM(UNIT_PRICE*QUANTITY) as totalSales
            FROM ${tableName} D
            JOIN STORE S ON S.STORE_CODE = D.STORE_NO
            WHERE STORE_NO = #{vo.storeNo}
            GROUP BY TO_CHAR(SALES_DATE,'YYYY-MM-DD'), STORE_NAME
            ORDER BY salesDate DESC
            """)
    List<DailySalesVo> listDaily(@Param("vo")DailySalesVo vo, @Param("tableName")String tableName);
}
