var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8080 }) ;
    express = require('express');
    app = express();
    server = app.listen(8081);

app.use(express.static(__dirname + '/static'));

var clients = [];
wss.on('connection', function connection(ws) {
  clients.push(ws);
  ws.on('message', function incoming(message, type, tgt) {
   console.log('received: ', message, 'from client:', ws.upgradeReq.client);
   for (var i = 0; i < clients.length;i++) {
      if (clients[i] != ws) {
       clients[i].send(message);
     }
    }
  });
  ws.send('something');
});
