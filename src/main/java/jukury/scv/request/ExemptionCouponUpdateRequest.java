package jukury.scv.request;

import lombok.Data;

@Data
public class ExemptionCouponUpdateRequest {
    private String name;
    private int amount;
    private String reason;
}
