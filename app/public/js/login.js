function setEvents(){
	let btnEntrar = document.getElementById('btn-entrar');
	btnEntrar.addEventListener('click', entrar);

	let inputName = document.getElementById('name');
	inputName.addEventListener('focus', hideError);

	removeFormEnter();
}

setEvents();

function entrar(event){
	let name = document.getElementById('name').value;
	if(name == ''){
		showError('O nome de jogador não pode ser vazio');
		return;
	}
	let form = document.getElementById('form-entrar');
	form.submit();
}

function showError(msg){
	let div = document.getElementById('error');
	error.style.display = 'block';
	error.innerHTML = msg;
}

function hideError(){
	let div = document.getElementById('error');
	error.style.display = 'none';
}

function removeFormEnter(){
	$('#form-entrar').on('keyup keypress', function(e) {
  		var keyCode = e.keyCode || e.which;
  		if (keyCode === 13) { 
    		e.preventDefault();
    		entrar(e);
    		return false;
  		}
	});
}
