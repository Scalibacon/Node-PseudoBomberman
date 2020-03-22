let socket, room, player;

function setEvents(){
	let tarolinho = document.getElementById('lobby-info-tarolinho');
	tarolinho.addEventListener('click', toggleInfo);
}

setEvents();

let infoOpened = false;
function toggleInfo(){
	let info = document.getElementById('lobby-info-container');
	let arrow = document.getElementById('tarolinho-arrow');
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

function connectToLobby(){
	socket = io("/lobby"); //localhost

	socket.on('updateLobby', function(data){
		updateLobby(data);
	});

	socket.on('startGame', function(data){
		let player = {
			name : document.getElementById('hidden-name').value,
			id : socket.id,
			room : data.idRoom	
		};
		
		localStorage.setItem("player", JSON.stringify(player));
		window.location.href = '/game';
	})
}

connectToLobby();

function updateLobby(rooms){
	let html = '<h2>Salas de jogo</h2>';
	let position = 0;

	for(let prop in rooms){
		let room = rooms[prop];

		html += '<div class="room-container">' +
					'<h4>Sala ' + prop + '</h4>' +
					'<div class="room-players-container">';

		for(let i = 1; i <= 4; i++){
			html += '<div class="room-player">' +
						'<img class="room-player-img empty">';
			if(room.players[i]){
				html +=	'<span class="room-player-name">' + room.players[i].name + '</span>';

				if(room.players[i].id === socket.id){
					position = i;
				}
			} else {
				html +=	'<span class="room-player-name empty"></span>';					
			}

			html += '</div>';
		}

		html += 	'</div>';

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

	let container = document.getElementById('lobby-center-container');
	container.innerHTML = html;

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

function enterRoom(room){
	let name = document.getElementById('hidden-name').value;

	let data = {
		room, 
		player : {name : name, id : socket.id}
	}

	socket.emit('enterRoom', data)
}

function exitRoom(room){
	let name = document.getElementById('hidden-name').value;

	let data = {
		room, 
		player : {name : name, id : socket.id}
	}

	let player = {name : name, id : socket.id}
	socket.emit('exitRoom', data);
}

function startGame(room){
	socket.emit('startGame', room);
}