var memberInfo;
var attendanceListArr;
window.onload = function () {
  memberInfoImport();
};

function dragAndDrop() {
  $(".seat").draggable({
    revert: true,
  });

  $(".seat").droppable({
    drop: function (event, ui) {
      var draggedSeat = ui.draggable;
      var droppedSeat = $(this);

      var tempText = draggedSeat.text();
      draggedSeat.text(droppedSeat.text());
      droppedSeat.text(tempText);

      draggedSeat.removeClass("selected");
      balanceEvaluation();
      sameNameCheck();
    },
  });

  $(".seat").click(function () {
    $(".seat").removeClass("selected");
    $(this).addClass("selected");
  });
  $(".seat").on("touchstart", function (event) {
    let touchedSeat = $(this);
    let originRect = touchedSeat[0].getBoundingClientRect();
    touchedSeat.addClass("selected");

    touchedSeat.on("touchmove", function (event) {
      event.preventDefault();
      let touch = event.originalEvent.touches[0];
      touchedSeat.offset({
        top: touch.pageY - touchedSeat.outerHeight() / 2,
        left: touch.pageX - touchedSeat.outerWidth() / 2,
      });
    });

    touchedSeat.on("touchend", function (event) {
      let touch = event.originalEvent.changedTouches[0];
      let droppedSeats = document.elementsFromPoint(touch.clientX, touch.clientY);
      let droppedSeat = null;

      droppedSeat = droppedSeats.find(
        (seat) =>
          seat.classList.contains("seat") &&
          !seat.classList.contains("selected")
      );

      if (droppedSeat && $(droppedSeat).hasClass("seat")) {
        var tempText = touchedSeat.text();
        touchedSeat.text($(droppedSeat).text());
        $(droppedSeat).text(tempText);
        touchedSeat.removeClass("selected");
        touchedSeat.off("touchmove touchend");
        touchedSeat.offset({
          top: originRect.top,
          left: originRect.left,
        });
      } else {
        touchedSeat.removeClass("selected");
        touchedSeat.off("touchmove touchend");
        touchedSeat.offset({
          top: originRect.top,
          left: originRect.left,
        });
      }
      balanceEvaluation();
	  $(".seat").removeAttr('style');
    });
  });
}

