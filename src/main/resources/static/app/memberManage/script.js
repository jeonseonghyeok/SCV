const memberManageUrl = "/members";
let promptMessege;
var memberInfo;
var token;
var zeroPaymentList;
window.onload = function() {
	tokenAuthentication();
	memberInfoImport();
	zeroPaymentListImport();
}
//토큰인증
function tokenAuthentication() {
	// LocalStorage에서 토큰 조회
	 token = localStorage.getItem("token");

	// 토큰이 없으면 알림 표시
	if (!token) {
		alert("토큰이 없습니다. 로그인해주세요.");
		window.location.href = "./tokenAuthentication";
	}
	$.ajax({
		url: '/api/verifyToken?token=' + token, // 토큰을 URL 파라미터로 전송
		method: 'GET',
		success: function() {
		},
		error: function(xhr) {
			if (xhr.status === 401) {
				alert(xhr.responseText);
				localStorage.removeItem("token");
				window.location.href = "./tokenAuthentication";
			} else {
				alert('토큰 검증 중 오류 발생: ' + xhr.status);
			}
		}
	});
}
function memberInfoImport() {
	fetch(memberManageUrl)
		.then(response => response.json())
		.then(data => {
			memberInfo = convertMapKeys(data);
			document.getElementById('teamTierManage').style.display = 'block';
		})
		.catch(error => console.error('회원 정보 가져오기 실패:', error));
}
function convertMapKeys(springMap) {
	var convertedMap = {};

	$.each(springMap, function(key, value) {
		convertedMap[value.name] = value;
	});

	return convertedMap;
}
function promptInput(message) {
	let input = prompt(message);
	if (input === null || input === '') {
		alert('입력이 취소되었거나 빈 값입니다.');
		return null;
	}
	return input.trim(); // 입력값의 앞뒤 공백 제거
}

function memberSearch() {
	let searchName = promptInput('이름을 입력하세요.');
	if (searchName === null) return; // 입력이 취소된 경우 함수 종료

	let member = memberInfo[searchName];

	if (member !== undefined) {
		memberInfoPrint(searchName);
		let choice = confirm('티어를 수정하시겠습니까?');
		if (choice) {
			console.log(memberTierChange(searchName));
		}
	} else {
		let confirmMessage = `'${searchName}'은(는) 명단에 존재하지 않습니다.\n등록하시겠습니까?`;
		let choice = confirm(confirmMessage);
		if (choice) {
			memberSignUp(searchName);
		} else {
			alert('등록이 취소되었습니다.');
		}
	}
}

function memberSignUp(name) {

	let sex = promptInput('성별을 입력하시오.\n(남성:1 / 여성:2)');
	if (sex === null) return;

	// 회원 정보 객체
	let memberData = {
		name: name,
		sex: Number(sex)
	};

	// 서버에 회원 등록 API 호출
	fetch('/members', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
		},
		body: JSON.stringify(memberData)
	})
		.then(response => {
			if (response.ok) {
				alert(`${name} 회원이 등록되었습니다.`);
				memberInfo[name] = memberData; // 로컬 데이터 업데이트
				memberTierChange(name);
			} else {
				throw new Error('회원 등록에 실패했습니다.');
			}
		})
		.catch(error => {
			alert(`오류 발생: ${error.message}`);
		});
}


function memberSexChange(name) {
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
	let inputString = prompt(promptMessege, '');
	if (inputString == null || inputString == "") {
		return;
	}
	let inputTierLever = Number(inputString);

	if(inputTierLever>0 && inputString<=6){
		promptMessege = '사유를 입력하시오.\n';
		promptMessege += '승급/가입/정정/조정 등등';
		inputString = prompt(promptMessege, '');
	}
	if (inputString == null || inputString == "") {
		return;
	}
	let reason = inputString;

	callUpdateTier(name, inputTierLever, reason, function(name, result) {
		if (result === 'Tier Change Success') {
			// 업데이트 성공 시 회원 정보 출력
			memberInfoPrint(name);
		} else {
			// 실패 시 메시지 출력
			alert(`${name}: ${result}`);
		}
	});
}

