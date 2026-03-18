package com.kh.app.feature.finance.dailySales;

import com.kh.app.feature.finance.account.AccountVo;
import com.kh.app.feature.hr.store.StoreVo;
import com.kh.app.feature.stock.Products.ProductVo;
import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/dailySales")
@RestController
public class DailySalesRestController {

    private final DailySalesService dailySalesService;

    @PostMapping("/insertDaily")
    public ResponseEntity<HashMap<String, String>> insertDaily(@RequestBody DailySalesVo vo) throws Exception {

        int result = dailySalesService.insertDaily(vo);

        HashMap<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    @PutMapping("/editDaily")
    public ResponseEntity<Map<String, String>> editDaily(@RequestBody DailySalesVo vo) throws Exception {

        int result = dailySalesService.editDaily(vo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/delDaily")
    public ResponseEntity<Map<String, String>> delDaily(@RequestBody DailySalesVo vo) throws Exception {
        int result = dailySalesService.delDaily(vo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    //매출조회
    @GetMapping("/listDaily")
    public ResponseEntity<Map<Object, Object>> listDaily(@RequestParam DailySalesVo vo) throws Exception {
        List<DailySalesVo> voList = dailySalesService.listDaily(vo);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    //지점별매출
    @GetMapping("/storeIncome")
    public ResponseEntity<Map<Object, Object>> storeIncome(@RequestParam String salesDate) throws Exception {

        List<DailySalesVo> voList = dailySalesService.storeIncome(salesDate);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    //상품별매출
    @GetMapping("/productIncome")
    public ResponseEntity<Map<Object, Object>> productIncome(@RequestParam String salesDate) throws Exception {

        List<DailySalesVo> voList = dailySalesService.productIncome(salesDate);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/getProductList")
    public List<ProductVo> getProductList(){

        return dailySalesService.getProductList();
    }

    @GetMapping("/getStoreList")
    public List<DailySalesVo> getStoreList(){
        return dailySalesService.getStoreList();
    }

}
