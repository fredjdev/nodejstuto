var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    fs = require('fs');

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    // Si pas de tableau todolist
    if (typeof(socket.todolist) == 'undefined') {
        socket.todolist = [];
    }

    io.emit("todolist", socket.todolist);

    // Dès qu'on reçoit une tâche
    socket.on('nouvelle_tache', function(tache) {
        socket.todolist.push(ent.encode(tache));
        io.emit("insert", ent.encode(tache));
        socket.handshake.headers.cookie.test = 'tessst';
        console.log(socket.handshake.headers.cookie.test);
    });

    // Dès qu'on reçoit une action de suppression
    socket.on('supprimer', function (id) { console.log(id);
        socket.todolist.splice(id, 1);
    }); 
});

server.listen(8080);