package jukury.scv.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class KakaoAPIResponseBuilder {

    // 기본 응답을 생성하는 메서드
    public static Map<String, Object> simpleText(String message) {

        // simpleText 구성
        KakaoAPIResponse.SimpleText simpleText = new KakaoAPIResponse.SimpleText();
        simpleText.setText(message);

        // simpleText를 Map으로 변환하여 output생성
        Map<String, Object> output = new HashMap<>();
        output.put("simpleText", simpleText);

        return output;
    }

    // ListCard 응답을 생성하는 메서드
    public KakaoAPIResponse listCardResponse(List<KakaoAPIResponse.ListCardItem> items, String headerTitle) {
        KakaoAPIResponse response = new KakaoAPIResponse();

        // ListCard 헤더 설정
        KakaoAPIResponse.ListCardHeader header = new KakaoAPIResponse.ListCardHeader();
        header.setTitle(headerTitle);

        // ListCard 설정
        KakaoAPIResponse.ListCard listCard = new KakaoAPIResponse.ListCard();
        listCard.setHeader(header);
        listCard.setItems(items);

        // listCard를 Map으로 변환하여 outputs 리스트에 추가
        Map<String, Object> listCardMap = new HashMap<>();
        listCardMap.put("listCard", listCard);

        List<Map<String, Object>> outputs = new ArrayList<>();
        outputs.add(listCardMap);
        KakaoAPIResponse.Template template = new KakaoAPIResponse.Template();

        return response;
    }

    // QuickReply를 생성하는 메서드
    public KakaoAPIResponse.QuickReply createQuickReply(String label, String action, String blockId) {
        KakaoAPIResponse.QuickReply quickReply = new KakaoAPIResponse.QuickReply();
        quickReply.setLabel(label);
        quickReply.setAction(action);
        quickReply.setBlockId(blockId);
        return quickReply;
    }

    // ListCardItem을 생성하는 메서드
    public KakaoAPIResponse.ListCardItem createListCardItem(String title, String description, String blockId, int scheduleKey) {
        KakaoAPIResponse.ListCardItem item = new KakaoAPIResponse.ListCardItem();
        item.setTitle(title);
        item.setDescription(description);
        item.setAction("block");
        item.setBlockId(blockId);

        Map<String, Object> extra = new HashMap<>();
        extra.put("scheduleKey", scheduleKey);
        item.setExtra(extra);

        return item;
    }

    // 다양한 출력 요소를 포함하는 Template을 생성하는 메서드
    public KakaoAPIResponse.Template createTemplate(List<Map<String, Object>> outputs, List<KakaoAPIResponse.QuickReply> quickReplies) {
        KakaoAPIResponse.Template template = new KakaoAPIResponse.Template();
        template.setOutputs(outputs);
        template.setQuickReplies(quickReplies);
        return template;
    }
    // Template를 인자로 받아서 응답을 생성하는 메서드
    public KakaoAPIResponse createResponse(KakaoAPIResponse.Template template) {
        KakaoAPIResponse response = new KakaoAPIResponse();
        response.setVersion("2.0");
        response.setTemplate(template);
        return response;
    }
    
 // Template를 인자로 받아서 응답을 생성하는 메서드
    public static KakaoAPIResponse createResponseForSimpleText(String message) {
    	KakaoAPIResponse response = new KakaoAPIResponse();
        response.setVersion("2.0");
        List<Map<String, Object>> outputs = new ArrayList<>();
        outputs.add(simpleText(message));
        KakaoAPIResponse.Template template = new KakaoAPIResponse.Template();
        template.setOutputs(outputs);
        response.setTemplate(template);
        return response;
    }
}