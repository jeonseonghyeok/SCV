const memberManageUrl = "/members";
var token;
let writer;
let attendees = {};
var memberInfo;

window.onload = function() {
	tokenAuthentication();
    initializeDateTime();
	memberInfoImport();
}
//토큰인증
function tokenAuthentication() {
	// LocalStorage에서 토큰 조회
	 token = localStorage.getItem("token");

	// 토큰이 없으면 알림 표시
	if (!token) {
		alert("토큰이 없습니다. 로그인해주세요.");
		window.location.href = "./tokenAuthentication";
	}
	$.ajax({
		url: '/api/verifyToken?token=' + token, // 토큰을 URL 파라미터로 전송
		method: 'GET',
		success: function(managerName) {
			writer = managerName;
		},
		error: function(xhr) {
			if (xhr.status === 401) {
				alert(xhr.responseText);
				localStorage.removeItem("token");
				window.location.href = "./tokenAuthentication";
			} else {
				alert('토큰 검증 중 오류 발생: ' + xhr.status);
			}
		}
	});
}

function initializeDateTime() {
    var now = new Date();
    var defaultTime;
    if (now.getHours() >= 20)
        defaultTime = "19:30";
    else if (now.getHours() >= 14)
        defaultTime = "13:00";
    else
        defaultTime = "09:00";

    $("#date").val(now.toISOString().slice(0, 10));
    $("#time").val(defaultTime);
}

$('#inputText').on('input', function() {
    // inputText 값이 변경될 때 실행할 함수
    // 텍스트박스에서 내용 가져오기
    attendees = {};//초기화
    const inputText = $('#inputText').val();

    // 입력된 텍스트를 줄바꿈을 기준으로 분리
	const lines = inputText.split('\n');
	
	// ':' 뒤에 텍스트가 있는 경우에만 사람 이름을 추출하는 정규식
	const regex = /^.*:\s*(.+)$/;
	
	lines.forEach(line => {
	    // 각 줄에 대해 정규식 적용
	    const match = regex.exec(line);
	    
	    if (match) {
	        // 이름 목록이 있는 경우에만 처리
	        const names = match[1].trim();
	        if (names) {
	            names.split(/\s+/).forEach(name => {
	                attendees[name] = 0;
	            });
	        }
	    }
	});
    removeKeysWithGuest(attendees);
    // attendees 객체의 길이 확인
	const attendeesLength = Object.keys(attendees).length;
	// 결과를 출력 (키값만 간단하게 출력)
	const attendeeNames = Object.keys(attendees).join(', ');
    $('#output').text(`참석 : ${attendeesLength}\n(${attendeeNames})`);
    if(attendeesLength>0)
    	$("#saveForm").show();
	else
		$("#saveForm").hide();
	
});

$('#registerBtn').on('click', function() {
	var gameTime = document.querySelector('input[id="date"]').value +"T"+ document.querySelector('input[id="time"]').value;
//	var scriptLink = "AKfycbxk--xhwahqnFFAM6pbXU1ydFpKaHARdyQa0Hhkn3yfeJ24RswReTuNRRFab3Ua_uWfgA";

	const attendeeIds = []; // 변환한 member_id를 담을 배열
	// attendees의 이름을 member_id로 변환
	// attendees의 이름을 순회하면서 member_id를 찾기
	Object.keys(attendees).forEach(name => {
	    if (memberInfo[name]) {
	        attendeeIds.push(memberInfo[name].member_id);
	    } else {
			alert("'"+name+"'을 명단에서 찾을 수 없습니다.");
			attendeeIds = [];
			return;
	    }
	});

	if(confirm("출석명단을 기록하시겠습니까?(작성자 : "+writer+")")){
		// 회원 정보 객체
		let attendanceInfo = {
			scheduleTime: gameTime,
			attendeeIds: attendeeIds
		};

		// 서버에 회원 등록 API 호출
		fetch('/api/attendance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
			},
			body: JSON.stringify(attendanceInfo)
		})
			.then(response => {
				if (response.ok) {
					alert('입력 완료.');
				} else {
					throw new Error('출석등록에 실패했습니다.');
				}
			})
			.catch(error => {
				alert(`${error.message}`);
			});
	   /* $.ajax({
			type: "get",
			data: {
				"gameTime" : gameTime,
				"writer" : writer,
				"gameResult": JSON.stringify(attendees)
			},
			url: "https://script.google.com/macros/s/"+scriptLink+"/exec",
			// url: "https://script.google.com/macros/s/"+scriptLink_test+"/dev",
			success: function(response){
				if (response.result == "success") {
					alert('입력 완료.');
			
				} else if (response.result == "error") {
					alert(response.errorMessage);
				}
			}
		});*/
		
	     
	    }
});


$('#ouputCopy').on('click', function() {
	copyText($('#output').text());
	alert('출석 명단이 복사되었습니다!');
});


//이름에 "게스트" 문자를 포함하거나 공백 키를 제거한 JSON 객체를 반환
function removeKeysWithGuest(jsonData) {
	for (const key in jsonData) {
		if (key.includes("게스트") || key === "") {
			delete jsonData[key];
		}
	}
}

//새로운 임시 요소를 만들어 텍스트를 복사를 수행하고 제거
function copyText(textToCopy) {
	var tempInput = $('<textarea>');
	$('body').append(tempInput);
	tempInput.val(textToCopy).select();
	document.execCommand('copy');
	tempInput.remove();
}

function memberInfoImport() {
	fetch(memberManageUrl)
		.then(response => response.json())
		.then(data => {
			memberInfo = convertMapKeys(data);
		})
		.catch(error => alert('회원 정보 가져오기 실패: ' + error.message));
}

function convertMapKeys(springMap) {
	var convertedMap = {};

	$.each(springMap, function(key, value) {
		convertedMap[value.name] = value;
	});

	return convertedMap;
}

