package jukury.scv.request;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Data
public class AttendanceRequest {
    private List<Long> attendeeIds;
    private LocalDateTime scheduleTime;
    private int scheduleId;
    private int managerId;
    private int vipTime;
}
