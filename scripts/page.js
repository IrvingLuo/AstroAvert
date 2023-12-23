// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================

// Div Handlers
let game_window;
let game_screen;
let onScreenAsteroid;
let curPortal;
let curShield;

// Difficulty Helpers
let astProjectileSpeed = 3;          // easy: 1, norm: 3, hard: 5
let spawnRate = 800;

// Game Object Helpers
let currentAsteroid = 1;
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;            //1218
let maxPersonPosY = 658;             // 658
let PERSON_SPEED = 5;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds

// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;

var player;

// counters
var portalIndex = 1;
var shieldIndex = 1;

//Globals
var Volume = 50;
var spawnIntervals = [];
var timeList = [];
var isShield = false;
var LEVEL = 1;
var LEVEL_multple = 1.2;
var DANGER = 20;
var SCORE = 0;
var isNew = true;
var gameDiff = 1;






// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
  // ====== Startup ====== 
  game_window = $('.game-window');
  game_screen = $("#actual_game");
  onScreenAsteroid = $('.curAstroid');
  landingPage = $("#landing-page");
  settingsPage = $("#settings")
  tutorial = $("#tutorial");
  endPage = $("#endPage");
  player = $("#player");

  // TODO: ADD MORE
  landingPage.show();
  settingsPage.hide();
  tutorial.hide();
  endPage.hide();
  game_screen.hide();
  $("#player").hide();
  $('asteroidSection').hide();
  $('#game_right_section').hide();
  game_window.show();

  //pre update
  preUpInterval = setInterval(preUpdateBoard,10);
  spawnIntervals.push(preUpInterval);

  
  
  

  


  
  
  // spawn(); // Example: Spawn an asteroid that travels from one border to another
   slideInterval = setInterval(slideBar,10);
   spawnIntervals.push(slideInterval);

});

// TODO: ADD YOUR FUNCTIONS HERE
function preUpdateBoard(){
  $("#danger_num").text(DANGER);
  $("#level_num").text(LEVEL);
  $("#score_num").text(SCORE);

}


function slideBar(){
  var slider = document.getElementById("mySlider");
  var output = document.getElementById("demo");
  output.innerHTML = slider.value;
  Volume = slider.value;
  console.log("current Volume: " + Volume);

  slider.oninput = function() {
    output.innerHTML = this.value;
  }
}

function clickSettings(){
  $("#settings").show();

}

function easy(){
  $("#easyButton").css("border-color","yellow");
  $("#normalButton").css("border-color","black");
  $("#hardButton").css("border-color","black");
  astProjectileSpeed = 1;
  spawnRate = 1000;
  DANGER = 10;
  gameDiff = 0;


}
function normal(){
  $("#easyButton").css("border-color","black");
  $("#normalButton").css("border-color","yellow");
  $("#hardButton").css("border-color","black");
  astProjectileSpeed = 3;
  spawnRate = 800;
  DANGER = 20;
  gameDiff = 1;
  
}
function hard(){
  $("#easyButton").css("border-color","black");
  $("#hardButton").css("border-color","yellow");
  $("#normalButton").css("border-color","black");
  astProjectileSpeed = 5;
  spawnRate = 600;
  DANGER = 30;
  gameDiff = 2;

}

function closeSettings(){
  $("#settings").hide();
  $("#landing-page").show();
  //update volume
  var slider = document.getElementById("mySlider");
  Volume = slider.value;
  //update diff
  setToDefault();


}

// Clicking play in Landing page
function landingPagePlay(){
  if(isNew){
    $("#actual_game").hide();
    $("#landing-page").hide();
    $("#settings").hide();
    $("#tutorial").show();
    isNew = false;
  }else{
    StartGame()
  }

  
}

