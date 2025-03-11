package jukury.scv.response;


import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class TotalAttendance{
    private int memberId;
    private String name;
    private int totalAttendance;
}
