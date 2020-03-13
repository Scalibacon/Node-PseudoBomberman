let holdingKey = {};

export function createKeyboardListener(){
	var state = {
		observers : []
	}

	function subscribe(observer){
		state.observers.push(observer);
	}

	function unsubscribe(remove) {
		state.observers = state.observers.filter(function(subscriber){
			subscriber !== remove
		});
	}

	function notifyAll(command){
		//console.log(`Notificando ${state.observers.length} observers`);
		state.observers.forEach(function(observer){
			observer(command);
		});
	}	

	document.addEventListener('keydown', handleKeyDown);

	function handleKeyDown(event){
		holdingKey[event.keyCode] = event;
	}

	document.addEventListener('keyup', handleKeyUp);

	function handleKeyUp(event){
		delete holdingKey[event.keyCode];
	}

	function checkHoldingKeys(){
		Object.keys(holdingKey).forEach(function(key, index){
			//console.log(`Você pressionou ${holdingKey[key].key}`);
			var command = {
				keyPressed : holdingKey[key].key
			}
			notifyAll(command);
		});
	}

	setInterval(checkHoldingKeys, 20);

	return {
		subscribe,
		unsubscribe
	}
}
