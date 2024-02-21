var memberInfo;
var attendanceListArr;
window.onload = function(){
    memberInfoImport();
    dragAndDrop();
}

function dragAndDrop(){		  
		  $('.seat').draggable({
			  revert: true
		  });

		  $('.seat').droppable({
			  drop: function(event, ui) {
				  var draggedSeat = ui.draggable;
				  var droppedSeat = $(this);

				  var tempText = draggedSeat.text();
				  draggedSeat.text(droppedSeat.text());
				  droppedSeat.text(tempText);

				  draggedSeat.removeClass('selected');
			  }
		  });

		  $('.seat').click(function() {
			  $('.seat').removeClass('selected');
			  $(this).addClass('selected');
		  });
		  $('.seat').on('touchstart', function(event) {
			  var touchedSeat = $(this);
			  touchedSeat.addClass('selected');

			  touchedSeat.on('touchmove', function(event) {
				  event.preventDefault();
			  });

			  touchedSeat.on('touchend', function(event) {
				  var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
				  var droppedSeat = document.elementFromPoint(touch.pageX, touch.pageY);
				  if (droppedSeat && $(droppedSeat).hasClass('seat')) {
					  var tempText = touchedSeat.text();
					  touchedSeat.text($(droppedSeat).text());
					  $(droppedSeat).text(tempText);
				  }
				  touchedSeat.removeClass('selected');
				  touchedSeat.off('touchmove touchend');
				  balanceEvaluation()
			  });
		  });
}
function memberInfoImport(){
	$.ajax({
		type:"GET",
		async : false,//동기방식으로 사용
		datatype:"JSON",
		//url:"../memberInfoList",
		url:"https://jeonseonghyeok.github.io/SCV/memberInfoList",
		success:function(result){
			memberInfo = JSON.parse(result);
		}
	});
}
function GameCreate() {
	var attendanceList = $("#attendanceList").val().includes('<참석명단>') ? $("#attendanceList").val().split('<참석명단>')[1] : $("#attendanceList").val();
	attendanceListArr = attendanceList
	.replace(/\(첫\)/g, "")  // 신입표시 제거
	.replace(/\d{1,2}\./g, "")  // 숫자와 마침표 제거
	.replace(/콕\d{1}/g, "")  // 숫자와 마침표 제거
	.replace(/ /g, "")	//띄어쓰기 제거
	.split("\n")  // 개행 문자로 나누어 배열 생성
	.filter(function(value) {
		return value.trim() !== ''; // 값이 공백이 아닌 경우에만 포함
	});

	if(attendanceListArr.length<4){
		alert("최소 4인 입력필요");
		return 0;
	}
	//명단 두 배로 늘려서 복제
	var readyPlayerListArr = attendanceListArr.concat(attendanceListArr);
	//인원이 홀수인 경우 출석이 빠른 2인 3회경기
	if(attendanceListArr.length % 2 !== 0)
		readyPlayerListArr = readyPlayerListArr.concat(attendanceListArr.slice(0, 2));
	var gameTomtalNumber = Math.ceil(attendanceListArr.length/2) //경기 수
	var playListArr = createPlayList(readyPlayerListArr);
	
	$('#seatContainer').html('');
	// 배열을 4개씩 나누어서 처리
	 $('#seatContainer').html();
	playListArr.forEach(element => {
		let newRow = $('<div class="row"></div>');
	    newRow.append('<div class="seat">'+element[0]+'</div>');
	    newRow.append('<div class="seat">'+element[1]+'</div>');
	    newRow.append(' VS ');
	    newRow.append('<div class="seat">'+element[2]+'</div>');
	    newRow.append('<div class="seat">'+element[3]+'</div>');
	    // seatContainer에 추가
	    $('#seatContainer').append(newRow);
	});
	dragAndDrop();
	$("#tierInfo").val(playersInfoPrint(attendanceListArr));
	$('#GameMatchDiv').show();
	$('#playerInputDiv').hide();
	balanceEvaluation()

//
//	// 2차원 배열 순환
//	var playList="";
//	for (let i = 0; i < playListArr.length; i++) {
//		playList += ((i+1)+"경기 "+playListArr[4*i+0]+" "+playListArr[4*i+1]+" VS "+playListArr[4*i+2]+" "+playListArr[4*i+3]+"\n");
//	}
//	var playListContent = '';
//	playListContent += (playersInfoPrint(attendanceListArr)+"\n");
//	playListContent += playList;
//	$("#playList").val(playListContent);
//	autoCopy(playListContent);
	
}
function playersInfoPrint(attendanceListArr){
    const tierName = ['🏸','브','실','골','플','다','마'];
    const playersInfoArr = Array(tierName.length).fill("");
    let playersInfo = "";
    /*
    let playersInfo = "SCV경기표🏸\n";
    playersInfo += ("("+getPlayTime()+")\n");
    */
    for(var i = 0; i < attendanceListArr.length;i++){
        player = attendanceListArr[i];
        if(memberInfo[player] == undefined || memberInfo[player].tier == undefined){
            playersInfoArr[0] += (player + " ");
        }
        else{
            playersInfoArr[memberInfo[player].tier] += (player + " ");
        }
    }
//    playersInfo += "총원 ("+attendanceListArr.length+")\n\n"
    for(var i=playersInfoArr.length-1;i>0;i--){
        playersInfo += (tierName[i]+"("+i+") "+ playersInfoArr[i]+"\n");
    }
    if(playersInfoArr[0].length>0)
        playersInfo += ("\n"+tierName[0]+" "+playersInfoArr[i]+"\n");
    return playersInfo;
}


