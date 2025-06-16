package jukury.scv.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jukury.scv.model.Member;
import jukury.scv.request.AttendanceRequest;
import jukury.scv.request.PaymentRequest;
import jukury.scv.response.ScheduleResponse;
import jukury.scv.response.TotalAttendance;
import jukury.scv.response.ZeroPayment;
import jukury.scv.security.UserContext;
import jukury.scv.security.annotation.AuthCheck;
import jukury.scv.service.MemberService;
import jukury.scv.service.ScheduleService;
import jukury.scv.service.TokenService;

@RestController
@RequestMapping("/api")
public class apiController {
	
    @Autowired
    private TokenService tokenService;

    @Autowired
    private ScheduleService scheduleService;

	
	 @GetMapping("/verifyToken") 
	public ResponseEntity<String> verifyToken(@RequestParam(value = "token") String token) {
		try {
			String name = tokenService.findNameByToken(token);
			return ResponseEntity.ok(name);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 유효하지 않습니다.");
		}
	}
 
    
    /**
     * 일정생성 및 참석자 등록(관리자 권한)
     * @param attendanceRequest
     * @param tokenWithBearer
     * @return
     */
    @PostMapping("/attendance")
    public ResponseEntity<String> createAttendance(@RequestBody AttendanceRequest attendanceRequest, @RequestHeader("Authorization") String tokenWithBearer) {
        try {
        	Member manager =  tokenService.findMemberByToken(tokenWithBearer);
        	if(manager.getAccessLevel()<2)
        		 throw new IllegalArgumentException("권한이 존재하지 않습니다.");
        	attendanceRequest.setManagerId(manager.getMemberId());
        	scheduleService.createAttendance(attendanceRequest);
            return ResponseEntity.ok("success");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    
    //출석 통계및 이력 조회
	/* 통합
	 * @GetMapping(value="/attendance",produces="application/json; charset=utf8")
	 * public ResponseEntity<Map<String, Object>> getAttendance(@RequestParam(name =
	 * "startDateTime", required = false) @DateTimeFormat(pattern =
	 * "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
	 * 
	 * @RequestParam(name = "endDateTime", required = false) @DateTimeFormat(pattern
	 * = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime) {
	 * 
	 * 
	 * List<TotalAttendance> totalAttendanceList =
	 * scheduleService.getTotalAttendanceList(startDateTime,endDateTime,0);
	 * List<ScheduleResponse> ScheduleList =
	 * scheduleService.getScheduleList(startDateTime,endDateTime,0); Map<String,
	 * Object> response = new HashMap<>(); response.put("totalAttendanceList",
	 * totalAttendanceList); response.put("scheduleInfoList", ScheduleList); return
	 * new ResponseEntity<>(response, HttpStatus.OK); }
	 */
    /**
     * 출석 이력 조회
     * @param memberId
     * @param startDateTime
     * @param endDateTime
     * @return
     */
    @GetMapping(value={"/attendance", "/attendance/{memberId}"},produces="application/json; charset=utf8")
    public ResponseEntity<Map<String, Object>> getAttendance(@PathVariable(name = "memberId", required = false) Integer memberId,
    		@RequestParam(name = "startDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
			@RequestParam(name = "endDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime) {
    	
    	int memberIdValue = (memberId != null) ? memberId : 0;
	   	List<TotalAttendance> totalAttendanceList = scheduleService.getTotalAttendanceList(startDateTime,endDateTime,memberIdValue);
	   	List<ScheduleResponse> ScheduleList = scheduleService.getScheduleList(startDateTime,endDateTime,memberIdValue);
	   	Map<String, Object> response = new HashMap<>();
	    response.put("totalAttendanceList", totalAttendanceList);
   	 	response.put("scheduleInfoList", ScheduleList);
	    return new ResponseEntity<>(response, HttpStatus.OK);

    }
    /*
     * 참석 종합 현황
     */
    @GetMapping(value={"/attendance/total", "/attendance/total/{memberId}"},produces="application/json; charset=utf8")
    public List<TotalAttendance> getAttendanceTotal(@PathVariable(name = "memberId", required = false) Integer memberId,
    		@RequestParam(name = "startDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
			@RequestParam(name = "endDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime) {
    	
    	int memberIdValue = (memberId != null) ? memberId : 0;
	   	List<TotalAttendance> totalAttendanceList = scheduleService.getTotalAttendanceList(startDateTime,endDateTime,memberIdValue);
	    return totalAttendanceList;

    }
    
    /**
     * 참석 상세 현황
     */
    @GetMapping(value={"/attendance/details", "/attendance/details/{memberId}"},produces="application/json; charset=utf8")
    public List<ScheduleResponse> getAttendanceHistory(@PathVariable(name = "memberId", required = false) Integer memberId,
    		@RequestParam(name = "startDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
			@RequestParam(name = "endDateTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime) {
    	
    	int memberIdValue = (memberId != null) ? memberId : 0;
	   	List<ScheduleResponse> attendanceHistory = scheduleService.getScheduleList(startDateTime,endDateTime,memberIdValue);
	    return attendanceHistory;

    }
    
    //미납리스트 조회
    @GetMapping("/attendance/zeroPaymentList")
    public ResponseEntity<List<ZeroPayment>> zeroPayment() {
    	List<ZeroPayment> zeroPaymentList = scheduleService.zeroPaymentList();
        return ResponseEntity.ok(zeroPaymentList);
    }
    
    /**
     * 비용납부처리
     */
    @PostMapping("/attendance/payment")
    public ResponseEntity<String> payment(@RequestBody PaymentRequest paymentRequest, @RequestHeader("Authorization") String tokenWithBearer) {
        try {
        	Member manager =  tokenService.findMemberByToken(tokenWithBearer);
        	if(manager.getAccessLevel()<3)
        		throw new IllegalArgumentException("총무권한이 존재하지 않습니다.");
            if(scheduleService.payment(paymentRequest)!=1)
            	throw new IllegalArgumentException("정보를 찾을 수 없어 변경에 실패하였습니다.");
            return ResponseEntity.ok("success");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}