function memberInfoImport() {
	$.ajax({
        type: "GET",
        async: false, //동기방식으로 사용
        datatype: "JSON",
        url: "/members",
        success: function(result) {
            memberInfo = convertMapKeys(result);
            $("#teamTierManage").show();
        }
    });
}
function convertMapKeys(springMap) {
    var convertedMap = {};

    $.each(springMap, function(key, value) {
        convertedMap[value.name] = value;
    });

    return convertedMap;
}
function isGuest(str) {
  const regex = /\(.*게.*\)/;
  return regex.test(str);
}
function getOnlyName(str) {
  const regex = /\(.*\)/;
  return str.replace(regex,'');
}
function GameCreate() {
  var attendanceList = $("#attendanceList").val().includes("<참석명단>")
    ? $("#attendanceList").val().split("<참석명단>")[1]
    : $("#attendanceList").val();
  let guestNum = 1;
  attendanceListArr = attendanceList
    //.replace(/\(첫\)/g, "") // 신입표시 제거
    .replace(/\d{1,2}\./g, "") // 숫자와 마침표 제거
//    .replace(/콕\d{1}/g, "") // 콕N개 제거
    .replace(/ /g, "") //띄어쓰기 제거
    .split("\n") // 개행 문자로 나누어 배열 생성
    .filter(function (value) {
      return value.trim() !== ""; // 값이 공백이 아닌 경우에만 포함
    });
//    .map((name) => {
//      if (/\(게\d*\)$/.test(name)) {
//        alert(name + " -> "+`게스트${guestNum}`);
//        return `게스트${guestNum++}`;
//      }
//      return name;
//    });

  if (attendanceListArr.length < 4) {
    alert("최소 4인 입력필요");
    return 0;
  }
  let isSuccess = true;

  	attendanceListArr.forEach(function(player) {
		const onlyName = getOnlyName(player);
		if(isGuest(player)){
			if(memberInfo[onlyName] !== undefined){
				alert(`'${onlyName}'은(는) 이미 회원 이름입니다.`);
				isSuccess = false;
				return
			}
		}
	});
	if(!isSuccess)
		return
	
	attendanceListArr.forEach(function(player) {
		if (isSuccess) {
			const onlyName = getOnlyName(player);
			
			if (memberInfo[onlyName] === undefined) {
				alert(`'${onlyName}'은(는) 명단에 존재하지 않습니다.\n 임시로 정보를 저장합니다.`);
				if (!memberSignUp(onlyName)) {
					isSuccess = false;
					return;
				}
			} else if (memberInfo[onlyName].tier == 0) {
				alert(`'${onlyName}'은(는) 티어가 누락되었습니다.\n 임시로 티어를 저장합니다.`);
				if (!memberTierChange(onlyName)) {
					isSuccess = false;
					return;
				}
			}
		}
	});
	
	let cleanedArr = attendanceListArr.map(name => name.replace(/\([^)]*\)/g, ''));

  if (!isSuccess) {
    alert("임시저장을 취소하여 경기표 생성을 진행하지 않습니다.");
	memberInfoImport();//명단 다시 불러오기
    return;
  }
	$("#tierInfo").val(playersInfoPrint(attendanceListArr));
  //명단 두 배로 늘려서 복제
  var readyPlayerListArr = cleanedArr.concat(cleanedArr);
  //인원이 홀수인 경우 출석이 빠른 2인 3회경기
  if (cleanedArr.length % 2 !== 0)
    cleanedArr = readyPlayerListArr.concat(
      cleanedArr.slice(0, 2)
    );
  var gameTomtalNumber = Math.ceil(cleanedArr.length / 2); //경기 수
  var playListArr = createPlayList(readyPlayerListArr);

  $("#seatContainer").html("");
  // 배열을 4개씩 나누어서 처리
  $("#seatContainer").html();
  playListArr.forEach((element,index) => {
    let newRow = $('<div class="row"></div>');
    // 체크박스 추가
    newRow.append('<input type="checkbox" class="game-checkbox" data-game-index="'+index+'">');
    newRow.append('<div class="seat">' + element[0] + "</div>");
    newRow.append('<div class="seat">' + element[1] + "</div>");
    newRow.append(" vs ");
    newRow.append('<div class="seat">' + element[2] + "</div>");
    newRow.append('<div class="seat">' + element[3] + "</div>");
    // seatContainer에 추가
    $("#seatContainer").append(newRow);
  });
  dragAndDrop();
  $("#GameMatchDiv").show();
  $("#playerInputDiv").hide();
  balanceEvaluation();
}
function GameReCreate() {
 	let uncheckedLines = [];
	let readyPlayerListArr = [];
    // 모든 게임 체크박스를 순회하며 체크 상태를 확인
    $("#seatContainer .game-checkbox").each(function(index) {
        if (!$(this).prop('checked')) {
            uncheckedLines.push(index);
            let $row = $(this).closest('.row');

            // 각 seat 요소에서 플레이어 이름을 추출하여 linePlayers 배열에 추가
            $row.find('.seat').each(function() {
                readyPlayerListArr.push($(this).text().trim());
            });
        }
    });
	let playListArr = createPlayList(readyPlayerListArr);
	uncheckedLines.forEach(function(lineNum, index){
		$("#seatContainer div.row:nth-child(" + (lineNum + 1) + ") div.seat").eq(0).text(playListArr[index][0]);
		$("#seatContainer div.row:nth-child(" + (lineNum + 1) + ") div.seat").eq(1).text(playListArr[index][1]);
		$("#seatContainer div.row:nth-child(" + (lineNum + 1) + ") div.seat").eq(2).text(playListArr[index][2]);
		$("#seatContainer div.row:nth-child(" + (lineNum + 1) + ") div.seat").eq(3).text(playListArr[index][3]);
	});
  balanceEvaluation();
}
function playersInfoPrint(attendanceListArr) {
  const tierName = ["🏸", "브", "실", "골", "플", "다", "마"];
  const playersInfoArr = Array(tierName.length).fill("");
  let print = "";

  //생성부
  for (var i = 0; i < attendanceListArr.length; i++) {
    let player = getOnlyName(attendanceListArr[i]);
    if (
      memberInfo[player] == undefined ||
      memberInfo[player].tier == undefined
    ) {
      playersInfoArr[0] += attendanceListArr[i] + " ";
    } else {
      playersInfoArr[memberInfo[player].tier] += attendanceListArr[i] + " ";
    }
  }
  
  //출력부
  for (var i = playersInfoArr.length - 1; i > 0; i--) {
    print += tierName[i] + " : " + playersInfoArr[i] + "\n";
  }
  if (playersInfoArr[0].length > 0)
    print += "\n" + tierName[0] + " " + playersInfoArr[i] + "\n";
  return print;
}

