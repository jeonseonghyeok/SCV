package jukury.scv.model;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import jukury.scv.model.KakaoAPIResponse.Template;
import lombok.Data;

@Data
public class GameSchedule {
    private int scheduleKey;
    private LocalDateTime schedule;
    private String createdBy;
    private Timestamp createdTimestamp;
    private int maxCapacity;
    private int status;
    private String updatedBy;
    private Timestamp updatedTimestamp;
}