function memberInfoPrint(searchName) {

	let playerInfo = "";
	const member = memberInfo[searchName];

	playerInfo += "[회원 정보]\n";
	playerInfo += "이름 : " + searchName + "\n";
	playerInfo += "면제권 : " + member.exemptionCoupon + "장\n";
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
			$("#memberInfoBox").val("");
		}
	} else
		alert("변경 사항 없이 종료합니다.");
}

function memberListTierChange() {
	// 회원 목록을 입력받습니다.
	let list = promptInput('명단을 입력하시오.');
	if (list === "") return; // 입력이 취소된 경우 함수 종료

	// 입력받은 문자열에서 회원명을 추출합니다.
	const members = list.replace(/\s+/g, " ").trim().split(" ");

	// 티어를 입력받습니다.
	let promptMessage = '티어를 입력하시오.(1~6)\n';
	promptMessage += ' - 브론즈 : 1 / 실버 : 2 / 골드 : 3\n - 플레티넘 : 4 / 다이아 : 5 / 마스터 : 6';
	let inputString = prompt(promptMessage, '');
	if (inputString == null || inputString == "") {
		return;
	}
	let inputTierLever = Number(inputString);

	// 사유를 입력받습니다.
	promptMessage = '사유를 입력하시오.\n';
	promptMessage += '승급/가입/정정/조정 등등';
	inputString = prompt(promptMessage, '');
	if (inputString == null || inputString == "") {
		return;
	}
	let reason = inputString;

	// 결과를 저장할 배열
	let results = [];

	// 각 회원에 대해 티어와 사유를 적용합니다.
	let completedRequests = 0;
	for (let i = 0; i < members.length; i++) {
		callUpdateTier(members[i], inputTierLever, reason, function(name, result) {
			results.push(`${name}: ${result}`);
			completedRequests++;
			// 모든 요청이 완료되면 결과를 표시합니다.
			if (completedRequests === members.length) {
				alert("처리 결과:\n" + results.join("\n"));
			}
		});
	}
}

// 회원의 티어를 업데이트하거나 삭제하는 함수
function callUpdateTier(name, tier, reason, callback) {
	if (tier == -1) {  // 티어가 -1인 경우, 회원을 삭제합니다.
		$.ajax({
			url: memberManageUrl + "/" + name,
			type: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
			},
			success: function(result) {
				delete (memberInfo[name]);
				callback(name, "탈퇴 완료");
			},
			error: function(xhr, status, error) {
				callback(name, '탈퇴 오류: ' + xhr.responseText);
			}
		});
	} else if (tier > 0 && tier <= 6) {  // 티어가 0 이상 6 이하인 경우, 티어를 업데이트합니다.
		$.ajax({
			url: memberManageUrl + "/updateTier",
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
			},
			data: JSON.stringify({
				"name": name,
				"newTier": tier,
				"reason": reason
			}),
			contentType: 'application/json; charset=utf-8',
			success: function(result) {
				memberInfo[name].tier = tier;
				callback(name, "업데이트 완료");
			},
			error: function(xhr, status, error) {
				callback(name, '업데이트 오류 - ' + xhr.responseText);
			}
		});
	}
}

// 회원에게 면제권을 부여하는 함수
function callExemptionCouponPlus(name, amount, reason, callback) {
	const plusData = {
		name: name,
		amount: parseInt(amount),
		reason: reason
	};

	$.ajax({
		url: memberManageUrl + "/exemptionCouponPlus",
		type: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
		},
		data: JSON.stringify(plusData),
		contentType: 'application/json; charset=utf-8',
		success: function(result) {
			memberInfo[name].exemptionCoupon += parseInt(amount); // 면제권 수량 추가
			callback(name, "면제권 부여 완료");
		},
		error: function(xhr, status, error) {
			callback(name, '면제권 부여 오류 - ' + xhr.responseText);
		}
	});
}

