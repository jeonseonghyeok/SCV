package jukury.scv.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import jukury.scv.model.Member;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberMapper {
	List<Map<String, Object>> findAll();
    Member findByName(String name); 
    Member findMemberByToken(String token); 
    Member findMemberByVerifyNumber(String encVerifyNumber);
    void insert(Member member);
    int update(Member member);
    void updateList(Member member,List<String> membersName);
    //회원탈퇴
    int cancelMember(String name);
    //이름을 기준으로 회원의 티어를 업데이트
    void updateTierByName(@Param("name") String name, @Param("newTier") String newTier);

    //인증번호를 기준으로 회원의 kakao_session_id를 업데이트
    int updateKakaoSessionId(Member member);
    
    // 티어 변경 이력 추가 메서드
    void insertTierChangeHistory(@Param("name") String name, @Param("tier_bf") int tierBefore, @Param("tier_af") int tierAfter, @Param("reason") String reason, @Param("lastChgrManager") int lastChgrManager);
    void insertExemptionCouponChangeHistory(@Param("name") String name, @Param("amount") int amount, @Param("reason") String reason, @Param("lastChgrManager") int lastChgrManager);
}