package jukury.scv.model;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KakaoAPIResponse {

    private String version;
    private Template template;

    // Template 클래스
    @Data
    public static class Template {
        private List<Map<String, Object>> outputs;
        private List<QuickReply> quickReplies;
    }

    // Output 클래스 (simpleText 또는 listCard 사용)
    @Data
    public static class Output {
    	private SimpleText simpleText;
	    private ListCard listCard;
	    // 여기에 다른 타입들도 추가 가능 (예: Button, Image 등)

	    // 생성자를 통해 간편하게 Output을 생성할 수 있도록 하는 메서드
	    public static Output ofSimpleText(SimpleText simpleText) {
	        Output output = new Output();
	        output.setSimpleText(simpleText);
	        return output;
	    }

	    public static Output ofListCard(ListCard listCard) {
	        Output output = new Output();
	        output.setListCard(listCard);
	        return output;
	    }

    }

    // SimpleText 클래스
    @Data
    public static class SimpleText {
        private String text;
        private Map<String, Object> extra;
    }

    // ListCard 클래스
    @Data
    public static class ListCard {
        private ListCardHeader header;
        private List<ListCardItem> items;
        private List<Button> buttons;
    }

    // ListCardHeader 클래스
    @Data
    public static class ListCardHeader {
        private String title;
        private Link link;
    }

    // ListCardItem 클래스
    @Data
    public static class ListCardItem {
        private String title;
        private String description;
        private String action;
        private String blockId;
        private Map<String, Object> extra;
    }

    // Button 클래스 (추가로 버튼이 필요할 때 사용)
    @Data
    public static class Button {
        private String label;
        private String action;
        private Map<String, Object> extra;
    }

    // Link 클래스
    @Data
    public static class Link {
        private String web;
    }

    // QuickReply 클래스
    @Data
    public static class QuickReply {
        private String label;
        private String action;
        private String blockId;
        private Map<String, Object> extra;
    }
}
