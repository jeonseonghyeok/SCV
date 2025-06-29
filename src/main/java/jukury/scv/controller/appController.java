package jukury.scv.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/app")
public class appController {

	/**
     * 토큰등록페이지로 이동
     * @return 뷰 이름 "tokenAuthentication"
     */
    @GetMapping("/tokenAuthentication")
    public String tokenAuthentication(Model model,@RequestParam(value = "verifyNumber", required = false) String verifyNumber) {
    	model.addAttribute("verifyNumber", verifyNumber);
        return "tokenAuthentication";
    }
    
    /**
     * 회원 관리 페이지로 이동
     * @return 뷰 이름 "memberManage"
     */
    @GetMapping("/memberManage")
    public String memberManage(Model model) {
        return "memberManage";
    }

    /**
     * 게임 매치 페이지로 이동
     * @return 뷰 이름 "gameMatch"
     */
    @GetMapping("/gameMatch")
    public String gameMatch(Model model) {
        return "gameMatch";
    }
    
    /**
     * 게임결과등록 페이지로 이동
     * @return 뷰 이름 "saveGameResult"
     */
    @GetMapping("/saveGameResult")
    public String saveGameResult(Model model) {
        return "saveGameResult";
    }
    
    /**
     * 출석저장 페이지로 이동
     * @return 뷰 이름 "saveAttendance"
     */
    @GetMapping("/saveAttendance")
    public String saveAttendance(Model model) {
        return "saveAttendance";
    }
    
    /**
     * 은행계좌이력 페이지
     * @return 뷰 이름 "saveGameResult"
     */
    @GetMapping("/viewBankAccountHistory")
    public String viewBankAccountHistory(Model model) {
        return "viewBankAccountHistory";
    }
    
    /**
     * 브라우저 죽이는 페이지로 이동
     * @return 뷰 이름 "saveGameResult"
     */
    @GetMapping("/killBrowser")
    public String killBrowser(Model model) {
        return "killBrowser";
    }
}