package jukury.scv.response;


import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class TotalAttendance{
    private int memberId;
    private int tier;
    private String name;
    private int totalAttendance;
    private LocalDateTime createdTimestamp;
}
