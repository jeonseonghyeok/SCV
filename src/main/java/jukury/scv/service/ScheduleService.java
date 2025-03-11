package jukury.scv.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jukury.scv.mapper.ScheduleAttendeeMapper;
import jukury.scv.mapper.ScheduleMapper;
import jukury.scv.model.ScheduleAttendee;
import jukury.scv.request.AttendanceRequest;
import jukury.scv.request.PaymentRequest;
import jukury.scv.response.ScheduleInfoResponse;
import jukury.scv.response.ScheduleResponse;
import jukury.scv.response.TotalAttendance;
import jukury.scv.response.ZeroPayment;

@Service
public class ScheduleService {

	@Autowired
	ScheduleMapper scheduleMapper;
	
	@Autowired
	ScheduleAttendeeMapper scheduleAttendeeMapper;
	
	@Transactional
	public void createAttendance(AttendanceRequest attendanceRequest) {
		int duplicateCount = scheduleMapper.checkDuplicateSchedule(attendanceRequest.getScheduleTime());
		if(duplicateCount>0)
			throw new IllegalArgumentException("이미 저장된 시간대입니다.");
		
		//19시 30분은 대관코트(vip용)로 판단
//		if(attendanceRequest.getScheduleTime().getHour() == 19 && attendanceRequest.getScheduleTime().getMinute() == 30) {
//			attendanceRequest.setVipTime(1);
//		}
		//일정생성
		scheduleMapper.insertSchedule(attendanceRequest);
		//일정의 참석자명단 추가
		scheduleAttendeeMapper.insertAttendee(attendanceRequest);
		
		//대관코트(vip용) 타임이면 정기권자는 비용 납부로 변경
		if(attendanceRequest.getVipTime() == 1) {
			scheduleAttendeeMapper.updateCoatPaymentForVip(attendanceRequest);
		}
	}

	public List<ScheduleAttendee> getAttendanceHistory(Long memberId){
		return null;
	}
	
	public List<TotalAttendance> getTotalAttendanceList(LocalDateTime startDateTime, LocalDateTime endDateTime,int memberId){

    	
    	List<TotalAttendance> totalAttendanceList = scheduleAttendeeMapper.selectTotalAttendance(startDateTime,endDateTime,memberId);
    	
		return totalAttendanceList;
	}
	
	public List<ScheduleResponse> getScheduleList(LocalDateTime startDateTime,LocalDateTime endDateTime,int memberId){

    	
    	List<ScheduleResponse> scheduleResponseList = scheduleMapper.getScheduleList(startDateTime,endDateTime,memberId);
    	
		return scheduleResponseList;
	}
	
	public List<ZeroPayment> zeroPaymentList() {
		return scheduleAttendeeMapper.selectPaymentZero();
	}
   
	public int payment(PaymentRequest paymentRequest) {
		return scheduleAttendeeMapper.updateCoatPayment(paymentRequest);
	}

}