var Game = require('./game');
var debug = require('debug')('ttt:GameManager');

var games = [];

function onMessage(socket, data)
{
    debug('received: %s', data);

    var msg = JSON.parse(data);
    switch(msg.action)
    {
        case 'new':
            var g = new Game(socket);
            games.push(g);

            var connInfo = {
                type: 'conn-info',
                'game-id': games.length-1
            };

            socket.send(JSON.stringify(connInfo));
            debug("New game, id: " + (games.length-1));
            break;
        case 'join':
            if(msg.id && msg.id >= 0 && msg.id < games.length)
            {
                var g = games[msg.id];
                if(!g.isFull())
                {
                    g.join(socket);
                    debug("Game full, id:" + msg.id)
                }
                else
                {
                    //TODO: send error to client saying that the game is already full
                }
            }
            else
            {
                console.warn("Invalid id provided: " + msg.id);
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
