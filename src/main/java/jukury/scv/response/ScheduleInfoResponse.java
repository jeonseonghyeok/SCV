package jukury.scv.response;
import lombok.Data;

@Data
public class ScheduleInfoResponse {
	private int schedule_id;
    private int[] memberIdList;
}
