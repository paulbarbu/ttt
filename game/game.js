var debug = require('debug')('ttt:Game');

function Game(player1, gameId)
{
    debug("instantiated");
    this.p1 = player1;
    this.board = [[0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]];
    this.p1Mark = 1;
    this.p2Mark = 2;
    this.currentPlayer = null;
    this.id = gameId;
}

Game.prototype.isValid = function (r, c)
{
    return this.board[r][c] == 0;
}

Game.prototype.isFull = function()
{
    return this.p1 && this.p2;
}


Game.prototype.switchCurrentPlayer = function(){
    if(this.currentPlayer == 1)
    {
        this.currentPlayer = 2;
    }
    else
    {
        this.currentPlayer = 1;
    }
}

Game.prototype.sendToOtherPlayer = function(data)
{
    if(this.currentPlayer == 1)
    {
        this.p2.send(data);
    }
    else
    {
        this.p1.send(data);
    }
}

/**
 * Check for a winner on the board
 *
 * @return int the marker (a player's id) that has won, if it's a draw
 * -1 is returned or if there is no winner yet, returns 0
 */
Game.prototype.getWinner = function()
{
    var board = this.board;
    //diagonal checking makes sense only if the middle was marked by a
    //player
    if(board[1][1] != 0)
    {
        if(board[0][0] == board[1][1] && board[1][1] == board[2][2]
            && board[0][0] == board[2][2])
        {
            return [board[0][0], {p: 'D', n: 1}]; //first diagonal
        }
        else if(board[0][2] == board[1][1] && board[1][1] == board[2][0]
            && board[0][2] == board[2][0])
        {
            return [board[0][2], {p: 'D', n: 2}]; //second diagonal
        }
    }

    for(var i=0; i<3; i++)
    {
        if(board[0][i] != 0 && board[0][i] == board[1][i] && board[1][i] == board[2][i]
            && board[0][i] == board[2][i])
        {
            return [board[0][i], {p: 'C', n: i}]; //a column
        }
        else if(board[i][0] != 0 && board[i][0] == board[i][1] && board[i][1] == board[i][2]
            && board[i][0] == board[i][2])
        {
            return [board[i][0], {p: 'R', n: i}]; //a row
        }
    }

    //check for draw
    for(var i=0; i<3; i++){
        for(var j=0; j<3; j++){
            if(board[i][j] == 0){
                //if the the board is not yet filled by player
                //markers (id's) and there is no winner then the game
                //should contine
                return 0;
            }
        }
    }

    //indeed it's a draw because the board is filled by markers but
    //there's no winner
    return -1;
}

Game.prototype.move = function(row, col, playerMark)
{
    if(this.currentPlayer == playerMark && this.isValid(row, col))
    {
        this.board[row][col] = playerMark;
        this.sendToOtherPlayer(JSON.stringify({
            type: 'move',
            r: row,
            c: col
        }));

        var winnerInfo = this.getWinner(),
            winner = winnerInfo[0],
            position = winnerInfo[1];

        switch(winner){
            case -1: //draw
                var msg = {
                    type: 'end',
                    winner: -1
                };
                this.p1.send(JSON.stringify(msg));
                this.p2.send(JSON.stringify(msg));
                break;
            case 1: // player 1 wins
                var msg = {
                    type: 'end',
                    winner: 1,
                    position: position
                };
                this.p1.send(JSON.stringify(msg));
                this.p2.send(JSON.stringify(msg));
                break;
            case 2: // player 2 wins
                var msg = {
                    type: 'end',
                    winner: 2,
                    position: position
                };
                this.p1.send(JSON.stringify(msg));
                this.p2.send(JSON.stringify(msg));
                break;
            default: // game in progress
                this.switchCurrentPlayer();
                break;
        }
    }
    else
    {
        console.info('The worng player tried to move!');
    }
}

Game.prototype.join = function (player2)
{
    this.p2 = player2;
}

Game.prototype.start = function(){
    this.currentPlayer = this.p1Mark;
    var msg = JSON.stringify({
        type: 'start',
        id: this.id
    });

    this.p1.send(msg);
    this.p2.send(msg);
};

module.exports = Game;