function cancel(){
	var choice = confirm("취소하시겠습니까?");
	
	if(choice){
		$("#attendanceList").val("");
		$("#playList").val("");
	};
}
function createPlayList(readyPlayerListArr) {
	let array = readyPlayerListArr.slice();
	let groups = [];
	let currentGroup = [];
	while(array.length>0){
		//뽑은 인원이 기존 경기 포함된 경우
		// 랜덤한 인덱스 선택
		const randomIndex = Math.floor(Math.random() * array.length);

		// 해당 인덱스의 값 pop
		const player = array.splice(randomIndex, 1)[0];

		//게임명단에 이미 있는경우
		if (currentGroup.includes(player)) {
			array.push(player);
			
			//경기배정대기 인원이 3명이하일때 재처리(무한루프 방지)
			if(array.length<=3){
				groups.length = 0;
				currentGroup.length = 0;
				array = readyPlayerListArr.slice();
			}
		} 
		else {
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
    var month = now.toLocaleString('default', { month: 'long' });
    var day = now.getDate();
    var formattedDate = month + ' ' + day + '일';
    var formattedTime;
    
    if(now.getHours()>=17)
    	formattedTime = "오후 7시 30분"
	else if(now.getHours()>=11)
		formattedTime = ("오후 13시");
	else
		formattedTime = ("오전 9시");
    return formattedDate + " " +formattedTime;
}

//새로운 임시 요소를 만들어 텍스트를 복사를 수행하고 제거
function autoCopy(textToCopy) {
    var tempInput = $('<textarea>');
    $('body').append(tempInput);
    tempInput.val(textToCopy).select();
    document.execCommand('copy');
	tempInput.remove();
	alert("복사되었습니다.");
}

function replaceInput(){
	$("#attendanceList").val($("#attendanceList").val().replaceAll(' ','\n'));
}
function gamePrint(){
	var playListContent = '';
	let gameInfoDefault = "SCV경기표🏸\n";
	gameInfoDefault += ("("+getPlayTime()+")\n");
	playListContent += gameInfoDefault;
	playListContent += (playersInfoPrint(attendanceListArr)+"\n");
	playListContent += "총원 ("+attendanceListArr.length+")\n\n"
	
	$("#playList").val(playListContent);
	
	// 경기배정표를 저장할 배열
    let playListArr = [];
    $('#seatContainer .seat').each(function() {
    	playListArr.push($(this).text());
    });

	for (let i = 0; i < playListArr.length/4; i++) {
		playListContent += ((i+1)+"경기 "+playListArr[4*i+0]+" "+playListArr[4*i+1]+" VS "+playListArr[4*i+2]+" "+playListArr[4*i+3]+"\n");
	}
	autoCopy(playListContent);
}
function balanceEvaluation(){
	//밸런스 구분  기본으로 변경
	$('#seatContainer div.seat').css('background-color', '#CCC');
	
	// 경기배정표를 저장할 배열
    let playListArr = [];
    $('#seatContainer .seat').each(function() {
    	playListArr.push($(this).text());
    });
    for (let i = 0; i < playListArr.length/4; i++) {
        const sliceStart = i * 4;
        const sliceEnd = sliceStart + 4;
        const leftWinPoint = winPointCalculate(playListArr.slice(sliceStart, sliceEnd), 0);
        const rightWinPoint = winPointCalculate(playListArr.slice(sliceStart, sliceEnd), 1);
        console.log(leftWinPoint + ' VS ' + rightWinPoint);
        if (leftWinPoint - rightWinPoint <= -2) {
        	$('#seatContainer div.row:nth-child('+(i+1)+') div.seat:nth-child(1)').css('background-color', '#F33');
        	$('#seatContainer div.row:nth-child('+(i+1)+') div.seat:nth-child(2)').css('background-color', '#F33');
        }
        else if(leftWinPoint - rightWinPoint >= 2) {
        	$('#seatContainer div.row:nth-child('+(i+1)+') div.seat:nth-child(3)').css('background-color', '#F33');
        	$('#seatContainer div.row:nth-child('+(i+1)+') div.seat:nth-child(4)').css('background-color', '#F33');
        }
	}
}
function winPointCalculate(players,winTeam){
	var score = 0;//점수
	var multiple = 1;//성비에 따른 배수
	
//	//승리 결과에 맞추어 우승점수 계산
//	switch (winTeam) {
//		case 0:
//			//성비에 따른 배수 계산
//			multiple += (memberInfo[players[0]].sex +memberInfo[players[1]].sex); 
//			multiple -= (memberInfo[players[2]].sex +memberInfo[players[3]].sex);
//			if(multiple<1)multiple=1;
//			
//			//위 계산된 배수를 이용한 합산
//			score += (multiple * memberInfo[players[2]].tier);
//			score += (multiple * memberInfo[players[3]].tier)
//			break;
//		case 1:
//			//성비에 따른 배수 계산
//			multiple += (memberInfo[players[2]].sex +memberInfo[players[3]].sex);
//			multiple -= (memberInfo[players[0]].sex +memberInfo[players[1]].sex); 
//			if(multiple<1)multiple=1;
//			
//			//위 계산된 배수를 이용한 합산
//			score += (multiple * memberInfo[players[0]].tier);
//			score += (multiple * memberInfo[players[1]].tier)
//			break;
//		default:
//				alert("오류발생");
		
		//승리 결과에 맞추어 우승점수 계산
		switch (winTeam) {
			case 0:
				score += (memberInfo[players[2]].tier-memberInfo[players[2]].sex);
				score += (memberInfo[players[3]].tier-memberInfo[players[3]].sex);
				break;
			case 1:
				score += (memberInfo[players[0]].tier-memberInfo[players[0]].sex);
				score += (memberInfo[players[1]].tier-memberInfo[players[1]].sex);
				break;
			default:
					alert("오류발생");
	}
	return score;
}	
