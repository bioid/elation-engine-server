var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8080 }) ;
    express = require('express');
    app = express();
    server = app.listen(8081);

app.use(express.static(__dirname + '/static'));

var clients = [];
var players = [];

wss.on('connection', function connection(ws) {
  console.log('conn');
  clients.push(ws);

  for (var i = 0; i < players.length; i++) {
    if (!ws.playerID || players[i] != ws.playerID) {
      ws.send(JSON.stringify({type: 'new_player', position: [0, 0, 0], network_id: players[i]}));
    }  
  };

  ws.on('message', function incoming(message, type, tgt) {
    console.log('received: ', message);
    var parsed = JSON.parse(message);
    if (parsed.type = 'new_player') {
      ws.playerID = parsed.network_id;
      players.push(parsed.network_id);
    } 
    for (var i = 0; i < clients.length;i++) {
      if (clients[i] != ws) {
       clients[i].send(message);
      }
    }
  });
  ws.on('close', function() {
    for (var i = 0; i < clients.length;i++) {
      if (clients[i] == ws) {
        clients.splice(i, 1);
      };
    };
    players.splice(players.indexOf(ws.playerID), 1);
  });
});
