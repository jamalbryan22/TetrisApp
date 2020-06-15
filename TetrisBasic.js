let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let winOrLose = "Playing";

let coordinateArray = [... Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));
let curTetromino = [[1,0], [0,1], [1,1],[2,1]];

let tetrominos = [];
let terominosColor =['purple','cyan','blue','yellow','orange','green','red'];
let currentTetrominoColor;

let gameBoardArray = [... Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let stoppedShapeArray = [... Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let DIRECTION ={
  IDLE: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

let direction;

class Coordinates{
  constructor(x,y){
    this.x=x;
    this.y=y;
  }
}

document.addEventListener('DOMContentLoaded',setUpCanvas);

function createCoorArray(){
  let i = 0;
  let j = 0;
  for(let y = 9; y <= 446; y += 23){
    for(let x = 11; x <= 264; x += 23){
      coordinateArray[i][j] = new Coordinates(x,y);
      i++;
    }
    j++;
    i = 0;
  }
}

function setUpCanvas(){
  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = 936;
  canvas.height = 956;

  ctx.scale(2,2);

  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(8,8,280,462);

  tetrisLogo = new Image(256,256);
  tetrisLogo.onload = drawTetrisLogo;
  tetrisLogo.src = "tetrislogo2.png";

  ctx.fillStyle = 'black';
  ctx.font = '21px Arial';
  ctx.fillText("Score", 300, 98);
  ctx.strokeRect(300,107,161,24);

  ctx.fillText(score.toString(),310,127);
  ctx.fillText("Level",300,157);
  ctx.strokeRect(300,171,161,24);
  ctx.fillText(level.toString(),310,190);

  ctx.fillText("Win/Lose",300,221);
  ctx.fillText(winOrLose,310,261);
  ctx.strokeRect(300,232,161,95)
  ctx.fillText("Controls", 300,354);
  ctx.strokeRect(300,366,161,104);

  ctx.font = "19px Arial";
  ctx.fillText("A: Move Left",310,388);
  ctx.fillText("D: Move Right",310,413);
  ctx.fillText("S: Move Down",310,438);
  ctx.fillText("E: Rotate Right",310,463);

  document.addEventListener('keydown', handleKeyPress);
  createTetrominos();
  createTetromino();
  
  createCoorArray();
  drawTetromino();
}

function drawTetrisLogo(){
  ctx.drawImage(tetrisLogo,300,-10,161,90);
}

function drawTetromino(){
  for(let i = 0; i < curTetromino.length; i++){
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = currentTetrominoColor;
    ctx.fillRect(coorX,coorY,21,21);
  }
}

function handleKeyPress(key){

  if(winOrLose != "Game Over"){
    //a
    if(key.keyCode === 65){
      direction = DIRECTION.LEFT;
      if(!hittingTheWall() && !checkForHorizontalCollision()){
      deleteTetromino();
      startX--;
      drawTetromino();
      }
      //d
    }else if(key.keyCode === 68){
      direction = DIRECTION.RIGHT;
      if(!hittingTheWall() && !checkForHorizontalCollision()){
      deleteTetromino();
      startX++;
      drawTetromino();
      }
    }else if(key.keyCode === 83){
      moveTetrominoDown();
    }else if(key.keyCode === 69){
      rotateTetromino(); 
    }
  }
}

function moveTetrominoDown(){
  direction = DIRECTION.DOWN;
  if(!checkForVerticalCollision()){
    deleteTetromino();
    startY++;
    drawTetromino();
  }   
}

window.setInterval(function(){
  if(winOrLose != "Game Over"){
    moveTetrominoDown();
  }
},1000);


function deleteTetromino(){
  for(let i = 0; i < curTetromino.length; i++){
    let x = curTetromino[i][0] + startX;
    let y = curTetromino[i][1] + startY;
    gameBoardArray[x][y] = 0;
    let coorX = coordinateArray[x][y].x;
    let coorY = coordinateArray[x][y].y;
    ctx.fillStyle = 'white';
    ctx.fillRect(coorX,coorY,21,21);
  }
}

function createTetrominos (){
     // Push T 
     tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
     // Push I
     tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
     // Push J
     tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
     // Push Square
     tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
     // Push L
     tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
     // Push S
     tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
     // Push Z
     tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function createTetromino(){
  let randmonTeromino = Math.floor(Math.random() * tetrominos.length);
  curTetromino = tetrominos[randmonTeromino];
  currentTetrominoColor = terominosColor[randmonTeromino];
}

function hittingTheWall(){
  for(let i = 0; i < curTetromino.length; i++){
    let newX = curTetromino[i][0] + startX;
    if(newX <= 0 && direction == DIRECTION.LEFT){
      return true;
    }else if(newX >= 11 && direction == DIRECTION.RIGHT)
    return true;
  }
  return false;
}

function checkForVerticalCollision(){
  let tetrominoCopy = curTetromino;
  let collision = false;
  for(let i = 0; i < curTetromino.length; i++){
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if(direction === DIRECTION.DOWN){
      y++;
    }
    //if(gameBoardArray[x][y+1]===1){
      if(typeof stoppedShapeArray[x][y+1]==='string'){
        deleteTetromino();
        startY++;
        drawTetromino();
        collision = true;
        break;
      }
      if(y >=20){
        collision = true;
        break;
      }
    }
    if(collision){
      if(startY <= 2){
        winOrLose = "Game Over";
        ctx.fillStyle = "white";
        ctx.fillRect(310,242,140,30);
        ctx.fillStyle = "black";
        ctx.fillText(winOrLose,310,261);
      }else{
        for(let i = 0; i < tetrominoCopy.length; i++){
          let square = tetrominoCopy[i];
          let x = square[0] + startX;
          let y = square[1] + startY;
          stoppedShapeArray[x][y] = currentTetrominoColor;
        }
        checkForCompletedRows();
        createTetromino();
        direction = DIRECTION.IDLE;
        startX = 4;
        startY = 0;
        drawTetromino();
      }
   // }
  }
}

function checkForHorizontalCollision(){
  let tetrominoCopy = curTetromino;
  let collision = false;
  for(let i = 0; i < tetrominoCopy.length; i++){
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;

    if(direction === DIRECTION.LEFT){
      x--;
    }else if(direction === DIRECTION.RIGHT){
      x++;
    }
    let stoppedShapeValue = stoppedShapeArray[x][y];
    if(typeof stoppedShapeValue === 'string'){
      collision = true;
      break;
    }
  }
  return collision;
}

function checkForCompletedRows(){
  let rowsToDelete = 0; 
  let startofDeletion = 0;
  for(let y = 0; y < gBArrayHeight; y++){
    let completed = true; 
    for(let x = 0; x < gBArrayWidth; x++){
      let square = stoppedShapeArray[x][y];
      if(square === 0 || typeof square === 'undefined'){
        completed = false;
        break; 
      }
    }
    if(completed){
      if(startofDeletion === 0) startofDeletion = y;
      rowsToDelete++;
      for(let i = 0; i < gBArrayWidth; i++){
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coorX = coordinateArray[i][y].x;
        let coorY = coordinateArray[i][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX,coorY,21,21);
      }
    }
  }
  if(rowsToDelete > 0){
    score += 10;
    ctx.fillStyle = 'white';
    ctx.fillRect(310,109,140,19);
    ctx.fillStyle = 'black';
    ctx.fillText(score.toString(), 310, 127);
    moveAllRowsDown(rowsToDelete,startofDeletion);
  }
}

function moveAllRowsDown(rowsToDelete,startofDeletion){
  for (let i = startofDeletion-1; i >= 0; i--){
    for(let x = 0; x <gBArrayWidth; x++){
      let y2 = i + rowsToDelete;
      let square = stoppedShapeArray[x][i];
      let nextSquare = stoppedShapeArray[x][y2];
      if(typeof square === 'string'){
        nextSquare = square; 
        gameBoardArray[x][y2] = 1; 
        stoppedShapeArray[x][y2] = square; 
        let coorX = coordinateArray[x][y2].x;
        let coorY = coordinateArray[x][y2].y;    
        ctx.fillStyle = nextSquare;
        ctx.fillRect(coorX,coorY,21,21);   
        
        square = 0; 
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coorX = coordinateArray[x][i].x;
        coorY = coordinateArray[x][i].y;    
        ctx.fillStyle = "white";
        ctx.fillRect(coorX,coorY,21,21);    
      }
    }
  }
}

function rotateTetromino(){
  let newRotation = [];
  let tetrominoCopy = curTetromino;
  let tetrominoBackup;
  for (let i = 0; i < tetrominoCopy.length; i++){
  tetrominoBackup = [...curTetromino];
    let x = tetrominoCopy[i][0];
    let y = tetrominoCopy[i][1];
    let newX = (getLastSquareX()-y);
    let newY = x; 
    newRotation.push([newX,newY]);
  }
  deleteTetromino();
  try{
    curTetromino = newRotation;
    drawTetromino();
  }catch(e){
    if(e instanceof TypeError){
      curTetromino = tetrominoBackup;
      deleteTetromino();
      drawTetromino();
    }
  }
}

function getLastSquareX(){
  let lastX = 0;
  for(let i = 0; i < curTetromino.length;i++){
    let square = curTetromino[i];
    if(square[0] > lastX){
      lastX = square[0];
    }
  }
  return lastX; 
}