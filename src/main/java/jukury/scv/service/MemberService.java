package jukury.scv.service;

import jukury.scv.mapper.MemberMapper;
import jukury.scv.mapper.TokenMapper;
import jukury.scv.model.Member;
import jukury.scv.request.TierUpdateRequest;
import jukury.scv.security.UserContext;
import jukury.scv.security.token.JwtGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class MemberService {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private TokenMapper tokenMapper;
    
    public List<Member> findAll() {
        return memberMapper.findAll();
    }

    public Member findByName(String name) {
        return memberMapper.findByName(name);
    }

	public Member findByKakaoSessionId(String kakaoSessionId) {
		return memberMapper.findMemberByToken(kakaoSessionId);
	}

    public void save(Member member, Member manager) {
    	member.setLastChgrManager(manager.getMemberId());
    	memberMapper.insert(member);
    }

    public String cancelMember(String name,String tokenWithBearer) {
        Member member = memberMapper.findByName(name);
    	verifyToken(member,tokenWithBearer);
        if (member == null) {
            return "Member Not Found";
        }
        member.setStatus(2);//탈퇴(2)상태로 변경
        memberMapper.update(member);
       	return "Success";
    }
    public String updateTier(TierUpdateRequest request, String tokenWithBearer) {
        Member member = memberMapper.findByName(request.getName());
    	verifyToken(member,tokenWithBearer);
        if (member == null) {
            return "Member Not Found";
        }

        int oldTier = member.getTier();
        if (oldTier == request.getNewTier()) {
            return "No Change Tier";
        }
        
        if (!isValidTier(request.getNewTier())) {
        	return "Entered tier is undefined";
        }
        member.setTier(request.getNewTier());
        if (memberMapper.update(member) > 0) {
            memberMapper.insertTierChangeHistory(request.getName(), oldTier, request.getNewTier(), request.getReason(),member.getLastChgrManager());
            return "Tier Change Success";
        }

        return "FAIL";
    }

    private boolean isValidTier(int tier) {
        return tier > 0 && tier <= 6;
    }
    
    @Transactional
    public String exemptionCouponPlus(String name, int exemptionCouponAmount, String reason, String tokenWithBearer) {
    	Member member = memberMapper.findByName(name);
    	verifyToken(member,tokenWithBearer);
        if (member == null) {
            return "Member Not Found";
        }
        
        if (exemptionCouponAmount <= 0) {
            return "exemptionCouponAmount can't be zero or less";
        }
        member.couponCal(exemptionCouponAmount);
        int updatedRows = memberMapper.update(member);
        if (updatedRows > 0) {
            member.setExemptionCoupon(member.getExemptionCoupon() + exemptionCouponAmount);
            memberMapper.insertExemptionCouponChangeHistory(name, exemptionCouponAmount, reason,member.getLastChgrManager());
            return "exemptionCouponPlus Success";
        } else {
            return "Update failed";
        }
        
    }
    
    @Transactional
    public String exemptionCouponMinus(String name, String reason, String tokenWithBearer) {
    	Member member = memberMapper.findByName(name);
     	verifyToken(member,tokenWithBearer);
    	    if (member == null) {
    	        return "Member Not Found";
    	    }


    	    if (member.getExemptionCoupon() < 1) {
    	        return "There are not enough exemptionCoupons available.";
    	    }
    	    member.couponCal(-1);
    	    int updatedRows = memberMapper.update(member);
    	    if (updatedRows > 0) {
    	        memberMapper.insertExemptionCouponChangeHistory(name, -1, reason,member.getLastChgrManager());
    	        return "exemptionCouponMinus Success";
    	    } else {
    	        return "Update failed";
    	    }
    }

	private void verifyToken(Member member, String tokenWithBearer) {
		if (tokenWithBearer != null && tokenWithBearer.startsWith("Bearer ")) {
			String token = tokenWithBearer.substring(7); // 'Bearer ' 부분을 제외한 토큰 값 추출
			Member manager = tokenMapper.findMemberByToken(token);
			if (manager == null) {
				throw new IllegalArgumentException("토큰이 유효하지 않습니다.");
			}
			member.setLastChgrManager(manager.getMemberId());
		}
		else {
			throw new IllegalArgumentException("유효하지 않은 토큰 형식입니다.");
		}
	}
	
	// 인증번호 생성 및 DB 저장
    public String verifyNumberGenerate(String name, String tokenWithBearer) {
    	   	
        Member member = memberMapper.findByName(name);
        if(member == null)
        	throw new IllegalArgumentException("사용자 정보가 없습니다.");
    	verifyToken(member,tokenWithBearer);
        String verificationCode = generateVerificationCode();
        String hashedData = hashCodeWithDate(verificationCode);
        member.setEncVerifyNumber(hashedData);
        memberMapper.update(member);
        
        return verificationCode;
    }
 // 인증번호 생성 및 DB 저장
    public String verifyNumberGenerate(int memberId,int managerMemberId) {
        Member member = new Member();
        member.setMemberId(memberId);
        member.setLastChgrManager(managerMemberId);
        String verificationCode = generateVerificationCode();
        String hashedData = hashCodeWithDate(verificationCode);
        member.setEncVerifyNumber(hashedData);
        if(memberMapper.update(member)>0)
        	return verificationCode;
        else 
        	return "존재하지 않거나 탈퇴한 계정입니다.";
    }
    
    /**
     * 임시인증번호를 검증하고 해당하는 계정의 토큰 생성
     * @param verifyNumber(임시번호6자리)
     * @param manager
     * @return
     */
    public Member tokenGenerate(String verifyNumber) {
        	
        String encVerifyNumber = hashCodeWithDate(verifyNumber);
        Member member = memberMapper.findMemberByVerifyNumber(encVerifyNumber);
        if(member == null) {
        	return null;
        }
        
        //토큰생성(기존에 생성된 토큰이 없는 경우에만)
        String token = member.getToken();
        if(token == null) {
        	token = JwtGenerator.createToken(member);
        }
        member.setToken(token);
        //토큰저장 및 임시번호 제거
        memberMapper.update(member);
        
        //토큰 값 반환
        return member;
        
    }
    
    // 인증번호 검증 후 카카오ID등록
	/*
	 * public boolean verifyNumberCheck(String kakaoSessionId, String
	 * verificationCode) {
	 * 
	 * Member member = new Member(); member.setToken(kakaoSessionId);
	 * member.setEncVerifyNumber(hashCodeWithDate(verificationCode)); int
	 * updatedRows = memberMapper.updateKakaoSessionId(member);
	 * 
	 * // 업데이트 성공 여부를 반환 (업데이트된 행이 1개 이면 성공) return updatedRows > 0; }
	 */
    
    // 오늘 날짜와 인증번호 결합 후 해시화
    public String hashCodeWithDate(String verificationCode) {
        try {
            // 오늘 날짜 가져오기
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String todayStr = LocalDate.now().format(formatter);
            // 날짜와 인증번호 결합 ("YYYY-MM-DD|인증번호" 형식)
            String dataToHash = todayStr + "|" + verificationCode;

            // 해시화
            return hash(dataToHash);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
	// 6자리 인증번호 생성
    private String generateVerificationCode() {
        int code = (int)(Math.random() * 900000) + 100000;  // 100000 ~ 999999 범위의 랜덤 숫자 생성
        return String.valueOf(code);
    }
	 // SHA-256 해시 함수
    public String hash(String data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hashBytes);  // Base64로 인코딩하여 문자열로 변환
    }

}