function cancel() {
  var choice = confirm("취소하시겠습니까?");

  if (choice) {
    $("#attendanceList").val("");
    $("#playList").val("");
  }
}
function createPlayList(readyPlayerListArr) {
  let array = readyPlayerListArr.slice();
  let groups = [];
  let currentGroup = [];
  while (array.length > 0) {
    //뽑은 인원이 기존 경기 포함된 경우
    // 랜덤한 인덱스 선택
    const randomIndex = Math.floor(Math.random() * array.length);

    // 해당 인덱스의 값 pop
    const player = array.splice(randomIndex, 1)[0];

    //게임명단에 이미 있는경우
    if (currentGroup.includes(player)) {
      array.push(player);

      //경기배정대기 인원이 3명이하일때 재처리(무한루프 방지)
      if (array.length <= 3) {
        groups.length = 0;
        currentGroup.length = 0;
        array = readyPlayerListArr.slice();
      }
    } else {
      currentGroup.push(player);
    }

    //명단이 4명 만들어지면 그룹에 푸시
    if (currentGroup.length === 4) {
      groups.push([...currentGroup]);
      currentGroup = [];
    }
  }
  return groups;
}

function getPlayTime() {
  var now = new Date();
  var month = now.toLocaleString("default", { month: "long" });
  var day = now.getDate();
  var formattedDate = month + " " + day + "일";
  var formattedTime;

  if (now.getHours() >= 17) formattedTime = "오후 7시 30분";
  else if (now.getHours() >= 13) formattedTime = "오후 13시 00분";
  else formattedTime = "오전 9시 00분";
  return formattedDate + " " + formattedTime;
}

//새로운 임시 요소를 만들어 텍스트를 복사를 수행하고 제거
function autoCopy(textToCopy) {
  var tempInput = $("<textarea>");
  $("body").append(tempInput);
  tempInput.val(textToCopy).select();
  document.execCommand("copy");
  tempInput.remove();
  alert("복사되었습니다.");
}