function memberListPrintToJson() {
	$("#memberInfoBox").val(JSON.stringify(memberInfo));
	copyTextareaContent();
}

function memberListPrintOrderByTier() {
	var memberArr = Array.from({ length: 7 }, () => []);
	const tierName = ['🏸', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'];

	for (var key in memberInfo) {
		if (!memberInfo[key].hasOwnProperty("tier")) { // 티어가 없는 경우 누락으로
			memberArr[0].push(key);
		} else {
			memberArr[memberInfo[key].tier].push(key);
		}
	}
	var printContent = "";
	// 배열 순환하면서 출력
	for (var i = memberArr.length - 1; i > 0; i--) {
		printContent += (tierName[i] + '(' + i + ')' + '\n');
		printContent += (memberArr[i].sort().join(' / ') + '\n\n');
	}
	if (memberArr[0].length > 0)
		printContent += ('누락 : ' + memberArr[0].sort().join(' / '));
	$("#memberInfoBox").val(printContent);
	copyTextareaContent();
}

function memberListPrintOrderByName() {
	alert("총원 : " + Object.keys(memberInfo).length);
	// 객체의 키를 정렬한 배열 생성
	$("#memberInfoBox").val(Object.keys(memberInfo).sort().join('\n'));
	copyTextareaContent();
}

function exemptionCouponPlus() {
	let searchName = promptInput('이름을 입력하세요.');
	if (searchName === null) return; // 입력이 취소된 경우 함수 종료
	let member = memberInfo[searchName];
	if (!member) {
		alert(`'${searchName}'은(는) 명단에 존재하지 않습니다.`);
		return;
	}

	memberInfoPrint(searchName);
	let amount = promptInput('부여할 면제권 수량을 입력하세요.');
	if (amount === null) return;
	let reason = promptInput('사유를 입력하세요.');
	if (reason === null) return;

	callExemptionCouponPlus(searchName, amount, reason, function(name, result) {
		alert(`${name}: ${result}`);
		memberInfoPrint(name); // 멤버 정보 다시 출력
	});

}
// 명단 목록 전체에 면제권 부여 함수
function exemptionCouponPlusListAll() {
	let list = promptInput('명단을 입력하시오.');
	if (list === "") return; // 입력이 취소된 경우 함수 종료

	const members = list.replace(/\s+/g, " ").trim().split(" ");

	let amount = promptInput('부여할 면제권 수량을 입력하세요.');
	if (amount === null) return;

	let reason = promptInput('사유를 입력하세요.');
	if (reason === null) return;

	let results = [];
	let completedRequests = 0;

	for (let i = 0; i < members.length; i++) {
		callExemptionCouponPlus(members[i], amount, reason, function(name, result) {
			results.push(`${name}: ${result}`);
			completedRequests++;

			if (completedRequests === members.length) {
				alert("면제권 부여 결과:\n" + results.join("\n"));
			}
		});
	}
}

function exemptionCouponMinus() {
	let searchName = promptInput('이름을 입력하세요.');
	if (searchName === null) return; // 입력이 취소된 경우 함수 종료
	let member = memberInfo[searchName];

	if (member !== undefined) {
		memberInfoPrint(searchName);
		let reason = promptInput('차감사유를 입력하세요.');
		if (reason === null) return;
		var plusData = {
			name: searchName,
			reason: reason
		};
		$.ajax({
			url: memberManageUrl + "/exemptionCouponMinus",
			type: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
			},
			data: JSON.stringify(plusData),
			contentType: 'application/json; charset=utf-8',
			success: function(result) {
				memberInfo[searchName].exemptionCoupon = Number(memberInfo[searchName].exemptionCoupon) - 1;
				alert("면제권 차감 완료");
				memberInfoPrint(searchName);

			},
			error: function(xhr, status, error) {
				alert('면제권 차감 오류 - ' + xhr.responseText);
			}
		});
	} else {
		let confirmMessage = `'${searchName}'은(는) 명단에 존재하지 않습니다.`;
		alert(confirmMessage);
		return;
	}
}
function memberListPrintOrderByExemptionCoupon() {
	let printContent = "";
	// 객체를 값 배열로 변환하여 처리
	const valuesArray = Object.values(memberInfo).filter(person => person.exemptionCoupon >= 1);

	// exemptionCoupon 수를 기준으로 그룹화
	const groupByExemptionCoupon = valuesArray.reduce((acc, person) => {
		const key = person.exemptionCoupon;
		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(person.name);
		return acc;
	}, {});
	// 그룹화된 데이터를 exemptionCoupon 역순으로 정렬
	const sortedKeys = Object.keys(groupByExemptionCoupon).sort((a, b) => b - a);

	// 역순으로 정렬된 데이터 출력
	for (const key of sortedKeys) {
		printContent += `${key}장 \n${groupByExemptionCoupon[key].join(' ')}\n\n`;
	}

	$("#memberInfoBox").val(printContent);
	copyTextareaContent();
}

