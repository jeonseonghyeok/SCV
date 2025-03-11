package jukury.scv.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ZeroPayment {
    private int scheduleId;
    private LocalDateTime scheduleTime;
    private int memberId;
    private String name;
}