function replaceInput() {
  $("#attendanceList").val($("#attendanceList").val().replaceAll(" ", "\n"));
}
function gamePrint() {
  if($("#seatContainer div.seat.sameName").length>0){
    alert("한 경기에 동일플레이어를 둘 수 없습니다.");
    return;
    }
  var playListContent = "";
  let gameInfoDefault = "SCV경기표🏸\n";
  gameInfoDefault += "(" + getPlayTime() + ")\n";
  playListContent += gameInfoDefault;
  playListContent += playersInfoPrint(attendanceListArr) + "\n";
  playListContent += "총원 (" + attendanceListArr.length + ")\n\n";

  $("#playList").val(playListContent);

  // 경기배정표를 저장할 배열
  let playListArr = [];
  $("#seatContainer .seat").each(function () {
    playListArr.push($(this).text());
  });

  for (let i = 0; i < playListArr.length / 4; i++) {
    playListContent +=
      i +
      1 +
      "경기 " +
      playListArr[4 * i + 0] +
      " " +
      playListArr[4 * i + 1] +
      " VS " +
      playListArr[4 * i + 2] +
      " " +
      playListArr[4 * i + 3] +
      "\n";
  }
  autoCopy(playListContent);
}
function balanceEvaluation() {
	//밸런스 구분  기본으로 변경
	$("#seatContainer div.seat").removeClass("unbalanced1");
	$("#seatContainer div.seat").removeClass("unbalanced2");
	// 경기배정표를 저장할 배열
	let playListArr = [];
	$("#seatContainer .seat").each(function() {
		playListArr.push($(this).text());
	});
	for (let i = 0; i < playListArr.length / 4; i++) {
		const sliceStart = i * 4;
		const sliceEnd = sliceStart + 4;
		const leftWinPoint = rivalLevelCalculate(
			playListArr.slice(sliceStart, sliceEnd),
			0
		);
		const rightWinPoint = rivalLevelCalculate(
			playListArr.slice(sliceStart, sliceEnd),
			1
		);
		if (leftWinPoint - rightWinPoint < 0) {
			if (leftWinPoint - rightWinPoint == -1) {
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(0).addClass("unbalanced1");
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(1).addClass("unbalanced1");
			}
			else {
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(0).addClass("unbalanced2");
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(1).addClass("unbalanced2");
			}
		} else if (leftWinPoint - rightWinPoint > 0) {
			if (leftWinPoint - rightWinPoint == 1) {
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(2).addClass("unbalanced1");
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(3).addClass("unbalanced1");
			} else {
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(2).addClass("unbalanced2");
				$("#seatContainer div.row:nth-child(" + (i + 1) + ") div.seat").eq(3).addClass("unbalanced2");
			}
		}
	}
	sameNameCheck();
}

function sameNameCheck() {
  $("#seatContainer div.seat").removeClass("sameName");
    let playListArr = [];
      $("#seatContainer .seat").each(function () {
        playListArr.push($(this).text());
      });
      for (let i = 0; i < playListArr.length; i += 4) {
        const occurrences = {};
        for (const palyerName of playListArr.slice(i,i+4)){
          if (occurrences[palyerName]) {
            console.log("경기내 동일플레이어 존재");
            $("#seatContainer div.row:nth-child("+i+") div.seat").removeClass("unbalanced2");
            playListArr.slice(i,i+4).forEach((element, index) => {
                    if (element === palyerName) {
                        console.log(i+index);
                        $("#seatContainer div.seat").eq(i+index).addClass("sameName");
//                        $("div.seat").eq(i+index).removeClass("unbalanced2");
                    }
                });
          }
          // 등장하지 않았던 요소라면 등장 횟수를 기록합니다.
          occurrences[palyerName] = true;
        };

      }
}
function rivalLevelCalculate(players, winTeam) {
  var score = 0; //점수

  switch (winTeam) {
    case 0:
      score = memberInfo[players[2]].tier + memberInfo[players[3]].tier
      break;
    case 1:
      score = memberInfo[players[0]].tier + memberInfo[players[1]].tier
      break;
    default:
      alert("오류발생");
  }
  return score;
}

function memberSignUp(name) {
  memberInfo[name] = {};

  if (memberTierChange(name)) {
    alert("완료되었습니다.");
    return 1;
  } 
}

function memberSexChange(name) {
  let promptMessege;
  var inputString;

  promptMessege = "성별을 입력하시오.\n";
  promptMessege += "(남성:1 / 여성:2)";
  inputString = prompt(promptMessege, "");
  if (inputString == null || inputString == "") {
    return 0;
  } else {
    memberInfo[name].sex = Number(inputString);
    return 1;
  }
}

function memberTierChange(name) {
  promptMessege = "티어를 입력하시오.(1~6)\n";
  promptMessege +=
    " - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 다이아 : 5 / 마스터 : 6";
  inputString = prompt(promptMessege, "");
  //console.log(inputString);
  if (inputString == null || inputString == "") {
    return 0;
  } else {
    var inputTierLever = Number(inputString);
    if (inputTierLever == -1) {
      delete memberInfo[name];
      alert("명단 삭제 완료");
      $("#memberInfoBox").val("");
    } else if (inputTierLever >= 0 && inputTierLever <= 6)
      memberInfo[name].tier = inputTierLever;
    else return 0;
  }
  return 1;
}
