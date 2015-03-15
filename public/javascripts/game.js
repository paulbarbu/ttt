window.onload = main

function Game(ws, gameId)
{
    this.ws = ws;
    this.id = gameId || null;

    this.canvas = document.getElementById('board');
    this.b = new Board(this.canvas, this);
    this.hasTwoPlayers = false;
    this.board = [[0, 0, 0],
                  [0, 0, 0],
                  [0, 0, 0]];
    this.statusBar = document.getElementById("status");

    // the player is the second one, he provided the game's id
    //1 - x, 2 - o
    if(this.id)
    {
        this.myTurn = false;
        this.mark = 2;
    }
    else
    {
        this.myTurn = true;
        this.mark = 1;
    }

    this.ws.onopen = this.start.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = function() {this.setErrorStatus('Connection closed!');}.bind(this);
}

Game.prototype.isMyTurn = function()
{
    return this.myTurn;
}

Game.prototype.getMark = function(){
    return this.mark;
};

Game.prototype.isValid = function (r, c)
{
    return this.board[r][c] == 0;
}

Game.prototype.set = function (r, c)
{
    this.myTurn = false;
    this.setStatus("Waiting opponent's move!");
    this.board[r][c] = this.mark;
    var msg = {
        action: 'move',
        id: this.id,
        row: r,
        col: c,
        player: this.mark
    };
    this.ws.send(JSON.stringify(msg));
}

Game.prototype.setStatus = function(text, html)
{
    html = html || false
    this.statusBar.style.background = null;
    if(html)
    {
        this.statusBar.innerHTML = text;
    }
    else
    {
        this.statusBar.textContent = text;
    }
}

Game.prototype.setErrorStatus = function(text)
{
    this.statusBar.style.background = 'red';
    this.statusBar.textContent = text;
}

Game.prototype.start = function()
{
    if(this.canvas.getContext)
    {
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

Game.prototype.end = function(winner, pos)
{
    //pos will be defined onyl if we have a winner

    if(winner == -1)
    {
        this.setStatus("It's a draw!");
        this.statusBar.style.background = 'grey';
    }
    else if(winner == this.mark)
    {
        this.setStatus('You win!');
        this.statusBar.style.background = 'green';
        this.b.highlight(pos, 'green');
    }
    else
    {
        this.setStatus('You lose!');
        this.statusBar.style.background = 'yellow';
        this.b.highlight(pos, 'yellow');
    }
}

Game.prototype.onMessage = function(event) {
    console.log("server-msg: " + event.data);
    var msg = JSON.parse(event.data);

    switch(msg.type)
    {
        case 'conn-info':
            var refDimension = document.body.clientWidth < document.body.clientHeight ? document.body.clientWidth : document.body.clientHeight;
            refDimension *= 40/100;
            var link = window.location + '?join=' + msg['game-id'];
            var qrcode = document.getElementById("qrcode");

            new QRCode(qrcode, {
                text: link,
                width: refDimension,
                height: refDimension
            });
            //center the code both horizontally and vertically
            qrcode.style.marginTop = (-1 * refDimension/2).toString() + 'px';
            qrcode.style.marginLeft = (-1 * refDimension/2).toString() + 'px';

            this.setStatus('Share the QR code above or this link:<br>' + link, true);
            break;
        case 'error':
            this.setErrorStatus(msg.msg);
            break;
        case 'start':
            var qrcode = document.getElementById("qrcode");
            qrcode.style.display = 'none';

            this.b.init();
            this.id = msg.id;
            this.hasTwoPlayers = true;
            this.setStatus('Game started!');
            console.log('Game started: ' + msg.id);
            break;
        case 'move':
            this.myTurn = true;
            this.setStatus('Your turn!');
            // move messages are always received from the server on behalf of the other player
            console.log('Move: row=' + msg.r + ' col=' + msg.c);
            var otherMark = this.mark == 1 ? 2 : 1;
            this.b.set(msg.r, msg.c, otherMark);
            this.board[msg.r][msg.c] = otherMark;
            break;
        case 'end':
            this.myTurn = false;
            // move messages are always received from the server on behalf of the other player
            console.log('End: ' + msg);
            this.end(msg.winner, msg.position);
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

    //TODO: disconnect the player gracefully when he starts reloading and reconnect him
}
