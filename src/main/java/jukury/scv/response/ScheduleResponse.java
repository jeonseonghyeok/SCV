package jukury.scv.response;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import jukury.scv.model.Member;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class ScheduleResponse {
    private int scheduleId;
    private LocalDateTime scheduleTime;
    private String createdBy;
    private LocalDateTime createdTimestamp;
    private String lastUpdatedBy;
    private LocalDateTime lastUpdated;
    private String status;
    private int vipTime;
    

    private List<Member> memberList;
}
