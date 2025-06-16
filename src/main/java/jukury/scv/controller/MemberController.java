package jukury.scv.controller;

import jukury.scv.model.Member;
import jukury.scv.request.ExemptionCouponUpdateRequest;
import jukury.scv.request.TierUpdateRequest;
import jukury.scv.security.UserContext;
import jukury.scv.security.annotation.AuthCheck;
import jukury.scv.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.findAll();
    }

    @GetMapping("/{name}") 
    public Member getMemberByName(@PathVariable("name")  String name) { 
        return memberService.findByName(name);
    }

    @AuthCheck
    @PostMapping
    public void createMember(@RequestBody Member member) {
    	Member manager = UserContext.getMember();
        memberService.save(member,manager);
    }

    @Deprecated
    @PutMapping("/{name}") 
    public void updateMember(@PathVariable("name") String name, @RequestBody Member member) { 
//        memberService.save(member);
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<String> deleteMember(@PathVariable("name") String name, @RequestHeader("Authorization") String token) { 
    	String result =  memberService.cancelMember(name,token);
    	switch (result) {
        case "Success":
            return new ResponseEntity<>(result, HttpStatus.OK);
        case "Member Not Found":
            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
        case "No Change Tier":
        case "Entered tier is undefined":
            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
        case "Update Failed":
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        default:
            return new ResponseEntity<>("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR);
    	}
    }
    
    @PostMapping("/updateTier")
    public ResponseEntity<String> updateTier(@RequestBody TierUpdateRequest request, @RequestHeader("Authorization") String token) {
        // 티어 변경 로직 호출
    	 String result = memberService.updateTier(request,token);

         switch (result) {
             case "Tier Change Success":
                 return new ResponseEntity<>(result, HttpStatus.OK);
             case "Member Not Found":
                 return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
             case "No Change Tier":
             case "Entered tier is undefined":
                 return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
             case "Update Failed":
                 return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
             default:
                 return new ResponseEntity<>("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }
    /**
     * 면제권 부여
     * 
     */
    @PostMapping("/exemptionCouponPlus")
    public ResponseEntity<String> exemptionCouponPlus(@RequestBody ExemptionCouponUpdateRequest request, @RequestHeader("Authorization") String token) {
    	String result = memberService.exemptionCouponPlus(request.getName(),request.getAmount(),request.getReason(),token);
    	switch (result) {
	        case "exemptionCouponPlus Success":
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        case "Member Not Found":
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        case "exemptionCouponAmount can't be zero or less":
	            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
	        case "Update Failed":
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        default:
	            return new ResponseEntity<>("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
    }
    
    /**
     * 면제권 사용
     * 우선은 1장 사용만 되도록 구현
     * @param request
     * @return
     */
    @PostMapping("/exemptionCouponMinus")
    public ResponseEntity<String> exemptionCouponMinus(@RequestBody ExemptionCouponUpdateRequest request, @RequestHeader("Authorization") String token) {
    	String result = memberService.exemptionCouponMinus(request.getName(),request.getReason(),token);
    	switch (result) {
	        case "exemptionCouponMinus Success":
	            return new ResponseEntity<>(result, HttpStatus.OK);
	        case "Member Not Found":
	            return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
	        case "exemptionCouponAmount can't be less than zero":
	        case "There are not enough exemptionCoupons available.":
	            return new ResponseEntity<>(result, HttpStatus.BAD_REQUEST);
	        case "Update Failed":
	            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
	        default:
	            return new ResponseEntity<>("Unknown Error", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
    }
    /**
     * 인증번호생성
     * @param request
     * @return
     */
    @Deprecated 
    @PostMapping("/verifyNumberGenerate")
    public ResponseEntity<String> verifyNumberGenerate(@RequestBody Map<String, Object> requestData, @RequestHeader("Authorization") String token) {
    	 // JSON의 "name" 필드를 추출
        String name = (String) requestData.get("name");
    	String result = memberService.verifyNumberGenerate(name,token);
    		return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    /**
     * 토큰 발급을 위한 임시인증번호(6자리)생성
     */
    @AuthCheck
    @GetMapping("/verifyNumberGenerate")
    public ResponseEntity<String> verifyNumberGenerate(@RequestParam("memberId") int memberId) {

        Member manager = UserContext.getMember();

		// 권한 체크: 최고관리자(AccessLevel 9)만 가능
		if (manager.getAccessLevel() < 9) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
		
		try {
			String verificationCode = memberService.verifyNumberGenerate(memberId, manager.getMemberId());
			if (verificationCode != null) {
				return ResponseEntity.ok(verificationCode);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("인증번호를 생성할 수 없습니다.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류로 인증번호 생성에 실패했습니다.");
        }
    }
    
    @GetMapping("/tokenGenerate")
    public ResponseEntity<String> tokenGenerate(@RequestParam("verifyNumber") Integer verifyNumber) {
    	
    	String token = memberService.tokenGenerate(verifyNumber.toString());
    	return new ResponseEntity<>(token, HttpStatus.OK);
   }
    
}