//start
function StartGame(){
  $("#actual_game").show();
  $("#player").hide();
  $('asteroidSection').hide();
  $('#game_right_section').show();
  $("#getReadyPage").show();

  $("#landing-page").hide();
  $("#settings").hide();
  $("#tutorial").hide();
  $("#endPage").hide();

  
  timeN = setTimeout(Game,3000);
  timeList.push(tiimeN);
  



}
function Game(){
  $("#getReadyPage").hide();

  $("#player").show();
  $('asteroidSection').show();
  setMode();
  setPlayer();

  // set up portal
  setPortal();
  //set up shield
  setShield();

  //detect collisions
  console.log("Start to detect Collisions~")
  // collide with asteroid
  inter = setInterval(detectCollision,10);
  spawnIntervals.push(inter);
  // collide with shield
  shieldInterval = setInterval(detectShield,10);
  spawnIntervals.push(shieldInterval);
  // collide with portal
  portalInterval = setInterval(detectPortal,10);
  spawnIntervals.push(portalInterval);

  //update score board(danger and level)
 scoreBoardInterval = setInterval(upDateScoreBoard,10);
 spawnIntervals.push(scoreBoardInterval);
  // update score board
  scoreInterval = setInterval(updateScore,500);
  spawnIntervals.push(scoreInterval);
  



}

//update Score board
function upDateScoreBoard(){
  $("#danger_num").text(DANGER);
  $("#level_num").text(LEVEL);


}
function updateScore(){
  SCORE += 40;
  $("#score_num").text(SCORE);

}

function setMode(){
 interval = setInterval(spawn,spawnRate);
 spawnIntervals.push(interval);
}
function setPlayer(){
 interval = setInterval(moveRocket,10);
 spawnIntervals.push(interval);
}
//portal function
function createPortal(){
  var portalDivStr = "<div id='portal-" + portalIndex + "'><img src= './src/port.gif'></div>"
  $("#actual_game").append(portalDivStr);
  curPortal = $('#portal-'+ portalIndex);
  var curPortalImg = $('#portal-'+ portalIndex + ' img');
  portalIndex++;
  
  curPortal.css("position","absolute")
  curPortal.css("top",getRandomNumber(0,maxPersonPosY));
  curPortal.css("left",getRandomNumber(0,maxPersonPosX));
  curPortalImg.css("width","62px");
  curPortalImg.css("height","62px");

  timeRemovePortal =  setTimeout(removePortal,5000);
  timeList.push(timeRemovePortal);
 
}
function removePortal(){
  curPortal.remove();
}

function setPortal(){
 interval = setInterval(createPortal,20000);
 spawnIntervals.push(interval);

}
// create a shield function
function createShield(){
  var shieldDivStr = "<div id='shield-" + shieldIndex +"' class ='SHIELD'><img src='./src/shield.gif'></div>";
  $("#actual_game").append(shieldDivStr);
  curShield = $('#shield-'+ shieldIndex);
  var curShieldImg = $('#shield-'+ shieldIndex + ' img');
  shieldIndex++;

  curShield.css("position","absolute");
  curShield.css("top",getRandomNumber(0,maxPersonPosY));
  curShield.css("left",getRandomNumber(0,maxPersonPosX));
  curShieldImg.css("width","62px");
  curShieldImg.css("height","62px");

  timeRemoveShield =  setTimeout(removeShield,5000); // change back to 5000
  timeList.push(timeRemoveShield);
 

}
function removeShield(){
    curShield.remove();
    
  
}
function setShield(){
 interval = setInterval(createShield,15000);// change back to 15000
 spawnIntervals.push(interval);
  
}

// collision
function detectCollision(){
     $('[id^=a-]').each(function(){
    if ($(this).length === 0 || $("#player").length === 0) {
      return;
    }
    if(isColliding($(this),$("#player"))){
      
      
      if(isShield){
        isShield = false;
        document.getElementById("playerImg").src = "./src/player/player.gif";
        $(this).remove();

      }else{

        // without shield  
        collideWithoutShield();
      }
       


    }
  });
}

function detectShield(){
  $('[id^=shield-]').each(function(){
    if ($(this).length === 0 || $("#player").length === 0) {
      return;
    }
    if(isColliding($(this),$("#player"))){
      console.log("collect a SHIELD!!!!!!");
      isShield = true;
      
      // The gif of the player now has a shield on
      document.getElementById("playerImg").src = "./src/player/player_shielded.gif";
      console.log("GIF: " + document.getElementById("playerImg").src);
      //Play sound for when the player collects an item.
      var collectAudio = new Audio('./src/audio/collect.mp3');
      collectAudio.volume = Volume/100;
      collectAudio.play();
      $(this).remove();
       


    }
  });

}


