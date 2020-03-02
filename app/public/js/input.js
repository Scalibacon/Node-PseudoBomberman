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
		console.log(`Notificando ${state.observers.length} observers`);
		state.observers.forEach(function(observer){
			observer(command);
		});
	}	

	document.addEventListener('keydown', handleKeyDown);

	function handleKeyDown(event){
		console.log(`Você pressionou ${event.key}`);
		var command = {
			player : "scali",
			keyPressed : event.key
		}
		notifyAll(command);
	}

	return {
		subscribe,
		unsubscribe
	}
}
