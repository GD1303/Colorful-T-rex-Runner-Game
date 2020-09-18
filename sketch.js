var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex , trex_running, trex_collided, trex_jumping;
var ground, groundImage, invisible_ground;
var cloudImage, cloudsGroup;
var obstacle_1Image, obstacle_2Image, obstacle_3Image, obstacle_4Image, obstacle_5Image, obstacle_6Image, obstaclesGroup;
var restart, restartImage;
var game_over, game_overImage;

var score;

function preload(){
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud.png");
  
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  
  trex_collided = loadImage("trex_collided.png");
  
  trex_jumping = loadImage("trex_1.png")
  
  obstacle_1Image = loadImage("obstacle_1.png");
  obstacle_2Image = loadImage("obstacle_2.png");
  obstacle_3Image = loadImage("obstacle_3.png");
  obstacle_4Image = loadImage("obstacle_4.png");
  obstacle_5Image = loadImage("obstacle_5.png");
  obstacle_6Image = loadImage("obstacle_6.png");
  
  restartImage = loadImage("restart.png");
  game_overImage = loadImage("gameover.png");
 }

function setup() {
  //600, 200
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(width/12,height/1.05,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("jumping", trex_jumping);

  trex.scale = 0.5;
  
  ground = createSprite(width/2,trex.y - 10,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(game_overImage);
  
  restart = createSprite(width/2,height/2 + 60);
  restart.addImage(restartImage);
  
  invisibleGround = createSprite(width/2,height/1.05,width,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background("skyblue");
  text("Score: "+ score, width/1.2,height/4);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if((touches.length > 0 || keyDown("space")) && trex.isTouching(ground)) {
      trex.velocityY = -12;
      trex.addImage(trex_jumping);
    }
    //console.log(trex.y)
    //console.log(windowWidth)
    //console.log(invisibleGround.y)
    
    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      
    }
  }
   else if (gameState === END) {
     gameOver.visible = true;
     restart.visible = true;
     
     trex.changeAnimation("collided", trex_collided);
     
     ground.velocityX = 0;
     trex.velocityY = 0 
     
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
     if(mousePressedOver(restart)) {
       reset();
     }
   }
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,ground.y - 10,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle_1Image);
              break;
      case 2: obstacle.addImage(obstacle_2Image);
              break;
      case 3: obstacle.addImage(obstacle_3Image);
              break;
      case 4: obstacle.addImage(obstacle_4Image);
              break;
      case 5: obstacle.addImage(obstacle_5Image);
              break;
      case 6: obstacle.addImage(obstacle_6Image);
              break;
      default: break;
    }
             
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height/1.6,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}