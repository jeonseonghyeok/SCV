var winnerArr;
var winnerList;

window.onload = function(){
	var now = new Date();
	document.getElementById('date').valueAsDate = now;
	if(now.getHours()>20)
		$("#time").val("19:30");
	else if(now.getHours()>13)
		$("#time").val("12:00");
	else
		$("#time").val("09:00");

	var userTimeParts = $("#time").val().split(":");
	var userHours = parseInt(userTimeParts[0]);
	var userMinutes = parseInt(userTimeParts[1]);
}

function GameResultDecomposition() {
  	// 괄호 내 문자 포함한 경우(게or왼or오) 제
	//VS(대소문자 구분 없이) 지우고,이름 외자인 인원 이름 내 공백제거, 줄바꿈제거 후, X경기 기준으로 분해
  	//결과적으로 점수와 명단만 남음 ex)이용대 유연성 (20) 최솔규 김원호
	  var playResultList = $("#playResult").val().replace(/VS/gi, " ").replace(/이 +현/g, "이현").replace(/박 +찬/g, "박찬").replace(/김 +진/g, "김진").replace(/\n/g, "").split(/\d{1,2}경기 /g);
	  var players;
	  winnerArr = [];
	  //var reg =/\(\d{1,2}\)/g; //(15)와 같이 점수를 포함한 괄호를 찾는 패턴
	  var reg = /\s*\(\d{1,2}\)/g;
	
	  playResultList.forEach(e => {
	    if (e != "") {
	      console.log(e);
	      // 1개 이상의 공백을 기준으로 문자열을 분할하는 정규식 패턴 사용
	      players = e.replace(reg, "").trim().split(/\s+/);
	      if (e.search(reg) < 5)
	        alert("승리팀 분석 실패\n" + e);
	      else if (e.search(reg) < 12) {//왼쪽 승(인덱스 값 7~9 예상)
	    	  winningScoreCount(players,0,parseInt(e.match(reg)[0].match(/\d+/)[0]));
	      }
	      else {//오른쪽 승
	    	  winningScoreCount(players,1,parseInt(e.match(reg)[0].match(/\d+/)[0]));
	      }
	
	    }
	  });

  winnerList = Object.fromEntries(Object.entries(winnerArr).sort());
  winResultPrint(winnerList);

  $("#saveForm").show();

}
function winCount(players,winTeam){
	//객체에 없는 경우 초기화
	players.forEach(function(player,index){
		switch (index) {
			case 0:
			case 1:
				if(!oryuWinner.hasOwnProperty(player))
					oryuWinner[player] = 0;
				break;
			case 2:
			case 3:
				if(!gogaWinner.hasOwnProperty(player))
					gogaWinner[player] = 0;
				break;
			default:
				alert("오류발생");
		}
	});
	//승리 결과에 맞추어 우승 횟수 카운트
	switch (winTeam) {
		case 0:
			oryuWinner[players[0]]++;
			oryuWinner[players[1]]++;
			break;
		case 1:
			gogaWinner[players[2]]++;
			gogaWinner[players[3]]++;
			break;
		default:
				alert("오류발생");
	}
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
  var returnMessege = "";
  //const keyArr = Object.keys(winnerList);
  Object.keys(winnerList).forEach(e => {
    returnMessege += (e + " " + winnerList[e]+"점\n");
  });
    returnMessege += "\n";
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
  $("#tbnGameResultSave").saveForm();
}
// 키 이름에 "(게)" 문자를 포함한 키를 제거한 JSON 객체
function removeKeysWithGuest(jsonData) {
  for (const key in jsonData) {
    if (key.includes("(게)")) {
      delete jsonData[key];
    }
  }
}
