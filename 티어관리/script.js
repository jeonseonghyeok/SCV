var memberInfo;
window.onload = function() {
//    memberInfoImport();
    $("#teamTierManage").show();
}

function memberInfoImport() {
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
    promptMessege += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 다이아 : 5 / 마스터 : 6';
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
            playerInfo += '다이아';
            break;
        case 6:
            playerInfo += '마스터';
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
        promptMessege += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 다이아 : 5 / 마스터 : 6';
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
	var memberArr = Array.from({ length: 7 }, () => []);
	const tierName = ['🏸','Bronze','Silver','Gold','Platinum','Diamond','Master'];

	for (var key in memberInfo) {
	    if (!memberInfo[key].hasOwnProperty("tier")) { // 티어가 없는 경우 누락으로
	        memberArr[0].push(key);
	    } else {
	        memberArr[memberInfo[key].tier].push(key);
	    }
	}
	var printContent = "";
	// 배열 순환하면서 출력
	for (var i = memberArr.length-1; i > 0; i--) {
	    printContent += (tierName[i]+'('+i+')' + '\n');
	    printContent += (memberArr[i].sort().join(' / ')+'\n\n');
	}
	if(memberArr[0].length > 0)
	    printContent += ('누락 : ' + memberArr[0].sort().join(' / '));
	$("#memberInfoBox").val(printContent);
}

function memberListPrintOrderByName() {
	// 객체의 키를 정렬한 배열 생성
    $("#memberInfoBox").val(Object.keys(memberInfo).sort().join('\n'));
}

