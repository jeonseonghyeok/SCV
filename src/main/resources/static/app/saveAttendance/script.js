const memberManageUrl = "/members";
var token;
let writer;
let attendees = {};
var memberInfo;
var autoDateTimeSetting;

window.onload = function() {
	tokenAuthentication();
//    initializeDateTime();
	memberInfoImport();
	autoDateTimeSetting = 0;
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
	setDateTime(inputText);

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
/**
 * SCV경기표 제목에서 날짜와 시간을 추출해 jQuery로 input에 자동 설정
 * @param {string} title - 예: "SCV경기표🏸 (6월 26일 오후 7시 30분)"
 */
function setDateTime(title) {
    // 괄호 안의 "6월 26일 오후 7시 30분" 패턴 추출
    var match = title.match(/\((\d+)월\s*(\d+)일\s*(오전|오후)\s*(\d+)시\s*(\d+)분\)/);
	if(autoDateTimeSetting) return; //최초 세팅 외에는 자동세팅X
    if (!match) return; // 패턴이 없으면 종료

    var month = parseInt(match[1], 10);
    var day = parseInt(match[2], 10);
    var ampm = match[3];
    var hour = parseInt(match[4], 10);
    var minute = parseInt(match[5], 10);

    // 오전/오후 변환
    if (ampm === "오후" && hour < 12) hour += 12;
    if (ampm === "오전" && hour === 12) hour = 0;

    // 오늘 연도 사용 (필요시 수정)
    var today = new Date();
    var year = today.getFullYear();

    // yyyy-MM-dd
    var dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
    // HH:mm
    var timeStr = String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');

    // jQuery로 값 넣기
    $("#date").val(dateStr);
    $("#time").val(timeStr);
	autoDateTimeSetting = 1;
}


$('#registerBtn').on('click', function() {
	var gameTime = document.querySelector('input[id="date"]').value +"T"+ document.querySelector('input[id="time"]').value;
//	var scriptLink = "AKfycbxk--xhwahqnFFAM6pbXU1ydFpKaHARdyQa0Hhkn3yfeJ24RswReTuNRRFab3Ua_uWfgA";

	const attendeeIds = []; // 변환한 memberId를 담을 배열
	// attendees의 이름을 memberId로 변환
	// attendees의 이름을 순회하면서 memberId를 찾기
	Object.keys(attendees).forEach(name => {
		// 🐣 이모지 제거
		    const cleanName = name.replace(/🐣/g, '');

		    if (memberInfo[cleanName]) {
		        attendeeIds.push(memberInfo[cleanName].memberId);
		    } else {
		        alert("'" + cleanName + "'을 명단에서 찾을 수 없습니다.");
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


//이름에 "*,(,)" 문자를 포함하거나 공백 키를 제거한 JSON 객체를 반환
function removeKeysWithGuest(jsonData) {
    const pattern = /[\*\(\)]/; // *, (, ) 중 하나라도 포함하는지 체크
    for (const key in jsonData) {
        if (pattern.test(key) || key === "") {
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

