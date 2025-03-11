package jukury.scv.request;


import lombok.Data;

@Data
public class PaymentRequest {
    private int scheduleId;
    private int memberId;
}
