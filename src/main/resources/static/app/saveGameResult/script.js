const memberManageUrl = "/members";
var winnerArr;
var winnerList;
var memberInfo;
var autoCalResult;
let promptMessege;
var memberInfo;
var token;
let writer;

window.onload = function() {
	tokenAuthentication();
	memberInfoImport();
    initializeDateTime();
//    const storedPlqyResult = localStorage.getItem('playResult');
//    $("#playResult").val(storedPlqyResult);
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
function memberInfoImport() {
	fetch(memberManageUrl)
		.then(response => response.json())
		.then(data => {
			memberInfo = convertMapKeys(data);
		})
		.catch(error => console.error('회원 정보 가져오기 실패:', error));
}

function convertMapKeys(springMap) {
	var convertedMap = {};

	$.each(springMap, function(key, value) {
		convertedMap[value.name] = value;
	});

	return convertedMap;
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


function GameResultDecomposition() {
	// 로컬 스토리지에 데이터 저장
//	localStorage.setItem('playResult', $("#playResult").val());
	var playResult=$("#playResult").val();
	//1경기 포함하며 이전텍스트 모두 제거 후 'n경기' 기준으로 나누어서 리스트생성
	var playResultList = playResult.substring(playResult.indexOf('1경기')).replace(/VS/gi, " ").split(/\d{1,2}경기 /g);
	var players;
	winnerArr = [];
	//var reg = /\s*\(\d{1,2}\)/g;//(15)와 같이 점수를 포함한 괄호를 찾아 split
	var reg = /\s*\(승\)/g;//'(승)'괄호를 찾아 split
	autoCalResult = "";//자동계산결과

	playResultList.forEach((e,index) => {
		if (e != "") {
			// 1개 이상의 공백을 기준으로 문자열을 분할하는 정규식 패턴 사용
			players = e.replace(reg, "").trim().split(/\s+/);
			if (e.search(reg) < 5)
				alert("승리팀 분석 실패\n" + e);
			else if (e.search(reg) < 12) {//왼쪽 승(인덱스 값 7~9 예상)
				autoCalResult += (index+'경기 '+players[0] +' '+ players[1]+'('+winPointGiveNew(players,0)+')' + ' VS ' + players[2] +' '+ players[3]+'\n');
			}
			else {//오른쪽 승
				autoCalResult += (index+'경기 '+players[0] +' '+ players[1] + ' VS ' + players[2] +' '+ players[3]+'('+winPointGiveNew(players,1)+')'+'\n');
			}

		}
	});
	winnerList = Object.fromEntries(Object.entries(winnerArr).sort());

	$("#winnerSortResult").val(autoCalResult);
	winResultPrint(winnerList);
	$("#saveForm").show();

}

function winPointGive(players,winTeam){
	var score = 0;//점수
	var multiple = 1;//성비에 따른 배수
	//객체에 없는 경우 초기화
	players.forEach(function(player,index){
		if(!winnerArr.hasOwnProperty(player))
			winnerArr[player] = 0;
		if(memberInfo[player] == undefined){
			alert("'"+player+"'은(는) 명단에 존재하지 않습니다.\n 임시로 정보를 저장합니다.")
			if(memberSignUp(player)); //임시 가입처리, 실패 시 종료
			else return 0;
		}
	});

	//승리 결과에 맞추어 우승점수 계산
	switch (winTeam) {
	case 0:
		//성비에 따른 배수 계산
		multiple += (memberInfo[players[0]].sex +memberInfo[players[1]].sex);
		multiple -= (memberInfo[players[2]].sex +memberInfo[players[3]].sex);
		if(multiple<1)multiple=1;

		//위 계산된 배수를 이용한 합산
		score += (multiple * memberInfo[players[2]].tier);
		score += (multiple * memberInfo[players[3]].tier)
		winnerArr[players[0]]+=score;
		winnerArr[players[1]]+=score;
		break;
	case 1:
		//성비에 따른 배수 계산
		multiple += (memberInfo[players[2]].sex +memberInfo[players[3]].sex);
		multiple -= (memberInfo[players[0]].sex +memberInfo[players[1]].sex);
		if(multiple<1)multiple=1;

		//위 계산된 배수를 이용한 합산
		score += (multiple * memberInfo[players[0]].tier);
		score += (multiple * memberInfo[players[1]].tier)
		winnerArr[players[2]]+=score;
		winnerArr[players[3]]+=score;
		break;
	default:
		alert("오류발생");
	}
	return score;
}
function winPointGiveNew(players,winTeam){
	const winPoint = 5;//기본승리점수
	let score = 0;
	//객체에 없는 경우 초기화
	players.forEach(function(player,index){
		if(!winnerArr.hasOwnProperty(player))
			winnerArr[player] = 0;
		if(memberInfo[player] == undefined){
			alert("'"+player+"'은(는) 명단에 존재하지 않습니다.\n 임시로 정보를 저장합니다.")
			if(memberSignUp(player)); //임시 가입처리, 실패 시 종료
			else return 0;
		}
	});
	var balancePoint = (memberInfo[players[0]].tier + memberInfo[players[1]].tier) - (memberInfo[players[2]].tier + memberInfo[players[3]].tier)
	//승리 결과에 맞추어 우승점수 계산
	switch (winTeam) {
	case 0:
		score =  winPoint-balancePoint;
		winnerArr[players[0]] += score;
		winnerArr[players[1]] += score;
		break;
	case 1:
		score =   winPoint+balancePoint;
		winnerArr[players[2]] += score;
		winnerArr[players[3]] += score;
		break;
	default:
		alert("오류발생");
	}
	return score;
}

function winningScoreCount(players,winTeam,score){
	//객체에 없는 경우 초기화
	players.forEach(function(player,index){
		if(!winnerArr.hasOwnProperty(player))
			winnerArr[player] = 0;
	});
	//승리 결과에 맞추어 우승점수 카운트
	switch (winTeam) {
	case 0:
		winnerArr[players[0]]+=score;
		winnerArr[players[1]]+=score;
		break;
	case 1:
		winnerArr[players[2]]+=score;
		winnerArr[players[3]]+=score;
		break;
	default:
		alert("오류발생");
	}
}	
function ConversionToObject(array) {
	array.sort();
	return array.reduce((pv, cv)=>{
		pv[cv] = (pv[cv] || 0) + 1;
		return pv;
	}, {});
}
function winResultPrint(winnerList) {
	var returnMessege = $("#winnerSortResult").val();
	returnMessege += '\n';
	//const keyArr = Object.keys(winnerList);
	Object.keys(winnerList).forEach(e => {
		returnMessege += (e + " " + winnerList[e]+"점\n");
	});
	$("#winnerSortResult").val(returnMessege);

}

function GameResultSave(){
	var gameTime = document.querySelector('input[id="date"]').value +" "+ document.querySelector('input[id="time"]').value;
	var scriptLink = "AKfycbxk--xhwahqnFFAM6pbXU1ydFpKaHARdyQa0Hhkn3yfeJ24RswReTuNRRFab3Ua_uWfgA";
	
	if(confirm("승리명단을 기록하시겠습니까?(작성자 : "+writer+")")){
		removeKeysWithGuest(winnerList);
		$.ajax({
			type: "get",
			data: {
				"gameTime" : gameTime,
				"writer" : writer,
				"gameResult": JSON.stringify(winnerList)
			},
			url: "https://script.google.com/macros/s/"+scriptLink+"/exec",
			// url: "https://script.google.com/macros/s/"+scriptLink_test+"/dev",
			success: function(response){
//				localStorage.removeItem('playResult');
				if(response.result == "success"){
					alert('입력 완료.');
					copyText($("#winnerSortResult").val());
					}
				else if((response.result == "error"))
					alert(response.errorMessage);
			}
		});
	}
}
function InputClear(){
	$("#playResult").val("");
	$("#winnerSortResult").val("");
//	localStorage.removeItem('playResult');
}
//이름에 "게스트" 문자를 포함한 키를 제거한 JSON 객체
function removeKeysWithGuest(jsonData) {
	for (const key in jsonData) {
		if (key.includes("게스트")) {
			delete jsonData[key];
		}
	}
}

function memberSignUp(name) {
	let promptMessege;
	var inputString;

	memberInfo[name] = {};

	if (memberTierChange(name)) {
		alert("완료되었습니다.");
		return 1;
	}
	else{
		delete(memberInfo[name]);
		return 0;
	}
}


function memberTierChange(name) {
	promptMessege = '티어를 입력하시오.(1~6)\n';
	promptMessege += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 다이아 : 5 / 마스터 : 6';
	inputString = prompt(promptMessege, '');
	if (inputString == null || inputString == "") {
		return 0;
	}
	else{
		var inputTierLever = Number(inputString);
		if(inputTierLever == -1){
			delete(memberInfo[name]);
			alert("명단 삭제 완료");
			$("#memberInfoBox").val("");
		}
		else if(inputTierLever >= 0 && inputTierLever <=6)
			memberInfo[name].tier = inputTierLever;
		else
			return 0;
	}
	return 1;
}

//새로운 임시 요소를 만들어 텍스트를 복사를 수행하고 제거
function copyText(textToCopy) {
	var tempInput = $('<textarea>');
	$('body').append(tempInput);
	tempInput.val(textToCopy).select();
	document.execCommand('copy');
	tempInput.remove();
}

function attendanceAdd() {
    var inputString = prompt("출석 이름을 입력하시오.");
    if (inputString != null && inputString != "") {
        var names = inputString.split(" ");
        names.forEach(function(name) {
            winnerList[name] = 0;
        });
        
        alert("출석자 추가 완료");
        $("#winnerSortResult").val(autoCalResult);
        winResultPrint(winnerList);
    }
}