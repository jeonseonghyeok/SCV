function GameResultDecomposition() {
  // VS 지우고, 2개 이상의 공백 1개로 변경하고, 줄바꿈제거 후, X경기 기준으로 분해
  //결과적으로 점수와 명단만 남음 ex)이용대 유연성 (20) 최솔규 김원호
  var playResultList = $("#playResult").val().replace(/VS/g, " ").replace(/\s{2,}/gi, ' ').replace(/\n/g, "").split(/\d{1,2}경기 /g)
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

  winResultPrint(oryuWinnerArr);
  $("#winnerSortResult").val($("#winnerSortResult").val() + "고가(합산점수 : " + gogaGameTotalPoint + ")\n");
  winResultPrint(gogaWinnerArr);
  $("#tbnGameResultSave").show();

}
function winResultPrint(winnerArr) {
  winnerArr.sort();
  var prevWinner = winnerArr[0];
  var numberOfWins = 0;
  var winResultPrintMessege = "";

  winnerArr.forEach(e => {
    if (e == prevWinner)
      numberOfWins++;
    else {
      winResultPrintMessege += (prevWinner + " " + numberOfWins + "승\n");
      prevWinner = e;
      numberOfWins = 1;
    }
  });
  if (prevWinner != undefined) {
    winResultPrintMessege += (prevWinner + " " + numberOfWins + "승\n\n");
    $("#winnerSortResult").val($("#winnerSortResult").val() + winResultPrintMessege);
  }
}

function GameResultSave(){
  if(confirm("해당 출력을 기록하시겠습니까?")){
    alert("현재 미구현");
    $.ajax({
      type: "get",
      url: "https://script.google.com/macros/s/AKfycbzPco8j4UMZRmHOh0BJr49cUkJ_h6bFM8tdhhdNVGVxFx8WClsshtx5N4bN9Vtbo461lw/exec",
      success: function(response){
         alert('입력 완료.');
      }
    });
  }
}
function InputClear(){
  $("#playResult").val("");
  $("#winnerSortResult").val("");
  $("#tbnGameResultSave").hide();
}
