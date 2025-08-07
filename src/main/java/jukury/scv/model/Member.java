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
    private Integer tier;                  // ✅ 조건부 업데이트
    private Integer exemptionCoupon;       // ✅ 조건부 업데이트
    private Integer status;                // ✅ 조건부 업데이트
    private LocalDateTime createdTimestamp;
    private LocalDateTime updatedTimestamp;
    private Integer lastChgrManager;       // ✅ 조건부 업데이트
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