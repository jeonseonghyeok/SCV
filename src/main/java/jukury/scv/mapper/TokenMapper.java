package jukury.scv.mapper;

import org.apache.ibatis.annotations.Mapper;

import jukury.scv.model.Member;

@Mapper
public interface TokenMapper {
	String findNameByToken(String token);
	Member findMemberByToken(String token);
}
