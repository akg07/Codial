

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: "http://localhost:8000",
            methods: ["GET", "POST"]
        }
    });

    // create a new connection with client from server
    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);
        
        // disconnect socket from server side
        socket.on('disconnect', function(){
            console.log('socket disconnected');
        });
        
        // receive req for room joining 
        socket.on('join_room', function(data) {
            console.log('joining req received ', data);
            
            // if there is a chatroom present with same name 
            // user will be added else create a new one and add user
            socket.join(data.chatroom); 
            
            // send notification to client 
            io.in(data.chatroom).emit('user_joined', data);
            
        });

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });


}