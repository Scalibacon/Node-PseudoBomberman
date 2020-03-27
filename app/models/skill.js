function SkillModel(state){
    this.state = state;

    this.setState = function(state){
		this.state = state;
    }

    this.setSkill = function(game_player, skillId){
        let skill = {};

        if(skillId === 0){
            skillId = Math.floor(Math.random() * 3 + 1);
        }

        skill.id = skillId;
        skill.time_remaining = 0;
        skill.using = false;
        skill.wait = 0;
        skill.spot = [game_player.y, game_player.x];

        switch(skillId){
            case 1:
                skill.name = 'furtividade';
                skill.cooldown = 45 * 1000;
                skill.duration = 10 * 1000;
                break;
            case 2:
                skill.name = 'ectoplasmose';
                skill.cooldown = 60 * 1000;
                skill.duration = 5 * 1000;
                break;
            case 3:
                skill.name = 'teleporte';
                skill.cooldown = 60 * 1000;
                skill.duration = 1 * 1000;
                break;
            default:
                skill.name = '???';
                skill.cooldown = 60 * 1000;
                skill.duration = 1 * 1000;
               break;
        }        

        game_player.skill = skill;
    }
    
    this.useSkill = function(player){
        if(this[player.skill.id]){
            this[player.skill.id](player);            
        }
    }

    this["1"] = function(player){  
        if(player.skill.wait <= 0 && !player.skill.using){
            console.log(`${player.name} usou ${player.skill.name}`) 
            player.skill.using = true;
            player.skill.time_remaining = player.skill.duration;
        }
    }

    this["2"] = function(player){
        if(player.skill.wait <= 0 && !player.skill.using){
            console.log(`${player.name} usou ${player.skill.name}`) 
            player.skill.using = true;
            player.skill.time_remaining = player.skill.duration;
        }
    }

    this["3"] = function(player){
        if(player.skill.wait <= 0 && !player.skill.using){
            console.log(`${player.name} usou ${player.skill.name}`) 
            player.y = player.skill.spot[0];
            player.x = player.skill.spot[1];
            player.skill.wait = player.skill.cooldown;
        }
    }

    this.updatePlayersSkills = function(time){
        for(let i in this.state.players){
            let player = this.state.players[i];
            let skill = player.skill;

            if(skill.time_remaining > 0){
                skill.time_remaining -= time;

                if(skill.time_remaining <= 0){
                    console.log(`${player.skill.name} de ${player.name} acabou`);
                    skill.using = false;
                    skill.wait = skill.cooldown;

                    if(skill.id === 2){
                        this.realocatePlayer(player);
                    }
                }
            } else 
            if(skill.wait > 0){
                skill.wait -= time;
            }                      
        }
    },

    this.realocatePlayer = function(player){
        let x = player.x;
        let y = player.y;
        
        //vê baixo, cima, direita, esquerda (sem diagonais :/)
        for(let i = 0; i < 17; i++){
            if(y + i > 0 && y + i < 11 && this.state.board[y + i][x].obj === 'empty'){
                player.y = y + i;
                return;
            } 

            if(y - i > 0 && y - i < 11 && this.state.board[y - i][x].obj === 'empty'){
                player.y = y - i;
                return;
            } 

            if(x + i > 0 && x + i < 17 && this.state.board[y][x + i].obj === 'empty'){
                player.x = x + i;
                return;
            }

            if(x - i > 0 && x - i < 17 && this.state.board[y][x - i].obj === 'empty'){
                player.x = x - i;
                return;
            }
        }

            // y + 1; y + 1 e x + 1;
            // x + 1; y + 1 e x - 1;
            // y - 1; y - 1 e x - 1;
            // x - 1; y + 1 e x - 1;
    }
}

module.exports = function(state){
    return new SkillModel(state);
}