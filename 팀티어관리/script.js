var memberInfo;
window.onload = function(){
  memberInfoImport();
}
function memberInfoImport(){
   $.ajax({
    type:"GET",
    async : false,//동기방식으로 사용
    datatype:"JSON",
    url:"../memberInfoList",
    //url:"https://jeonseonghyeok.github.io/SCV/memberInfoList",
    success:function(result){
	    memberInfo = JSON.parse(result);
      $("#SearchButtonGroup").show();
    }
  });
}
function memeberSearch(){
  //명단 조회
let searchName = prompt('이름을 입력하시오.');
let choice;
const member = memberInfo[searchName];

if(searchName == null || searchName == '')
  alert("미입력 또는 취소로 종료");
else if(member != undefined){
  memeberInfoPrint(searchName);
  choice = confirm("정보를 수정하시겠습니까?");
  if(choice){
    memeberInfoChange(searchName)//팀 또는 티어를 변경
  }
}
else{
  let confirmMessege = "";
  confirmMessege += "'"+searchName+"'은(는) 명단에 존재하지 않습니다.\n";
  confirmMessege += "등록하시겠습니까?";
  choice = confirm(confirmMessege);
  if(choice)
    memeberSignUp(searchName);
}
}

function memeberSignUp(name){
  let promptMessege;
  var inputString;

  memberInfo[name] = {};
  //console.log(memeberTeamChange(name));

  if(memeberTeamChange(name) && memeberTierChange(name)){
    //localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
    //console.log(memberInfo[name]);

    alert("완료되었습니다.");
    memeberInfoPrint(name);
  }

}
function memeberInfoChange(name){
	if(confirm("티어를 변경하시겠습니까?")){
		if(memeberTierChange(name)){
			// localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
			alert("완료되었습니다.");
		}
		else{
			return 0;
		}
	}
	else if(confirm("팀을 변경하시겠습니까?")){
		if(memeberTeamChange(name)){
			// localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
			alert("완료되었습니다.");
		}
		else{
			return 0;
		}
	}
	else{
		alert("변경사항 없이 종료합니다.");
    return 0;
  }
    $("#btnMemberInfoExport").show();
    $("#memberInfoBox").show();
    $("#memberInfoBox").val("");
    memeberInfoPrint(name);
}
function memeberTeamChange(name){
  let promptMessege;
  var inputString;

  promptMessege = '팀을 입력하시오.\n';
  promptMessege += '(오류:0 / 고가:1 / 깍두기:2)';
  inputString = prompt(promptMessege,'');
  if(inputString == null || inputString == ""){
    alert("미입력 또는 취소로 종료");
    return 0;
  }
  memberInfo[name].team = Number(inputString);
  return 1;
}
function memeberTierChange(name){
  promptMessege = '티어를 입력하시오.(1~5)\n';
  promptMessege += '(브 : 1/ 실 : 2/ 골 : 3/ 플 : 4/ 다 : 5)';
  inputString = prompt(promptMessege,'');
  //console.log(inputString);
  if(inputString == null || inputString == ""){
    alert("미입력 또는 취소로 종료");
    return 0;
  }
  memberInfo[name].tier = Number(inputString);
  return 1;
}
function memeberInfoPrint(searchName){

  let playerInfo = "";
  const member = memberInfo[searchName];

  playerInfo += "[회원 정보]\n";
  playerInfo += "이름 : "+searchName+"\n";
  playerInfo += "팀 : ";
  //console.log(member.team);
  switch (member.team) {
    case 0:
        playerInfo += '오류';
        break;
    case 1:
        playerInfo += '고가';
        break;
    case 2:
        playerInfo += '깍두기';
        break;
    default:
        playerInfo += '누락';
  }
  playerInfo += "\n";
  playerInfo += "티어 : ";
  //console.log(member.tier);
  switch (member.tier) {
    case 1:
        playerInfo += '브론즈';
        break;
    case 2:
        playerInfo += '실버';
        break;
    case 3:
        playerInfo += '골드';
        break;
    case 4:
        playerInfo += '플레티넘';
        break;
    case 5:
        playerInfo += '다이아';
        break;
    default:
        playerInfo += '미정';
  }
  playerInfo += "\n";
  alert(playerInfo);
}

function memebersManage(){
if(confirm("티어를 일괄적으로 변경하시겠습니까?")){
	if(memeberListTierChange()){
		// localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
		alert("완료되었습니다.");
    $("#btnMemberInfoExport").show();
    $("#memberInfoBox").show();
    $("#memberInfoBox").val("");
	}
}
else if(confirm("팀을 일괄적으로 변경하시겠습니까?")){
	if(memeberListTeamChange()){
		// localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
		alert("완료되었습니다.");
    $("#btnMemberInfoExport").show();
    $("#memberInfoBox").show();
    $("#memberInfoBox").val("");
	}
}
else
	alert("변경 사항 없이 종료합니다.");
}

function memeberListTierChange(){
	let list = prompt('명단을 입력하시오.');
	var inputString;

	if(list==null || list == ""){
		alert("명단 입력이 필요합니다.");
		return 0;
		}
	else{
		promptMessege = '티어를 입력하시오.(1~5)\n';
		promptMessege += '(브 : 1/ 실 : 2/ 골 : 3/ 플 : 4/ 다 : 5)';
		inputString = Number(prompt(promptMessege,''));

		if(inputString == null || inputString == ""){
			alert("미입력 또는 취소로 종료");
			return 0;
		}
		else{
			const players = list.replace("  "," ").split(" ");

			for(var i = 0; i < players.length;i++){
        if(memberInfo[players[i]] == undefined)
          alert("'"+players[i]+"'은(는) 명단에 존재하지 않아 미처리됩니다.");
        else{
          console.log(players[i] + " : "+memberInfo[players[i]].tier+ "->" + inputString);
          memberInfo[players[i]].tier = inputString;
        }
			}
			return 1;
		}
  }

}

function memeberListTeamChange(){
	let list = prompt('명단을 입력하시오.');
	var inputString;

	if(list==null || list == ""){
		alert("명단 입력이 필요합니다.");
		return 0;
		}
	else{
			promptMessege = '팀을 입력하시오.\n';
			promptMessege += '(오류:0 / 고가:1 / 깍두기:2)';
			inputString = Number(prompt(promptMessege,''));
			const players = list.replace("  "," ").split(" ");

			for(var i = 0; i < players.length;i++){
			  if(memberInfo[players[i]] == undefined)
          alert("'"+players[i]+"'은(는) 명단에 존재하지 않아 미처리됩니다.");
        else{
          console.log(players[i] + " : "+memberInfo[players[i]].team+ "->" + inputString);
				  memberInfo[players[i]].team = inputString;
        }
			}
			return 1;
	}

}

function memeberInfoPrintByJson(){
  $("#memberInfoBox").val(JSON.stringify(memberInfo));
}
