let socket;

function setEvents(){
	let tarolinho = document.getElementById('lobby-info-tarolinho');
	tarolinho.addEventListener('click', toggleInfo)
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
	})
}

connectToLobby();

function updateLobby(rooms){
	let html = '<h2>Salas de jogo</h2>';

	for(let prop in rooms){
		let room = rooms[prop];

		html += '<div class="room-container">' +
					'<h4>Sala ' + prop + '</h4>' +
					'<div class="room-players-container">';

		for(let i = 1; i <= 4; i++){
			html += '<div class="room-player">' +
						'<img class="room-player-img empty">';
			if(room['player'+i]){
				html +=	'<span class="room-player-name">' + room['player'+i].name + '</span>';
			} else {
				html +=	'<span class="room-player-name empty"></span>';					
			}

			html += '</div>';
		}

		html += 	'</div>' +
					'<button type="button" onclick="enterRoom(' + prop + ')" class="btn btn-primary btn-room-enter">Entrar</button>' +
				'</div>';
	}	

	let container = document.getElementById('lobby-center-container');
	container.innerHTML = html;
}

function enterRoom(room){
	let name = document.getElementById('hidden-name').value;

	let data = {
		room, 
		player : {name : name}
	}

	socket.emit('enterRoom', data)
}