function generateVerificationCode() {
	let searchName = promptInput('이름을 입력하세요.');
	if (searchName === null) return; // 입력이 취소된 경우 함수 종료
	let member = memberInfo[searchName];

	if (member !== undefined) {
		$.ajax({
			url: memberManageUrl + "/verifyNumberGenerate?memberId="+member.member_id,
			type: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
			},
//			data: JSON.stringify({name: searchName}),
			contentType: 'application/json; charset=utf-8',
			success: function(result) {
				alert(result);
			},
			error: function(xhr, status, error) {
				alert('인증번호 발급 오류 : ' + xhr.responseText);
			}
		});
	} else {
		let confirmMessage = `'${searchName}'은(는) 명단에 존재하지 않습니다.`;
		alert(confirmMessage);
		return;
	}
}

/**
 * 출력물 복사
 */
function copyTextareaContent() {
    var textarea = $('#memberInfoBox');
    textarea.select();

    textarea[0].setSelectionRange(0, 99999);

    document.execCommand('copy');

    alert('클립보드에 복사되었습니다.');
}
function zeroPaymentListImport(){
	fetch("../api/attendance/zeroPaymentList")
		.then(response => response.json())
		.then(data => {
			zeroPaymentList = convertMapKeys(data);
		})
		.catch(error => console.error('회원 정보 가져오기 실패:', error));
}
function zeroPaymentSearch() {
	let searchName = promptInput('이름을 입력하세요.');
	if (searchName === null) return; // 입력이 취소된 경우 함수 종료

	let zeroPaymentMemeber = zeroPaymentList[searchName];

	if (zeroPaymentMemeber !== undefined) {
		let choice = confirm(searchName+'님이 대관비 납부를 완료했습니까?');
		if (choice) {
			fetch('../api/attendance/payment', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}` //백틱(`)으로 문자열 템플릿 사용
				},
				body: JSON.stringify(zeroPaymentMemeber)
			})
			.then(response => {
				if (response.ok) {
					alert(`처리되었습니다.`);
					delete(zeroPaymentList[searchName]);
				} else {
					throw new Error('처리 실패하였습니다.');
				}
			})
			.catch(error => {
				alert(`오류 발생: ${error.message}`);
			});
		}
		else
			alert('대관비 납부가 취소되었습니다.');
	} else {
		let confirmMessage = `'${searchName}'은(는) 명단에 존재하지 않습니다.`;
		alert(confirmMessage);
	}
}

function zeroPaymentListPrint() {
	$("#memberInfoBox").val(Object.keys(zeroPaymentList).sort().join('\n'));
//	$("#memberInfoBox").val(JSON.stringify(zeroPaymentList));
}

