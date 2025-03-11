package jukury.scv.request;

import lombok.Data;

@Data
public class TierUpdateRequest {
    private String name;
    private int newTier;
    private String reason;
}
