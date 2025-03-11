package jukury.scv.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import jukury.scv.model.GameSchedule;


@Mapper
public interface GameScheduleMapper {
     GameSchedule selectGameScheduleBySchedule(LocalDateTime schedule); 
     int insertGameSchedule(@Param("scheduleTime")String scheduleTime,@Param("managerName")String managerName);
     List<GameSchedule> selectGameSchedule();
}
