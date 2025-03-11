package jukury.scv.request;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class KakaoAPIRequest {

    private Bot bot;
    private Intent intent;
    private Action action;
    private UserRequest userRequest;
    private List<Map<String, Object>> contexts; // contexts를 List로 변경

    @Data
    public static class Bot {
        private String id;
        private String name;
    }

    @Data
    public static class Intent {
        private String id;
        private String name;

        @Data
        public static class Extra {
            private Reason reason;

            @Data
            public static class Reason {
                private int code;
                private String message;
            }
        }
    }

    @Data
    public static class Action {
        private String id;
        private String name;
        private Map<String, String> params;
        private DetailParams detailParams;
        private Map<String, Object> clientExtra;

        @Data
        public static class DetailParams {
            private AuthNum authNum;

            @Data
            public static class AuthNum {
                private String groupName;
                private String origin;
                private String value;
            }
        }
    }

    @Data
    public static class UserRequest {
        private Block block;
        private User user;
        private String utterance;
        private Map<String, String> params;
        private String lang;
        private String timezone;

        @Data
        public static class Block {
            private String id;
            private String name;
        }

        @Data
        public static class User {
            private String id;
            private String type;
            private Map<String, String> properties;
        }
    }
}
