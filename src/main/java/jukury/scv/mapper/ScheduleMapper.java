package jukury.scv.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import jukury.scv.request.AttendanceRequest;
import jukury.scv.response.ScheduleResponse;

@Mapper
public interface ScheduleMapper {
	int insertSchedule(AttendanceRequest attendanceRequest);
	int checkDuplicateSchedule(LocalDateTime scheduleTime);
	List<ScheduleResponse> getScheduleList(@Param("startDateTime") LocalDateTime startDateTime, @Param("endDateTime") LocalDateTime endDateTime, @Param("memberId") int memberId);
}
