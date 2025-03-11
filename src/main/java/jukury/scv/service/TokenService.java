package jukury.scv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jukury.scv.mapper.TokenMapper;
import jukury.scv.model.Member;

@Service
public class TokenService {

    @Autowired
    private TokenMapper tokenMapper;
    
    public String findNameByToken(String token) {
    	String name = tokenMapper.findNameByToken(token);
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("토큰이 유효하지 않습니다.");
        }
        return name;
    }
    
    public Member findMemberByToken(String tokenWithBearer) {
    	if (tokenWithBearer == null || !tokenWithBearer.startsWith("Bearer ")) {
			throw new IllegalArgumentException("유효하지 않은 토큰 형식입니다.");
    	}
    	String token = tokenWithBearer.substring(7); // 'Bearer ' 부분을 제외한 토큰 값 추출
    	Member member = tokenMapper.findMemberByToken(token);
        if (member == null) {// 결과가 없을 때의 처리 로직
            throw new IllegalArgumentException("토큰이 유효하지 않습니다.");
        }
        return member;
    }
}
