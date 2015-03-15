var debug = require('debug')('ttt:Game');

function Game(player1)
{
    debug("instantiated");
    this.p1 = player1;
    this.board = [[0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]];
    this.p1Mark = 1;
    this.p2Mark = 2;
}

Game.prototype.isFull = function()
{
    return this.p1 && this.p2;
}

Game.prototype.join = function (player2)
{
    this.p2 = player2;
}

Game.prototype.start = function(){
    var msg = JSON.stringify({
        type: 'start'
    });

    this.p1.send(msg);
    this.p2.send(msg);
};

module.exports = Game;
