var memberInfo;
window.onload = function() {
    memberInfoImport();
    $("#teamTierManage").show();
}

function memberInfoImport() {
//	memberInfo = {"김준선":{"tier":6,"sex":1},"이현":{"tier":4},"이승재":{"tier":6,"sex":1},"김규혁":{"tier":6,"sex":1},"이성훈":{"tier":5,"sex":1},"김대원":{"tier":3,"sex":1},"정해준":{"tier":5,"sex":1},"최민선":{"tier":3,"sex":2},"노우석":{"tier":3,"sex":1},"서광철":{"tier":5,"sex":1},"최진영":{"tier":4,"sex":1},"박형기":{"tier":2,"sex":1},"장익석":{"tier":3,"sex":1},"고은비":{"tier":3,"sex":2},"이익제":{"tier":2,"sex":1},"김성권":{"tier":4,"sex":1},"선우윤호":{"tier":1,"sex":1},"정창수":{"tier":2,"sex":1},"최보경":{"tier":2},"윤효진":{"tier":2,"sex":2},"문정경":{"tier":2,"sex":2},"홍봄이":{"tier":1,"sex":2},"전성혁":{"tier":3,"sex":1},"김진":{"tier":4,"sex":1},"강선문":{"tier":4,"sex":1},"배종천":{"tier":3,"sex":1},"신재성":{"tier":5,"sex":1},"이정석":{"tier":4,"sex":1},"서승범":{"tier":2,"sex":1},"홍지수":{"tier":2,"sex":2},"이규현":{"tier":1,"sex":1},"방희연":{"tier":1,"sex":2},"박찬":{"tier":1,"sex":1},"김대원2":{"tier":1,"sex":1},"강지수":{"tier":2,"sex":2},"오종혁":{"tier":2,"sex":1},"이창빈":{"tier":3,"sex":1},"강래엽":{"tier":2,"sex":1},"송승범":{"tier":2,"sex":1},"박종찬":{"tier":3,"sex":1},"방한결":{"tier":5,"sex":2},"유연진":{"tier":1,"sex":1},"정상열":{"tier":4,"sex":1},"배현민":{"tier":1,"sex":1},"심예림":{"tier":4,"sex":2},"박주성":{"tier":1,"sex":1},"윤윤하":{"tier":4,"sex":2},"송지우":{"tier":4,"sex":1},"장철원":{"tier":1,"sex":1},"전나원":{"tier":1,"sex":2},"박우영":{"tier":2,"sex":1},"정우민":{"tier":1,"sex":1},"김남우":{"tier":5,"sex":2},"송인혁":{"tier":3,"sex":1},"최용진":{"tier":3,"sex":1},"이현재":{"sex":1,"tier":3},"박준의":{"sex":1,"tier":3}};
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

function memberSearch() {
    //명단 조회
    let searchName = prompt('이름을 입력하시오.');
    let choice;
    const member = memberInfo[searchName];

    if (searchName == null || searchName == '')
        alert("미입력 또는 취소로 종료");
    else if (member != undefined) {
        memberInfoPrint(searchName);
        choice = confirm("티어를 수정하시겠습니까?");
        if (choice && memberTierChange(searchName)) {//티어를 변경 완료
        	memberInfoPrint(searchName);
        }
    } else {
        let confirmMessege = "";
        confirmMessege += "'" + searchName + "'은(는) 명단에 존재하지 않습니다.\n";
        confirmMessege += "등록하시겠습니까?";
        choice = confirm(confirmMessege);
        if (choice && memberSignUp(searchName))
        	memberInfoPrint(searchName);
        else
        	alert("미입력 또는 취소로 종료");
    }
}

function memberSignUp(name) {
    let promptMessege;
    var inputString;

    memberInfo[name] = {};

    if (memberSexChange(name) && memberTierChange(name)) {
        alert("완료되었습니다.");
        $("#memberInfoBox").val("");
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

function memberInfoPrint(searchName) {

    let playerInfo = "";
    const member = memberInfo[searchName];

    playerInfo += "[회원 정보]\n";
    playerInfo += "이름 : " + searchName + "\n";
    playerInfo += "성별 : ";
    switch (member.sex) {
        case 1:
            playerInfo += '남성';
            break;
        case 2:
            playerInfo += '여성';
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
            playerInfo += '마스터';
            break;
        case 6:
            playerInfo += '다이아';
            break;
        default:
            playerInfo += '미정';
    }
    playerInfo += "\n";
    alert(playerInfo);
}


function membersManage() {
    if (confirm("티어를 일괄적으로 변경하시겠습니까?")) {
        if (memberListTierChange()) {
            alert("완료되었습니다.");
            $("#memberInfoBox").val("");
        }
    } else
        alert("변경 사항 없이 종료합니다.");
}

function memberListTierChange() {
    let list = prompt('명단을 입력하시오.');
    var inputString;

    if (list == null || list == "") {
        alert("명단 입력이 필요합니다.");
        return 0;
    } else {
        promptMessege = '티어를 입력하시오.(1~6)\n';
        promptMessege += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 에메랄드 : 5 / 마스터 : 6';
        inputString = prompt(promptMessege, '');
        //console.log(inputString);
        if (inputString == null || inputString == "") {
            return 0;
        }
        else{
        	var inputTierLever = Number(inputString);
            const players = list.replace("  ", " ").split(" ");
        	if(inputTierLever == -1){
        		for (var i = 0; i < players.length; i++) {
        			delete(memberInfo[players[i]]);
                }
        		alert("명단 삭제 완료");
        		return 1;
        	}
        	else if(inputTierLever >= 0 && inputTierLever <=6){
        		for (var i = 0; i < players.length; i++) {
                    if (memberInfo[players[i]] == undefined)
                        alert("'" + players[i] + "'은(는) 명단에 존재하지 않아 미처리됩니다.");
                    else {
                        console.log(players[i] + " : " + memberInfo[players[i]].tier + "->" + inputString);
                        memberInfo[players[i]].tier = inputTierLever;
                    }
                }
        		return 1;
        	}
        	else
        		return 0;
        }
    }
}

function memberListTeamChange() {
    let list = prompt('명단을 입력하시오.');
    var inputString;

    if (list == null || list == "") {
        alert("명단 입력이 필요합니다.");
        return 0;
    } else {
        promptMessege = '팀을 입력하시오.\n';
        promptMessege += '(오류:0 / 고가:1 / 깍두기:2 / 탈퇴:3)';
        inputString = Number(prompt(promptMessege, ''));
        const players = list.replace("  ", " ").split(" ");
        if (inputString == null || inputString == "") {
            alert("미입력 또는 취소로 종료");
            return 0;
        } else if (inputString == 3) {
            if (confirm('명단에서 제거하시겠습니까?', '')) {
                for (var i = 0; i < players.length; i++) {
                    if (memberInfo[players[i]] == undefined)
                        alert("'" + players[i] + "'은(는) 명단에 존재하지 않아 미처리됩니다.");
                    else {
                        delete(memberInfo[players[i]]);
                        console.log(players[i] + '제거');
                    }
                }
            } else {
                alert('취소');
                return 0;
            }
        } else {
            for (var i = 0; i < players.length; i++) {
                if (memberInfo[players[i]] == undefined)
                    alert("'" + players[i] + "'은(는) 명단에 존재하지 않아 미처리됩니다.");
                else {
                    console.log(players[i] + " : " + memberInfo[players[i]].team + "->" + inputString);
                    memberInfo[players[i]].team = inputString;
                }
            }
        }
        return 1;
    }

}

function memberListPrintToJson() {
    alert("총원 : " + Object.keys(memberInfo).length);
    $("#memberInfoBox").val(JSON.stringify(memberInfo));
}

function memberListPrintOrderByTier(){
	// 3행 6열의 배열 생성 및 초기화
	var memberArr = Array.from({ length: 3 }, () => Array.from({ length: 7 }, () => []));
	const tierName = ['🏸','Bronze','Silver','Gold','Platinum','Diamond','Master'];
	const sexName = ['','남자','여자'];

    for (var key in memberInfo) {
        if (!memberInfo[key].hasOwnProperty("sex") || !memberInfo[key].hasOwnProperty("tier")) { // 성별이 없는거나 티어가 없는 경우 누락으로
            memberArr[0][0].push(key);
        } else {
            memberArr[memberInfo[key].sex][memberInfo[key].tier].push(key);
        }
    }
	var printContent = "";
    // 배열 순환하면서 출력
    for (var i = 1; i < memberArr.length; i++) { //남,여 순서
    	 printContent += (sexName[i] + ' \n');
	      for (var j = memberArr[i].length-1; j > 0; j--) {
	    	  printContent += (tierName[j]+'('+j+')' + '\n');
	    	  printContent += (memberArr[i][j].sort().join(' / ')+'\n\n');
	      }
	      printContent += '─────────────────────\n\n';
    }
    printContent += ('누락 : ' + memberArr[0][0]);
    $("#memberInfoBox").val(printContent);
}

function memberListPrintOrderByName() {
	// 객체의 키를 정렬한 배열 생성
    $("#memberInfoBox").val(Object.keys(memberInfo).sort().join('\n'));
}

/*function ConversionToObject(array) {
    array.sort();
    return array.reduce((pv, cv) => {
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
    }, {});
}*/


/*function membersTeamReset() {
    if (confirm("팀을 초기화 하시겠습니까?")) {
        for (var key in memberInfo) {
            if (memberInfo.hasOwnProperty(key)) { // 객체의 고유한 속성만 처리
                delete(memberInfo[key].team);
            }
        }
    }
}*/

/**
 * 성별 일관 기입 또는 변경
let memberlist = prompt('명단 입력');
let promptMessege = '성별을 입력하시오.\n';
promptMessege += '(남성:1 / 여성:2)';
let inputSex = Number(prompt(promptMessege, ''));
const players = memberlist.replace("  ", " ").split(" ");
var successResult = "";

for (var i = 0; i < players.length; i++) {
	if (memberInfo[players[i]] == undefined)
		console.log("'" + players[i] + "'은(는) 명단에 존재하지 않아 미처리");
	else {
		memberInfo[players[i]].sex = inputSex;
        console.log(memberInfo[players[i]]);
    }
}

 */


