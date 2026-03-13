package com.kh.app.feature.stock.item;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ItemMapper {
    @Select("""
            SELECT
                STOCK_NO
               ,STOCK_NAME
               ,UNIT_PRICE  
               ,STOCK       
               ,LOCATION    
               ,ACTIVE_YN   
               ,CREATED_AT  
               ,UPDATED_AT  
               ,ORDER_DATE  
            FROM ITEM
            ORDER BY STOCK_NO DESC
    
    """)
    List<ItemVo> selectList(ItemVo vo);
}
