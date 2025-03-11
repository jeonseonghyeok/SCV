package jukury.scv.security.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jukury.scv.mapper.MemberMapper;
import jukury.scv.mapper.TokenMapper;
import jukury.scv.model.Member;
import jukury.scv.security.UserContext;
import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class AuthCheckAspect {
    private final MemberMapper memberMapper;
    private final HttpServletRequest httpServletRequest;

    
    @Around("@annotation(jukury.scv.security.annotation.AuthCheck)")
    public Object authCheck(ProceedingJoinPoint joinPoint) throws Throwable{

		try {
	        String tokenWithBearer = httpServletRequest.getHeader("Authorization");
	        if (tokenWithBearer != null && tokenWithBearer.startsWith("Bearer ")) {
				String token = tokenWithBearer.substring(7); // 'Bearer ' 부분을 제외한 토큰 값 추출
				Member member = memberMapper.findMemberByToken(token);
				if (member == null) {
					throw new IllegalArgumentException("토큰이 유효하지 않습니다.");
				}
				UserContext.setMember(member); // member 정보를 UserContext에 저장
			}
			else {
				throw new IllegalArgumentException("유효하지 않은 토큰 형식입니다.");
			}
			return joinPoint.proceed();
			
	    } catch (IllegalArgumentException e) {
	        HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
	        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	        response.setContentType("application/json; charset=UTF-8");
	        response.setCharacterEncoding("UTF-8");
	        response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
	        return null; // 메서드 실행을 중단하고 사용자에게 오류 응답을 보냅니다.
	    } finally {
	        UserContext.clear(); // ThreadLocal 정보 제거
	    }
    }    
}