// collide without shield
function collideWithoutShield(){
  document.getElementById("playerImg").src = "./src/player/player_touched.gif";
  //play audio
  var dieAudio = new Audio('./src/audio/die.mp3');
  dieAudio.volume = Volume/100;
  dieAudio.play();
  // Payer and asteroids stop moving
  spawnIntervals.forEach(function(item,index){
    clearInterval(item);
  });

  timeGoto = setTimeout(toGameOverPage,2000);
  timeList.push(timeGoto);
  
  

}

function detectPortal(){
  $('[id^=portal-]').each(function(){
    if ($(this).length === 0 || $("#player").length === 0) {
      return;
    }
    if(isColliding($(this),$("#player"))){
      touchPortal();
      $(this).remove();
    }


  });
}
function touchPortal(){
      LEVEL += 1;
      astProjectileSpeed *= LEVEL_multple;
      DANGER += 2;

      var collectAudio = new Audio('./src/audio/collect.mp3');
      collectAudio.volume = Volume/100;
      collectAudio.play();

}




// remove all asteroids <div>
function removeAll(){
  $('[id^=a-]').each(function(){
    $(this).remove();
    
  });
  $('[id^=shield-]').each(function(){
    $(this).remove();
    
  });
  $('[id^=portal-]').each(function(){
    $(this).remove();
    
  });

}
// set player to new position
function resetPlayer(){
  $("#player").css("top",getRandomNumber(0,maxPersonPosY));
  $("#player").css("left",getRandomNumber(0,maxPersonPosX));
}

// transition to the "Game over page"
function toGameOverPage(){

  $("#actual_game").hide();
  $("#landing-page").hide();
  $("#settings").hide();
  $("#tutorial").hide();
  $("#endPage").show();
  $("#endHeader").show();
  // stop all and clear all asteroids
  removeAll();
  resetPlayer();

  //post player score
  $("#finalScore").text(SCORE);

  // set score board to the default
  setToDefault();
  // clear all setTime
  timeList.forEach(function(item,index){
    clearTimeout(item);
  });



}


function setToDefault(){
  LEVEL = 1;
  SCORE = 0;
  if(gameDiff === 0){
    DANGER = 10;
    astProjectileSpeed = 1;
    spawnRate = 1000;
  }
  if(gameDiff === 1){
    DANGER = 20;
    astProjectileSpeed = 3;
    spawnRate = 800;
  
  }
  if(gameDiff === 2){
    DANGER = 30;
    astProjectileSpeed = 5;
    spawnRate = 600;
  
  }

  $("#danger_num").text(DANGER);
  $("#level_num").text(LEVEL);
  $("#score_num").text(SCORE);



}

// In end page, startover
function startOver(){
  $("#actual_game").hide();
  $("#landing-page").show();
  $("#settings").hide();
  $("#tutorial").hide();
  $("#endPage").hide();
  
}






// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}
// 
function moveRocket(){
  if(LEFT == true){
    if(isShield){
      document.getElementById("playerImg").src = "./src/player/player_shielded_left.gif";
    }else{
      document.getElementById("playerImg").src = "./src/player/player_left.gif";
    }
    console.log("moving left");
    var newPos = parseInt(player.css("left")) - PERSON_SPEED;
    if(newPos < 0){
      newPos = 0;
    }
    player.css("left",newPos);
  }
  if(UP == true){
    if(isShield){
      document.getElementById("playerImg").src = "./src/player/player_shielded_up.gif";
    }else{
      document.getElementById("playerImg").src = "./src/player/player_up.gif";
    }
   
    console.log("moving UP");
    var newPos = parseInt(player.css("top")) - PERSON_SPEED;
    if(newPos < 0){
      newPos = 0;
    }
    player.css("top",newPos);
  }
  if(DOWN == true){
    if(isShield){
      document.getElementById("playerImg").src = "./src/player/player_shielded_down.gif";
    }else{
      document.getElementById("playerImg").src = "./src/player/player_down.gif";
    }
   
    console.log("moving down");
    var newPos = parseInt(player.css("top")) +  PERSON_SPEED;
    if(newPos > maxPersonPosY){
      newPos = maxPersonPosY;
    }
    player.css("top",newPos);
  }
  if(RIGHT == true){
    if(isShield){
      document.getElementById("playerImg").src = "./src/player/player_shielded_right.gif";
    }else{
      document.getElementById("playerImg").src = "./src/player/player_right.gif";
    }

    
    console.log("moving right");
    var newPos = parseInt(player.css("left")) + PERSON_SPEED;
    if(newPos > maxPersonPosX){
      newPos = maxPersonPosX;
    }
    player.css("left",newPos);
  }

  if(!LEFT && !UP && !DOWN && !RIGHT){
    if(isShield){
      document.getElementById("playerImg").src = "./src/player/player_shielded.gif";
    }else{
      document.getElementById("playerImg").src = "./src/player/player.gif";
    }
    

  }
  
}









