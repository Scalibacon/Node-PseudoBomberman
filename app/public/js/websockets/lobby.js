let socket;
let observers = [];

export {socket};

export function subscribe(observer){
    observers.push(observer);
}

function notifyAll(data){
    observers.forEach(function(observer){
        observer(data);
    });
}

export function connectToLobby(){
	socket = io("/lobby"); //localhost

	socket.on('connect', function(){
		let name = document.getElementById('hidden-name').value;
	
		let date = new Date();
		let time = date.getTime();

		let player = {
			name : name,
			id : socket.id, 
			unikey : time
		}

		localStorage.setItem("player", JSON.stringify(player));
	});

	socket.on('updateLobby', function(data){
		notifyAll(data);
	});

	socket.on('enterRoom', function(room){
		localStorage.setItem('room', room);
	});

	socket.on('startGame', function(data){
		localStorage.setItem("room", JSON.stringify(data.idRoom));
		window.location.href = '/game';
	})
}

export function enterRoom(room){
	let player = JSON.parse(localStorage.getItem("player"));

	let data = {
		room, 
		player
	}

	socket.emit('enterRoom', data);
}

export function exitRoom(room){
	let player = JSON.parse(localStorage.getItem('player'));

	let data = {
		room, 
		player
	}

	socket.emit('exitRoom', data);
}

export function startGame(room){
	socket.emit('startGame', room);
}