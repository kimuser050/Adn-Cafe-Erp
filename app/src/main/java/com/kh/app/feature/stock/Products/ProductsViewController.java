package com.kh.app.feature.stock.Products;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class ProductsViewController {

    @GetMapping("products")
    public String products(){
        return "/stock/item/products";
    }
}
