
// a fucntion that detects a collision between two rectangles 
// (the attackBox of the player, and the rectangle of the other Sprite)
//this functions is used in the animation function
function rectangularCollision({recntangle1,rectangle2}){
    return(
    //when attackBox facing to the right: the edge of the atackbox is touching (or inside) of the left side of the other sprite
    //when attackBox facing to the left: the sprite right side is not outside the left bound of the other sprite
    (recntangle1.attackBox.position.x + recntangle1.attackBox.width) >= rectangle2.position.x &&  
    //when attackBox facing to the right: the sprite left side is not outside the right bound of the other sprite
    //when attackBox facing to the left: the edge of the atackbox is touching (or inside) of the right side of the other sprite
    recntangle1.attackBox.position.x <= (rectangle2.position.x + rectangle2.width) &&  
    //the bottom of the atackbox is not above the `other sprite's top
    (recntangle1.attackBox.position.y + recntangle1.attackBox.height) >= rectangle2.position.y &&  
    //the top of the atackbox is not bellow the other sprites bottom
    recntangle1.attackBox.position.y <= (rectangle2.position.y + rectangle2.height)  
    )
}

// a function that determines the winner (used in: timer function, animate function)
function determineWinner({player,enemy,timerId}){
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'; // makes the text visible
    if(player.health == enemy.health)
        document.querySelector('#displayText').innerHTML = 'Tie';                
    else if(player.health > enemy.health)
        document.querySelector('#displayText').innerHTML = 'Player 1 wins';               
    else if(player.health < enemy.health)
        document.querySelector('#displayText').innerHTML = 'Player 2 wins';     
}

//timer function
let timer = 60
let timerId 
function decreaseTimer(){    
    if (timer>0){
        timerId = setTimeout(decreaseTimer,1000)        
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if(timer == 0){        
        determineWinner({player,enemy,timerId});
    }
    
}