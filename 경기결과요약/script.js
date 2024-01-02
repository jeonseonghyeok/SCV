var winnerArr;
var winnerList;
var memberInfo;

window.onload = function(){
	//로컬 스토리지에서 데이터 불러오기
	$("#playResult").val(localStorage.getItem('playResult'));
	memberInfoImport();
	var now = new Date();
	document.getElementById('date').valueAsDate = now;
	if(now.getHours()>=20)
		$("#time").val("19:30");
	else if(now.getHours()>=13)
		$("#time").val("12:00");
	else
		$("#time").val("09:00");

	var userTimeParts = $("#time").val().split(":");
	var userHours = parseInt(userTimeParts[0]);
	var userMinutes = parseInt(userTimeParts[1]);
}


function memberInfoImport() {
//	memberInfo = {"김준선":{"tier":6,"sex":1},"이현":{"tier":4},"이승재":{"tier":6,"sex":1},"김태수":{"tier":3},"김규혁":{"tier":6,"sex":1},"이성훈":{"tier":5,"sex":1},"박준의":{"tier":3},"김대원":{"tier":3,"sex":1},"정해준":{"tier":5,"sex":1},"최민선":{"tier":3,"sex":2},"노우석":{"tier":4,"sex":1},"서광철":{"tier":5,"sex":1},"최진영":{"tier":4,"sex":1},"박형기":{"tier":2,"sex":1},"장익석":{"tier":2,"sex":1},"고은비":{"tier":3,"sex":2},"이익제":{"tier":2,"sex":1},"김성권":{"tier":4,"sex":1},"선우윤호":{"tier":1,"sex":1},"정창수":{"tier":3,"sex":1},"최보경":{"tier":2},"윤효진":{"tier":2,"sex":2},"문정경":{"tier":2,"sex":2},"홍봄이":{"tier":1,"sex":2},"전성혁":{"tier":3,"sex":1},"김진":{"tier":4,"sex":1},"강선문":{"tier":4,"sex":1},"배종천":{"tier":3,"sex":1},"신재성":{"tier":5,"sex":1},"이정석":{"tier":4,"sex":1},"서승범":{"tier":2,"sex":1},"홍지수":{"tier":2,"sex":2},"이규현":{"tier":1,"sex":1},"방희연":{"tier":1,"sex":2},"박찬":{"tier":1,"sex":1},"김대원2":{"tier":1,"sex":1},"강지수":{"tier":2,"sex":2},"오종혁":{"tier":2,"sex":1},"이창빈":{"tier":3,"sex":1},"강래엽":{"tier":2,"sex":1},"송승범":{"tier":2,"sex":1},"류시원":{"tier":1},"박종찬":{"tier":3,"sex":1},"방한결":{"tier":5,"sex":2},"유연진":{"tier":1,"sex":1},"정상열":{"tier":4,"sex":1},"배현민":{"tier":1,"sex":1},"심예림":{"tier":4,"sex":2},"박주성":{"tier":1,"sex":1},"윤윤하":{"tier":4,"sex":2},"송지우":{"tier":4,"sex":1},"장철원":{"tier":1,"sex":1},"전나원":{"tier":1,"sex":2},"박우영":{"tier":2,"sex":1},"정우민":{"tier":1,"sex":1},"김남우":{"tier":5,"sex":2},"송인혁":{"tier":2,"sex":1},"최용진":{"tier":3,"sex":1},"이승채":{"sex":1,"tier":2},"이현재":{"sex":1,"tier":3}};
    $.ajax({
        type: "GET",
        async: false, //동기방식으로 사용
        datatype: "JSON",
        //url:"../memberInfoList",
        url: "https://jeonseonghyeok.github.io/SCV/memberInfoList",
        success: function(result) {
            memberInfo = JSON.parse(result);
            $("#teamTierManage").show();
        }
    });
}

