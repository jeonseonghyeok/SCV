var memberInfo;
window.onload = function(){
  teamTierInfoCall();
}
function teamTierInfoCall(){
  var memberInfoString = '{"국윤호":{"team":0,"tier":5},"손준희":{"team":0,"tier":5},"변성섭":{"team":1,"tier":5},"김준선":{"team":0,"tier":5},"조민환":{"team":0,"tier":5},"염정은":{"team":1,"tier":4},"조수경":{"team":0,"tier":5},"김혜민":{"team":1,"tier":5},"윤서아":{"team":1,"tier":5},"배정우":{"team":1,"tier":4},"손동우":{"team":1,"tier":4},"이현":{"team":2,"tier":4},"이승재":{"team":0,"tier":4},"황준엽":{"team":1,"tier":4},"김진곤":{"team":0,"tier":4},"홍동현":{"team":0,"tier":4},"박지성":{"team":0,"tier":4},"이경엽":{"team":1,"tier":4},"이준성":{"team":1,"tier":4},"김태영":{"team":0,"tier":4},"맹순영":{"team":2,"tier":4},"김태수":{"team":1,"tier":3},"김수빈":{"team":0,"tier":3},"임의진":{"team":0,"tier":3},"김규혁":{"team":0,"tier":3},"최욱진":{"team":1,"tier":3},"윤경빈":{"team":0,"tier":3},"이성훈":{"team":1,"tier":3},"박준의":{"team":0,"tier":3},"곽태형":{"team":1,"tier":3},"장수환":{"team":0,"tier":3},"최만수":{"team":1,"tier":3},"권구태":{"team":0,"tier":3},"이재현":{"team":1,"tier":3},"배시온":{"team":1,"tier":3},"장준혁":{"team":0,"tier":3},"전성기":{"team":1,"tier":3},"김대원":{"team":1,"tier":3},"정해준":{"team":0,"tier":3},"김구범":{"team":2,"tier":3},"고도연":{"team":1,"tier":3},"최민선":{"team":0,"tier":3},"이재진":{"team":0,"tier":3},"노우석":{"team":1,"tier":2},"우도경":{"team":0,"tier":2},"권영동":{"team":1,"tier":2},"서광철":{"team":1,"tier":3},"송지우":{"team":0,"tier":2},"김강민":{"team":0,"tier":2},"이우빈":{"team":0,"tier":2},"이성진":{"team":0,"tier":2},"장준원":{"team":0,"tier":2},"한상균":{"team":0,"tier":2},"이승민":{"team":1,"tier":2},"최진영":{"team":1,"tier":2},"조석준":{"team":2,"tier":3},"류철현":{"team":1,"tier":2},"박형기":{"team":1,"tier":2},"강인호":{"team":0,"tier":2},"이승원":{"team":1,"tier":2},"송동수":{"team":1,"tier":2},"권용재":{"team":0,"tier":2},"황성준":{"team":0,"tier":2},"이건우":{"team":0,"tier":2},"김영재":{"team":0,"tier":2},"장익석":{"team":1,"tier":2},"명현수":{"team":0,"tier":2},"김서윤":{"team":0,"tier":3},"이수빈":{"team":0,"tier":2},"정혜진":{"team":0,"tier":2},"권혜지":{"team":1,"tier":2},"맹서희":{"team":0,"tier":2},"고은비":{"team":2,"tier":3},"이현하":{"team":0,"tier":2},"윤세린":{"team":0,"tier":2},"마정미":{"team":1,"tier":3},"서우림":{"team":0,"tier":2},"오연아":{"team":0,"tier":2},"김민주":{"team":1,"tier":3},"김희정":{"team":1,"tier":3},"이민수":{"team":0,"tier":1},"신동혁":{"team":1,"tier":1},"김경훈":{"team":1,"tier":1},"임진성":{"team":0,"tier":1},"이익제":{"team":1,"tier":2},"이재원":{"team":0,"tier":1},"양정호":{"team":0,"tier":1},"권승호":{"team":1,"tier":1},"이도현":{"team":0,"tier":2},"김영수":{"team":1,"tier":1},"강현창":{"team":0,"tier":1},"김성권":{"team":1,"tier":2},"조영상":{"team":1,"tier":1},"전범기":{"team":1,"tier":2},"김준영":{"team":1,"tier":1},"김정근":{"team":0,"tier":2},"김범철":{"team":1,"tier":2},"윤진섭":{"team":1,"tier":1},"선우윤호":{"tier":1,"team":0},"성지경":{"team":0,"tier":1},"고태호":{"team":1,"tier":1},"정창수":{"team":1,"tier":1},"김광호":{"team":1,"tier":1},"황인재":{"team":1,"tier":1},"최민혁":{"team":1,"tier":1},"한신":{"team":0,"tier":1},"이희수":{"team":1,"tier":2},"최보경":{"team":0,"tier":1},"윤효진":{"team":0,"tier":1},"공난희":{"tier":1},"이세현":{"team":0,"tier":1},"박미란":{"team":1,"tier":1},"박민영":{"team":1,"tier":1},"김지인":{"team":1,"tier":1},"문정경":{"team":1,"tier":1},"전혜선":{"team":0,"tier":1},"박현아":{"team":0,"tier":1},"홍봄이":{"team":1,"tier":1},"김보현":{"team":1,"tier":1},"김수민":{"team":1,"tier":1},"이수경":{"team":0,"tier":1},"문수진":{"team":0,"tier":1},"김성현":{"team":0,"tier":1},"장성호":{"team":0,"tier":1},"김기홍":{"team":1,"tier":2},"전성혁":{"team":0,"tier":2},"이제창":{"team":0,"tier":1},"김진":{"team":0,"tier":2},"오주환":{"team":1,"tier":2},"유병욱":{"team":1,"tier":1},"최성욱":{"team":1,"tier":1},"김찬엽":{"team":0,"tier":2},"강선문":{"team":0,"tier":2},"최선규":{"team":0,"tier":2},"배종천":{"team":0,"tier":2},"신재성":{"team":0,"tier":2},"이성재":{"team":0,"tier":2},"이정석":{"team":1,"tier":2},"서승범":{"team":0,"tier":1},"박병준":{"team":1,"tier":1},"허규백":{"team":0,"tier":1},"최여진":{"team":1,"tier":3},"강윤서":{"team":1,"tier":5},"정지인":{"team":0,"tier":1},"홍지수":{"team":1,"tier":1},"정예은":{"team":0,"tier":1},"김태윤":{"team":0,"tier":1},"윤솔라":{"team":0,"tier":1},"천준혁":{"team":0,"tier":1}}';

  memberInfo = JSON.parse(memberInfoString);
  $("#btnMemberSearch").show();
}
function memeberSearch(){
  //명단 조회
let searchName = prompt('이름을 입력하시오.');
let choice;
const member = memberInfo[searchName];

if(searchName == null || searchName == '')
  console.log("미입력 또는 취소로 종료");
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
    localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
    console.log(memberInfo[name]);

    alert("완료되었습니다.");
    memeberInfoPrint(name);
  }

}
function memeberInfoChange(name){
	if(confirm("티어를 변경하시겠습니까?")){
		if(memeberTierChange(name)){
			localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
			alert("완료되었습니다.");
		}
		else{
			return 0;
		}
	}
	else if(confirm("팀을 변경하시겠습니까?")){
		if(memeberTeamChange(name)){
			localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
			alert("완료되었습니다.");
		}
		else{
			return 0;
		}
	}
	else
		alert("변경사항 없이 종료합니다.");

    memeberInfoPrint(name);
}
function memeberTeamChange(name){
  let promptMessege;
  var inputString;

  promptMessege = '팀을 입력하시오.\n';
  promptMessege += '(오류:0 / 고가:1 / 깍두기:2)';
  inputString = prompt(promptMessege,'');
  if(inputString == null || inputString == ""){
    console.log("미입력 또는 취소로 종료");
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
    console.log("미입력 또는 취소로 종료");
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
