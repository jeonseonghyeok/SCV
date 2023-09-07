var memberInfo;
memberInfoImport();
const tierName = ['','브','실','골','에'];
const countOfMembers = [0,0];
let list = prompt('참석 명단을 입력하시오.');
if(list==null || list == "")
  document.write("입력 값이 필요.");
else
  GameSetting(list);

function memberInfoImport(){ 
	$.ajax({ 
		type:"GET",
		async : false,//동기방식으로 사용
		datatype:"JSON",
		url:"../memberInfoList",
		//url:"https://jeonseonghyeok.github.io/SCV/memberInfoList",
		success:function(result){
			memberInfo = JSON.parse(result);
		}
	});
}

function GameSetting(list){
   //given
   const result = Array.from(Array(3), () => Array(5).fill(""))
   const players = list.replace("  "," ").split(" ");
   var player;
  
   //when
   for(var i = 0; i < players.length;i++){
     //document.write(i+1,"번째 선수 :",players[i]);
     player = memberInfo[players[i]];
     //document.write(player);
     
     
     if(player == undefined || player.team == undefined || player.tier == undefined){       
	if(players[i].includes("🏸"))
		result[2][0] += (players[i] + " ");
	else
       		document.write(players[i]," : 정보가 없거나 누락 존재<br>");
}
     else{
       player.name = players[i];

       if(player.team == 2)//깍두기
         result[2][0] += (player.name + "(" + tierName[player.tier] + ") ");
       else{
         result[player.team][player.tier] += player.name+" ";
		 countOfMembers[player.team]++;
	   }
    
     }
  }
   
    resultPrint(result,players.length);

}



 function resultPrint(result,total){
   
   document.write("오류고가 팀전🏸<br>");
   document.write("<br>");
   
   document.write("깍두기 : "+ result[2][0]+"<br>");
   document.write("<br>");
   
   document.write("오류("+countOfMembers[0]+")<br>");
   document.write("<br>");
   for(var i=4;i>0;i--)
      document.write(tierName[i]+"("+i+") "+ result[0][i]+"<br>");
   document.write("<br>");
   
   document.write("고가("+countOfMembers[1]+")<br>");
   document.write("<br>");
   for(var i=4;i>0;i--)
      document.write(tierName[i]+"("+i+") "+ result[1][i]+"<br>");
   document.write("<br>");
   
   document.write("총원 ("+total+")"+"<br>");
   document.write("<br>");
   
   document.write("첫(2배), 막(3배)"+"<br>");
   document.write("<br>");
   for(var i = 1;i<=(total+1)/2;i++){
      document.write(i+"경기 VS<br>");
   }
   
   if(result[2][1] != "")
      document.write("예외 : " + result[2][1])

 }
