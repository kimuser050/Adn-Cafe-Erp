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
            DELETE FROM ${tableName}
            WHERE SALES_NO = #{vo.salesNo}
            """)
    int delDaily(@Param("vo") DailySalesVo vo, @Param("tableName") String tableName);


    @Select("""
            SELECT
            D.SALES_NO AS salesNo
            , S.STORE_NAME AS storeName
            , P.PRODUCTS_NAME AS productName
            , P.PRODUCTS_NO AS productNo
            , D.UNIT_PRICE AS unitPrice
            , D.QUANTITY AS quantity
            , D.PAYMENT_CD AS paymentCd
            , TO_CHAR(D.SALES_DATE, 'YYYY-MM-DD') AS salesDate
            , (D.UNIT_PRICE * D.QUANTITY) AS totalSales
            FROM ${tableName} D
            JOIN STORE S ON S.STORE_CODE = D.STORE_NO
            JOIN PRODUCTS P ON P.PRODUCTS_NO = D.PRODUCT_NO
            WHERE STORE_NO = #{vo.storeNo}
            AND TO_CHAR(D.SALES_DATE, 'YYYY-MM-DD') = #{vo.salesDate}
            ORDER BY D.SALES_NO DESC
            """)
    List<DailySalesVo> listDaily(@Param("vo") DailySalesVo vo, @Param("tableName") String tableName);


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
            FROM TOTAL_SALES T
            JOIN STORE S ON T.STORE_NO = S.STORE_CODE
            WHERE TO_CHAR(T.SALES_DATE, 'YYYY-MM') = #{salesDate}
            GROUP BY S.STORE_NAME
            ORDER BY totalSales DESC
            """)
    List<DailySalesVo> storeIncome(@Param("salesDate") String salesDate);


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
            FROM TOTAL_SALES T
            JOIN PRODUCTS P ON P.PRODUCTS_NO = T.PRODUCT_NO
            WHERE TO_CHAR(T.SALES_DATE, 'YYYY-MM') = #{salesDate}
            GROUP BY P.PRODUCTS_NAME
            ORDER BY totalSales DESC
            """)
    List<DailySalesVo> productIncome(@Param("salesDate") String salesDate);


//    @Select("""
//            SELECT
//                P.PRODUCTS_NAME AS productName,
//                SUM(T.UNIT_PRICE * T.QUANTITY) AS totalSales
//            FROM TOTAL_SALES T
//            JOIN PRODUCTS P ON P.PRODUCTS_NO = T.PRODUCT_NO
//            WHERE TO_CHAR(T.SALES_DATE, 'YYYY-MM') = #{salesDate}
//            GROUP BY P.PRODUCTS_NAME
//            ORDER BY totalSales DESC
//            """)
//    int insertTotalSales(DailySalesVo vo);


    @Insert("""
            INSERT INTO TOTAL_SALES
            (
                SALES_NO
                , STORE_NO
                , PRODUCT_NO
                , UNIT_PRICE
                , QUANTITY
                , SALES_DATE
            )
            VALUES
            (
                SEQ_TOTAL_SALES.NEXTVAL
                , #{storeNo}
                , #{productNo}
                , #{unitPrice}
                , #{quantity}
                , #{salesDate}
            )
            """)
    int insertTotalSalesReal(DailySalesVo vo);


    @Select("""
            SELECT
                STORE_CODE AS storeNo,
                STORE_NAME AS storeName
            FROM STORE
            WHERE OWNER_EMP_NO = #{empNo}
            """)
    DailySalesVo getMyStore(String empNo);
}