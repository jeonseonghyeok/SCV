window.onload = function(){
}

function GameCreate() {

	var attendanceListArr= $("#attendanceList")
	.val()
	.replace(/\(\D.*?\)/g, "")  // 괄호 안의 내용 제거
	.replace(/\d{1,2}\. /g, "")  // 숫자와 마침표 제거
	.replace(/ /g, "")	//띄어쓰기 제거
	.split("\n");  // 개행 문자로 나누어 배열 생성

	if(attendanceListArr.length<4){
		alert("최소 4인");
		return 0;
	}
	//명단 두 배로 늘려서 복제
	var readyPlayerListArr = attendanceListArr.concat(attendanceListArr);
	//인원이 홀수인 경우 출석
	if(attendanceListArr.length % 2 !== 0)
		readyPlayerListArr = readyPlayerListArr.concat(attendanceListArr.slice(0, 2));
	// 플레이어 섞기
	//shuffle(readyPlayerListArr);
	var gameTomtalNumber = Math.ceil(attendanceListArr.length/2) //경기 수

	var playLIstArr = createPlayLIst(readyPlayerListArr);

	// 2차원 배열 순환
	var playLIst="";
	for (let i = 0; i < playLIstArr.length; i++) {
		playLIst += ((i+1)+"경기 "+playLIstArr[i][0]+" "+playLIstArr[i][1]+" VS "+playLIstArr[i][2]+" "+playLIstArr[i][3]+"\n");
	}

	$("#playLIst").val(playLIst);

}
//배열을 섞기 위한 함수
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function InputClear(){
	$("#attendanceList").val("");
	$("#playLIst").val("");
}
function createPlayLIst(readyPlayerListArr) {
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




