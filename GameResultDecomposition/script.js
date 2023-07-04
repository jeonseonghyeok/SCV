function GameResultDecomposition(){
  var playResultList = $("#playResult").val().replace(/VS/g," ").replace(/\s{2,}/gi, ' ').replace(/\n/g,"").split(/\d{1,2}경기 /g)
  var winner;
  var players;
  var reg = /\d{1,2}/g;
  var oryuWinnerArr = [];
  var gogaWinnerArr = [];

  playResultList.forEach(e => {
    if(e!=""){
      console.log(e);
      //console.log(e.search(reg));
      players = e.replace(/\(\d{1,2}\)/g,"").split(" ");
      if(e.search(reg) <10){//왼쪽 승
        winner = players[0] +" "+ players[1];
        oryuWinnerArr.push(players[0]);
        oryuWinnerArr.push(players[1]);
      }
      else{//오른쪽 승
        winner = players[2] +" "+ players[3];
        gogaWinnerArr.push(players[2]);
        gogaWinnerArr.push(players[3]);
      }
      console.log("승리자 : " + winner);
    }
  });
  
  $("#winnerSortResult").val("오류\n");
  winResultPrint(oryuWinnerArr);
  $("#winnerSortResult").val($("#winnerSortResult").val()+"고가\n");
  winResultPrint(gogaWinnerArr);
  
}
function winResultPrint(winnerArr){
  winnerArr.sort();
  var prevWinner = winnerArr[0];
  var numberOfWins = 0;
  var winResultPrintMessege = "";

  winnerArr.forEach(e => {
    if(e == prevWinner)
      numberOfWins++;
    else{
      winResultPrintMessege += (prevWinner + " "+ numberOfWins + "승\n");
      prevWinner = e;
      numberOfWins = 1;
    }
  });
  winResultPrintMessege += (prevWinner + " "+ numberOfWins + "승\n\n");
  $("#winnerSortResult").val($("#winnerSortResult").val()+winResultPrintMessege);
}