window.onload = main

function Game()
{
    this.board = [[0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]];
    this.mark = 1; //1 - x, 2 - o
    this.statusBar = document.getElementById("status");

}

Game.prototype.isValid = function (r, c)
{
    return this.board[r][c] == 0;
}

Game.prototype.set = function (r, c)
{
    this.board[r][c] = this.mark;
}

Game.prototype.setStatus = function(text)
{
    this.statusBar.style.background = null;
    this.statusBar.textContent = text;
};

Game.prototype.setErrorStatus = function(text)
{
    this.statusBar.style.background = 'red';
    this.statusBar.textContent = text;
};

function main()
{
    var game = new Game();
    var ws = new WebSocket(window.location.origin.replace(/^http/, 'ws'));

    ws.onopen = function(event) {
        var canvas = document.getElementById('board');

        if(canvas.getContext)
        {
            var b = new Board(canvas, game);
            b.init();

            var msg = { action: 'new' };

            ws.send(JSON.stringify(msg));
        }
        else
        {
            game.setErrorStatus("Canvas is not supported!");
        }
    }

    ws.onmessage = function (event) {
        console.log("server-msg: " + event.data);
    };
}
