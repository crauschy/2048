var Game = function(boardString){
  this.board = makeBoard(boardString || randomBoardString());
  this.score = 0;
  this.moves = 0;
  this.prevBoard = [];
  this.prevScore = 0
};

      // updates game's attributes (moves, score, board, boardString)
Game.prototype.move = function(direction){
  var resolved = {}
  if (direction === "left"){
      resolved = leftUpMath(compactLeftUp(this.board));
    } else if (direction === "up") {
      var almostResolved = leftUpMath(compactLeftUp(columnsToFro((this.board))));
      almostResolved['board'] = columnsToFro(almostResolved['board'])
      resolved = almostResolved
    } else if (direction === "right") {
      resolved = rightDownMath(compactRightDown(this.board));
    } else {
      var almostResolved = rightDownMath(compactRightDown(columnsToFro((this.board))));
      almostResolved['board'] = columnsToFro(almostResolved['board'])
      resolved = almostResolved
    };
  this.moves += 1;
  this.prevScore = this.score;
  this.score += resolved['score'];
  this.prevBoard = this.board;
  if (isFull(resolved['board'])){
    console.log("the board is full");
    this.board = resolved['board'];
  } else {
    this.board = insertRandom(resolved['board']);
  }
};

// TODO: GAME MOVES
// Things to Consider:
//    * move count shouldn't go up if a move doesn't change the board
//    * the board cannot be compacted by a move in any direction
//    *


// TODO: Redo Game Over functions
// Things to Consider:
//    Game is over WHEN:
//    * the board is full (there are no empty cells in grid)
//    * the board cannot be compacted by a move in any direction
//    *


Game.prototype.isOver = function(){
  var boardFull = isFull(this.board);
  var noChanges = (this.prevScore===this.score && this.prevBoard===this.board)
  if (boardFull && noChanges){
      return true;
    } else {
      return false;
    };
};


// var isFull = function(board){
//   board.forEach(function(row){
//     row.forEach(function(cell){
//       if (cell == "0"){
//         return false;
//       }
//     });
//   });
//   console.log(board);
//   return true;
// };


var isFull = function(board){
  var boardArray = board[0].concat(board[1],board[2],board[3]);
  var boardString = boardArray.join();
  return !boardString.includes('0');
};


////// SETUP HELPER FUNCTIONS //////

// RANDOM BOARD STRING -- returns a random board string

  var randomBoardString = function(){
    var string = "2200000000000000"
    var a = string.split(""),
        n = 16;
    for(var i = n - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[rand];
        a[rand] = tmp;
    }
    return a.join("");
  };


// MAKE BOARD -- transforms boardString attribute to an array of arrays (the board)

  var makeBoard = function(boardString){
    var row1 = boardString.substr(0,4).split("");
    var row2 = boardString.substr(4,4).split("");
    var row3 = boardString.substr(8,4).split("");
    var row4 = boardString.substr(12,4).split("");
    return [row1, row2, row3, row4]; // creates array of row arrays (numbers still in string form)
  };



////// MOVE HELPER FUNCTIONS //////

// for UP and DOWN: preps board for Math method, and returns back to normal
  var columnsToFro = function(gameBoardStructure){
    var newBoard = [];
    for (i = 0; i < 4; i++){
      var newArray = [];
      gameBoardStructure.forEach(function(array){
        newArray.push(array[i]);
      })
      newBoard.push(newArray);
    }
    return newBoard; // creates array of column arrays (index = row number)
  }

// COMPACT LEFT and UP returns board with numbers moved and prepped for any math merging
    // ex: if a row/column is ["0", "2", "2", "0"], this will filter to ["2", "2"], and then will PUSH in enough "0"'s to make the new array-length 4: ["2", "2", "0", "0"]... each new row/column is then pushed into the board and the new board is returned
  var compactLeftUp = function(rowsOrColumns){
    var board = [];
    rowsOrColumns.forEach(function(rowOrColumn){
      var newOne = rowOrColumn.filter(function(cell){
        return cell != "0";
      });
      var times = ( 4 - newOne.length );
      for(i=0; i < times; i++){
        newOne.push("0");
      };
      board.push(newOne);
    });
    return board;
  }

// COMPACT RIGHT and DOWN returns board with numbers moved and prepped for any math merging
    // ex: if a row/column is ["0", "2", "2", "0"], this will filter to ["2", "2"], and then will UNSHIFT enough "0"'s to make the new array-length 4: ["0", "0", "2", "2"]... each new row/column is then pushed into the board and the new board is returned
  var compactRightDown = function(rowsOrColumns){
    var board = [];
    rowsOrColumns.forEach(function(rowOrColumn){
      var newOne = rowOrColumn.filter(function(cell){
        return cell != "0";
      });
      var times = ( 4 - newOne.length );
      for(i=0; i < times; i++){
        newOne.unshift("0");
      }
      board.push(newOne);
    });
    return board;
  }

// LEFT and UP MATH takes a COMPACTED BOARD and returns obj literal with merged board and score increase
    // ex: a compacted row/column is ["2", "2", "2", "2"]; loops through each index of each row/column array...
  var leftUpMath = function(compactBoard){
    var mathifiedBoard = [];
    var upScore = 0;
    compactBoard.forEach(function(array){
      for( i = 0; i < 3; i++){
        if (array[i] != "0"){
          if (array[i] === array [i+1]){ // if numbers are the same, they combine...
            array[i] *= 2; // doubling the original...
            array[i+1] = 0; // and resetting cell that combined. [4, "0", "2", "2"], then [4, "0", 4, "0"]
            upScore += array[i] // add the new merge value to score
          };
        };
      };
      var stringyArray = array.join(); //
      mathifiedBoard.push(stringyArray.split(","));
    });
    var endOfMove = { 'board': compactLeftUp(mathifiedBoard), 'score': upScore}
    return endOfMove ; // UP move will need to have columnToFro() its board
  };

      // for RIGHT and DOWN returns obj literal with merged board and score increase
var rightDownMath = function(compactBoard){
  var mathifiedBoard = [];
  var upScore = 0;
  compactBoard.forEach(function(array){
    for( i = 3; i > 0; i--){
      if (array[i] != "0"){
        if (array[i] === array [i-1]){
          array[i] *= 2;
          array[i-1] = 0;
          upScore += array[i] // add the new merge value to score
        };
      };
    };
    var stringyArray = array.join();
    mathifiedBoard.push(stringyArray.split(","));
  });
  var endOfMove = { 'board': compactRightDown(mathifiedBoard), 'score': upScore}
  return endOfMove ; // DOWN move will need to have columnToFro() its board
};


// INSERT RANDOM returns an updated board (with block spawned)
// TO-DO: add 4 as an option (a fraction of the time)
  var insertRandom = function(updatedBoard){
    var boardArray = updatedBoard[0].concat(updatedBoard[1],updatedBoard[2],updatedBoard[3]);
    var inserted = false;
    while ( inserted === false ){
      var randomIndex = Math.floor((Math.random() * 15) + 0);
      if (boardArray[randomIndex] === "0"){
        boardArray.splice(randomIndex, 1, "2");
        inserted = true;
      };
      // console.log("a block was spawned");
    };
    var row1 = boardArray.slice(0,4);
    var row2 = boardArray.slice(4,8);
    var row3 = boardArray.slice(8,12);
    var row4 = boardArray.slice(12,16);
    return [row1, row2, row3, row4];
  };