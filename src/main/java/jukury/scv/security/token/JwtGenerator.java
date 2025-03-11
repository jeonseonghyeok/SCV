package jukury.scv.security.token;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jukury.scv.model.Member;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtGenerator {
    private static Key key;

    public JwtGenerator(@Value("${jwt.secret}") String secret) {
        JwtGenerator.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

	public static String createToken(Member member) {
        
        
        return Jwts.builder()
                .claim("memberId", member.getMemberId())
                .claim("name", member.getName())
                .claim("accessLevel", member.getAccessLevel())
                .issuedAt(new Date())
                .signWith(key)
                .compact();
    }
}