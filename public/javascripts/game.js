window.onload = main

function Game(ws, gameId)
{
    this.ws = ws;
    this.id = gameId || null;

    this.hasTwoPlayers = false;
    this.board = [[0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]];
    this.mark = 1; //1 - x, 2 - o
    this.statusBar = document.getElementById("status");

    this.ws.onopen = this.start.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
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
}

Game.prototype.setErrorStatus = function(text)
{
    this.statusBar.style.background = 'red';
    this.statusBar.textContent = text;
}

Game.prototype.start = function()
{
    var canvas = document.getElementById('board');

    if(canvas.getContext)
    {
        var b = new Board(canvas, this);
        b.init();

        if(this.id)
        {
            var msg = {
                action: 'join',
                id: parseInt(this.id)
            };
            this.ws.send(JSON.stringify(msg));
        }
        else
        {
            var msg = { action: 'new' };
            this.ws.send(JSON.stringify(msg));
        }
    }
    else
    {
        this.setErrorStatus("Canvas is not supported!");
    }
}

Game.prototype.onMessage = function(event) {
    console.log("server-msg: " + event.data);
    var msg = JSON.parse(event.data);

    switch(msg.type)
    {
        case 'conn-info':
            this.setStatus('Share this link: ' + window.location + '?join=' + msg['game-id']);
            break;
        case 'error':
            this.setErrorStatus(msg.msg);
            break;
        case 'start':
            // TODO: enforce rules
            this.setStatus("Game started!");
            this.hasTwoPlayers = true;
            break;
    }
};

function main()
{
    var q = getQuery(),
        ws = new WebSocket(window.location.origin.replace(/^http/, 'ws')),
        game;

    if(q.join)
    {
        game = new Game(ws, q.join);
    }
    else
    {
        game = new Game(ws);
    }
}
