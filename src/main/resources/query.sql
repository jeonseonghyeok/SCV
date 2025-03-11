		SELECT schedule.schedule_id,
			schedule_time,
			manager.name AS '기록자',
			member.name AS '참석자'
	    FROM schedule schedule
	    LEFT JOIN schedule_attendee attendee
	    on schedule.schedule_id = attendee.schedule_id 
	    LEFT JOIN  members manager 
	    on schedule.created_by = manager.member_id
	    LEFT JOIN  members member 
	    on attendee.member_id = member.member_id 
	    
	    WHERE schedule.status = 'ACTIVE'
	    