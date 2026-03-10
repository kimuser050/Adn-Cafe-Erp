package com.kh.app.feature.finance.DailySales;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.swing.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/dailySales")
@RestController
public class DailySalesRestController {

    private final DailySalesService dailySalesService;
}
