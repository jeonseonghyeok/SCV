package jukury.scv.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import jukury.scv.request.AttendanceRequest;
import jukury.scv.request.PaymentRequest;
import jukury.scv.response.TotalAttendance;
import jukury.scv.response.ZeroPayment;

@Mapper
public interface ScheduleAttendeeMapper {
	int insertAttendee(AttendanceRequest attendanceRequest);
	int updateCoatPaymentForVip(AttendanceRequest attendanceRequest);
	List<ZeroPayment> selectPaymentZero();
	int updateCoatPayment(PaymentRequest payment);
	List<TotalAttendance> selectTotalAttendance(@Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime, @Param("memberId") int memberId);
}
