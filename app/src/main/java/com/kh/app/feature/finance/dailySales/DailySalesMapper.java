package com.kh.app.feature.finance.dailySales;

import com.kh.app.feature.stock.Products.ProductVo;
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
                SEQ_${tableName}.NEXTVAL
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
            S.STORE_NAME
            ,TO_CHAR(D.SALES_DATE,'YYYY-MM-DD') as salesDate
            ,SUM(D.UNIT_PRICE*D.QUANTITY) as totalSales
            FROM ${tableName} D
            JOIN STORE S ON S.STORE_CODE = D.STORE_NO
            WHERE STORE_NO = #{vo.storeNo}
            GROUP BY TO_CHAR(D.SALES_DATE,'YYYY-MM-DD'), S.STORE_NAME
            ORDER BY salesDate DESC
            """)
    List<DailySalesVo> listDaily(@Param("vo")DailySalesVo vo, @Param("tableName")String tableName);


    @Select("""
            SELECT
            STORE_CODE AS storeNo
            ,STORE_NAME AS storeName
            FROM STORE
            """)
    List<DailySalesVo> getStoreList();


    @Select("""
            SELECT
            S.STORE_NAME AS storeName
            ,SUM(T.UNIT_PRICE*T.QUANTITY) AS totalSales
            FROM ${tableName} T
            JOIN STORE S ON T.STORE_NO = S.STORE_CODE
            WHERE TO_CHAR(T.SALES_DATE, 'YYYY-MM') = #{salesDate}
            AND T.STORE_NO = #{store.storeNo}
            GROUP BY S.STORE_NAME
            """)
    List<DailySalesVo> storeIncome(
            @Param("store") DailySalesVo store
            , @Param("tableName") String tableName
            , @Param("salesDate") String salesDate);


    @Select("""
            SELECT
            PRODUCTS_NO AS productsNo
            ,PRODUCTS_NAME AS productsName
            FROM PRODUCTS
            """)
    List<ProductVo> getProductList();

    @Select("""
            SELECT
            P.PRODUCTS_NAME AS productName
            , SUM(T.UNIT_PRICE*T.QUANTITY) AS totalSales
            FROM ${tableName} T
            JOIN PRODUCTS P ON P.PRODUCTS_NO = T.PRODUCT_NO
            WHERE TO_CHAR(T.SALES_DATE, 'YYYY-MM') = #{salesDate}
            GROUP BY P.PRODUCTS_NAME
            ORDER BY P.PRODUCTS_NAME
            """)
    List<DailySalesVo> productIncome(
            @Param("tableName") String tableName
            ,@Param("salesDate") String salesDate);


}
