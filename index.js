// *** canvas ***
// init canvas
const canvas = document.getElementById('canvas1');
const c = canvas.getContext('2d'); 
// canvas parameters
canvas.width = 1024;
canvas.height = 576;
// canvas background
c.fillRect(0,0,canvas.width,canvas.height);

// gravity
const gravity = 0.7;

//create background sprite
const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'
})
//create shop sprite
const shop = new Sprite({
    position:{
        x:600,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale : 2.75,
    framesMax : 6
})

// create player
const player = new Fighter({
    
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:0,
    },  
    offset:{
        x:0,
        y:0,
    },
    imageSrc:'./img/samuraiMack/Idle.png',
    framesMax : 8,
    scale:2.5,
    offset:{
        x:215,
        y:157
    },    
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4,
        },
        death:{
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6,
        }
    },    
    attackBox:{
        offset:{
            x:100,
            y:50
        },
        width:160,
        height:50
    }            
}
)
console.log(player)

// create enemy 
const enemy = new Fighter({
    
    position:{
        x:400,
        y:100
    },
    velocity:{
        x:0,
        y:0,
    },
    offset:{
        x:-50,
        y:0,
    },
    color: 'blue',
    imageSrc:'./img/kenji/Idle.png',
    framesMax : 4,
    scale:2.5,
    offset:{
        x:215,
        y:167
    },    
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit:{
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death:{
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        }
    },
    attackBox:{
        offset:{
            x:-170,
            y:50
        },
        width:170,
        height:50
    }          
}
)


// an object that stores the state of a key (pressed or not)
const keys = {
    //player
    a:{
        pressed:false
    },
    d:{
        pressed:false
    },
    w:{
        pressed:false
    },
    //enemy
    ArrowRight:{
        pressed:false
    },
    ArrowLeft:{
        pressed:false
    },
    ArRowUp:{
        pressed:false
    }
}

// use of the timer function from Utilities.js
decreaseTimer()

// *** animation function ***
function animate(){ 
    window.requestAnimationFrame(animate);   
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height); // delete all sprites by drawing a black screen (refresh)

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0, canvas.width,canvas.height)

    player.update();
    enemy.update();

    player.velocity.x = 0; //resets the velocity at every frame 
    enemy.velocity.x = 0; //resets the velocity at every frame

    // player movment        
    // run       
    if (keys.a.pressed && player.lastKey == 'a'){ // listenning (using event listener) for a pressed key to set velocity
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') { // same ^^
        player.velocity.x = 5;
        player.switchSprite('run');
    } else { // if player sprite is not moving - switch back to idle animation image
        player.switchSprite('idle'); // default player sprite image
    }
    //jump
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0){ //fall
        player.switchSprite('fall')        
    }

    // enemy movement   
    //run 
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'a'){ // listenning (using event listener) for a pressed key to set velocity
        enemy.velocity.x = -5;        
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'd') { // same ^^
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    //jump
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0){ //fall
        enemy.switchSprite('fall')        
    }


    // collision between PLAYER attack box and sprite of the ENEMY
    if (rectangularCollision({recntangle1:player,rectangle2:enemy}) && //detect for collision
    player.isAtacking && // the sprite is atacking
    player.framesCurrent == 4 // only subtract health in the frame when the swords extands
    ){
        enemy.takeHit(20); // player's attacks are twice as slower - so to counter balance i made them twice as stronger
        player.isAtacking = false;
        
        //document.querySelector("#enemyHealth").style.width = enemy.health + '%';   //old health bar decrease method (no animation)
        gsap.to('#enemyHealth',{
           width: enemy.health + '%'
        })    
    }
    // if player misses
    if (player.isAtacking && player.framesCurrent == 4){
       player.isAtacking = false;
    }

    // collision between ENEMY attack box and sprite of the PLAYER
    if (rectangularCollision({recntangle1:enemy,rectangle2:player}) && //detect for collision
    enemy.isAtacking && // the sprite is atacking
    enemy.framesCurrent == 2 // only subtract health in the frame when the swords extands
    ){
        player.takeHit(10)
        enemy.isAtacking = false;       
        document.querySelector("#playerHealth").style.width = player.health + '%'; 
        gsap.to('#playerHealth',{
            width: player.health + '%'
         })            
    }
    // if player misses
    if (enemy.isAtacking && enemy.framesCurrent == 2){
        enemy.isAtacking = false;
     }

    // end gamee based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player,enemy,timerId})
    }
}
// call animation function
animate();

// *** move charters with event listeners ***
// listen for keydown events - for movment and attack
window.addEventListener('keydown', ( event) => {
    //player
    if (!player.dead){ // if the player's not dead
        switch (event.key){        
            case 'D':
            case 'd':
            //case 'ג': //hebrew
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'A':
            case 'a':
            //case 'ש': //hebrew
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'W':
            case 'w':
            //case '\'': //hebrew
                player.velocity.y = -20;
                break;  
            case ' ': //space key
                player.attack()          
                break;            
        }    
    
    }
    
    //enemy
    if (!enemy.dead){
        switch (event.key){        
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'd';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'a';
                break;
            case 'ArrowUp':
                enemy.velocity.y = -20;
                break;
            case 'Enter':            
                enemy.attack();
                break;
                
        }    
    }    
})
// listen for keyup events for registration of keyup of a movment key 
window.addEventListener('keyup', ( event) => {
    switch (event.key){
        //player
        case 'D':
        case 'd':
        //case 'ג': //hebrew
            keys.d.pressed = false;
            break;
        case 'A':
        case 'a':
        //case 'ש': //hebrew
            keys.a.pressed = false;
            break;  
        //enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;      
    }    
})


