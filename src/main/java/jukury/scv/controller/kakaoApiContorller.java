package jukury.scv.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jukury.scv.model.KakaoAPIResponse;
import jukury.scv.model.KakaoAPIResponseBuilder;
import jukury.scv.model.Member;
import jukury.scv.request.KakaoAPIRequest;
import jukury.scv.service.GameScheduleService;
import jukury.scv.service.MemberService;

@RestController
@RequestMapping("/kakaoApi")
public class kakaoApiContorller {
	@Autowired
    private MemberService memberService;
	@Autowired
    private GameScheduleService gameScheduleService;

    /**
     * 인증번호검증
     * @param request
     * @return
     */
	/*
	 * @PostMapping("/verifyNumberCheck") public KakaoAPIResponse
	 * verifyNumberCheck(@RequestBody KakaoAPIRequest request) { //user.id 추출 String
	 * kakaoSessionId = request.getUserRequest().getUser().getId();
	 * //verificationCode 추출 Map<String, String> params =
	 * request.getAction().getParams(); String verificationCode =
	 * params.get("verificationCode");
	 * 
	 * // 인증번호가 없거나 6자리가 아닌 경우 if (verificationCode == null ||
	 * verificationCode.length() != 6) { return
	 * KakaoAPIResponseBuilder.createResponseForSimpleText("인증번호는 6자리 숫자여야 합니다."); }
	 * 
	 * // 인증번호가 유효하지 않은 경우 if (!memberService.verifyNumberCheck(kakaoSessionId,
	 * verificationCode)) { return
	 * KakaoAPIResponseBuilder.createResponseForSimpleText("인증번호가 일치하지 않습니다."); }
	 * return KakaoAPIResponseBuilder.createResponseForSimpleText("인증완료"); }
	 */
    
    /**
     * (관리자)일정생성 가능 여부 및 의사 파악
     * @param request
     * @return
     */
    @PostMapping("/manager/schedule/checkBeforeCreate")
    public KakaoAPIResponse schedulGenerateCheck(@RequestBody KakaoAPIRequest request) {

        //user.id 추출
        String kakaoSessionId = request.getUserRequest().getUser().getId();
        Member member = memberService.findByKakaoSessionId(kakaoSessionId);
        if(member == null)
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("인증되지 않았습니다.");
        else if(!member.isManager())
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("권한이 존재하지 않습니다.");
        //params 추출
        Map<String, String> params = request.getAction().getParams();
        return gameScheduleService.scheduleCreateCheck(params);
        
    }    
    
    /**
     * (관리자)일정생성
     * @param request
     * @return
     */
    @PostMapping("/manager/schedule/create")
    public KakaoAPIResponse scheduleCreate(@RequestBody KakaoAPIRequest request) {

        //user.id 추출
        String kakaoSessionId = request.getUserRequest().getUser().getId();
        Member member = memberService.findByKakaoSessionId(kakaoSessionId);
        if(member == null)
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("인증되지 않았습니다.");
        else if(!member.isManager())
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("권한이 존재하지 않습니다.");
        //params 추출
        Map<String, Object> clientExtra = request.getAction().getClientExtra();

        if(!clientExtra.containsKey("scheduleTime"))
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("ERROR : 시간 값 소실");
        
        String scheduleTime= (String) clientExtra.get("scheduleTime");
        return gameScheduleService.scheduleCreate(scheduleTime,member.getName());        
    }
    /**
     * (관리자)일정조회
     * @param request
     * @return
     */
    @PostMapping("/manager/schedule/search")
    public KakaoAPIResponse schedulShow(@RequestBody KakaoAPIRequest request) {

        //user.id 추출
        String kakaoSessionId = request.getUserRequest().getUser().getId();
        Member member = memberService.findByKakaoSessionId(kakaoSessionId);
        if(member == null)
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("인증되지 않았습니다.");
        else if(!member.isManager())
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("권한이 존재하지 않습니다.");
        
        return gameScheduleService.search();        
    }
    
  
    
    
}
