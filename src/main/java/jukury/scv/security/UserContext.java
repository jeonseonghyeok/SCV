package jukury.scv.security;

import jukury.scv.model.Member;

public class UserContext {
    private static final ThreadLocal<Member> currentMember = new ThreadLocal<>();

    public static void setMember(Member member) {
        currentMember.set(member);
    }

    public static Member getMember() {
        return currentMember.get();
    }

    public static void clear() {
        currentMember.remove();
    }
}

