package jukury.scv.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jukury.scv.mapper.GameScheduleMapper;
import jukury.scv.model.GameSchedule;
import jukury.scv.model.KakaoAPIResponse;
import jukury.scv.model.KakaoAPIResponseBuilder;
import jukury.scv.model.Member;
import jukury.scv.model.KakaoAPIResponse.Output;
import jukury.scv.model.KakaoAPIResponse.QuickReply;
import jukury.scv.model.KakaoAPIResponse.SimpleText;

@Service
public class GameScheduleService {
   @Autowired
    private GameScheduleMapper gameScheduleMapper;
   @Autowired
   	private KakaoAPIResponseBuilder builder;
	    
	public KakaoAPIResponse scheduleCreateCheck(Map<String, String> params) {
		String selectedDateTime = params.get("dateTime");
        
        // ObjectMapper 인스턴스 생성
        ObjectMapper objectMapper = new ObjectMapper();
        
        // dateTime의 JSON 문자열을 파싱하여 value 필드 값 추출
        JsonNode dateTimeJson;
		try {
			dateTimeJson = objectMapper.readTree(selectedDateTime);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("에러가 발생하였습니다.");
		}
        String dateTimeValue = dateTimeJson.get("value").asText();

        // LocalDateTime으로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateTime = LocalDateTime.parse(dateTimeValue, formatter);
        
        GameSchedule gameSchedule = gameScheduleMapper.selectGameScheduleBySchedule(dateTime);
        
        if(gameSchedule != null) {
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("동시간대 일정 생성은 불가합니다.");
        }
        else {
            List<Map<String, Object>> outputs = new ArrayList<>();
            List<QuickReply> quickReplies = new ArrayList<>();
            outputs.add(KakaoAPIResponseBuilder.simpleText("["+dateTime+"]\n위 일정을 생성하시겠습니까?"));
            // SimpleText Output 생성

            // "네" QuickReply 생성 및 extra 설정
            KakaoAPIResponse.QuickReply yesQuickReply = builder.createQuickReply("네", "block", "66e2a078c684d8595117d71a");
            Map<String, Object> yesExtra = new HashMap<>();
            yesExtra.put("scheduleTime", dateTime);
            yesQuickReply.setExtra(yesExtra);
            quickReplies.add(yesQuickReply);

            // "아니요" QuickReply 생성
            KakaoAPIResponse.QuickReply noQuickReply = builder.createQuickReply("아니요", "block", "66e29f6894b48c2a211227f0");
            noQuickReply.setExtra(new HashMap<>()); // 빈 extra
            quickReplies.add(noQuickReply);

            // Template 생성
            KakaoAPIResponse.Template template = new KakaoAPIResponse.Template();
            template.setOutputs(outputs);
            template.setQuickReplies(quickReplies);

            // 최종 응답 생성
            KakaoAPIResponse response = builder.createResponse(template);
            return response;
        }
	}
	public KakaoAPIResponse scheduleCreate(String scheduleTime,String managerName) {

        // LocalDateTime으로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime dateTime = LocalDateTime.parse(scheduleTime, formatter);
        
        GameSchedule gameSchedule = gameScheduleMapper.selectGameScheduleBySchedule(dateTime);
        if(gameSchedule != null) {
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("동시간대 일정이 이미 생성되었습니다.");
        }
        else {
        	//일정 생성
        	gameScheduleMapper.insertGameSchedule(scheduleTime,managerName);
            
        	return KakaoAPIResponseBuilder.createResponseForSimpleText("일정이 생성되었습니다.");
        }
	}
	public KakaoAPIResponse search() {

		List<GameSchedule> gamesSheduleList = gameScheduleMapper.selectGameSchedule();
		if(gamesSheduleList == null || gamesSheduleList.isEmpty())
			return KakaoAPIResponseBuilder.createResponseForSimpleText("일정이 없습니다.");

		// Create ListCardHeader
        KakaoAPIResponse.ListCardHeader header = new KakaoAPIResponse.ListCardHeader();
        header.setTitle("모임일정");
        KakaoAPIResponse.Link link = new KakaoAPIResponse.Link();
        link.setWeb("");
        header.setLink(link);

        // ListCardItems를 담을 리스트 생성
        List<KakaoAPIResponse.ListCardItem> items = new ArrayList<>();
        
        // 포맷터를 정의 (예: "d일 E HH시 mm분" 형식)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d일 E H시 mm분");
        
        for (GameSchedule gameSchedule : gamesSheduleList) {
        	KakaoAPIResponse.ListCardItem item = new KakaoAPIResponse.ListCardItem();
        	item.setTitle("["+gameSchedule.getSchedule().format(formatter)+"]");
            item.setDescription("12명/"+gameSchedule.getMaxCapacity()+"명");
            item.setAction("block");
            item.setBlockId("66f251c1ef21cb53dd047fbd");
            Map<String, Object> extra = new HashMap<>();
            extra.put("scheduleKey", gameSchedule.getScheduleKey());
            item.setExtra(extra);
            
            // 생성된 각 아이템을 리스트에 추가
            items.add(item);
		}

        // Create ListCard and set items
        KakaoAPIResponse.ListCard listCard = new KakaoAPIResponse.ListCard();
        listCard.setHeader(header);
        listCard.setItems(items); // 생성된 아이템 리스트를 설정
        listCard.setButtons(Collections.emptyList()); // 빈 버튼 리스트 설정
        
        // outputs 리스트 생성
        List<Map<String, Object>> outputs = new ArrayList<>();
        
        Map<String, Object> output = new HashMap<>();
        output.put("listCard", listCard);
        outputs.add(output);
        

        // Create Template and set Outputs
        KakaoAPIResponse.Template template = new KakaoAPIResponse.Template();
        template.setOutputs(outputs);

        // 최종 응답 생성
        KakaoAPIResponse response = builder.createResponse(template);
        
		return response;
	}
	
}
