var memberInfo;
window.onload = function(){
    memberInfoImport();
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
	var attendanceListArr = attendanceList
	.replace(/\(\D.*?\)/g, "")  // 괄호 안의 내용 제거
	.replace(/\d{1,2}\./g, "")  // 숫자와 마침표 제거
	.replace(/콕\d{1}/g, "")  // 숫자와 마침표 제거
	.replace(/🏸/g, "")	//신입표시 제거
	.replace(/ /g, "")	//띄어쓰기 제거
	.split("\n")  // 개행 문자로 나누어 배열 생성
	.filter(function(value) {
		return value.trim() !== ''; // 값이 공백이 아닌 경우에만 포함
	});

	if(attendanceListArr.length<4){
		alert("최소 4인");
		return 0;
	}
	//명단 두 배로 늘려서 복제
	var readyPlayerListArr = attendanceListArr.concat(attendanceListArr);
	//인원이 홀수인 경우 출석
	if(attendanceListArr.length % 2 !== 0)
		readyPlayerListArr = readyPlayerListArr.concat(attendanceListArr.slice(0, 2));
	var gameTomtalNumber = Math.ceil(attendanceListArr.length/2) //경기 수

	var playListArr = createPlayList(readyPlayerListArr);

	// 2차원 배열 순환
	var playList="";
	for (let i = 0; i < playListArr.length; i++) {
		playList += ((i+1)+"경기 "+playListArr[i][0]+" "+playListArr[i][1]+" VS "+playListArr[i][2]+" "+playListArr[i][3]+"\n");
	}
	var playListContent = '';
	playListContent += (playersInfoPrint(attendanceListArr)+"\n");
	playListContent += playList;
	$("#playList").val(playListContent);

}
function playersInfoPrint(attendanceListArr){
    const tierName = ['🏸','브','실','골','플','다','마'];
    const playersInfoArr = Array(tierName.length).fill("");
    let playersInfo = "SCV경기표🏸\n";
    playersInfo += ("("+getPlayTime()+")\n");
    for(var i = 0; i < attendanceListArr.length;i++){
        player = attendanceListArr[i];
        if(memberInfo[player] == undefined || memberInfo[player].tier == undefined){
            playersInfoArr[0] += (player + " ");
        }
        else{
            playersInfoArr[memberInfo[player].tier] += (player + " ");
        }
    }
    playersInfo += "총원 ("+attendanceListArr.length+")\n\n"
    for(var i=playersInfoArr.length-1;i>0;i--){
        playersInfo += (tierName[i]+"("+i+") "+ playersInfoArr[i]+"\n");
    }
    if(playersInfoArr[0].length>0)
        playersInfo += ("\n"+tierName[0]+" "+playersInfoArr[i]+"\n");
    return playersInfo;
}


function InputClear(){
	var choice = confirm("지우시겠습니까?");
	
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
    
    if(now.getHours()>12)
    	formattedTime = "오후 7시 30분"
	else if(now.getHours()>9)
		formattedTime = ("오후 12시");
	else
		formattedTime = ("오전 9시 30분");
    return formattedDate + " " +formattedTime;
}


