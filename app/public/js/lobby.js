import  {subscribe, connectToLobby, enterRoom, exitRoom, startGame, socket } from './websockets/lobby.js';

$(document).ready(function() {
	createSkills();
	localStorage.setItem("skill", 0);

	setEvents();
	subscribe(updateLobby);
	connectToLobby();
});

function createSkills(){
	let html = '<p class="lobby-info-title">Habilidades</p>';
	for(let i = 0; i <= 5; i++){
		html += `<div class='lobby-info-skill skill${i}' id='${i}'></div>`
	}
	document.getElementById('skills-container').innerHTML = html;
}

function setEvents(){
	let tarolinho = document.getElementById('arrow-box');
	tarolinho.addEventListener('click', toggleInfo);

	let skills = document.getElementsByClassName("lobby-info-skill");
	Array.from(skills).forEach(function(skill) {
     	skill.addEventListener('click', function(){
      		changeSkill(skill.id);
      	});
    });
}

let infoOpened = false;
function toggleInfo(){
	let info = document.getElementById('info-container');
	let arrow = document.getElementById('toggle-arrow');
	if(infoOpened){
		info.style.left = '-150px';
		//arrow.style.transform = 'scaleX(1)';
		arrow.style.transform =  'rotate(0deg)';
	} else {		
		info.style.left = '0px';
		//arrow.style.transform = 'scaleX(-1)';
		arrow.style.transform =  'rotate(180deg)';		
	}
	infoOpened = !infoOpened;	
}

function updateLobby(rooms){
	let html = '<h2>Salas de jogo</h2>';
	let position = 0;	

	for(let prop in rooms){
		let room = rooms[prop];

		html += '<div class="room-container">' +
					'<h4>Sala ' + prop + '</h4>' +
					'<div class="room-players-container">';
		for(let i = 1; i <= 4; i++){			
			html += 	'<div class="room-player">' +
							'<img class="room-player-img empty">';
			if(room.players[i]){
				html +=		'<span class="room-player-name">' + room.players[i].name + '</span>';
				if(room.players[i].id === socket.id){
					position = i;
				}
			} else {
				html +=		'<span class="room-player-name empty"></span>';					
			}
			html += 	'</div>';
		}
		html += 	'</div>';

		if(room.state == 'playing'){
			html +=		'<button type="button" id="' + prop + '" class="btn btn-danger btn-room-exit">Em curso</button>';
		} else 
		if(position > 0){
			html +=		'<button type="button" id="' + prop + '" class="btn btn-danger btn-room-exit">Sair</button>';
			if(position == 1){
				html +=	'<button type="button" id="' + prop + '" class="btn btn-success btn-room-start">Iniciar</button>';
			}
		} else {
			html +=		'<button type="button" id="' + prop + '" class="btn btn-primary btn-room-enter">Entrar</button>';
		}			
		html +=	'</div>';
		position = 0;
	}

	let container = document.getElementById('rooms-container');
	container.innerHTML = html;

	setRoomButtonsEvents();
}

function setRoomButtonsEvents(){
	let btnEnter = document.getElementsByClassName("btn-room-enter");
	Array.from(btnEnter).forEach(function(btn) {
     	btn.addEventListener('click', function(){
      		enterRoom(btn.id);
      	});
    });

    let btnExit = document.getElementsByClassName("btn-room-exit");
	Array.from(btnExit).forEach(function(btn) {
     	btn.addEventListener('click', function(){
      		exitRoom(btn.id);
      	});
    });

    let btnStart = document.getElementsByClassName("btn-room-start");
	Array.from(btnStart).forEach(function(btn) {
     	btn.addEventListener('click', function(){
      		startGame(btn.id);
      	});
    });
}

function changeSkill(skill){
	$('.lobby-info-skill').css({border : 'solid 1px rgba(200,200,200,0.75)'});
	$('.skill'+skill).css({border : 'solid 2px rgb(0,100,255,1)'});

	localStorage.setItem('skill', skill);	
}