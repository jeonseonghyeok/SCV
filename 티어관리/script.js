var memberInfo;
window.onload = function() {
    memberInfoImport();
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

function memeberSearch() {
    //명단 조회
    let searchName = prompt('이름을 입력하시오.');
    let choice;
    const member = memberInfo[searchName];

    if (searchName == null || searchName == '')
        alert("미입력 또는 취소로 종료");
    else if (member != undefined) {
        memeberInfoPrint(searchName);
        choice = confirm("정보를 수정하시겠습니까?");
        if (choice) {
            memeberInfoChange(searchName) //팀 또는 티어를 변경
        }
    } else {
        let confirmMessege = "";
        confirmMessege += "'" + searchName + "'은(는) 명단에 존재하지 않습니다.\n";
        confirmMessege += "등록하시겠습니까?";
        choice = confirm(confirmMessege);
        if (choice)
            memeberSignUp(searchName);
    }
}

function memeberSignUp(name) {
    let promptMessege;
    var inputString;

    memberInfo[name] = {};
    //console.log(memeberTeamChange(name));

    if (memeberTeamChange(name) && memeberTierChange(name)) {
        //localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
        //console.log(memberInfo[name]);

        alert("완료되었습니다.");
        $("#memberInfoBox").val("");
        memeberInfoPrint(name);
    }

}

function memeberInfoChange(name) {
    if (confirm("팀을 변경하시겠습니까?")) {
        if (memeberTeamChange(name)) {
            // localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
            alert("완료되었습니다.");
        } else {
            return 0;
        }
    } else if (confirm("티어를 변경하시겠습니까?")) {
        if (memeberTierChange(name)) {
            // localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
            alert("완료되었습니다.");
        } else {
            return 0;
        }
    } else {
        alert("변경사항 없이 종료합니다.");
        return 0;
    }
    $("#memberInfoBox").val("");
    memeberInfoPrint(name);
}

function memeberTeamChange(name) {
    let promptMessege;
    var inputString;

    promptMessege = '팀을 입력하시오.\n';
    promptMessege += '(오류:0 / 고가:1 / 깍두기:2 / 탈퇴:3)';
    inputString = prompt(promptMessege, '');
    if (inputString == null || inputString == "") {
        alert("미입력 또는 취소로 종료");
        return 0;
    } else if (inputString == 3) {
        if (confirm('명단에서 제거하시겠습니까?', '')) {
            delete(memberInfo[name]);
            alert('제거 완료');
        } else {
            alert('취소');
            return 0;
        }
    }
    memberInfo[name].team = Number(inputString);
    return 1;
}

function memeberTierChange(name) {
    promptMessege = '티어를 입력하시오.(1~5)\n';
    promptMessege += '(브 : 1/ 실 : 2/ 골 : 3/ 에 : 4)';
    inputString = prompt(promptMessege, '');
    //console.log(inputString);
    if (inputString == null || inputString == "") {
        alert("미입력 또는 취소로 종료");
        return 0;
    }
    memberInfo[name].tier = Number(inputString);
    return 1;
}

function memeberInfoPrint(searchName) {

    let playerInfo = "";
    const member = memberInfo[searchName];

    playerInfo += "[회원 정보]\n";
    playerInfo += "이름 : " + searchName + "\n";
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
            playerInfo += '에메랄드';
            break;
        default:
            playerInfo += '미정';
    }
    playerInfo += "\n";
    alert(playerInfo);
}

function memebersManage() {
    if (confirm("팀을 일괄적으로 변경하시겠습니까?")) {
        if (memeberListTeamChange()) {
            // localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
            alert("완료되었습니다.");
            $("#memberInfoBox").val("");
        }
    } else if (confirm("티어를 일괄적으로 변경하시겠습니까?")) {
        if (memeberListTierChange()) {
            // localStorage.setItem("memberInfo", JSON.stringify(memberInfo));
            alert("완료되었습니다.");
            $("#memberInfoBox").val("");
        }
    } else
        alert("변경 사항 없이 종료합니다.");
}

function memeberListTierChange() {
    let list = prompt('명단을 입력하시오.');
    var inputString;

    if (list == null || list == "") {
        alert("명단 입력이 필요합니다.");
        return 0;
    } else {
        promptMessege = '티어를 입력하시오.(1~5)\n';
        promptMessege += '(브 : 1/ 실 : 2/ 골 : 3/ 에 : 4)';
        inputString = Number(prompt(promptMessege, ''));

        if (inputString == null || inputString == "") {
            alert("미입력 또는 취소로 종료");
            return 0;
        } else {
            const players = list.replace("  ", " ").split(" ");

            for (var i = 0; i < players.length; i++) {
                if (memberInfo[players[i]] == undefined)
                    alert("'" + players[i] + "'은(는) 명단에 존재하지 않아 미처리됩니다.");
                else {
                    console.log(players[i] + " : " + memberInfo[players[i]].tier + "->" + inputString);
                    memberInfo[players[i]].tier = inputString;
                }
            }
            return 1;
        }
    }
}

function memeberListTeamChange() {
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

function memeberInfoPrintByJson() {
    $("#memberInfoBox").val(JSON.stringify(memberInfo));
}

function memebersTeamReset() {
    if (confirm("팀을 초기화 하시겠습니까?")) {
        for (var key in memberInfo) {
            if (memberInfo.hasOwnProperty(key)) { // 객체의 고유한 속성만 처리
                delete(memberInfo[key].team);
            }
        }
    }
}

function memeberNameByTeamOrder() {
    var memberArr = [
        [],
        [],
        [],
        []
    ]; //4개 생성

    for (var key in memberInfo) {
        if (memberInfo[key].hasOwnProperty("team")) { // team이 있을 경우에만 처리 0,1,2 이외에는 없을 것으로 간주
            memberArr[memberInfo[key].team].push(key);
        } else {
            memberArr[3].push(key);
        }
    }
    //출력	
    memberNamePrint(memberArr);
}

function removeTeamMissingMembers() {
    if (confirm("팀 누락명단에 있는 멤버를 제거하시겠습니까?")) {
        for (var key in memberInfo) {
            if (!memberInfo[key].hasOwnProperty('team')) {
                delete(memberInfo[key]);
            }
        }
    }

}

function memberNamePrint(memberArr) {
    let printMessege = "";
    for (var i = 0; i < memberArr.length; i++) {
        switch (i) {
            case 0:
                printMessege += '오류';
                break;
            case 1:
                printMessege += '고가';
                break;
            case 2:
                printMessege += '깍두기';
                break;
            default:
                printMessege += '누락';
        }
        printMessege += ("(" + memberArr[i].length + ")");
        printMessege += '\n';
        memberArr[i].sort().forEach(function(memberName) {
            printMessege += (memberName + "\n");
        });
        printMessege += '\n\n';
    };
    $("#memberInfoBox").val(printMessege);
}

function ConversionToObject(array) {
    array.sort();
    return array.reduce((pv, cv) => {
        pv[cv] = (pv[cv] || 0) + 1;
        return pv;
    }, {});
}