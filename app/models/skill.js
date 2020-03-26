function SkillModel(state){
    this.state = state;

    this.setState = function(state){
		this.state = state;
    }

    this.setSkill = function(game_player, skillId){
        let skill = {};

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
                skill.name = 'fectoplasmose';
                skill.cooldown = 60 * 1000;
                skill.duration = 5 * 1000;
                break;
            case 3:
                skill.name = 'cronoquebra';
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
            console.log(`${player.name} usou furtividade`) 
            player.skill.using = true;
            player.skill.time_remaining = player.skill.duration;
        }
    }

    this["2"] = function(player){
        console.log(`${player.name} usou ectoplasmose`)
    }

    this["3"] = function(player){
        console.log(`${player.name} usou cronoquebra`)
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
                }
            } else 
            if(skill.wait > 0){
                skill.wait -= time;
            }                      
        }
    }
}

module.exports = function(state){
    return new SkillModel(state);
}