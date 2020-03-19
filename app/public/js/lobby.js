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