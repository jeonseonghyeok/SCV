var oryuWinnerList;
var gogaWinnerList;

window.onload = function(){
	var now = new Date();
	if(now.getHours()>20)
		$("#time").val("19:30");
	else if(now.getHours()>14)
		$("#time").val("14:00");
	else if(now.getHours()>10)
		$("#time").val("10:00");
	else
		$("#time").val("08:00");

	var userTimeParts = $("#time").val().split(":");
	var userHours = parseInt(userTimeParts[0]);
	var userMinutes = parseInt(userTimeParts[1]);
}

function GameResultDecomposition() {
  // 괄호 내 문자 포함한 경우 제거하고, VS(대소문자 구분 없이) 지우고, 2개 이상의 공백 1개로 변경하고, 줄바꿈제거 후, X경기 기준으로 분해
  //결과적으로 점수와 명단만 남음 ex)이용대 유연성 (20) 최솔규 김원호
  var playResultList = $("#playResult").val().replace(/\(\D.*?\)/g, " ").replace(/VS/gi, " ").replace(/\s{2,}/gi, ' ').replace(/\n/g, "").split(/\d{1,2}경기 /g);
  var winner;
  var players;
  var reg = /\d{1,2}/g;
  var oryuWinnerArr = [];
  var oryuGameTotalPoint = 0;
  var gogaWinnerArr = [];
  var gogaGameTotalPoint = 0;

  playResultList.forEach(e => {
    if (e != "") {
      console.log(e);
      //console.log(e.search(reg));
      players = e.replace(/\(\d{1,2}\)/g, "").split(" ");
      if (e.search(reg) < 5)
        alert("승리팀 분석 실패\n" + e);
      else if (e.search(reg) < 10) {//왼쪽 승
        winner = players[0] + " " + players[1];
        oryuWinnerArr.push(players[0]);
        oryuWinnerArr.push(players[1]);
        oryuGameTotalPoint += Number(e.match(reg)[0]);
      }
      else {//오른쪽 승
        winner = players[2] + " " + players[3];
        gogaWinnerArr.push(players[2]);
        gogaWinnerArr.push(players[3]);
        gogaGameTotalPoint += Number(e.match(reg)[0]);
      }
      console.log("승리팀 : " + winner);
    }
  });

  $("#winnerSortResult").val("오류(합산점수 : " + oryuGameTotalPoint + ")\n");
  oryuWinnerList = ConversionToObject(oryuWinnerArr);
  winResultPrint(oryuWinnerList);

  $("#winnerSortResult").val($("#winnerSortResult").val() + "고가(합산점수 : " + gogaGameTotalPoint + ")\n");
  gogaWinnerList = ConversionToObject(gogaWinnerArr);
  winResultPrint(gogaWinnerList);

  $("#saveForm").show();

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
    returnMessege += (e + " " + winnerList[e]+"승\n");
  });
    returnMessege += "\n";
  $("#winnerSortResult").val($("#winnerSortResult").val() + returnMessege);

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
    $.ajax({
      type: "get",
      data: {
        "gameTime" : gameTime,
        "writer" : writer,
        "gameResult": JSON.stringify(Object.assign(oryuWinnerList,gogaWinnerList))
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
