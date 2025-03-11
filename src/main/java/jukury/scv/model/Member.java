package jukury.scv.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_DEFAULT) 
@Data
public class Member {
    private int memberId;
    private String name;
    private int sex;
    private int tier;
    private int exemptionCoupon;
    private int status;
    private LocalDateTime createdTimestamp;
    private LocalDateTime updatedTimestamp;
    private int lastChgrManager;
    private String encVerifyNumber;
    private String token;
    private int accessLevel;// 2(관리자), 9(최고관리자)
    
    // Getters and Setters
    public void couponCal(int amount){
    	exemptionCoupon = exemptionCoupon + amount;
    }
    
    public boolean isManager() {
    	return (accessLevel >= 2);
    }
}