function GameResultDecomposition() {
	// 로컬 스토리지에 데이터 저장
	  localStorage.setItem('playResult', $("#playResult").val());
  	// 괄호 내 문자 포함한 경우(게or왼or오) 제
	//VS(대소문자 구분 없이) 지우고,이름 외자인 인원 이름 내 공백제거, 줄바꿈제거 후, X경기 기준으로 분해
  	//결과적으로 점수와 명단만 남음 ex)이용대 유연성 (20) 최솔규 김원호
	  var playResultList = $("#playResult").val().replace(/VS/gi, " ").replace(/이 +현/g, "이현").replace(/박 +찬/g, "박찬").replace(/김 +진/g, "김진").replace(/\n/g, "").split(/\d{1,2}경기 /g);
	  var players;
	  winnerArr = [];
//	  var reg = /\s*\(\d{1,2}\)/g;//(15)와 같이 점수를 포함한 괄호를 찾아 split
	  var reg = /\s*\(승\)/g;//'(승)'괄호를 찾아 split
	  var autoCalResult = "";//자동계산결과
	  
	  playResultList.forEach((e,index) => {
	    if (e != "") {
	      console.log(e);
	      // 1개 이상의 공백을 기준으로 문자열을 분할하는 정규식 패턴 사용
	      players = e.replace(reg, "").trim().split(/\s+/);
	      if (e.search(reg) < 5)
	        alert("승리팀 분석 실패\n" + e);
	      else if (e.search(reg) < 12) {//왼쪽 승(인덱스 값 7~9 예상)
	    	  autoCalResult += (index+'경기 '+players[0] +' '+ players[1]+'('+winPointGive(players,0)+')' + ' VS ' + players[2] +' '+ players[3]+'\n');
//	    	  winningScoreCount(players,0,parseInt(e.match(reg)[0].match(/\d+/)[0]));
	      }
	      else {//오른쪽 승
	    	  autoCalResult += (index+'경기 '+players[0] +' '+ players[1] + ' VS ' + players[2] +' '+ players[3]+'('+winPointGive(players,1)+')'+'\n');
//	    	  winningScoreCount(players,1,parseInt(e.match(reg)[0].match(/\d+/)[0]));
	      }
	
	    }
	  });
	  autoCalResult+= '\n';
	  winnerList = Object.fromEntries(Object.entries(winnerArr).sort());
	
	  $("#winnerSortResult").val(autoCalResult);
	  winResultPrint(winnerList);
	
	  $("#saveForm").show();

}
//function winCount(players,winTeam){
//	//객체에 없는 경우 초기화
//	players.forEach(function(player,index){
//		switch (index) {
//			case 0:
//			case 1:
//				if(!oryuWinner.hasOwnProperty(player))
//					oryuWinner[player] = 0;
//				break;
//			case 2:
//			case 3:
//				if(!gogaWinner.hasOwnProperty(player))
//					gogaWinner[player] = 0;
//				break;
//			default:
//				alert("오류발생");
//		}
//	});
//	//승리 결과에 맞추어 우승 횟수 카운트
//	switch (winTeam) {
//		case 0:
//			oryuWinner[players[0]]++;
//			oryuWinner[players[1]]++;
//			break;
//		case 1:
//			gogaWinner[players[2]]++;
//			gogaWinner[players[3]]++;
//			break;
//		default:
//				alert("오류발생");
//	}
//}	
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
  //const keyArr = Object.keys(winnerList);
  Object.keys(winnerList).forEach(e => {
    returnMessege += (e + " " + winnerList[e]+"점\n");
  });
  $("#winnerSortResult").val(returnMessege);

}

function GameResultSave(){
  var gameTime = document.querySelector('input[id="date"]').value +" "+ document.querySelector('input[id="time"]').value;
  var scriptLink = "AKfycbxk--xhwahqnFFAM6pbXU1ydFpKaHARdyQa0Hhkn3yfeJ24RswReTuNRRFab3Ua_uWfgA";
  var scriptLink_test = "AKfycbwyQLNDHtIn-aLH3z189SFItcX9B29021xm2zMVF8n9";
  var writer = localStorage.getItem("writer");
  if(writer == null){
    var inputName = prompt("작성자 성함을 기입해주세요.");
    if(inputName != null && inputName != ""){
      writer = inputName;
      localStorage.setItem("writer",writer);
    }
    else
      return 0;
  }
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
	    	  localStorage.removeItem('playResult');
	        console.log(response);
	        if(response.result == "success")
	          alert('입력 완료.');
	        else if((response.result == "error"))
	          alert(response.errorMessage);
	      }
	    });
	  }
	  else{
	    if(confirm("작성자를 변경하시겠습니까?")){
	      localStorage.removeItem("writer");
	      GameResultSave();
	    }
	  }
	}
function InputClear(){
  $("#playResult").val("");
  $("#winnerSortResult").val("");
  localStorage.removeItem('playResult');
}
// 키 이름에 "(게)" 문자를 포함한 키를 제거한 JSON 객체
function removeKeysWithGuest(jsonData) {
  for (const key in jsonData) {
    if (key.includes("(게)")) {
      delete jsonData[key];
    }
  }
}

function memberSignUp(name) {
    let promptMessege;
    var inputString;

    memberInfo[name] = {};

    if (memberSexChange(name) && memberTierChange(name)) {
        alert("완료되었습니다.");
        return 1;
    }
    else{
    	delete(memberInfo[name]);
    	return 0;
    }
}


function memberSexChange(name) {
    let promptMessege;
    var inputString;

    promptMessege = '성별을 입력하시오.\n';
    promptMessege += '(남성:1 / 여성:2)';
    inputString = prompt(promptMessege, '');
    if (inputString == null || inputString == "") {
        return 0;
    } 
    else {
    	memberInfo[name].sex = Number(inputString);
        return 1;
    }
    
    
}

function memberTierChange(name) {
    promptMessege = '티어를 입력하시오.(1~6)\n';
    promptMessege += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 에메랄드 : 5 / 마스터 : 6';
    inputString = prompt(promptMessege, '');
    //console.log(inputString);
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