// Starter Code for randomly generating and moving an asteroid on screen
// Feel free to use and add additional methods to this class
class Asteroid {
  // constructs an Asteroid object
  constructor() {
      /*------------------------Public Member Variables------------------------*/
      // create a new Asteroid div and append it to DOM so it can be modified later
      let objectString = "<div id = 'a-" + currentAsteroid + "' class = 'curAstroid' > <img src = 'src/asteroid.png'/></div>";
      onScreenAsteroid.append(objectString);
      // select id of this Asteroid
      this.id = $('#a-' + currentAsteroid);
      currentAsteroid++; // ensure each Asteroid has its own id
      // current x, y position of this Asteroid
      this.cur_x = 0; // number of pixels from right
      this.cur_y = 0; // number of pixels from top

      /*------------------------Private Member Variables------------------------*/
      // member variables for how to move the Asteroid
      this.x_dest = 0;
      this.y_dest = 0;
      // member variables indicating when the Asteroid has reached the boarder
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      // spawn an Asteroid at a random location on a random side of the board
      this.#spawnAsteroid();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Asteroid has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
      if(this.hide_axis == 'x'){
          if(this.sign_of_switch == 'pos'){
              if(this.cur_x > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_x < this.hide_after){
                  return true;
              }          
          }
      }
      else {
          if(this.sign_of_switch == 'pos'){
              if(this.cur_y > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_y < this.hide_after){
                  return true;
              }          
          }
      }
      return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Asteroid 1 unit in its designated direction
  updatePosition() {
      // ensures all asteroids travel at current level's speed
      this.cur_y += this.y_dest * astProjectileSpeed;
      this.cur_x += this.x_dest * astProjectileSpeed;
      // update asteroid's css position
      this.id.css('top', this.cur_y);
      this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Asteroid
  //          all asteroids travel at the same speed
  #spawnAsteroid() {
      // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
      let x = getRandomNumber(0, 1280);
      let y = getRandomNumber(0, 720);
      let floor = 784;
      let ceiling = -64;
      let left = 1344;
      let right = -64;
      let major_axis = Math.floor(getRandomNumber(0, 2));
      let minor_aix =  Math.floor(getRandomNumber(0, 2));
      let num_ticks;

      if(major_axis == 0 && minor_aix == 0){
          this.cur_y = floor;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 0 && minor_aix == 1){
          this.cur_y = ceiling;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = 784;
          this.sign_of_switch = 'pos';
      }
      if(major_axis == 1 && minor_aix == 0) {
          this.cur_y = y;
          this.cur_x = left;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = -astProjectileSpeed - getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 1 && minor_aix == 1){
          this.cur_y = y;
          this.cur_x = right;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / astProjectileSpeed);

          this.x_dest = astProjectileSpeed + getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = 1344;
          this.sign_of_switch = 'pos';
      }
      // show this Asteroid's initial position on screen
      this.id.css("top", this.cur_y);
      this.id.css("right", this.cur_x);
      // normalize the speed s.t. all Asteroids travel at the same speed
      let speed = Math.sqrt((this.x_dest)*(this.x_dest) + (this.y_dest)*(this.y_dest));
      this.x_dest = this.x_dest / speed;
      this.y_dest = this.y_dest / speed;
  }
}

// Spawns an asteroid travelling from one border to another
function spawn() {
  let asteroid = new Asteroid();
  setTimeout(spawn_helper(asteroid), 0);
}

function spawn_helper(asteroid) {
  let astermovement = setInterval(function () {
    // update asteroid position on screen
    asteroid.updatePosition();

    // determine whether asteroid has reached its end position, i.e., outside the game border
    if (asteroid.hasReachedEnd()) {
      asteroid.id.remove();
      clearInterval(astermovement);
    }
  }, AST_OBJECT_REFRESH_RATE);
  // push to spawnIntervals
  spawnIntervals.push(astermovement);
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}
