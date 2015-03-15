var Game = require('./game');
var debug = require('debug')('ttt:GameManager');

var games = [];

function isValidId(id)
{
    return id !== null && id >= 0 && id < games.length;
}

function onMessage(socket, data)
{
    debug('received: %s', data);

    var msg = JSON.parse(data);
    switch(msg.action)
    {
        case 'new':
            var g = new Game(socket, games.length);
            games.push(g);

            var connInfo = {
                type: 'conn-info',
                'game-id': games.length-1
            };

            socket.send(JSON.stringify(connInfo));
            debug('New game, id: ' + (games.length-1));
            break;
        case 'join':
            if(isValidId(msg.id))
            {
                var g = games[msg.id];
                if(!g.isFull())
                {
                    g.join(socket);
                    debug('Game full, id:' + msg.id)
                    g.start();
                }
                else
                {
                    var msg = {
                        type: 'error',
                        msg: 'The game is already full!'
                    }
                    socket.send(JSON.stringify(msg));
                }
            }
            else
            {
                console.warn("Invalid id provided: " + msg.id);
                var msg = {
                    type: 'error',
                    msg: 'Invalid game id: ' + msg.id
                };
                socket.send(JSON.stringify(msg));
            }
            break;
        case 'move':
            if(isValidId(msg.id))
            {
                debug('Move: ' + msg);

                var g = games[msg.id];
                g.move(msg.row, msg.col, msg.player);
            }
            break;
    }
}

function onConnection(socket)
{
    socket.on('message', function(data) { onMessage(socket, data); });
    debug('connection established');
}

function onError(error)
{
    console.error(error);
}

exports.onConnection = onConnection;
exports.onError = onError;
